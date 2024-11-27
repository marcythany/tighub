import { createLayout } from './components/layout.js';

document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');
    const { element: layout, contentArea, cleanup: layoutCleanup } = createLayout();
    app.appendChild(layout);
    
    // Handle navigation events
    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });
    
    // Handle initial load
    loadPage(window.location.pathname);

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        if (layoutCleanup) layoutCleanup();
    });
});

// Store the current page cleanup function
let currentPageCleanup = null;

// Handle navigation
async function loadPage(path) {
    try {
        const response = await fetch(`/api/auth/status`, { credentials: 'include' });
        const authData = await response.json();
        
        if (!authData.authenticated && path !== '/login') {
            window.location.href = '/login';
            return;
        }
        
        const contentArea = document.getElementById('content');
        
        // Cleanup previous page if exists and is a function
        if (typeof currentPageCleanup === 'function') {
            try {
                currentPageCleanup();
            } catch (error) {
                console.error('Error during page cleanup:', error);
            }
        }
        currentPageCleanup = null;
        
        // Extract the base path and parameters
        const [basePath, ...params] = path.split('/').filter(Boolean);
        
        // Clear content area before loading new page
        contentArea.innerHTML = '';
        
        try {
            switch (basePath) {
                case undefined:
                case 'home':
                    const homeModule = await import('./pages/home.js');
                    currentPageCleanup = await homeModule.default(contentArea);
                    break;
                case 'explore':
                    const exploreModule = await import('./pages/explore.js');
                    currentPageCleanup = await exploreModule.default(contentArea);
                    break;
                case 'profile':
                    const profileModule = await import('./pages/profile.js');
                    const username = params[0];
                    currentPageCleanup = await profileModule.default(contentArea, username);
                    break;
                case 'likes':
                    const likesModule = await import('./pages/likes.js');
                    currentPageCleanup = await likesModule.default(contentArea);
                    break;
                case 'login':
                    const loginModule = await import('./pages/login.js');
                    currentPageCleanup = await loginModule.initializeLoginPage(contentArea);
                    break;
                default:
                    contentArea.innerHTML = `
                        <div class="flex items-center justify-center min-h-screen">
                            <div class="text-center">
                                <h1 class="text-4xl font-bold text-teal-900 dark:text-teal-100 mb-4">404</h1>
                                <p class="text-teal-600 dark:text-teal-400">Page Not Found</p>
                            </div>
                        </div>
                    `;
                    currentPageCleanup = null;
            }
        } catch (error) {
            console.error('Error loading module:', error);
            contentArea.innerHTML = `
                <div class="flex items-center justify-center min-h-screen">
                    <div class="text-center text-red-600 dark:text-red-400">
                        <p>Error loading page. Please try again.</p>
                    </div>
                </div>
            `;
            currentPageCleanup = null;
        }
    } catch (error) {
        console.error('Error loading page:', error);
        currentPageCleanup = null;
    }
}
