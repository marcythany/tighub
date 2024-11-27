import { describe, test, expect, beforeEach, afterEach, mock, spyOn } from 'bun:test';
import { HomePage } from '../pages/home.js';
import { eventBus, Events } from '../core/EventBus.js';
import { LanguageManager } from '../i18n/languageManager.js';

// Mock localStorage
const mockLocalStorage = {
    store: {},
    getItem: mock((key) => mockLocalStorage.store[key] || null),
    setItem: mock((key, value) => {
        mockLocalStorage.store[key] = value;
    }),
    removeItem: mock((key) => {
        delete mockLocalStorage.store[key];
    }),
    clear: mock(() => {
        mockLocalStorage.store = {};
    })
};

global.localStorage = mockLocalStorage;

// Mock DOM
function createMockElement(tag = 'div') {
    const element = {
        tagName: tag,
        children: [],
        innerHTML: '',
        textContent: '',
        attributes: {},
        style: {},
        classList: new Set(),
        appendChild(child) {
            this.children.push(child);
            child.parentElement = this;
            return child;
        },
        removeChild(child) {
            const index = this.children.indexOf(child);
            if (index !== -1) {
                this.children.splice(index, 1);
                child.parentElement = null;
            }
            return child;
        },
        querySelector(selector) {
            // Basic selector support for classes and tags
            if (selector.startsWith('.')) {
                const className = selector.slice(1);
                const classSet = this.classList instanceof Set ? this.classList : this.classList.set;
                if (classSet.has(className)) return this;
                for (const child of this.children) {
                    const result = child.querySelector?.(selector);
                    if (result) return result;
                }
            } else {
                if (this.tagName.toLowerCase() === selector.toLowerCase()) return this;
                for (const child of this.children) {
                    const result = child.querySelector?.(selector);
                    if (result) return result;
                }
            }
            return null;
        },
        setAttribute(name, value) {
            this.attributes[name] = value;
        },
        getAttribute(name) {
            return this.attributes[name];
        },
        hasAttribute(name) {
            return name in this.attributes;
        },
        remove() {
            if (this.parentElement) {
                this.parentElement.removeChild(this);
            }
        }
    };

    // Create classList methods that operate on the Set
    element.classList = {
        add(...classes) {
            classes.forEach(c => this.set.add(c));
        },
        remove(...classes) {
            classes.forEach(c => this.set.delete(c));
        },
        contains(className) {
            return this.set.has(className);
        },
        set: element.classList
    };

    return element;
}

const mockDocument = {
    createElement: (tag) => createMockElement(tag),
    body: createMockElement()
};

global.document = mockDocument;

// Mock EventBus
const originalEventBusOn = eventBus.on;
const originalEventBusOff = eventBus.off;
const originalEventBusEmit = eventBus.emit;

describe('HomePage', () => {
    let container;
    let homePage;
    let languageManager;

    beforeEach(() => {
        // Setup mocks
        eventBus.on = mock((event, callback) => {
            // Store the callback so emit can use it
            eventBus._callbacks = eventBus._callbacks || {};
            eventBus._callbacks[event] = callback;
            return () => { delete eventBus._callbacks[event]; };
        });
        eventBus.off = mock();
        eventBus.emit = mock((event, data) => {
            // Call the stored callback if it exists
            if (eventBus._callbacks && eventBus._callbacks[event]) {
                eventBus._callbacks[event](data);
            }
        });

        // Create a new instance of LanguageManager for each test
        languageManager = new LanguageManager();
        languageManager.setLanguage('en');
        
        container = createMockElement();
        homePage = new HomePage(container);
        homePage.mount(); // Ensure event listeners are set up
    });

    afterEach(() => {
        // Restore original methods
        eventBus.on = originalEventBusOn;
        eventBus.off = originalEventBusOff;
        eventBus.emit = originalEventBusEmit;
        eventBus._callbacks = {};

        // Clear any existing listeners
        languageManager.clearListeners?.();
        languageManager = null;
    });

    describe('initialization', () => {
        test('should create homepage with default state', () => {
            homePage = new HomePage(container);
            expect(homePage.container).toBe(container);
            expect(homePage.state).toEqual({
                isLoading: false,
                error: null,
                recentActivity: []
            });
        });

        test('should subscribe to events on mount', () => {
            expect(eventBus.on).toHaveBeenCalled();
        });

        test('should unsubscribe from events on unmount', () => {
            const unsubscribeError = mock();
            const unsubscribeLang = mock();
            
            // Mock event subscriptions
            eventBus.on.mockImplementation((event) => {
                if (event === Events.ERROR_OCCURRED) {
                    return unsubscribeError;
                }
                if (event === Events.THEME_CHANGED) {
                    return mock();
                }
                return () => {};
            });

            homePage = new HomePage(container);
            homePage.destroy();

            expect(unsubscribeError).toHaveBeenCalled();
        });
    });

    describe('loadRecentActivity', () => {
        test('should load recent activity successfully', async () => {
            const mockActivity = [{
                id: 1,
                type: 'commit',
                action: 'pushed to',
                user: {
                    username: 'testuser',
                    avatar: 'test-avatar.jpg'
                },
                repo: {
                    name: 'test/repo',
                    full_name: 'test/repo'
                },
                timestamp: '2024-01-01T00:00:00Z'
            }];

            global.fetch = mock(() => 
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockActivity)
                })
            );

            await homePage.loadRecentActivity();
            expect(homePage.state.recentActivity).toEqual(mockActivity);
            expect(homePage.state.isLoading).toBe(false);
            expect(homePage.state.error).toBe(null);
        });

        test('should handle loading state', () => {
            global.fetch = mock(() => new Promise(() => {})); // Never resolves
            homePage.loadRecentActivity();
            expect(homePage.state.isLoading).toBe(true);
            expect(homePage.state.error).toBe(null);
        });

        test('should handle error state', async () => {
            global.fetch = mock(() => 
                Promise.reject(new Error('Test error'))
            );

            await homePage.loadRecentActivity();
            expect(homePage.state.error).toBeTruthy();
            expect(homePage.state.isLoading).toBe(false);
        });
    });

    describe('rendering', () => {
        test('should render loading state', () => {
            homePage.setState({ isLoading: true });
            homePage.render();
            const loadingElement = container.querySelector('.loading-indicator');
            expect(loadingElement).toBeTruthy();
        });

        test('should render error state', () => {
            const errorMessage = 'Test error';
            homePage.setState({ error: errorMessage });
            homePage.render();
            const errorElement = container.querySelector('.error-message');
            expect(errorElement).toBeTruthy();
        });

        test('should render recent activity', () => {
            const mockActivity = [{
                action: 'starred',
                user: {
                    username: 'testuser',
                    avatar: 'test-avatar.jpg'
                },
                repo: {
                    name: 'test/repo',
                    full_name: 'test/repo'
                },
                timestamp: '2024-01-01T00:00:00Z'
            }];

            // Create a fresh container for this test
            const testContainer = createMockElement();
            const testHomePage = new HomePage(testContainer);
            testHomePage.setState({ recentActivity: mockActivity });
            testHomePage.render();

            // Check if activity item was rendered
            const activityItem = testContainer.querySelector('.activity-item');
            expect(activityItem).toBeTruthy();
            expect(activityItem.innerHTML).toContain('testuser');
            expect(activityItem.innerHTML).toContain('test/repo');
        });
    });

    describe('feature cards', () => {
        test('should create feature card with all elements', () => {
            const testContainer = createMockElement();
            const testHomePage = new HomePage(testContainer);
            
            const title = 'Test Title';
            const description = 'Test Description';
            const icon = 'star';

            const card = testHomePage.createFeatureCard(title, description, icon);
            testContainer.appendChild(card); // Important: append the card to test container
            
            // Check the card has the correct classes
            expect(card.classList.contains('feature-card')).toBe(true);
            
            // Check icon
            const iconElement = card.querySelector('.text-4xl');
            expect(iconElement).toBeTruthy();
            expect(iconElement.innerHTML).toBe('<i class="fas fa-star"></i>');

            // Check title
            const titleElement = card.querySelector('h3');
            expect(titleElement).toBeTruthy();
            expect(titleElement.textContent).toBe(title);

            // Check description
            const descriptionElement = card.querySelector('p');
            expect(descriptionElement).toBeTruthy();
            expect(descriptionElement.textContent).toBe(description);
        });
    });

    describe('error handling', () => {
        test('should handle API error events', () => {
            const errorMessage = 'Test API Error';
            homePage.setState({ error: null });
            eventBus.emit(Events.ERROR_OCCURRED, { message: errorMessage });
            expect(homePage.state.error).toBe(errorMessage);
        });

        test('should handle network error in loadRecentActivity', async () => {
            global.fetch = mock(() => Promise.reject(new Error('Network error')));
            
            await homePage.loadRecentActivity();
            
            expect(homePage.state.isLoading).toBe(false);
            expect(homePage.state.error).toBe('Network error');
            expect(homePage.state.recentActivity).toEqual([]);
        });

        test('should handle API error response in loadRecentActivity', async () => {
            global.fetch = mock(() => 
                Promise.resolve({
                    ok: false,
                    status: 500,
                    statusText: 'Internal Server Error'
                })
            );
            
            await homePage.loadRecentActivity();
            
            expect(homePage.state.isLoading).toBe(false);
            expect(homePage.state.error).toBe('Failed to load activity');
            expect(homePage.state.recentActivity).toEqual([]);
        });
    });

    describe('event handling', () => {
        test('should re-render on language change', () => {
            // Create a fresh container for this test
            const testContainer = createMockElement();
            const testHomePage = new HomePage(testContainer);
            
            // Use Bun's spy functionality
            const renderSpy = spyOn(testHomePage, 'render');
            eventBus.emit(Events.LANGUAGE_CHANGED);
            expect(renderSpy).toHaveBeenCalledTimes(1);
            renderSpy.mockRestore();
        });

        test('should re-render on theme change', () => {
            // Create a fresh container for this test
            const testContainer = createMockElement();
            const testHomePage = new HomePage(testContainer);
            
            // Use Bun's spy functionality
            const renderSpy = spyOn(testHomePage, 'render');
            eventBus.emit(Events.THEME_CHANGED);
            expect(renderSpy).toHaveBeenCalledTimes(1);
            renderSpy.mockRestore();
        });
    });
});
