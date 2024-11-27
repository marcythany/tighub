class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.applyTheme();
        
        // Watch for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light', true);
                }
            });
        }
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Dispatch event for components to update
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: this.theme } }));
    }

    setTheme(theme, system = false) {
        this.theme = theme;
        if (!system) {
            localStorage.setItem('theme', theme);
        }
        this.applyTheme();
    }

    toggleTheme() {
        this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    }

    getCurrentTheme() {
        return this.theme;
    }
}

export const themeManager = new ThemeManager();
