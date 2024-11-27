import { fetchAPI, handleAPIError } from '../utils/api.js';
import { languageManager } from '../i18n/languageManager.js';

export default async function initializeHomePage(contentArea) {
    let cleanup = null; // Armazena a função de cleanup

    try {
        function createFeatureCard(title, description, icon) {
            return `
                <div class="bg-white dark:bg-teal-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div class="text-teal-600 dark:text-teal-400 mb-4">
                        ${icon}
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-teal-900 dark:text-teal-100">
                        ${title}
                    </h3>
                    <p class="text-teal-700 dark:text-teal-300">
                        ${description}
                    </p>
                </div>
            `;
        }

        function updateContent() {
            contentArea.innerHTML = `
                <div class="min-h-full w-full">
                    <!-- Hero Section -->
                    <div class="bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-800 dark:to-teal-950">
                        <div class="container mx-auto px-6 py-20 text-center">
                            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                                ${languageManager.translate('welcome')}
                            </h1>
                            <p class="text-xl text-teal-100 mb-8">
                                ${languageManager.translate('tagline')}
                            </p>
                            <div class="flex flex-wrap justify-center gap-4">
                                <a href="/explore" class="bg-white text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                                    ${languageManager.translate('getStarted')}
                                </a>
                                <a href="/about" class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                                    ${languageManager.translate('learnMore')}
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Features Section -->
                    <div class="container mx-auto px-6 py-16">
                        <h2 class="text-3xl font-bold text-center mb-12 text-teal-900 dark:text-teal-100">
                            ${languageManager.translate('featuresTitle')}
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            ${createFeatureCard(
                                languageManager.translate('feature1Title'),
                                languageManager.translate('feature1Description'),
                                '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>'
                            )}
                            ${createFeatureCard(
                                languageManager.translate('feature2Title'),
                                languageManager.translate('feature2Description'),
                                '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
                            )}
                            ${createFeatureCard(
                                languageManager.translate('feature3Title'),
                                languageManager.translate('feature3Description'),
                                '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>'
                            )}
                        </div>
                    </div>

                    <!-- Recent Activity Section -->
                    <div class="container mx-auto px-6 pb-16">
                        <h2 class="text-3xl font-bold text-center mb-8 text-teal-900 dark:text-teal-100">
                            ${languageManager.translate('recentActivity')}
                        </h2>
                        <div class="bg-white dark:bg-teal-900 rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
                            <div class="text-center text-teal-700 dark:text-teal-300">
                                ${languageManager.translate('noRecentActivity')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Initial render
        updateContent();

        // Add language change listener and store cleanup function
        cleanup = languageManager.addChangeListener(updateContent);

        // Retorna uma função de cleanup para ser chamada quando a página for desmontada
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

        // Mesmo em caso de erro, retorna uma função de cleanup
        return () => {
            if (cleanup) {
                cleanup();
                cleanup = null;
            }
        };
    }
}
