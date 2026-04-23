/* ===========================================
   GENPLAN · interactive map
   =========================================== */

const VILLAS = {
    '1':  { beds: 4, baths: 5, area: 362.18, block: 1 },
    '2':  { beds: 5, baths: 5, area: 391.51, block: 1 },
    '3':  { beds: 4, baths: 4, area: 348.72, block: 1 },
    '4':  { beds: 5, baths: 6, area: 410.05, block: 1 },
    '5':  { beds: 5, baths: 5, area: 391.51, block: 1 },
    '6':  { beds: 3, baths: 3, area: 285.40, block: 1 },
    '7':  { beds: 4, baths: 4, area: 342.18, block: 2 },
    '8':  { beds: 4, baths: 5, area: 368.92, block: 2 },
    '9':  { beds: 5, baths: 6, area: 425.30, block: 2 },
    '10': { beds: 4, baths: 4, area: 355.60, block: 2 },
    '11': { beds: 4, baths: 5, area: 372.04, block: 2 },
    '12': { beds: 5, baths: 5, area: 398.15, block: 2 },
    '13': { beds: 4, baths: 4, area: 340.25, block: 3 },
    '14': { beds: 5, baths: 6, area: 431.80, block: 3 },
    '15': { beds: 3, baths: 3, area: 278.50, block: 3 },
    '16': { beds: 4, baths: 4, area: 352.15, block: 3 },
    '17': { beds: 4, baths: 5, area: 375.40, block: 3 },
    '18': { beds: 5, baths: 5, area: 402.60, block: 3 },
    '19': { beds: 4, baths: 4, area: 358.30, block: 4 },
    '20': { beds: 5, baths: 5, area: 395.20, block: 4 },
    '21': { beds: 5, baths: 5, area: 411.40, block: 4 },
    '22': { beds: 4, baths: 5, area: 368.45, block: 4 },
    '23': { beds: 5, baths: 6, area: 428.90, block: 4 }
};

document.addEventListener('DOMContentLoaded', () => {

    const canvas  = document.getElementById('canvas');
    const markers = document.querySelectorAll('.marker');
    const tooltip = document.getElementById('tooltip');
    const ttNum   = document.getElementById('ttNum');
    const ttBeds  = document.getElementById('ttBeds');
    const ttBaths = document.getElementById('ttBaths');
    const ttArea  = document.getElementById('ttArea');
    const ttLink  = document.getElementById('ttLink');
    const outline = document.getElementById('outline');

    if (!canvas) return;

    let activeMarker = null;
    let hideTimer = null;

    function showTooltip(marker) {
        const id = marker.dataset.id;
        const v = VILLAS[id];
        if (!v) return;

        clearTimeout(hideTimer);

        // Update content
        ttNum.textContent = id;
        ttBeds.textContent = `${v.beds} recámaras`;
        ttBaths.textContent = `${v.baths} baños`;
        ttArea.textContent = `${v.area.toFixed(2)} m²`;
        ttLink.href = `pages/villa.html?id=${id}`;

        // Position tooltip near marker (offset so it doesn't cover it)
        const rect = marker.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const x = rect.left - canvasRect.left + rect.width / 2;
        const y = rect.top - canvasRect.top;

        // Offset: to the right + above the marker
        const offsetX = x > canvasRect.width / 2 ? -180 : 180;
        const offsetY = -60;

        tooltip.style.left = (x + offsetX) + 'px';
        tooltip.style.top  = (y + offsetY) + 'px';
        tooltip.classList.add('show');

        // Mark active
        markers.forEach(m => m.classList.remove('active'));
        marker.classList.add('active');
        activeMarker = marker;

        // Draw schematic outline (simple polygon around marker position as %)
        drawOutline(marker);
    }

    function hideTooltip() {
        hideTimer = setTimeout(() => {
            tooltip.classList.remove('show');
            markers.forEach(m => m.classList.remove('active'));
            activeMarker = null;
            clearOutline();
        }, 200);
    }

    function drawOutline(marker) {
        const topPct  = parseFloat(marker.style.top);
        const leftPct = parseFloat(marker.style.left);

        const size = 5;
        const points = [
            `${leftPct - size},${topPct - size * 1.2}`,
            `${leftPct + size * 0.8},${topPct - size * 1.4}`,
            `${leftPct + size * 1.2},${topPct + size * 0.4}`,
            `${leftPct + size * 0.6},${topPct + size * 1.2}`,
            `${leftPct - size * 1.1},${topPct + size * 0.8}`,
            `${leftPct - size * 1.3},${topPct - size * 0.4}`
        ].join(' ');

        outline.innerHTML = `<polygon class="active" points="${points}"/>`;
    }

    function clearOutline() {
        outline.innerHTML = '';
    }

    // Hover on marker
    markers.forEach(marker => {
        marker.addEventListener('mouseenter', () => showTooltip(marker));
        marker.addEventListener('click', (e) => {
            e.preventDefault();
            showTooltip(marker);
        });
    });

    // Tooltip stays when hovered
    tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    tooltip.addEventListener('mouseleave', hideTooltip);

    canvas.addEventListener('mouseleave', hideTooltip);

    // Marker leave (but not to tooltip)
    markers.forEach(marker => {
        marker.addEventListener('mouseleave', (e) => {
            const to = e.relatedTarget;
            if (to && (to === tooltip || tooltip.contains(to))) return;
            hideTooltip();
        });
    });

    // ===== BLOCK FILTER =====
    const blkChips = document.querySelectorAll('.blk-chip');
    blkChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.dataset.filter;
            blkChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            markers.forEach(m => {
                if (filter === 'all' || m.dataset.block === filter) {
                    m.classList.remove('dim');
                } else {
                    m.classList.add('dim');
                }
            });
        });
    });

    // Block labels click to filter
    document.querySelectorAll('.block-label').forEach(bl => {
        bl.addEventListener('click', () => {
            const block = bl.dataset.block;
            const chip = document.querySelector(`.blk-chip[data-filter="${block}"]`);
            if (chip) chip.click();
        });
    });

    // ===== VIEW CHIPS (CSS filters, same image) =====
    const viewChips = document.querySelectorAll('.view-chip');
    const modeMap = { 'Día': 'dia', 'Atardecer': 'sunset', 'Plano': 'plan' };

    viewChips.forEach(v => {
        v.addEventListener('click', () => {
            viewChips.forEach(x => x.classList.remove('active'));
            v.classList.add('active');
            const mode = modeMap[v.textContent.trim()];
            canvas.classList.remove('view-dia', 'view-sunset', 'view-plan');
            canvas.classList.add('view-' + mode);
        });
    });
});
