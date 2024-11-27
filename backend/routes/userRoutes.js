import express from 'express';
import axios from 'axios';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch fresh data from GitHub API
        const headers = {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${user.accessToken}`
        };

        const [githubResponse, reposResponse] = await Promise.all([
            axios.get(`https://api.github.com/user`, { headers }),
            axios.get(`https://api.github.com/user/repos`, { headers })
        ]);

        const githubData = githubResponse.data;

        // Transform GitHub data to match our frontend field names
        res.json({
            id: githubData.id,
            githubId: githubData.id,
            username: githubData.login,
            name: githubData.name,
            email: githubData.email,
            avatarUrl: githubData.avatar_url,
            html_url: githubData.html_url,
            bio: githubData.bio,
            company: githubData.company,
            blog: githubData.blog,
            location: githubData.location,
            public_repos: reposResponse.data.length,
            followers: githubData.followers,
            following: githubData.following,
            created_at: githubData.created_at,
            updated_at: githubData.updated_at,
            isCurrentUser: true
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Get GitHub user profile
router.get('/github/:username', rateLimitMiddleware, async (req, res) => {
    try {
        const { username } = req.params;
        
        // First try to find user in our database
        const dbUser = await User.findOne({ username });
        let isLiked = false;

        if (req.user) {
            const currentUser = await User.findById(req.user.id);
            if (currentUser && dbUser) {
                isLiked = currentUser.likedProfiles.includes(dbUser._id);
            }
        }

        // Fetch user data from GitHub API
        const headers = {
            Accept: 'application/vnd.github.v3+json'
        };

        if (req.user?.accessToken) {
            headers.Authorization = `token ${req.user.accessToken}`;
        }

        const [userResponse, reposResponse] = await Promise.all([
            axios.get(`https://api.github.com/users/${username}`, { headers }),
            axios.get(`https://api.github.com/users/${username}/repos`, { headers })
        ]);

        const userData = userResponse.data;

        res.json({
            id: userData.id,
            githubId: userData.id,
            username: userData.login,
            name: userData.name,
            email: userData.email,
            avatarUrl: userData.avatar_url,
            html_url: userData.html_url,
            bio: userData.bio,
            company: userData.company,
            blog: userData.blog,
            location: userData.location,
            public_repos: reposResponse.data.length,
            followers: userData.followers,
            following: userData.following,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            isLiked
        });
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'GitHub user not found' });
        }
        res.status(500).json({ error: 'Failed to fetch GitHub profile' });
    }
});

// Like a user
router.post('/:username/like', rateLimitMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        // First try to find target user in our database
        let targetUser = await User.findOne({ username: req.params.username });
        
        // If not found, fetch from GitHub and create a placeholder in our database
        if (!targetUser) {
            try {
                const githubResponse = await axios.get(`https://api.github.com/users/${req.params.username}`);
                const githubData = githubResponse.data;
                
                targetUser = await User.create({
                    githubId: githubData.id.toString(),
                    username: githubData.login,
                    name: githubData.name || '',
                    email: githubData.email || '',
                    avatarUrl: githubData.avatar_url,
                    bio: githubData.bio || '',
                    accessToken: '', // Empty since they haven't logged in
                    likedProfiles: [], // Empty array since they haven't liked anyone
                    likedBy: [] // Will contain users who liked them
                });
            } catch (error) {
                console.error('Error creating user from GitHub:', error);
                if (error.response?.status === 404) {
                    return res.status(404).json({ error: 'GitHub user not found' });
                }
                if (error.name === 'ValidationError') {
                    return res.status(400).json({ error: 'Invalid user data from GitHub' });
                }
                return res.status(500).json({ error: 'Failed to create user from GitHub' });
            }
        }

        // Prevent self-liking
        if (currentUser.id === targetUser.id) {
            return res.status(400).json({ error: 'Cannot like yourself' });
        }

        // Check if already liked
        if (currentUser.likedProfiles.includes(targetUser.id)) {
            return res.status(400).json({ error: 'User already liked' });
        }

        // Add to liked profiles
        currentUser.likedProfiles.push(targetUser.id);
        await currentUser.save();

        // Add to likedBy of target user
        targetUser.likedBy.push(currentUser.id);
        await targetUser.save();

        // Return whether the target user has liked the current user back
        const isLikedBack = targetUser.likedProfiles.includes(currentUser.id);

        res.json({ 
            message: 'User liked successfully',
            isLiked: true,
            isLikedBack
        });
    } catch (error) {
        console.error('Error liking user:', error);
        res.status(500).json({ error: 'Failed to like user' });
    }
});

// Unlike a user
router.delete('/:username/like', rateLimitMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const targetUser = await User.findOne({ username: req.params.username });
        if (!targetUser) {
            return res.status(404).json({ error: 'Target user not found' });
        }

        // Remove from liked profiles
        currentUser.likedProfiles = currentUser.likedProfiles.filter(
            id => id.toString() !== targetUser.id.toString()
        );
        await currentUser.save();

        // Remove from likedBy of target user
        targetUser.likedBy = targetUser.likedBy.filter(
            id => id.toString() !== currentUser.id.toString()
        );
        await targetUser.save();

        res.json({ 
            message: 'User unliked successfully',
            isLiked: false
        });
    } catch (error) {
        console.error('Error unliking user:', error);
        res.status(500).json({ error: 'Failed to unlike user' });
    }
});

// Get liked users with their GitHub info
router.get('/liked', rateLimitMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(req.user.id)
            .populate('likedProfiles', 'username name avatarUrl bio likedProfiles')
            .exec();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Transform the data to include isLikedBack status
        const likedUsers = user.likedProfiles.map(likedUser => ({
            username: likedUser.username,
            name: likedUser.name,
            avatarUrl: likedUser.avatarUrl,
            bio: likedUser.bio,
            isLikedBack: likedUser.likedProfiles.includes(user.id)
        }));

        res.json(likedUsers);
    } catch (error) {
        console.error('Error fetching liked users:', error);
        res.status(500).json({ error: 'Failed to fetch liked users' });
    }
});

export default router;
