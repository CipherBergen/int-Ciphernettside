(() => {
    const GA_ID = 'G-TX4GRPD3L6';
    const STORAGE_KEY = 'cipher-cookie-consent';

    const readChoice = () => {
        try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
    };

    const saveChoice = (choice) => {
        try { localStorage.setItem(STORAGE_KEY, choice); } catch {}
    };

    const loadAnalytics = () => {
        window['ga-disable-' + GA_ID] = false;
        if (window.gtag) return;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', GA_ID);
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(script);
    };

    const disableAnalytics = () => {
        window['ga-disable-' + GA_ID] = true;
        const parts = location.hostname.split('.');
        const domains = [''];
        for (let i = 0; i < parts.length - 1; i++) domains.push('; domain=.' + parts.slice(i).join('.'));
        document.cookie.split('; ')
            .map(c => c.split('=')[0])
            .filter(name => name.startsWith('_ga'))
            .forEach(name => domains.forEach(d => { document.cookie = name + '=; Max-Age=0; path=/' + d; }));
    };

    const style = document.createElement('style');
    style.textContent = `
        .cc-banner {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 97;
            width: 360px;
            max-width: calc(100% - 40px);
            padding: 18px 20px;
            background: #212338;
            color: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 14px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            line-height: 1.5;
            animation: cc-in 0.3s ease-out;
        }
        .cc-banner[hidden] { display: none; }
        .cc-banner p { margin: 0 0 14px; font-size: inherit; }
        .cc-banner .cc-title { margin-bottom: 6px; color: #FFFFFF; font-weight: 600; font-size: 1rem; }
        .cc-banner a { color: #F5A28C; text-decoration: underline; text-underline-offset: 2px; }
        .cc-banner a:hover { color: #FFCEBF; }
        .cc-actions { display: flex; gap: 10px; }
        .cc-actions button {
            flex: 1;
            padding: 10px 14px;
            background: transparent;
            color: #FFFFFF;
            border: 1px solid #F5A28C;
            border-radius: 8px;
            font: inherit;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease, color 0.2s ease;
        }
        .cc-actions button:hover { background: #F5A28C; color: #212338; }
        .cc-banner button:focus-visible,
        .cc-banner a:focus-visible,
        .footer-consent:focus-visible { outline: 3px solid #FFCEBF; outline-offset: 2px; }
        .footer-consent {
            padding: 0;
            background: none;
            border: 0;
            color: rgba(255, 255, 255, 0.7);
            font: inherit;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .footer-consent:hover { color: #F5A28C; padding-left: 5px; }
        @keyframes cc-in { from { opacity: 0; transform: translateY(12px); } }
        @media (max-width: 480px) {
            .cc-banner { left: 12px; right: 12px; bottom: 12px; width: auto; max-width: none; padding: 14px 16px; font-size: 0.85rem; }
            .cc-banner p { margin-bottom: 10px; }
            .cc-actions button { padding: 8px 12px; }
        }
        @media (prefers-reduced-motion: reduce) {
            .cc-banner { animation: none; }
        }
    `;
    document.head.appendChild(style);

    const banner = document.createElement('section');
    banner.className = 'cc-banner';
    banner.hidden = true;
    banner.setAttribute('aria-labelledby', 'cc-title');
    banner.innerHTML = `
        <p class="cc-title" id="cc-title">Informasjonskapsler</p>
        <p>Vi vil gjerne bruke informasjonskapsler til statistikk, så vi kan gjøre nettsiden bedre. Du kan når som helst ombestemme deg nederst på siden. <a href="/personvern/#statistikk">Les mer</a></p>
        <div class="cc-actions">
            <button type="button" data-choice="denied">Nei takk</button>
            <button type="button" data-choice="granted">Godta</button>
        </div>
    `;
    document.body.prepend(banner);

    let returnFocusTo = null;

    banner.addEventListener('click', (e) => {
        const choice = e.target.closest('[data-choice]')?.dataset.choice;
        if (!choice) return;
        saveChoice(choice);
        if (choice === 'granted') loadAnalytics(); else disableAnalytics();
        banner.hidden = true;
        returnFocusTo?.focus();
        returnFocusTo = null;
    });

    document.querySelectorAll('[data-consent-settings]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            returnFocusTo = trigger;
            banner.hidden = false;
            banner.querySelector('button').focus();
        });
    });

    const choice = readChoice();
    if (choice === 'granted') loadAnalytics();
    else if (choice !== 'denied') banner.hidden = false;
})();
