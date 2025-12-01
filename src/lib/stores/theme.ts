import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
    if (browser) {
        const stored = localStorage.getItem('theme') as Theme;
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
    }
    return 'dark'; // Default to dark theme
};

function createThemeStore() {
    const { subscribe, set } = writable<Theme>(getInitialTheme());

    return {
        subscribe,
        toggle: () => {
            if (browser) {
                const current = localStorage.getItem('theme') as Theme || 'dark';
                const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
                set(newTheme);
                localStorage.setItem('theme', newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        },
        setTheme: (theme: Theme) => {
            set(theme);
            if (browser) {
                localStorage.setItem('theme', theme);
                document.documentElement.setAttribute('data-theme', theme);
            }
        },
        initialize: () => {
            if (browser) {
                const theme = getInitialTheme();
                set(theme);
                document.documentElement.setAttribute('data-theme', theme);
            }
        }
    };
}

export const theme = createThemeStore();
