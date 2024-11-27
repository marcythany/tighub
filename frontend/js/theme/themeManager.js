class ThemeManager {
    constructor() {
        this.listeners = new Set();
        this.isNotifying = false;
        
        // Check if theme preference exists in localStorage
        const savedTheme = localStorage.getItem('theme');
        
        // Check system preference if no saved theme
        if (!savedTheme) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        } else {
            this.setTheme(savedTheme);
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        if (this.isNotifying) return; // Previne chamadas recursivas

        const oldTheme = this.getCurrentTheme();
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        
        if (oldTheme !== theme) {
            this.notifyListeners(theme);
        }
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        this.setTheme(isDark ? 'light' : 'dark');
        return !isDark;
    }

    getCurrentTheme() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }

    addChangeListener(callback) {
        // Previne a adição do mesmo callback múltiplas vezes
        if (typeof callback === 'function' && !this.listeners.has(callback)) {
            this.listeners.add(callback);
        }
        return () => this.removeChangeListener(callback); // Retorna função de cleanup
    }

    removeChangeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners(theme) {
        if (this.isNotifying) return; // Previne notificações recursivas
        
        this.isNotifying = true;
        try {
            this.listeners.forEach(callback => {
                try {
                    callback(theme);
                } catch (error) {
                    console.error('Error in theme change listener:', error);
                    this.listeners.delete(callback); // Remove listeners com erro
                }
            });
        } finally {
            this.isNotifying = false;
        }
    }

    // Limpa todos os listeners
    clearListeners() {
        this.listeners.clear();
    }
}

export const themeManager = new ThemeManager();
