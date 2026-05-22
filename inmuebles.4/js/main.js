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

    const openMenu = () => {
        menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (menuClose) menuClose.focus();          // move focus into the panel
    };
    const closeMenu = () => {
        menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
        if (menuBtn) menuBtn.focus();              // return focus to the trigger
    };

    if (menuBtn && menuOverlay) menuBtn.addEventListener('click', openMenu);
    if (menuClose && menuOverlay) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOverlay.classList.contains('open')) closeMenu();
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
    const langBtns = document.querySelectorAll('.lang-switch button');
    langBtns.forEach(b => b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false'));
    langBtns.forEach(b => {
        b.addEventListener('click', () => {
            langBtns.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
            b.classList.add('active');
            b.setAttribute('aria-pressed', 'true');
        });
    });

    // ===== DATE INPUTS · no permitir fechas pasadas =====
    const todayISO = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(d => { if (!d.min) d.min = todayISO; });

    // ===== FLOORPLAN TABS =====
    const fpTabs = document.querySelectorAll('.fp-tab');
    fpTabs.forEach(t => t.setAttribute('aria-pressed', t.classList.contains('active') ? 'true' : 'false'));
    fpTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            fpTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');
            const target = tab.dataset.target;
            if (target) {
                document.querySelectorAll('.floorplan-svg').forEach(s => s.style.display = 'none');
                const el = document.getElementById(target);
                if (el) el.style.display = 'block';
            }
        });
    });

    // ===== VILLA DETAIL · poblar la ficha desde el lote (?id=) =====
    // Datos en js/data.js (LOTES global) — misma fuente que el genplan,
    // así el mapa y la ficha nunca muestran cifras distintas.
    const villaRoot = document.querySelector('[data-villa]');
    if (villaRoot && typeof LOTES !== 'undefined') {
        const ids = Object.keys(LOTES);
        const qid = new URLSearchParams(location.search).get('id');
        const id = LOTES[qid] ? qid : ids[0];        // sin id válido → primer lote
        const t = LOTES[id];
        const pad2 = n => String(n).padStart(2, '0');
        const linea = (typeof loteLinea === 'function') ? loteLinea(id) : '';

        const fields = {
            num: id,
            linea: linea,
            lineaLote: `${linea} · Lote ${pad2(id)}`,
            construido: t.construido,
            terreno: t.sup,
            frente: t.frente,
            recamaras: t.recamaras,
            banos: t.banos,
            salas: t.salas,
            alberca: t.alberca,
            terraza: t.terraza,
            estac: t.estac,
            estado: t.estado,
            playaMin: t.block === 2 ? '0 min · caminando' : '3 min · caminando'
        };
        document.querySelectorAll('[data-field]').forEach(el => {
            const v = fields[el.dataset.field];
            if (v !== undefined) el.textContent = v;
        });

        // Píldora de estado (Disponible / Apartado / Vendido) con su color.
        document.querySelectorAll('[data-estado-pill]').forEach(el => {
            el.textContent = t.estado;
            el.className = (el.className.replace(/\best-\w+\b/g, '').trim() + ' est-' + t.estado.toLowerCase()).trim();
        });

        document.title = `Villa ${pad2(id)} — Mirador Costalegre`;

        // Copy de ubicación según la fila.
        const blk = (typeof BLOCKS !== 'undefined') ? BLOCKS[t.block] : null;
        if (blk) {
            const ut = document.querySelector('[data-ubic-title]');
            if (ut) ut.innerHTML = `${blk.ubicTitle[0]} <em>${blk.ubicTitle[1]}</em>`;
            const up = document.querySelector('[data-ubic-text]');
            if (up) up.textContent = blk.ubicText;
        }

        // Prev / next circular dentro de 1..N.
        const i = ids.indexOf(id);
        const setNav = (sel, navId) => {
            const a = document.querySelector(sel);
            if (!a) return;
            a.href = `villa.html?id=${navId}`;
            const s = a.querySelector('strong');
            if (s) s.textContent = `Villa ${pad2(navId)}`;
        };
        setNav('.villa-nav a.prev', ids[(i - 1 + ids.length) % ids.length]);
        setNav('.villa-nav a.next', ids[(i + 1) % ids.length]);
    }
});
