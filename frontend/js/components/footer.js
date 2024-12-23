import { languageManager } from '../i18n/languageManager.js';

export function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'mt-auto bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-100 py-4 px-6 shadow-lg';
    footer.setAttribute('aria-label', languageManager.translate('footerSection'));

    function updateContent() {
        footer.innerHTML = `
            <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

                <div class="text-sm text-teal-700 dark:text-teal-300">
                    ${languageManager.translate('copyright')}
                </div>
            </div>
        `;
    }

    // Initial render
    updateContent();

    // Add language change listener and store cleanup function
    const cleanup = languageManager.addChangeListener(updateContent);

    return {
        element: footer,
        cleanup: cleanup
    };
}