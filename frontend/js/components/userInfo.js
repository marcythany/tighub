import { fetchAPI, handleAPIError } from '../utils/api.js';
import { languageManager } from '../i18n/languageManager.js';

export function createUserInfo(userData, isCurrentUser = false) {
    const container = document.createElement('div');
    container.className = 'bg-white dark:bg-teal-900 rounded-lg shadow-lg p-6';
    
    let cleanup = null;
    
    async function handleLikeClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const isLiked = button.classList.contains('text-pink-500');
        
        try {
            if (isLiked) {
                await fetchAPI(`/api/users/${userData.username}/unlike`, { method: 'POST' });
                button.classList.remove('text-pink-500');
                button.classList.add('text-teal-400', 'dark:text-teal-500');
                button.title = languageManager.translate('like');
            } else {
                await fetchAPI(`/api/users/${userData.username}/like`, { method: 'POST' });
                button.classList.remove('text-teal-400', 'dark:text-teal-500');
                button.classList.add('text-pink-500');
                button.title = languageManager.translate('unlike');
            }
        } catch (error) {
            handleAPIError(error);
        }
    }
    
    function updateContent() {
        // Normalize user data to handle both GitHub API and our backend format
        const normalizedData = {
            username: userData.username || userData.login,
            name: userData.name,
            avatarUrl: userData.avatarUrl || userData.avatar_url,
            bio: userData.bio,
            company: userData.company,
            blog: userData.blog,
            location: userData.location,
            html_url: userData.html_url,
            public_repos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            isLiked: userData.isLiked || false
        };

        container.innerHTML = `
            <div class="flex flex-col items-center">
                <div class="relative">
                    <img
                        src="${normalizedData.avatarUrl}"
                        alt="${languageManager.translate('profilePicture', { username: normalizedData.username })}"
                        class="w-32 h-32 rounded-full mb-4"
                    />
                    ${!isCurrentUser ? `
                        <button class="like-button absolute -right-2 top-0 ${normalizedData.isLiked ? 'text-pink-500' : 'text-teal-400 dark:text-teal-500'} hover:text-pink-500 transition-colors" title="${normalizedData.isLiked ? languageManager.translate('unlike') : languageManager.translate('like')}">
                            <svg class="w-8 h-8" fill="${normalizedData.isLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                <h2 class="text-2xl font-bold text-teal-900 dark:text-teal-100 mb-2">
                    ${normalizedData.name || normalizedData.username}
                </h2>
                <p class="text-teal-600 dark:text-teal-400 mb-4">@${normalizedData.username}</p>
                
                ${normalizedData.bio ? `
                    <p class="text-teal-700 dark:text-teal-300 text-center mb-4">
                        ${normalizedData.bio}
                    </p>
                ` : ''}
                
                <div class="flex space-x-4 mb-6">
                    <div class="text-center">
                        <span class="block font-bold text-teal-900 dark:text-teal-100">
                            ${normalizedData.public_repos}
                        </span>
                        <span class="text-sm text-teal-600 dark:text-teal-400">
                            ${languageManager.translate('repositories')}
                        </span>
                    </div>
                    <div class="text-center">
                        <span class="block font-bold text-teal-900 dark:text-teal-100">
                            ${normalizedData.followers}
                        </span>
                        <span class="text-sm text-teal-600 dark:text-teal-400">
                            ${languageManager.translate('followers')}
                        </span>
                    </div>
                    <div class="text-center">
                        <span class="block font-bold text-teal-900 dark:text-teal-100">
                            ${normalizedData.following}
                        </span>
                        <span class="text-sm text-teal-600 dark:text-teal-400">
                            ${languageManager.translate('following')}
                        </span>
                    </div>
                </div>
                
                ${normalizedData.location || normalizedData.company || normalizedData.blog ? `
                    <div class="border-t border-teal-200 dark:border-teal-700 pt-4 w-full">
                        <ul class="space-y-2">
                            ${normalizedData.location ? `
                                <li class="flex items-center text-teal-700 dark:text-teal-300">
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 0C6.478 0 3.618 2.86 3.618 6.382c0 5.673 5.727 13.282 5.968 13.593a.534.534 0 00.828 0c.24-.31 5.968-7.92 5.968-13.593C16.382 2.86 13.522 0 10 0zm0 9.573a3.191 3.191 0 110-6.382 3.191 3.191 0 010 6.382z"/>
                                    </svg>
                                    ${normalizedData.location}
                                </li>
                            ` : ''}
                            
                            ${normalizedData.company ? `
                                <li class="flex items-center text-teal-700 dark:text-teal-300">
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                    </svg>
                                    ${normalizedData.company}
                                </li>
                            ` : ''}
                            
                            ${normalizedData.blog ? `
                                <li class="flex items-center text-teal-700 dark:text-teal-300">
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                    </svg>
                                    <a href="${normalizedData.blog}" target="_blank" rel="noopener noreferrer" class="hover:text-teal-500 dark:hover:text-teal-400">
                                        ${normalizedData.blog}
                                    </a>
                                </li>
                            ` : ''}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="mt-6">
                    <a href="${normalizedData.html_url}" target="_blank" rel="noopener noreferrer" 
                       class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600">
                        ${languageManager.translate('viewProfile')}
                    </a>
                </div>
            </div>
        `;
        
        const likeButton = container.querySelector('.like-button');
        if (likeButton) {
            likeButton.addEventListener('click', handleLikeClick);
        }
    }

    // Initial render
    updateContent();

    // Add language change listener and store cleanup function
    const languageCleanup = languageManager.addChangeListener(updateContent);
    
    // Combine all cleanup functions
    cleanup = () => {
        languageCleanup();
        const likeButton = container.querySelector('.like-button');
        if (likeButton) {
            likeButton.removeEventListener('click', handleLikeClick);
        }
    };
    
    return {
        element: container,
        cleanup
    };
}
