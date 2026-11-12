(() => {
    'use strict';

    const storageKey = 'radarwm-theme';
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    let preference = 'system';

    try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved === 'light' || saved === 'dark') {
            preference = saved;
        }
    } catch {
        // Keep the session preference when storage is unavailable.
    }

    function applyTheme() {
        root.dataset.theme = preference === 'system'
            ? (systemTheme.matches ? 'dark' : 'light')
            : preference;
    }

    applyTheme();
    systemTheme.addEventListener('change', applyTheme);

    document.addEventListener('DOMContentLoaded', () => {
        const selector = document.getElementById('appearance');
        selector.value = preference;
        selector.addEventListener('change', () => {
            preference = selector.value;
            applyTheme();
            try {
                window.localStorage.setItem(storageKey, preference);
            } catch {
                // Manual selection still works for the current page session.
            }
        });
    });
})();
