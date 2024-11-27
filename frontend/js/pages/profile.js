import { fetchAPI, handleAPIError } from '../utils/api.js';
import { createRepositoryCard } from '../components/repositoryCard.js';
import { createUserInfo } from '../components/userInfo.js';
import { languageManager } from '../i18n/languageManager.js';

export default async function initializeProfilePage(contentArea, username = null) {
    let cleanup = null;

    try {
        async function updateContent() {
            // Clear the content area
            contentArea.innerHTML = '';
            
            // Create main content area with grid layout
            const mainContainer = document.createElement('div');
            mainContainer.className = 'flex-1 p-4 lg:p-6 flex flex-col lg:flex-row gap-6 min-h-screen';
            
            // Left sidebar for user info
            const sidebarContainer = document.createElement('div');
            sidebarContainer.className = 'w-full lg:w-80 flex-shrink-0';
            sidebarContainer.setAttribute('aria-label', languageManager.translate('userInfoSection'));
            
            // Main content area for repositories
            const reposContainer = document.createElement('div');
            reposContainer.className = 'flex-1 min-w-0';
            reposContainer.setAttribute('aria-label', languageManager.translate('repositoriesSection'));
            
            // Add loading indicators
            const userLoadingIndicator = document.createElement('div');
            userLoadingIndicator.className = 'animate-pulse space-y-4';
            userLoadingIndicator.innerHTML = `
                <div class="h-40 bg-teal-50 dark:bg-teal-950 rounded-lg"></div>
            `;
            sidebarContainer.appendChild(userLoadingIndicator);
            
            const reposLoadingIndicator = document.createElement('div');
            reposLoadingIndicator.className = 'animate-pulse space-y-4';
            for (let i = 0; i < 3; i++) {
                reposLoadingIndicator.innerHTML += '<div class="h-32 bg-teal-400 dark:bg-teal-900 rounded-lg"></div>';
            }
            reposContainer.appendChild(reposLoadingIndicator);
            
            mainContainer.appendChild(sidebarContainer);
            mainContainer.appendChild(reposContainer);
            contentArea.appendChild(mainContainer);
            
            try {
                let userData;
                let githubToken = null;

                if (username) {
                    // If username is provided, fetch that user's profile
                    const [userResponse, likedUsersResponse] = await Promise.all([
                        fetchAPI(`/api/users/github/${username}`),
                        fetchAPI('/api/users/liked')
                    ]);
                    
                    // Check if this user is in the liked users list
                    const likedUsers = await likedUsersResponse;
                    const isLiked = likedUsers.some(user => user.username === username);
                    
                    userData = {
                        ...userResponse,
                        isLiked,
                        isCurrentUser: false
                    };
                } else {
                    // Otherwise, fetch the current user's profile
                    userData = await fetchAPI('/api/users/profile');
                    userData.isCurrentUser = true;
                    githubToken = userData.accessToken;
                }
                
                const { element: userInfoElement, cleanup: userInfoCleanup } = createUserInfo(userData, userData.isCurrentUser);
                sidebarContainer.innerHTML = '';
                sidebarContainer.appendChild(userInfoElement);
                
                // Store the userInfo cleanup function
                if (cleanup) {
                    cleanup();
                }
                cleanup = userInfoCleanup;
                
                // Create repositories header
                const reposHeader = document.createElement('div');
                reposHeader.className = 'flex justify-between items-center mb-6';
                reposHeader.innerHTML = `
                    <h2 class="text-2xl font-bold">${languageManager.translate('repositories')}</h2>
                    <span class="text-teal-900 dark:text-teal-100" id="repoCount"></span>
                `;
                
                // Create repositories grid
                const reposGrid = document.createElement('div');
                reposGrid.className = 'grid grid-cols-1 lg:grid-cols-2 gap-4';
                reposGrid.setAttribute('aria-label', languageManager.translate('repositoriesGrid'));
                
                reposContainer.innerHTML = '';
                reposContainer.appendChild(reposHeader);
                reposContainer.appendChild(reposGrid);
                
                // Fetch repositories from GitHub API
                try {
                    const targetUsername = username || userData.username || userData.login;
                    const headers = githubToken ? {
                        'Authorization': `token ${githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    } : {
                        'Accept': 'application/vnd.github.v3+json'
                    };

                    const response = await fetch(`https://api.github.com/users/${targetUsername}/repos?sort=updated&per_page=30`, {
                        headers
                    });

                    if (!response.ok) {
                        throw new Error(`GitHub API error: ${response.status}`);
                    }

                    const repositories = await response.json();
                    
                    // Update repository count
                    document.getElementById('repoCount').textContent = 
                        languageManager.translate('repositoryCount', { count: repositories.length });
                    
                    if (repositories.length === 0) {
                        reposGrid.innerHTML = `
                            <div class="col-span-2 text-center text-teal-600 dark:text-teal-400">
                                ${languageManager.translate('noRepositories')}
                            </div>
                        `;
                        return;
                    }

                    // Create repository cards
                    repositories.forEach(repo => {
                        const repoCard = createRepositoryCard(repo, userData.isCurrentUser);
                        reposGrid.appendChild(repoCard);
                    });
                    
                } catch (error) {
                    console.error('Error fetching repositories:', error);
                    reposGrid.innerHTML = `
                        <div class="col-span-2 text-center text-red-600 dark:text-red-400">
                            ${languageManager.translate('errorLoadingRepositories')}
                        </div>
                    `;
                }
            } catch (error) {
                handleAPIError(error);
                contentArea.innerHTML = `
                    <div class="p-6 text-center text-red-600 dark:text-red-400">
                        ${languageManager.translate('error')}
                    </div>
                `;
            }
        }

        // Initial render
        await updateContent();

        // Add language change listener and store cleanup function
        const languageCleanup = languageManager.addChangeListener(updateContent);

        // Return a cleanup function that will be called when the page is unmounted
        return () => {
            if (cleanup) {
                cleanup();
            }
            if (languageCleanup) {
                languageCleanup();
            }
        };
    } catch (error) {
        handleAPIError(error);
        return () => {}; // Return empty cleanup function in case of error
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const contentArea = document.getElementById('content');
    await initializeProfilePage(contentArea);
});