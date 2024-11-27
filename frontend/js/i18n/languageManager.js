import { translations } from './translations.js';

export class LanguageManager {
    constructor() {
        const savedLanguage = localStorage.getItem('language');
        this.currentLanguage = translations[savedLanguage] ? savedLanguage : 'en';
        this.listeners = new Set();
        this.isNotifying = false;
        this.maxListeners = 100; // Limite máximo de listeners
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return Object.keys(translations);
    }

    setLanguage(lang) {
        if (this.isNotifying) return; // Previne chamadas recursivas

        if (!translations[lang]) {
            this.currentLanguage = 'en';
            localStorage.setItem('language', 'en');
            this.notifyListeners();
            return;
        }

        if (lang !== this.currentLanguage) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.notifyListeners();
        }
    }

    translate(key, params = {}) {
        if (key === undefined) return 'undefined';
        if (key === null) return 'null';

        const languageTranslations = translations[this.currentLanguage] || translations['en'];
        const translation = languageTranslations[key];
        
        if (!translation) {
            return key;
        }
        
        // If translation is not a string (e.g., array or object), return it as is
        if (typeof translation !== 'string') {
            return translation;
        }
        
        return translation.replace(/\{(\w+)\}/g, (match, param) => {
            if (params[param] === undefined) {
                return match;
            }
            return params[param];
        });
    }

    addChangeListener(callback) {
        if (typeof callback !== 'function') {
            console.error('Language change listener must be a function');
            return () => {}; // Retorna uma função vazia em caso de erro
        }

        // Verifica se já atingiu o limite máximo de listeners
        if (this.listeners.size >= this.maxListeners) {
            console.warn(`Maximum number of language change listeners (${this.maxListeners}) exceeded. Removing oldest listener.`);
            // Remove o primeiro listener (o mais antigo) usando o iterator
            const firstListener = this.listeners.values().next().value;
            this.listeners.delete(firstListener);
        }

        // Adiciona o novo listener
        this.listeners.add(callback);

        // Retorna uma função de cleanup
        return () => {
            this.removeChangeListener(callback);
        };
    }

    removeChangeListener(callback) {
        if (this.listeners.has(callback)) {
            this.listeners.delete(callback);
        }
    }

    notifyListeners() {
        if (this.isNotifying) return; // Previne loops infinitos
        
        try {
            this.isNotifying = true;
            this.listeners.forEach(callback => {
                try {
                    callback(this.currentLanguage);
                } catch (error) {
                    console.error('Error in language change listener:', error);
                    this.listeners.delete(callback); // Remove listeners com erro
                }
            });
        } finally {
            this.isNotifying = false;
        }
    }

    // Method to clear all listeners (for testing purposes)
    clearListeners() {
        this.listeners.clear();
    }
}

// Export singleton instance
export const languageManager = new LanguageManager();
