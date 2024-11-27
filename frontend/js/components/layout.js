import { createNavigation } from './navigation.js';
import { createFooter } from './footer.js';
import { createSearchBar } from './searchBar.js';
import { languageManager } from '../i18n/languageManager.js';

export function createLayout() {
    // Create main layout container
    const layout = document.createElement('div');
    layout.className = 'min-h-screen bg-white dark:bg-teal-950 text-teal-900 dark:text-teal-100';
    
    // Create flex container for content
    const container = document.createElement('div');
    container.className = 'flex min-h-screen';
    layout.appendChild(container);
    
    // Add navigation
    const navigation = createNavigation();
    container.appendChild(navigation);
    
    // Create main content area
    const mainContainer = document.createElement('div');
    mainContainer.className = 'flex-1 flex flex-col';
    
    // Add search bar at the top
    const searchBarContainer = document.createElement('div');
    searchBarContainer.className = 'p-4 border-b border-teal-200 dark:border-teal-800 bg-white dark:bg-teal-950';
    const searchBar = createSearchBar();
    searchBarContainer.appendChild(searchBar);
    mainContainer.appendChild(searchBarContainer);
    
    // Create content area for pages
    const contentArea = document.createElement('main');
    contentArea.id = 'content';
    contentArea.className = 'flex-1';
    contentArea.setAttribute('aria-label', languageManager.translate('mainContent'));
    mainContainer.appendChild(contentArea);
    
    // Add footer
    const { element: footerElement, cleanup: footerCleanup } = createFooter();
    mainContainer.appendChild(footerElement);
    
    container.appendChild(mainContainer);
    
    function updateContent() {
        contentArea.setAttribute('aria-label', languageManager.translate('mainContent'));
    }

    // Initial render
    updateContent();

    // Add language change listener and store cleanup function
    const layoutCleanup = languageManager.addChangeListener(updateContent);

    // Combine all cleanup functions
    const cleanup = () => {
        layoutCleanup();
        footerCleanup();
    };

    return {
        element: layout,
        contentArea: contentArea,
        cleanup: cleanup
    };
}
