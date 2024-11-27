import { languageManager } from '../i18n/languageManager.js';
import { handleAPIError } from '../utils/api.js';

export function initializeLoginPage(contentArea) {
    let cleanup = null;

    try {
        function updateContent() {
            contentArea.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-800 dark:to-teal-950 py-12 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-md w-full space-y-8 bg-white dark:bg-teal-900 p-8 rounded-xl shadow-2xl">
                        <div>
                            <h1 class="mt-6 text-center text-3xl font-extrabold text-teal-900 dark:text-teal-100">
                                ${languageManager.translate('welcomeBack')}
                            </h1>
                            <p class="mt-2 text-center text-sm text-teal-600 dark:text-teal-300">
                                ${languageManager.translate('loginSubtitle')}
                            </p>
                            <p class="mt-2 text-center text-sm text-teal-600 dark:text-teal-300">
                                ${languageManager.translate('loginDescription')}
                            </p>
                        </div>
                        <div class="mt-8">
                            <div>
                                <button
                                    type="button"
                                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600"
                                    onclick="window.location.href='/api/auth/github'"
                                >
                                    <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg class="h-5 w-5 text-teal-500 group-hover:text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                    </span>
                                    ${languageManager.translate('loginWithGithub')}
                                </button>
                            </div>
                        </div>
                        <div class="mt-6">
                            <p class="text-center text-xs text-teal-600 dark:text-teal-400">
                                ${languageManager.translate('privacyNotice', {
                                    privacy: `<a href="/privacy" class="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-300 dark:hover:text-teal-200">${languageManager.translate('privacyPolicy')}</a>`,
                                    terms: `<a href="/terms" class="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-300 dark:hover:text-teal-200">${languageManager.translate('termsOfService')}</a>`
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Initial render
        updateContent();

        // Add language change listener and store cleanup function
        cleanup = languageManager.addChangeListener(updateContent);

        // Return a cleanup function that will be called when the page is unmounted
        return () => {
            if (cleanup) {
                cleanup();
                cleanup = null;
            }
        };

    } catch (error) {
        handleAPIError(error);
        contentArea.innerHTML = `
            <div class="p-6 text-center text-red-600 dark:text-red-400">
                ${languageManager.translate('error')}
            </div>
        `;

        // Return empty cleanup function in case of error
        return () => {
            if (cleanup) {
                cleanup();
                cleanup = null;
            }
        };
    }
}
