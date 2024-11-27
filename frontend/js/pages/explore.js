import { fetchAPI, handleAPIError } from '../utils/api.js';
import { createRepositoryCard } from '../components/repositoryCard.js';
import { programmingLanguages } from '../utils/languages.js';
import { languageManager } from '../i18n/languageManager.js';

export default async function initializeExplorePage(contentArea) {
    try {
        function updateContent() {
            // Clear the content area
            contentArea.innerHTML = '';
            
            // Create main content area with grid layout
            const gridContainer = document.createElement('div');
            gridContainer.className = 'flex-1 p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen overflow-x-hidden';
            
            // Left sidebar for filters
            const filterSection = document.createElement('div');
            filterSection.className = 'w-full lg:w-64 space-y-4 lg:space-y-6 flex-shrink-0';
            
            // Create language filter
            const languageFilter = document.createElement('div');
            languageFilter.className = 'bg-white dark:bg-teal-900 rounded-lg shadow-md p-4 border border-teal-100 dark:border-teal-800';
            languageFilter.innerHTML = `
                <h3 class="text-lg font-semibold mb-3 text-teal-900 dark:text-teal-100">${languageManager.translate('language')}</h3>
                <div class="relative">
                    <div id="customLanguageSelect" class="w-full p-2 border rounded cursor-pointer bg-white dark:bg-teal-900 border-teal-200 dark:border-teal-700 text-teal-900 dark:text-teal-100">
                        <div class="selected-option flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-code text-teal-500 dark:text-teal-400"></i>
                                <span>${languageManager.translate('allLanguages')}</span>
                            </div>
                            <svg class="w-5 h-5 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                    <div id="languageDropdown" class="absolute z-10 w-full mt-1 bg-white dark:bg-teal-900 border border-teal-200 dark:border-teal-700 rounded-lg shadow-lg hidden max-h-60 overflow-y-auto">
                        <div class="language-option p-2 hover:bg-teal-50 dark:hover:bg-teal-800 flex items-center gap-2 text-teal-900 dark:text-teal-100" data-value="">
                            <i class="fas fa-code text-teal-500 dark:text-teal-400"></i>
                            <span>${languageManager.translate('allLanguages')}</span>
                        </div>
                        ${programmingLanguages.map(lang => `
                            <div class="language-option p-2 hover:bg-teal-50 dark:hover:bg-teal-800 flex items-center gap-2 text-teal-900 dark:text-teal-100" data-value="${lang.name}">
                                <i class="${lang.icon} text-teal-500 dark:text-teal-400"></i>
                                <span>${lang.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Add click handlers for custom select
            const customSelect = languageFilter.querySelector('#customLanguageSelect');
            const dropdown = languageFilter.querySelector('#languageDropdown');
            const selectedOption = languageFilter.querySelector('.selected-option');

            customSelect.addEventListener('click', () => {
                dropdown.classList.toggle('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!customSelect.contains(e.target)) {
                    dropdown.classList.add('hidden');
                }
            });

            languageFilter.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', () => {
                    const value = option.dataset.value;
                    const icon = option.querySelector('i').className;
                    const text = option.querySelector('span').textContent;
                    
                    selectedOption.innerHTML = `
                        <div class="flex items-center gap-2">
                            <i class="${icon}"></i>
                            <span>${text}</span>
                        </div>
                        <svg class="w-5 h-5 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    `;
                    
                    dropdown.classList.add('hidden');
                    // Trigger language change event
                    const event = new CustomEvent('languageChange', { detail: { language: value } });
                    window.dispatchEvent(event);
                });
            });

            // Create sort filter
            const sortFilter = document.createElement('div');
            sortFilter.className = 'bg-white dark:bg-teal-900 rounded-lg shadow-md p-4 border border-teal-100 dark:border-teal-800';
            sortFilter.innerHTML = `
                <h3 class="text-lg font-semibold mb-3 text-teal-900 dark:text-teal-100">${languageManager.translate('sortBy')}</h3>
                <select class="w-full p-2 border rounded bg-white dark:bg-teal-900 border-teal-200 dark:border-teal-700 text-teal-900 dark:text-teal-100 focus:border-teal-500 dark:focus:border-teal-400" id="sortSelect">
                    <option value="stars">${languageManager.translate('mostStars')}</option>
                    <option value="forks">${languageManager.translate('mostForks')}</option>
                    <option value="updated">${languageManager.translate('recentlyUpdated')}</option>
                    <option value="help-wanted-issues">${languageManager.translate('helpWanted')}</option>
                </select>
            `;

            filterSection.appendChild(languageFilter);
            filterSection.appendChild(sortFilter);
            
            // Main content area for repositories
            const reposSection = document.createElement('div');
            reposSection.className = 'flex-1 min-w-0';
            
            // Create search results header
            const resultsHeader = document.createElement('div');
            resultsHeader.className = 'flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2';
            resultsHeader.innerHTML = `
                <h2 class="text-xl lg:text-2xl font-bold">${languageManager.translate('exploreRepositories')}</h2>
                <span class="text-gray-500 text-sm lg:text-base" id="resultCount"></span>
            `;
            reposSection.appendChild(resultsHeader);
            
            // Create repository grid
            const repoGrid = document.createElement('div');
            repoGrid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6';
            repoGrid.id = 'repoGrid';
            reposSection.appendChild(repoGrid);
            
            // Add loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'animate-pulse space-y-4';
            loadingIndicator.id = 'loadingIndicator';
            for (let i = 0; i < 3; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'bg-teal-400 dark:bg-teal-900 h-32 rounded-lg';
                loadingIndicator.appendChild(skeleton);
            }
            repoGrid.appendChild(loadingIndicator);

            // Create pagination controls
            const paginationControls = document.createElement('div');
            paginationControls.className = 'flex justify-center items-center space-x-2 mt-6 px-4';
            paginationControls.innerHTML = `
                <button id="prevPage" class="px-3 sm:px-4 py-2 bg-teal-50 dark:bg-teal-950 text-gray-700 dark:text-teal-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                    ${languageManager.translate('previous')}
                </button>
                <span id="pageInfo" class="text-gray-600 text-sm sm:text-base"></span>
                <button id="nextPage" class="px-3 sm:px-4 py-2 bg-teal-50 dark:bg-teal-950 text-gray-700 dark:text-teal-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                    ${languageManager.translate('next')}
                </button>
            `;
            reposSection.appendChild(paginationControls);

            gridContainer.appendChild(filterSection);
            gridContainer.appendChild(reposSection);
            contentArea.appendChild(gridContainer);

            // Function to update repositories
            async function updateRepositories(query = '', language = '', sort = 'stars', page = 1) {
                try {
                    loadingIndicator.style.display = 'block';
                    const repoGrid = document.getElementById('repoGrid');
                    repoGrid.querySelectorAll('.repository-card').forEach(card => card.remove());

                    const response = await fetchAPI(`/api/repositories/explore?q=${query}&language=${language}&sort=${sort}&page=${page}`);
                    
                    loadingIndicator.style.display = 'none';
                    
                    // Update result count and pagination info
                    const resultCount = document.getElementById('resultCount');
                    resultCount.textContent = languageManager.translate('repositoriesFound', { count: response.total_count.toLocaleString() });
                    
                    const pageInfo = document.getElementById('pageInfo');
                    pageInfo.textContent = languageManager.translate('pageInfo', { current: response.current_page, total: response.total_pages });

                    // Update pagination buttons
                    const prevButton = document.getElementById('prevPage');
                    const nextButton = document.getElementById('nextPage');
                    
                    prevButton.disabled = response.current_page <= 1;
                    nextButton.disabled = response.current_page >= response.total_pages;
                    
                    // Store current state in window object for pagination
                    window.exploreState = {
                        query,
                        language,
                        sort,
                        currentPage: response.current_page,
                        totalPages: response.total_pages
                    };

                    if (response.repositories && response.repositories.length > 0) {
                        response.repositories.forEach(repo => {
                            const card = createRepositoryCard(repo);
                            card.classList.add('repository-card');
                            repoGrid.appendChild(card);
                        });
                    } else {
                        repoGrid.innerHTML = `
                            <div class="col-span-full text-center py-8 text-teal-600 dark:text-teal-400">
                                ${languageManager.translate('noRepositoriesFound')}
                            </div>
                        `;
                    }
                } catch (error) {
                    handleAPIError(error);
                    loadingIndicator.style.display = 'none';
                    repoGrid.innerHTML = `
                        <div class="col-span-full text-center py-8 text-red-600 dark:text-red-400">
                            ${languageManager.translate('errorLoadingRepositories')}
                        </div>
                    `;
                }
            }

            // Add event listeners
            const sortSelect = document.getElementById('sortSelect');
            sortSelect.addEventListener('change', () => {
                updateRepositories('', window.exploreState?.language || '', sortSelect.value, 1);
            });

            window.addEventListener('languageChange', (e) => {
                updateRepositories('', e.detail.language, sortSelect.value, 1);
            });

            document.getElementById('prevPage').addEventListener('click', () => {
                if (window.exploreState && window.exploreState.currentPage > 1) {
                    updateRepositories(
                        window.exploreState.query,
                        window.exploreState.language,
                        window.exploreState.sort,
                        window.exploreState.currentPage - 1
                    );
                }
            });

            document.getElementById('nextPage').addEventListener('click', () => {
                if (window.exploreState && window.exploreState.currentPage < window.exploreState.totalPages) {
                    updateRepositories(
                        window.exploreState.query,
                        window.exploreState.language,
                        window.exploreState.sort,
                        window.exploreState.currentPage + 1
                    );
                }
            });

            // Initial load
            updateRepositories();
        }

        // Initial render
        updateContent();

        // Listen for language changes
        languageManager.addChangeListener(() => {
            updateContent();
        });

    } catch (error) {
        handleAPIError(error);
        contentArea.innerHTML = `
            <div class="text-center py-8 text-red-600 dark:text-red-400">
                ${languageManager.translate('errorLoadingPage')}
            </div>
        `;
    }
}