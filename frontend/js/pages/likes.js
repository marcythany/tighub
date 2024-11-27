import { fetchAPI } from '../utils/api.js';
import { createRepositoryCard } from '../components/repositoryCard.js';
import { createLikedUserCard } from '../components/likedUserCard.js';
import { languageManager } from '../i18n/languageManager.js';

export default async function initializeLikesPage(contentArea) {
    try {
        // Clear content area
        contentArea.innerHTML = '';
        
        // Create main container
        const container = document.createElement('div');
        container.className = 'max-w-6xl mx-auto p-6';
        
        // Create tabs container
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'border-b border-gray-200 mb-6';
        
        const tabs = document.createElement('div');
        tabs.className = 'flex -mb-px';
        
        // Create Users tab
        const usersTab = document.createElement('button');
        usersTab.className = 'text-gray-700 dark:text-teal-100 py-4 px-6 border-b-2 border-blue-500 font-medium text-sm';
        usersTab.textContent = languageManager.translate('likedUsers');
        usersTab.dataset.tab = 'users';
        
        // Create Repositories tab
        const reposTab = document.createElement('button');
        reposTab.className = 'text-gray-500 hover:text-gray-700 dark:text-teal-100 py-4 px-6 border-b-2 border-transparent font-medium text-sm';
        reposTab.textContent = languageManager.translate('likedRepositories');
        reposTab.dataset.tab = 'repos';
        
        tabs.append(usersTab, reposTab);
        tabsContainer.appendChild(tabs);
        container.appendChild(tabsContainer);
        
        // Create content areas with loading states
        const usersContent = document.createElement('div');
        usersContent.id = 'usersContent';
        usersContent.className = 'grid grid-cols-1 gap-4';
        usersContent.innerHTML = `
            <div class="animate-pulse space-y-4">
                ${Array(3).fill().map(() => `
                    <div class="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
                        <div class="rounded-full bg-teal-50 dark:bg-teal-950 h-12 w-12"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-teal-50 dark:bg-teal-950 rounded w-1/4"></div>
                            <div class="h-3 bg-teal-50 dark:bg-teal-950 rounded w-1/3"></div>
                        </div>
                        <div class="h-8 bg-teal-50 dark:bg-teal-950 rounded w-20"></div>
                    </div>
                `).join('')}
            </div>
        `;
        
        const reposContent = document.createElement('div');
        reposContent.id = 'reposContent';
        reposContent.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hidden';
        reposContent.innerHTML = `
            <div class="animate-pulse space-y-4 col-span-full">
                ${Array(3).fill().map(() => `
                    <div class="bg-white rounded-lg shadow p-6 space-y-3">
                        <div class="h-4 bg-teal-50 dark:bg-teal-950 rounded w-3/4"></div>
                        <div class="h-3 bg-teal-50 dark:bg-teal-950 rounded w-1/2"></div>
                        <div class="h-3 bg-teal-50 dark:bg-teal-950 rounded w-1/4"></div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.append(usersContent, reposContent);
        contentArea.appendChild(container);
        
        // Add tab switching functionality
        [usersTab, reposTab].forEach(tab => {
            tab.addEventListener('click', () => {
                // Update tab styles
                usersTab.className = tab === usersTab 
                    ? 'text-gray-700 dark:text-teal-100 py-4 px-6 border-b-2 border-blue-500 font-medium text-sm'
                    : 'text-gray-500 hover:text-gray-700 py-4 px-6 border-b-2 border-transparent font-medium text-sm';
                    
                reposTab.className = tab === reposTab
                    ? 'text-gray-700 dark:text-teal-100 py-4 px-6 border-b-2 border-blue-500 font-medium text-sm'
                    : 'text-gray-500 hover:text-gray-700 py-4 px-6 border-b-2 border-transparent font-medium text-sm';
                
                // Show/hide content
                usersContent.classList.toggle('hidden', tab !== usersTab);
                reposContent.classList.toggle('hidden', tab !== reposTab);
            });
        });
        
        // Load data
        const [likedUsers, likedRepos] = await Promise.all([
            fetchAPI('/api/users/liked'),
            fetchAPI('/api/repositories/liked')
        ]);
        
        // Clear loading states
        usersContent.innerHTML = '';
        reposContent.innerHTML = '';
        
        // Render liked users
        if (likedUsers.length === 0) {
            usersContent.innerHTML = `
                <div class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-teal-100">${languageManager.translate('noLikedUsers')}</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-teal-300">${languageManager.translate('startExploringUsers')}</p>
                </div>
            `;
        } else {
            likedUsers.forEach(userData => {
                const userCard = createLikedUserCard(userData);
                usersContent.appendChild(userCard);
            });
        }
        
        // Render liked repositories
        if (likedRepos.length === 0) {
            reposContent.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-teal-100">${languageManager.translate('noLikedRepositories')}</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-teal-300">${languageManager.translate('startExploringRepositories')}</p>
                </div>
            `;
        } else {
            likedRepos.forEach(repo => {
                // Ensure each repository is marked as liked
                const repoData = {
                    ...repo,
                    isLiked: true
                };
                const repoCard = createRepositoryCard(repoData);
                reposContent.appendChild(repoCard);
            });
        }
        
    } catch (error) {
        console.error('Error initializing likes page:', error);
        contentArea.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500">${languageManager.translate('failedToLoadLikes')}</p>
            </div>
        `;
    }
}