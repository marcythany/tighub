import { languageManager } from '../i18n/languageManager.js';

export function createLikedUserCard(userData) {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-teal-900 rounded-lg shadow-md p-4 flex items-center space-x-4 border border-teal-100 dark:border-teal-800';

    function updateContent() {
        // Make the card clickable to go to user's profile
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = `/profile/${userData.username}`;
        });

        card.innerHTML = `
            <img src="${userData.avatarUrl}" alt="${userData.username}" class="w-12 h-12 rounded-full ring-2 ring-teal-200 dark:ring-teal-700" title="${languageManager.translate('userAvatar', { username: userData.username })}">
            <div class="flex-1 min-w-0">
                <h2 class="text-sm font-medium text-teal-900 dark:text-teal-100 truncate" title="${userData.name || userData.username}">
                    ${userData.name || userData.username}
                </h2>
                <p class="text-sm text-teal-600 dark:text-teal-400" title="${languageManager.translate('githubUsername', { username: userData.username })}">@${userData.username}</p>
            </div>
            <button class="flex items-center px-3 py-1.5 bg-pink-50 dark:bg-pink-900 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 rounded-md" title="${languageManager.translate('unlikeUser')}">
                <svg class="w-5 h-5 mr-1 text-pink-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                    </path>
                </svg>
                <span class="text-sm">${languageManager.translate('liked')}</span>
            </button>
        `;
    }

    // Initial render
    updateContent();

    // Listen for language changes
    languageManager.addChangeListener(() => {
        updateContent();
    });

    return card;
}
