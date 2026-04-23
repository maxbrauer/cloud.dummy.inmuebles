/* ===========================================
   SHARED HEADER + MENU + FOOTER INJECTION
   =========================================== */

(function () {
    const BASE = '../';

    const header = `
    <header class="topbar" id="topbar">
        <div class="topbar-left">
            <button class="btn-menu" id="menuBtn" aria-label="Abrir menú">
                <span class="menu-icon"><span></span><span></span></span>
                <span class="menu-label">Menú</span>
            </button>
            <a href="${BASE}index.html" class="btn-select">
                <span class="dot"></span>
                Seleccionar villa
            </a>
            <a href="masterplan.html" class="btn-plan">Plan maestro</a>
        </div>

        <a href="${BASE}index.html" class="brand">
            <span class="brand-letter">M</span>
            <span class="brand-text">irador</span>
        </a>

        <div class="topbar-right">
            <a href="tel:+523220000000" class="phone">+52 322 000 0000</a>
            <div class="lang-switch">
                <button class="active">ES</button>
                <button>EN</button>
            </div>
            <a href="agentes.html" class="btn-agent">Portal agentes</a>
        </div>
    </header>

    <div class="menu-overlay" id="menuOverlay">
        <div class="menu-panel">
            <div class="menu-header">
                <span>Menú</span>
                <button class="menu-close" id="menuClose" aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" width="20"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5"/></svg>
                </button>
            </div>
            <nav class="menu-nav">
                <a href="${BASE}index.html"><em>01</em><span>Plan general</span></a>
                <a href="villa.html"><em>02</em><span>Villas</span></a>
                <a href="masterplan.html"><em>03</em><span>Plan maestro</span></a>
                <a href="amenidades.html"><em>04</em><span>Amenidades</span></a>
                <a href="ubicacion.html"><em>05</em><span>Ubicación</span></a>
                <a href="contacto.html"><em>06</em><span>Contacto</span></a>
            </nav>
            <div class="menu-footer">
                <div class="menu-block">
                    <small>Ventas</small>
                    <a href="tel:+523220000000">+52 322 000 0000</a>
                    <a href="mailto:ventas@miradorcostalegre.mx">ventas@miradorcostalegre.mx</a>
                </div>
                <div class="menu-block">
                    <small>Oficinas</small>
                    <p>Carretera 200, Km 120<br>Costalegre, Jalisco</p>
                </div>
                <div class="menu-block">
                    <small>Síguenos</small>
                    <a href="#">Instagram</a>
                    <a href="#">Pinterest</a>
                    <a href="#">LinkedIn</a>
                </div>
            </div>
            <div class="menu-big">Costalegre</div>
        </div>
    </div>`;

    const footer = `
    <footer class="footer">
        <div class="container">
            <div class="footer-top">
                <div class="footer-brand">Mirador<br>Costalegre</div>
                <div class="footer-cols">
                    <div>
                        <h5>Proyecto</h5>
                        <a href="${BASE}index.html">Plan general</a>
                        <a href="villa.html">Villas</a>
                        <a href="amenidades.html">Amenidades</a>
                        <a href="ubicacion.html">Ubicación</a>
                    </div>
                    <div>
                        <h5>Contacto</h5>
                        <a href="tel:+523220000000">+52 322 000 0000</a>
                        <a href="mailto:ventas@miradorcostalegre.mx">ventas@miradorcostalegre.mx</a>
                        <p>Carretera 200, Km 120<br>Costalegre, Jalisco</p>
                    </div>
                    <div>
                        <h5>Legal</h5>
                        <a href="#">Aviso de privacidad</a>
                        <a href="#">Términos</a>
                        <a href="#">Permisos</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <span>© 2026 Mirador Costalegre · Hecho en México</span>
                <span>Diseño &amp; desarrollo propios</span>
            </div>
        </div>
    </footer>`;

    document.addEventListener('DOMContentLoaded', () => {
        const h = document.getElementById('headerMount');
        const f = document.getElementById('footerMount');
        if (h) h.outerHTML = header;
        if (f) f.outerHTML = footer;
    });
})();
