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

(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const dialog = document.querySelector('.screenshot-dialog');
        if (!dialog || typeof dialog.showModal !== 'function') return;

        const content = dialog.querySelector('.screenshot-dialog-content');
        const title = dialog.querySelector('h2');
        let opener;

        document.querySelectorAll('[data-screenshot]').forEach(link => {
            link.addEventListener('click', event => {
                // Preserve normal link behavior for opening a separate tab.
                if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                opener = link;
                const image = link.querySelector('img').cloneNode();
                image.removeAttribute('loading');
                content.replaceChildren(image);
                title.textContent = link.closest('figure').querySelector('figcaption').textContent;
                dialog.showModal();
            });
        });

        dialog.addEventListener('close', () => {
            content.replaceChildren();
            opener?.focus();
        });
    });
})();
