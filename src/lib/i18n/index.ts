import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
import { browser } from '$app/environment';

// Register all locales
register('en', () => import('./locales/en.json'));
register('hi', () => import('./locales/hi.json'));
register('ta', () => import('./locales/ta.json'));
register('te', () => import('./locales/te.json'));
register('bn', () => import('./locales/bn.json'));
register('mr', () => import('./locales/mr.json'));
register('gu', () => import('./locales/gu.json'));

export const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
];

export function initI18n() {
    let initialLocale = 'en';

    if (browser) {
        // Check localStorage first
        const stored = localStorage.getItem('locale');
        if (stored) {
            initialLocale = stored;
        } else {
            // Fall back to browser language
            const browserLocale = getLocaleFromNavigator();
            if (browserLocale) {
                const langCode = browserLocale.split('-')[0];
                const available = availableLanguages.find(l => l.code === langCode);
                if (available) {
                    initialLocale = langCode;
                }
            }
        }
    }

    init({
        fallbackLocale: 'en',
        initialLocale
    });
}

export function setLanguage(lang: string) {
    if (browser) {
        localStorage.setItem('locale', lang);
    }
    locale.set(lang);
}

export { locale, _ } from 'svelte-i18n';
