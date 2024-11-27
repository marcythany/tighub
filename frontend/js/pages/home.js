import { eventBus, Events } from '../core/EventBus.js';
import { languageManager } from '../i18n/languageManager.js';
import { api } from '../services/ApiClient.js';
import { logger } from '../core/Logger.js';
import { Component } from '../core/Component.js';

export class HomePage extends Component {
    constructor(container) {
        super(container);
        this.state = this.getInitialState();
        this.setupEventListeners();
    }

    getInitialState() {
        return {
            isLoading: false,
            error: null,
            recentActivity: []
        };
    }

    mount() {
        this.loadRecentActivity();
    }

    destroy() {
        // Clean up event listeners
        [
            this.unsubscribeLanguageEvent,
            this.unsubscribeThemeEvent,
            this.unsubscribeLanguageBusEvent,
            this.unsubscribeErrorEvent
        ].forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });

        // Clear references
        this.unsubscribeLanguageEvent = null;
        this.unsubscribeThemeEvent = null;
        this.unsubscribeLanguageBusEvent = null;
        this.unsubscribeErrorEvent = null;
    }

    setupEventListeners() {
        // Store unsubscribe functions
        this.unsubscribeLanguageEvent = languageManager.addChangeListener(() => {
            this.render();
        });

        this.unsubscribeThemeEvent = eventBus.on(Events.THEME_CHANGED, () => {
            this.render();
        });

        this.unsubscribeLanguageBusEvent = eventBus.on(Events.LANGUAGE_CHANGED, () => {
            this.render();
        });

        this.unsubscribeErrorEvent = eventBus.on(Events.ERROR_OCCURRED, (error) => {
            // Extract error message from various formats
            let errorMessage = null;
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && error.message) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object') {
                errorMessage = JSON.stringify(error);
            }
            
            // Update state with error message
            this.setState({ error: errorMessage });
            this.render(); // Force re-render to show error message
        });
    }

    async loadRecentActivity() {
        try {
            this.setState({ isLoading: true, error: null });
            const data = await api.get('/api/activity');
            this.setState({ recentActivity: data, isLoading: false });
        } catch (error) {
            logger.error('Error loading recent activity:', { error });
            this.setState({ 
                error: error.message === 'Network error' ? 'Network error' : 'Failed to load activity',
                isLoading: false 
            });
        }
    }

    render() {
        if (!this.container) return;

        // Clear container
        this.container.innerHTML = '';

        // Show loading state
        if (this.state.isLoading) {
            const loadingIndicator = this.createElement('div', {
                classes: ['loading-indicator', 'text-center', 'py-4']
            });
            loadingIndicator.innerHTML = '<div class="spinner"></div>';
            this.container.appendChild(loadingIndicator);
            return;
        }

        // Show error state
        if (this.state.error) {
            const errorMessage = this.createElement('div', {
                classes: ['error-message', 'text-red-500', 'text-center', 'py-4']
            });
            errorMessage.textContent = this.state.error;
            this.container.appendChild(errorMessage);
            return;
        }

        // Create activity list
        const activityList = this.createElement('ul', {
            classes: ['activity-list', 'space-y-4']
        });

        if (this.state.recentActivity && this.state.recentActivity.length > 0) {
            this.state.recentActivity.forEach((item) => {
                const activityItem = this.createElement('li', {
                    classes: ['activity-item', 'flex', 'items-center', 'gap-4']
                });
                activityItem.innerHTML = `
                    <div class="flex-shrink-0">
                        <img src="${item.user.avatar}" alt="${item.user.username}" class="h-10 w-10 rounded-full">
                    </div>
                    <div class="flex-grow">
                        <p class="text-sm text-gray-900 dark:text-white">
                            <span class="font-medium">${item.user.username}</span>
                            ${item.action}
                            <a href="/repo/${item.repo.full_name}" class="text-teal-600 dark:text-teal-400 hover:underline">
                                ${item.repo.name}
                            </a>
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            ${new Date(item.timestamp).toLocaleString()}
                        </p>
                    </div>
                `;
                activityList.appendChild(activityItem);
            });
        } else {
            const emptyState = this.createElement('li', {
                classes: ['text-center', 'text-gray-500', 'py-4']
            });
            emptyState.textContent = languageManager.translate('home.noActivity');
            activityList.appendChild(emptyState);
        }

        this.container.appendChild(activityList);
    }

    createFeatureCard(title, description, icon) {
        const card = this.createElement('div', {
            classes: ['feature-card', 'bg-white', 'dark:bg-gray-800', 'rounded-lg', 'shadow-lg', 'p-6', 'flex', 'flex-col', 'items-center', 'text-center']
        });

        const iconElement = this.createElement('div', {
            classes: ['text-4xl', 'mb-4', 'text-teal-500']
        });
        iconElement.innerHTML = `<i class="fas fa-${icon}"></i>`;

        const titleElement = this.createElement('h3', {
            classes: ['text-lg', 'font-semibold', 'mb-2', 'text-gray-900', 'dark:text-white']
        });
        titleElement.textContent = title;

        const descriptionElement = this.createElement('p', {
            classes: ['text-gray-600', 'dark:text-gray-300']
        });
        descriptionElement.textContent = description;

        card.appendChild(iconElement);
        card.appendChild(titleElement);
        card.appendChild(descriptionElement);

        return card;
    }
}

// Export a factory function for creating the page
export default function initializeHomePage(container) {
    return new HomePage(container);
}
