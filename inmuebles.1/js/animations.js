/* ===========================================
   ANIMATIONS & SCROLL EFFECTS
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== INTERSECTION OBSERVER FOR REVEAL =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll(
        '.reveal, .fade-in, .scale-in, .amenity-card, .dest-row, .intro-title, .cta-title, .img-mask'
    );
    elementsToReveal.forEach(el => observer.observe(el));

    // ===== PARALLAX =====
    const parallaxElements = document.querySelectorAll('[data-speed]');

    function handleParallax() {
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.5;
            const rect = el.getBoundingClientRect();
            const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
            const translate = centerOffset * speed * -0.3;
            el.style.transform = `translateY(${translate}px)`;
        });
    }

    window.addEventListener('scroll', handleParallax);
    handleParallax();

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.dataset.count;
                let current = 0;
                const duration = 2000;
                const start = performance.now();

                const step = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    current = Math.floor(target * ease);
                    entry.target.textContent = current;
                    if (progress < 1) requestAnimationFrame(step);
                    else entry.target.textContent = target;
                };
                requestAnimationFrame(step);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ===== CARD TILT EFFECT =====
    const tiltCards = document.querySelectorAll('.amenity-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            const media = card.querySelector('.card-media');
            if (media) {
                media.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const media = card.querySelector('.card-media');
            if (media) {
                media.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }
        });
    });

    // ===== DESTINATION ROW CURSOR FOLLOW =====
    const destRows = document.querySelectorAll('.dest-row');
    destRows.forEach(row => {
        const hover = row.querySelector('.dest-hover');
        if (!hover) return;

        row.addEventListener('mousemove', (e) => {
            const rect = row.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hover.style.left = x + 'px';
            hover.style.top = y + 'px';
        });
    });

    // ===== HERO IMAGE PARALLAX =====
    const heroMedia = document.querySelector('.hero-media img');
    if (heroMedia) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                heroMedia.style.transform = `scale(1) translateY(${scroll * 0.4}px)`;
            }
        });
    }

    // ===== MAGNETIC BUTTONS =====
    const magneticEls = document.querySelectorAll('.btn-primary, .btn-ghost, .btn-cta');
    magneticEls.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

});
