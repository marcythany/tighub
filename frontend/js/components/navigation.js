import { languageManager } from '../i18n/languageManager.js';
import { themeManager } from '../theme/themeManager.js';

export function createNavigation() {
    const nav = document.createElement('nav');
    nav.className = 'min-h-screen w-14 bg-teal-100 dark:bg-teal-900 text-teal-900 dark:text-teal-100 flex flex-col';
    
    function setupLanguageButtons() {
        const enButton = nav.querySelector('#lang-en');
        const ptButton = nav.querySelector('#lang-pt');

        if (enButton) {
            enButton.addEventListener('click', () => {
                console.log('Changing language to EN');
                languageManager.setLanguage('en');
            });
        }

        if (ptButton) {
            ptButton.addEventListener('click', () => {
                console.log('Changing language to PT-BR');
                languageManager.setLanguage('pt-BR');
            });
        }
    }
    
    const updateNavigation = () => {
        // Preserve the avatar element if it exists
        const existingAvatar = nav.querySelector('#profile-avatar');
        const avatarHtml = existingAvatar?.innerHTML || `
            <svg class="w-full h-full text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        `;

        // Get current theme and language
        const isDarkMode = themeManager.getCurrentTheme() === 'dark';
        const currentLang = languageManager.getCurrentLanguage();

        nav.innerHTML = `
            <div class="border-b border-teal-200 dark:border-teal-800">
                <a href="/" class="flex items-center justify-center">
                    <img class="h-8 w-8" src="/tigs.png" alt="TiGHub">
                </a>
            </div>
            
            <div class="flex-1 overflow-y-auto py-4">
                <div class="space-y-2 px-2">
                    <a href="/" class="flex items-center justify-center p-2 rounded hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors" title="${languageManager.translate('home')}">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </a>
                    
                    <a href="/explore" class="flex items-center justify-center p-2 rounded hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors" title="${languageManager.translate('explore')}">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </a>
                    
                    <a href="/likes" class="flex items-center justify-center p-2 rounded hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors" title="${languageManager.translate('likes')}">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </a>
                </div>
            </div>

            <div class="p-2 border-t border-teal-200 dark:border-teal-800 space-y-2">
                <div class="flex flex-col gap-1 justify-center items-center p-2">
                    <button id="theme-toggle" class="w-8 h-8 flex items-center justify-center rounded hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors" title="${isDarkMode ? languageManager.translate('lightMode') : languageManager.translate('darkMode')}">
                        ${isDarkMode ? `
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ` : `
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        `}
                    </button>
                    <div class="flex flex-col gap-1">
                        <button id="lang-en" class="text-sm px-2 py-1 rounded ${currentLang === 'en' ? 'bg-teal-200 dark:bg-teal-800' : 'hover:bg-teal-200 dark:hover:bg-teal-800'}">EN</button>
                        <button id="lang-pt" class="text-sm px-2 py-1 rounded ${currentLang === 'pt-BR' ? 'bg-teal-200 dark:bg-teal-800' : 'hover:bg-teal-200 dark:hover:bg-teal-800'}">PT</button>
                    </div>
                </div>
                <a href="/profile" class="flex items-center justify-center p-2 rounded hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors" id="profile-link" title="${languageManager.translate('profile')}">
                    <div class="w-8 h-8 rounded-full bg-teal-200 dark:bg-teal-800 overflow-hidden" id="profile-avatar">
                        ${avatarHtml}
                    </div>
                </a>
                <button id="logout-btn" class="w-full flex items-center justify-center p-2 rounded hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors" title="${languageManager.translate('logout')}">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        `;

        // Set active class for current path
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            if (link.getAttribute('href') === window.location.pathname) {
                link.classList.add('bg-teal-200', 'dark:bg-teal-800');
            }
        });

        // Add theme toggle handler
        const themeToggle = nav.querySelector('#theme-toggle');
        themeToggle.addEventListener('click', () => {
            themeManager.toggleTheme();
            updateNavigation(); // Update icons
        });

        setupLanguageButtons();
    };

    // Initial render
    updateNavigation();

    // Handle navigation clicks
    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            const path = link.getAttribute('href');
            window.history.pushState({}, '', path);
            window.dispatchEvent(new PopStateEvent('popstate'));
            
            // Remove active class from all links and add to clicked one
            const links = nav.querySelectorAll('a');
            links.forEach(l => l.classList.remove('bg-teal-200', 'dark:bg-teal-800'));
            link.classList.add('bg-teal-200', 'dark:bg-teal-800');
        }
    });

    // Handle logout
    nav.addEventListener('click', async (e) => {
        const logoutBtn = e.target.closest('#logout-btn');
        if (logoutBtn) {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    });

    // Load user data
    const loadUserData = async () => {
        try {
            const response = await fetch('/api/auth/status', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated && data.user) {
                    const avatarContainer = nav.querySelector('#profile-avatar');
                    avatarContainer.innerHTML = `<img src="${data.user.avatarUrl}" alt="Profile" class="w-full h-full object-cover">`;
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    loadUserData();

    // Listen for language and theme changes
    languageManager.addChangeListener(() => {
        console.log('Language changed, updating navigation');
        updateNavigation();
    });

    themeManager.addChangeListener(() => {
        console.log('Theme changed, updating navigation');
        updateNavigation();
    });

    return nav;
}
