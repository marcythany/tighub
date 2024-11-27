import { languageManager } from '../i18n/languageManager.js';

export function createSearchBar() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'relative w-full max-w-xl mx-auto';

    function updateContent() {
        const searchBar = document.createElement('div');
        searchBar.className = 'relative';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = languageManager.translate('searchPlaceholder');
        searchInput.className = 'w-full pl-10 pr-4 py-2 rounded-lg border border-teal-200 dark:border-teal-800 bg-white dark:bg-teal-900 text-teal-900 dark:text-teal-100 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 placeholder-teal-400 dark:placeholder-teal-500';
        
        const searchIcon = document.createElement('div');
        searchIcon.className = 'absolute left-3 top-2.5 text-teal-400 dark:text-teal-500';
        searchIcon.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        `;

        const searchResults = document.createElement('div');
        searchResults.className = 'absolute w-full mt-1 bg-white dark:bg-teal-900 rounded-lg shadow-lg hidden max-h-96 overflow-y-auto z-50 border border-teal-200 dark:border-teal-800';
        searchResults.id = 'searchResults';
        
        let debounceTimer;
        
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const query = searchInput.value.trim();
            
            if (query.length === 0) {
                searchResults.classList.add('hidden');
                return;
            }
            
            debounceTimer = setTimeout(async () => {
                try {
                    // Get repositories from the explore endpoint
                    const reposResponse = await fetch(`/api/repositories/explore?q=${encodeURIComponent(query)}`, {
                        credentials: 'include'
                    });
                    
                    // Get user profile from GitHub API
                    const userResponse = await fetch(`/api/users/github/${encodeURIComponent(query)}`, {
                        credentials: 'include'
                    });
                    
                    const [repositories, user] = await Promise.all([
                        reposResponse.json(),
                        userResponse.ok ? userResponse.json() : { error: 'User not found' }
                    ]);
                    
                    searchResults.innerHTML = `
                        ${!user.error ? `
                            <div class="p-2 text-sm text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-800">${languageManager.translate('user')}</div>
                            <a href="/profile/${user.username}" class="block p-2 hover:bg-teal-50 dark:hover:bg-teal-800" title="${languageManager.translate('viewUserProfile', { username: user.username })}">
                                <div class="flex items-center gap-2">
                                    <img src="${user.avatarUrl}" alt="${user.username}" class="w-8 h-8 rounded-full" title="${languageManager.translate('userAvatar', { username: user.username })}">
                                    <div>
                                        <div class="font-medium text-teal-900 dark:text-teal-100">${user.name || user.username}</div>
                                        <div class="text-sm text-teal-600 dark:text-teal-400">@${user.username}</div>
                                    </div>
                                </div>
                            </a>
                        ` : ''}
                        
                        ${repositories.repositories && repositories.repositories.length > 0 ? `
                            <div class="p-2 text-sm text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-800">${languageManager.translate('repositories')}</div>
                            ${repositories.repositories.slice(0, 5).map(repo => `
                                <a href="${repo.html_url}" class="block p-2 hover:bg-teal-50 dark:hover:bg-teal-800" target="_blank" title="${languageManager.translate('openRepository', { name: repo.name })}">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-5 h-5 text-teal-400 dark:text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                                        </svg>
                                        <div>
                                            <div class="font-medium text-teal-900 dark:text-teal-100">${repo.name}</div>
                                            <div class="text-sm text-teal-600 dark:text-teal-400">${repo.full_name}</div>
                                        </div>
                                    </div>
                                </a>
                            `).join('')}
                            ${repositories.repositories.length > 5 ? `
                                <a href="/explore?q=${encodeURIComponent(query)}" class="block p-2 text-center text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-800">
                                    ${languageManager.translate('viewAllResults', { count: repositories.repositories.length })}
                                </a>
                            ` : ''}
                        ` : `
                            <div class="p-4 text-center text-sm text-teal-600 dark:text-teal-400">
                                ${languageManager.translate('noResults')}
                            </div>
                        `}
                    `;
                    
                    searchResults.classList.remove('hidden');
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    searchResults.innerHTML = `
                        <div class="p-4 text-center text-sm text-red-600 dark:text-red-400">
                            ${languageManager.translate('searchError')}
                        </div>
                    `;
                    searchResults.classList.remove('hidden');
                }
            }, 300);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });

        // Clear existing content and append new elements
        searchContainer.innerHTML = '';
        searchBar.appendChild(searchIcon);
        searchBar.appendChild(searchInput);
        searchContainer.appendChild(searchBar);
        searchContainer.appendChild(searchResults);
    }

    // Initial render
    updateContent();

    // Listen for language changes
    languageManager.addChangeListener(() => {
        updateContent();
    });

    return searchContainer;
}
