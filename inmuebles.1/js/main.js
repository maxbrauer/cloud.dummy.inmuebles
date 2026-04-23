/* ===========================================
   CASA MÉRIDA · MAIN
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== LOADER =====
    const loader = document.getElementById('loader');
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) {
                loader.classList.add('done');
                setTimeout(() => loader.style.display = 'none', 1500);
            }
            document.body.style.overflow = 'auto';
        }, 2200);
    });

    // ===== SCROLL PROGRESS =====
    const progress = document.getElementById('scrollProgress');
    const scrollTop = document.getElementById('scrollTop');
    const navbar = document.getElementById('navbar');

    function onScroll() {
        const scroll = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const pct = (scroll / height) * 100;

        if (progress) progress.style.width = pct + '%';

        if (navbar) {
            if (scroll > 80) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }

        if (scrollTop) {
            if (scroll > 600) scrollTop.classList.add('show');
            else scrollTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (scrollTop) {
        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            menuToggle.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
        });

        mobileMenu.querySelectorAll('nav a').forEach(a => {
            a.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // ===== TESTIMONIALS SLIDER =====
    const testimonials = document.querySelectorAll('.testimonial');
    const counter = document.getElementById('current');
    const prevBtn = document.querySelector('.slider-controls .prev');
    const nextBtn = document.querySelector('.slider-controls .next');
    let current = 0;
    let auto;

    function showTestimonial(i) {
        testimonials.forEach(t => t.classList.remove('active'));
        testimonials[i].classList.add('active');
        if (counter) counter.textContent = String(i + 1).padStart(2, '0');
    }

    function startAuto() {
        clearInterval(auto);
        auto = setInterval(() => {
            current = (current + 1) % testimonials.length;
            showTestimonial(current);
        }, 6000);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            current = (current + 1) % testimonials.length;
            showTestimonial(current);
            startAuto();
        });
        prevBtn.addEventListener('click', () => {
            current = (current - 1 + testimonials.length) % testimonials.length;
            showTestimonial(current);
            startAuto();
        });
        startAuto();
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});
