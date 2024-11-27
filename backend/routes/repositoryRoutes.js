import express from 'express';
import axios from 'axios';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware.js';
import Repository from '../models/Repository.js';
import User from '../models/User.js';

const router = express.Router();

// Auth middleware
const ensureAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
};

// Apply auth middleware to all routes
router.use(ensureAuthenticated);

// Rota para buscar os repositórios do usuário autenticado
router.get('/', rateLimitMiddleware, async (req, res) => {
    try {
        const { sort } = req.query; // 'recent', 'stars', 'forks'

        // Fetch repositories from GitHub API
        const headers = {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${req.user.accessToken}`
        };

        const githubResponse = await axios.get('https://api.github.com/user/repos', {
            headers,
            params: {
                sort: sort === 'recent' ? 'created' : sort,
                direction: 'desc',
                per_page: 100
            }
        });

        // Transform GitHub repositories to our format
        const repositories = githubResponse.data.map(repo => ({
            id: repo.id.toString(),
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            topics: repo.topics || [],
            isPrivate: repo.private,
            owner: {
                id: repo.owner.id,
                login: repo.owner.login,
                avatar_url: repo.owner.avatar_url
            }
        }));

        res.json(repositories);
    } catch (error) {
        console.error('Error fetching repositories:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});

// Rota para buscar os repositórios curtidos pelo usuário
router.get('/liked', rateLimitMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('likedRepositories')
            .exec();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.likedRepositories || []);
    } catch (error) {
        console.error('Error fetching liked repositories:', error);
        res.status(500).json({ error: 'Failed to fetch liked repositories' });
    }
});

// Rota para curtir um repositório
router.post('/:id/like', rateLimitMiddleware, async (req, res) => {
    try {
        const repoId = req.params.id;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch repository data from GitHub API
        const headers = {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${req.user.accessToken}`
        };

        // First try to find an existing repository in our database
        let repository = await Repository.findOne({ githubId: repoId });

        if (!repository) {
            try {
                // Fetch from GitHub if not in our database
                const githubResponse = await axios.get(`https://api.github.com/repositories/${repoId}`, { headers });
                const repoData = githubResponse.data;

                // Create new repository in our database
                repository = await Repository.create({
                    githubId: repoId,
                    fullName: repoData.full_name,
                    name: repoData.name,
                    description: repoData.description,
                    language: repoData.language,
                    forks_count: repoData.forks_count,
                    stars_count: repoData.stargazers_count,
                    url: repoData.html_url,
                    created_at: repoData.created_at,
                    updated_at: repoData.updated_at
                });
            } catch (error) {
                if (error.response?.status === 404) {
                    return res.status(404).json({ error: 'Repository not found on GitHub' });
                }
                throw error;
            }
        }

        // Check if already liked
        if (user.likedRepositories.includes(repository._id)) {
            return res.status(400).json({ error: 'Repository already liked' });
        }

        // Add repository to user's liked repositories
        user.likedRepositories.push(repository._id);
        await user.save();

        res.json({ 
            message: 'Repository liked successfully',
            isLiked: true
        });
    } catch (error) {
        console.error('Error liking repository:', error);
        res.status(500).json({ error: 'Failed to like repository' });
    }
});

// Rota para descurtir um repositório
router.delete('/:id/like', rateLimitMiddleware, async (req, res) => {
    try {
        const repoId = req.params.id;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find repository in our database
        const repository = await Repository.findOne({ githubId: repoId });
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        // Remove repository from user's liked repositories
        user.likedRepositories = user.likedRepositories.filter(
            id => id.toString() !== repository._id.toString()
        );
        await user.save();

        res.json({ 
            message: 'Repository unliked successfully',
            isLiked: false
        });
    } catch (error) {
        console.error('Error unliking repository:', error);
        res.status(500).json({ error: 'Failed to unlike repository' });
    }
});

// Rota para explorar repositórios
router.get('/explore', rateLimitMiddleware, async (req, res) => {
    try {
        const { q = '', language = '', sort = 'stars', page = 1, per_page = 30 } = req.query;
        const user = await User.findById(req.user.id);
        
        // Build the search query
        let searchQuery = q;
        if (language) {
            searchQuery += ` language:${language}`;
        }

        // Make request to GitHub API
        const response = await axios.get('https://api.github.com/search/repositories', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${req.user.accessToken}`
            },
            params: {
                q: searchQuery || 'stars:>1',
                sort: sort === 'stars' ? 'stars' : sort === 'forks' ? 'forks' : sort === 'help-wanted-issues' ? 'help-wanted-issues' : 'updated',
                order: 'desc',
                page: parseInt(page),
                per_page: parseInt(per_page)
            }
        });

        // Get list of liked repository IDs for the current user
        const likedRepoIds = new Set((await Repository.find({ 
            _id: { $in: user.likedRepositories } 
        })).map(repo => repo.githubId));

        // Transform the response
        const transformedResponse = {
            total_count: response.data.total_count,
            current_page: parseInt(page),
            total_pages: Math.ceil(response.data.total_count / per_page),
            repositories: response.data.items.map(repo => ({
                id: repo.id.toString(),
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                url: repo.html_url,
                stars_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                language: repo.language,
                created_at: repo.created_at,
                updated_at: repo.updated_at,
                isLiked: likedRepoIds.has(repo.id.toString())
            }))
        };

        res.json(transformedResponse);
    } catch (error) {
        console.error('Error fetching repositories:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});

// Like a repository
router.post('/:owner/:repo/like', rateLimitMiddleware, async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const fullName = `${owner}/${repo}`;

        // Find or create repository
        let repository = await Repository.findOne({ fullName });
        
        if (!repository) {
            // Fetch repository data from GitHub API
            const headers = {
                Accept: 'application/vnd.github.v3+json',
                Authorization: `token ${req.user.accessToken}`
            };
            
            const githubResponse = await axios.get(`https://api.github.com/repos/${fullName}`, { headers });
            const repoData = githubResponse.data;
            
            repository = await Repository.create({
                githubId: repoData.id.toString(),
                fullName: repoData.full_name,
                name: repoData.name,
                description: repoData.description,
                language: repoData.language,
                forks_count: repoData.forks_count,
                stars_count: repoData.stargazers_count,
                created_at: repoData.created_at,
                updated_at: repoData.updated_at,
                url: repoData.html_url,
                likedBy: []
            });
        }

        // Check if already liked
        if (repository.isLikedBy(req.user.id)) {
            return res.status(400).json({ error: 'Repository already liked' });
        }

        // Add user to likedBy
        repository.likedBy.push(req.user.id);
        await repository.save();

        // Add repository to user's liked repositories
        const user = await User.findById(req.user.id);
        if (!user.likedRepositories.includes(repository.id)) {
            user.likedRepositories.push(repository.id);
            await user.save();
        }

        res.json({ 
            message: 'Repository liked successfully',
            isLiked: true
        });
    } catch (error) {
        console.error('Error liking repository:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'Repository not found on GitHub' });
        }
        res.status(500).json({ error: 'Failed to like repository' });
    }
});

// Unlike a repository
router.delete('/:owner/:repo/like', rateLimitMiddleware, async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const fullName = `${owner}/${repo}`;

        const repository = await Repository.findOne({ fullName });
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        // Remove user from likedBy
        repository.likedBy = repository.likedBy.filter(id => id.toString() !== req.user.id);
        await repository.save();

        // Remove repository from user's liked repositories
        const user = await User.findById(req.user.id);
        user.likedRepositories = user.likedRepositories.filter(id => id.toString() !== repository.id);
        await user.save();

        res.json({ 
            message: 'Repository unliked successfully',
            isLiked: false
        });
    } catch (error) {
        console.error('Error unliking repository:', error);
        res.status(500).json({ error: 'Failed to unlike repository' });
    }
});

// Get liked repositories
router.get('/liked', rateLimitMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'likedRepositories',
                select: 'githubId name fullName description language forks_count stars_count url created_at updated_at'
            });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Transform data and ensure isLiked is true for all repositories
        const likedRepos = user.likedRepositories.map(repo => ({
            id: repo.githubId,
            name: repo.name,
            fullName: repo.fullName,
            description: repo.description,
            language: repo.language,
            forks_count: repo.forks_count,
            stars_count: repo.stars_count,
            url: repo.url,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            isLiked: true  // These are liked repositories, so isLiked should always be true
        }));

        res.json(likedRepos);
    } catch (error) {
        console.error('Error fetching liked repositories:', error);
        res.status(500).json({ error: 'Failed to fetch liked repositories' });
    }
});

export default router;
