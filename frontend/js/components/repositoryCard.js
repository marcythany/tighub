import { fetchAPI } from '../utils/api.js';
import { languageManager } from '../i18n/languageManager.js';

export function createRepositoryCard(repo, isCurrentUser = false) {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-teal-900 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-teal-100 dark:border-teal-800';
    
    function updateContent() {
        const languageColor = getLanguageColor(repo.language);
        
        card.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex items-start justify-between gap-2 mb-2">
                    <div class="min-w-0 flex-1">
                        <h3 class="font-semibold text-base truncate text-teal-900 dark:text-teal-100">
                            <a href="${repo.url}" target="_blank" class="hover:text-teal-600 dark:hover:text-teal-300" title="${languageManager.translate('openInNewTab')}">
                                ${repo.name}
                            </a>
                        </h3>
                        ${repo.fullName ? `
                            <p class="text-sm text-teal-600 dark:text-teal-400 truncate">
                                ${repo.fullName}
                            </p>
                        ` : ''}
                    </div>
                    ${!isCurrentUser ? `
                        <button class="like-button flex-shrink-0 ${repo.isLiked ? 'text-pink-500' : 'text-teal-400 dark:text-teal-500'} hover:text-pink-500 transition-colors" title="${repo.isLiked ? languageManager.translate('unlike') : languageManager.translate('like')}">
                            <svg class="w-5 h-5" fill="${repo.isLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                
                <p class="text-teal-700 dark:text-teal-300 text-sm mb-4 line-clamp-2 flex-1">
                    ${repo.description || languageManager.translate('noDescription')}
                </p>
                
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-teal-700 dark:text-teal-300">
                    ${repo.language ? `
                        <div class="flex items-center gap-1" title="${languageManager.translate('programmingLanguage')}">
                            <span class="w-3 h-3 rounded-full" style="background-color: ${languageColor}"></span>
                            <span>${repo.language}</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex items-center gap-1" title="${languageManager.translate('starsCount', { count: repo.stars_count || 0 })}">
                        <svg class="w-4 h-4 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                        <span>${repo.stars_count || 0}</span>
                    </div>
                    
                    <div class="flex items-center gap-1" title="${languageManager.translate('forksCount', { count: repo.forks_count || 0 })}">
                        <svg class="w-4 h-4 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                        <span>${repo.forks_count || 0}</span>
                    </div>
                    
                    <div class="flex items-center gap-1" title="${languageManager.translate('lastUpdated', { date: formatDate(repo.updated_at) })}">
                        <svg class="w-4 h-4 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>${languageManager.translate('updated')} ${formatDate(repo.updated_at)}</span>
                    </div>
                </div>
            </div>
        `;

        // Re-attach like button functionality
        const likeButton = card.querySelector('.like-button');
        if (likeButton) {
            likeButton.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    const action = repo.isLiked ? 'unlike' : 'like';
                    await fetchAPI(`/api/repositories/${repo.id}/${action}`, { method: 'POST' });
                    repo.isLiked = !repo.isLiked;
                    updateContent();
                } catch (error) {
                    // Handle error silently and let the UI stay in current state
                }
            });
        }
    }

    // Initial render
    updateContent();

    // Listen for language changes
    languageManager.addChangeListener(() => {
        updateContent();
    });

    return card;
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Swift': '#ffac45',
        'Go': '#00ADD8',
        'Rust': '#dea584'
    };
    return colors[language] || '#6e7681';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffDays === 0) {
        return languageManager.translate('today');
    } else if (diffDays === 1) {
        return languageManager.translate('yesterday');
    } else if (diffDays < 30) {
        return languageManager.translate('daysAgo', { days: diffDays });
    } else if (diffMonths === 1) {
        return languageManager.translate('monthAgo', { count: 1 });
    } else if (diffMonths < 12) {
        return languageManager.translate('monthsAgo', { count: diffMonths });
    } else if (diffYears === 1) {
        return languageManager.translate('yearAgo', { count: 1 });
    } else {
        return languageManager.translate('yearsAgo', { count: diffYears });
    }
}
