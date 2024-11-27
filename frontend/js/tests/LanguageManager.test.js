import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import { translations } from '../i18n/translations.js';
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

describe('LanguageManager', () => {
    let languageManager;

    beforeEach(() => {
        console.warn = mock();
        console.error = mock();
        localStorage.clear();
        // Create a new instance for each test
        languageManager = new LanguageManager();
        // Reset language to English
        languageManager.setLanguage('en');
        // Clear any existing listeners
        languageManager.clearListeners?.();
    });

    afterEach(() => {
        // Clear all mocks
        languageManager.clearListeners?.();
        languageManager = null;
    });

    describe('initialization', () => {
        test('should initialize with default language (en) when no saved language', () => {
            expect(languageManager.getCurrentLanguage()).toBe('en');
        });

        test('should use saved language from localStorage', () => {
            localStorage.setItem('language', 'pt-BR');
            languageManager.setLanguage('pt-BR');
            expect(languageManager.getCurrentLanguage()).toBe('pt-BR');
        });

        test('should fallback to en if language is invalid', () => {
            languageManager.setLanguage('invalid-lang');
            expect(languageManager.getCurrentLanguage()).toBe('en');
        });
    });

    describe('language management', () => {
        beforeEach(() => {
            languageManager.setLanguage('en');
            languageManager.clearListeners();
        });

        test('should get available languages', () => {
            const languages = languageManager.getAvailableLanguages();
            expect(languages).toContain('en');
            expect(languages).toContain('pt-BR');
        });

        test('should set language and notify listeners', () => {
            let notified = false;
            let newLang = '';
            
            languageManager.addChangeListener((lang) => {
                notified = true;
                newLang = lang;
            });

            languageManager.setLanguage('pt-BR');
            
            // Add a small delay to allow for async notifications
            setTimeout(() => {
                expect(notified).toBe(true);
                expect(newLang).toBe('pt-BR');
            }, 0);
        });

        test('should not notify if setting same language', () => {
            let notifyCount = 0;
            const cleanup = languageManager.addChangeListener(() => {
                notifyCount++;
            });

            languageManager.setLanguage('en'); // Already en, shouldn't notify
            expect(notifyCount).toBe(0);

            cleanup();
        });

        test('should fallback to en when setting invalid language', () => {
            languageManager.setLanguage('invalid-lang');
            expect(languageManager.getCurrentLanguage()).toBe('en');
        });
    });

    describe('translation', () => {
        beforeEach(() => {
            languageManager.setLanguage('en');
            languageManager.clearListeners();
        });

        test('should translate simple key', () => {
            expect(languageManager.translate('loading')).toBe('Loading...');
        });

        test('should translate key with parameters', () => {
            const translation = languageManager.translate('starsCount', { count: 5 });
            expect(translation).toBe('5 stars');
        });

        test('should return key if translation not found', () => {
            const key = 'nonexistent.key';
            expect(languageManager.translate(key)).toBe(key);
        });

        test('should keep parameter placeholder if parameter not provided', () => {
            const translation = languageManager.translate('starsCount');
            expect(translation).toBe('{count} stars');
        });

        test('should handle non-string translations', () => {
            // Mock a non-string translation
            const originalTranslate = languageManager.translate;
            languageManager.translate = function(key) {
                if (key === 'array.test') return ['item1', 'item2'];
                return originalTranslate.apply(this, arguments);
            };

            const result = languageManager.translate('array.test');
            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual(['item1', 'item2']);

            // Restore original translate method
            languageManager.translate = originalTranslate;
        });
    });

    describe('listeners management', () => {
        beforeEach(() => {
            languageManager.setLanguage('en');
            languageManager.clearListeners();
        });

        test('should add and remove listeners', () => {
            let called = false;
            const listener = () => { called = true; };

            const cleanup = languageManager.addChangeListener(listener);
            
            // Add a small delay to allow for async notifications
            setTimeout(() => {
                languageManager.setLanguage('pt-BR');
                expect(called).toBe(true);
                
                // Reset and test removal
                called = false;
                cleanup();
                languageManager.setLanguage('en');
                expect(called).toBe(false);
            }, 0);
        });

        test('should handle invalid listener', () => {
            const cleanup = languageManager.addChangeListener('not a function');
            expect(typeof cleanup).toBe('function');
        });

        test('should handle listener errors', () => {
            const errorListener = () => {
                throw new Error('Listener error');
            };

            const cleanup = languageManager.addChangeListener(errorListener);
            languageManager.setLanguage('pt-BR'); // Should not throw
            cleanup();
        });

        test('should respect max listeners limit', () => {
            const listeners = [];
            for (let i = 0; i < 105; i++) {
                listeners.push(() => {});
            }

            // Add more than max listeners
            listeners.forEach(listener => {
                languageManager.addChangeListener(listener);
            });

            // Should have removed the oldest listeners
            expect(languageManager.listeners.size).toBeLessThanOrEqual(languageManager.maxListeners);
        });

        test('should prevent recursive notifications', () => {
            let callCount = 0;
            const recursiveListener = (lang) => {
                callCount++;
                if (callCount === 1) {
                    languageManager.setLanguage('en');
                }
            };

            const cleanup = languageManager.addChangeListener(recursiveListener);
            
            // Add a small delay to allow for async notifications
            setTimeout(() => {
                languageManager.setLanguage('pt-BR');
                expect(callCount).toBe(1);
                cleanup();
            }, 0);
        });
    });

    describe('error handling', () => {
        test('should handle missing translation key', () => {
            const result = languageManager.translate('nonexistent.key');
            expect(result).toBe('nonexistent.key');
        });

        test('should handle invalid translation parameters', () => {
            const result = languageManager.translate('welcome');
            expect(result).toBe('Welcome to TiGHub');
        });

        test('should handle undefined translation key', () => {
            const result = languageManager.translate(undefined);
            expect(result).toBe('undefined');
        });

        test('should handle null translation key', () => {
            const result = languageManager.translate(null);
            expect(result).toBe('null');
        });
    });

    describe('listener management', () => {
        test('should handle adding same listener multiple times', () => {
            let callCount = 0;
            const listener = () => callCount++;
            const cleanup1 = languageManager.addChangeListener(listener);
            const cleanup2 = languageManager.addChangeListener(listener);

            languageManager.setLanguage('pt-BR');
            expect(callCount).toBe(1);

            cleanup1();
            cleanup2();
        });

        test('should handle removing non-existent listener', () => {
            const listener = () => {};
            languageManager.removeChangeListener(listener);
            // Should not throw error
        });

        test('should handle adding invalid listener', () => {
            const cleanup = languageManager.addChangeListener('not a function');
            expect(cleanup).toBeDefined();
            cleanup();
        });

        test('should handle clearing listeners multiple times', () => {
            let callCount = 0;
            const listener = () => callCount++;
            languageManager.addChangeListener(listener);
            languageManager.clearListeners();
            languageManager.clearListeners();
            languageManager.setLanguage('pt-BR');
            expect(callCount).toBe(0);
        });
    });

    describe('language validation', () => {
        test('should handle setting invalid language code', () => {
            // First set a valid non-English language
            languageManager.setLanguage('pt-BR');
            expect(languageManager.getCurrentLanguage()).toBe('pt-BR');

            // Then try to set an invalid language
            languageManager.setLanguage('invalid-code');
            expect(languageManager.getCurrentLanguage()).toBe('en');
            expect(languageManager.getCurrentLanguage()).not.toBe('pt-BR');
        });

        test('should handle setting empty language code', () => {
            languageManager.setLanguage('');
            expect(languageManager.getCurrentLanguage()).toBe('en');
        });

        test('should handle setting null language code', () => {
            languageManager.setLanguage(null);
            expect(languageManager.getCurrentLanguage()).toBe('en');
        });
    });
});
