/* ===========================================
   MIRADOR · MAIN
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== LOADER =====
    const loader = document.getElementById('loader');
    const pct = document.getElementById('loaderPct');

    if (loader) {
        let value = 0;
        const interval = setInterval(() => {
            value += Math.random() * 8 + 3;
            if (value >= 100) {
                value = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loader.classList.add('done');
                }, 300);
            }
            if (pct) pct.textContent = String(Math.floor(value)).padStart(2, '0');
        }, 80);
    }

    // ===== MENU OVERLAY =====
    const menuBtn     = document.getElementById('menuBtn');
    const menuClose   = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('menuOverlay');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }
    if (menuClose && menuOverlay) {
        menuClose.addEventListener('click', () => {
            menuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                menuOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== REVEAL ON SCROLL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    document.querySelectorAll('.reveal, .fade-in').forEach(el => observer.observe(el));

    // ===== LANGUAGE SWITCH (visual only) =====
    document.querySelectorAll('.lang-switch button').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.lang-switch button').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
        });
    });

    // ===== FLOORPLAN TABS =====
    document.querySelectorAll('.fp-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.fp-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.target;
            if (target) {
                document.querySelectorAll('.floorplan-svg').forEach(s => s.style.display = 'none');
                const el = document.getElementById(target);
                if (el) el.style.display = 'block';
            }
        });
    });

    // ===== READ ?id= FROM QUERY FOR VILLA PAGE =====
    const params = new URLSearchParams(location.search);
    const villaId = params.get('id');
    if (villaId) {
        const titleEl = document.querySelector('[data-villa-id]');
        if (titleEl) titleEl.textContent = villaId;
        document.querySelectorAll('[data-villa-query]').forEach(a => {
            const href = a.getAttribute('href').split('?')[0];
            a.setAttribute('href', `${href}?id=${villaId}`);
        });
    }
});
