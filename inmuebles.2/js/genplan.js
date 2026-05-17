/* ===========================================
   GENPLAN · interactive lot map
   -------------------------------------------
   The aerial photo shows a real subdivision of
   12 lots laid out as a 6-column × 2-row grid.
   Every point is positioned in % of #stage
   (the photo box) via a perspective bilinear
   map of the parcel block, so the markers stay
   locked to the actual lots on any screen.
   =========================================== */

/* 12 terrenos · row 1 (fondo / back) = 1-6,  row 2 (frente / near) = 7-12 */
const LOTES = {
    '1':  { sup: 412, frente: 14, estado: 'Disponible', block: 1 },
    '2':  { sup: 388, frente: 14, estado: 'Disponible', block: 1 },
    '3':  { sup: 401, frente: 15, estado: 'Apartado',   block: 1 },
    '4':  { sup: 376, frente: 14, estado: 'Disponible', block: 1 },
    '5':  { sup: 420, frente: 15, estado: 'Vendido',    block: 1 },
    '6':  { sup: 455, frente: 16, estado: 'Disponible', block: 1 },
    '7':  { sup: 498, frente: 17, estado: 'Disponible', block: 2 },
    '8':  { sup: 472, frente: 16, estado: 'Apartado',   block: 2 },
    '9':  { sup: 463, frente: 16, estado: 'Disponible', block: 2 },
    '10': { sup: 451, frente: 16, estado: 'Disponible', block: 2 },
    '11': { sup: 489, frente: 17, estado: 'Vendido',    block: 2 },
    '12': { sup: 524, frente: 18, estado: 'Disponible', block: 2 }
};

/* ===========================================
   PARCEL GRID over the aerial photo
   -------------------------------------------
   STAGE_QUAD = the 4 corners of the developed
   parcel block as seen in the photo, in %
   [left, top] of the image (calibrated against
   genplan-aerial.png). u = left↔right,
   v = back(fondo)↔front(frente).

   Lock final positions exactly: open
   index.html?edit=1 , drag the 12 points onto
   each lot, press “Copiar coords”, and paste
   the printed object into MARKER_POS below.
   =========================================== */
const STAGE_QUAD = {
    bl: [35.0, 47.5],   // back-left
    br: [72.5, 48.5],   // back-right
    fr: [83.0, 73.0],   // front-right
    fl: [31.5, 68.5]    // front-left
};

const COLS = 6;
const ROW_V = { 1: 0.34, 2: 0.74 };   // perspective-biased row depth

// Lot -> [col(0..5), row(1|2)]
const LOT_CELL = {
    '1':  [0, 1], '2':  [1, 1], '3':  [2, 1], '4':  [3, 1], '5':  [4, 1], '6':  [5, 1],
    '7':  [0, 2], '8':  [1, 2], '9':  [2, 2], '10': [3, 2], '11': [4, 2], '12': [5, 2]
};

// Block (row) label anchors: [u, v]
const BLOCK_UV = {
    '1': [-0.07, 0.30],   // fondo  (left gutter, clear of markers)
    '2': [-0.07, 0.80]    // frente
};

// Final locked positions in image % — calibrated against genplan-aerial.png
// (keys: lot ids + "B1","B2"). Set to null to fall back to the quad grid.
const MARKER_POS = {"1":[55.79,42.77],"2":[69.35,46.33],"3":[82.01,48.77],"4":[49.95,48.71],"5":[65.35,52.18],"6":[79.94,55.11],"7":[44.64,54.69],"8":[60.99,57.45],"9":[78.17,62.02],"10":[39.63,62.11],"11":[54.74,65.71],"12":[75.54,72.39],"B1":[31.03,53.66],"B2":[28.79,64.03]};

// Per-lot custom shapes — { id: [[x,y],[x,y],[x,y],[x,y]] } in image %.
// Calibrated by hand against genplan-aerial.png (modo “Lotes”).
// Set to null to fall back to the auto cell shape.
const LOT_SHAPES = {"1":[[50.69,40.94],[64.54,42.92],[59.76,48.38],[44.76,45.92]],"2":[[65.38,43.21],[76.85,44.87],[73.45,50.83],[61.13,48.22]],"3":[[88.15,47.01],[77.12,45.65],[74.03,51.52],[89.37,53.85]],"4":[[59.7,48.61],[44.09,46.1],[41.43,49.77],[56.49,52.91]],"5":[[60.17,49.33],[73.06,51.88],[70.19,55.77],[57.16,53.01]],"6":[[74.5,51.4],[89.17,54.15],[90.81,60.66],[71.75,56.05]],"7":[[41.16,50.62],[55.8,53.5],[51.42,59.16],[37.01,56]],"8":[[56.67,53.35],[69.65,56.56],[65.55,62.64],[52.61,59.4]],"9":[[90.56,61.2],[71.04,56.78],[67.91,63.18],[91.32,68.86]],"10":[[61.12,56.46],[36.74,57.69],[32.14,63.09],[55.04,67.92]],"11":[[51.04,60.8],[65.08,63.78],[60,71.78],[45.96,67.61]],"12":[[66.71,64.44],[90.97,70.27],[89.86,79.96],[61.89,72.03]]};

function quadPoint(u, v) {
    const L = (a, b, t) => a + (b - a) * t;
    const topX = L(STAGE_QUAD.bl[0], STAGE_QUAD.br[0], u);
    const topY = L(STAGE_QUAD.bl[1], STAGE_QUAD.br[1], u);
    const botX = L(STAGE_QUAD.fl[0], STAGE_QUAD.fr[0], u);
    const botY = L(STAGE_QUAD.fl[1], STAGE_QUAD.fr[1], u);
    return [L(topX, botX, v), L(topY, botY, v)];
}

function lotPoint(id) {
    const cell = LOT_CELL[id];
    if (!cell) return [50, 50];
    const u = (cell[0] + 0.5) / COLS;
    const v = ROW_V[cell[1]];
    return quadPoint(u, v);
}

function applyLayout(markers, labels) {
    markers.forEach(m => {
        const id = m.dataset.id;
        const pos = (MARKER_POS && MARKER_POS[id]) || lotPoint(id);
        m.style.left = pos[0].toFixed(2) + '%';
        m.style.top  = pos[1].toFixed(2) + '%';
    });
    labels.forEach(l => {
        const b = l.dataset.block;
        const pos = (MARKER_POS && MARKER_POS['B' + b]) || quadPoint(...(BLOCK_UV[b] || [0.5, 0.5]));
        l.style.left = pos[0].toFixed(2) + '%';
        l.style.top  = pos[1].toFixed(2) + '%';
    });
}

function resolvePos(id) {
    return (MARKER_POS && MARKER_POS[id]) || lotPoint(id);
}

/* ===========================================
   LOT POLYGONS
   -------------------------------------------
   Each lot is the cell around its (calibrated)
   center. Corner nodes = average of the 4
   surrounding lot centers, with edge cells
   extrapolated, so the outline traces the real
   parcel shape in perspective instead of a
   generic blob.
   =========================================== */
const ROWS = 2;                 // r index 0 = fondo, 1 = frente
const LOT_INSET = 0.14;         // shrink toward centroid so it sits inside the lot

function buildLotPolys() {
    // C[r][c] = [x%, y%]
    const C = [];
    for (let r = 0; r < ROWS; r++) C[r] = [];
    Object.keys(LOT_CELL).forEach(id => {
        const [c, rowKey] = LOT_CELL[id];
        C[rowKey - 1][c] = resolvePos(id);
    });

    const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];

    // extrapolated cell center for any (possibly out-of-range) r,c
    function EC(r, c) {
        if (r < 0)        return add(EC(0, c),        sub(EC(0, c),        EC(1, c)));
        if (r > ROWS - 1) return add(EC(ROWS - 1, c), sub(EC(ROWS - 1, c), EC(ROWS - 2, c)));
        if (c < 0)        return add(EC(r, 0),        sub(EC(r, 0),        EC(r, 1)));
        if (c > COLS - 1) return add(EC(r, COLS - 1), sub(EC(r, COLS - 1), EC(r, COLS - 2)));
        return C[r][c];
    }
    // grid node between cells = mean of the 4 surrounding centers
    function node(i, j) {
        const p = [EC(i - 1, j - 1), EC(i - 1, j), EC(i, j - 1), EC(i, j)];
        return [
            (p[0][0] + p[1][0] + p[2][0] + p[3][0]) / 4,
            (p[0][1] + p[1][1] + p[2][1] + p[3][1]) / 4
        ];
    }

    // polys[id] = [[x,y],[x,y],[x,y],[x,y]]  (numeric, mutable)
    const polys = {};
    Object.keys(LOT_CELL).forEach(id => {
        if (LOT_SHAPES && LOT_SHAPES[id]) {                 // hand-shaped: use as-is
            polys[id] = LOT_SHAPES[id].map(p => [p[0], p[1]]);
            return;
        }
        const [c, rowKey] = LOT_CELL[id];
        const r = rowKey - 1;
        const corners = [node(r, c), node(r, c + 1), node(r + 1, c + 1), node(r + 1, c)];
        const cx = (corners[0][0] + corners[1][0] + corners[2][0] + corners[3][0]) / 4;
        const cy = (corners[0][1] + corners[1][1] + corners[2][1] + corners[3][1]) / 4;
        polys[id] = corners.map(([x, y]) => [
            x + (cx - x) * LOT_INSET,
            y + (cy - y) * LOT_INSET
        ]);
    });
    return polys;
}

// "x,y x,y ..." for an SVG polygon
function polyStr(corners) {
    return corners.map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
}

document.addEventListener('DOMContentLoaded', () => {

    const canvas  = document.getElementById('canvas');
    const stage   = document.getElementById('stage');
    const markers = document.querySelectorAll('.marker');
    const labels  = document.querySelectorAll('.block-label');
    const tooltip = document.getElementById('tooltip');
    const ttNum   = document.getElementById('ttNum');
    const ttSup   = document.getElementById('ttSup');
    const ttFrente= document.getElementById('ttFrente');
    const ttEstado= document.getElementById('ttEstado');
    const ttLink  = document.getElementById('ttLink');
    const outline = document.getElementById('outline');

    if (!canvas) return;

    applyLayout(markers, labels);
    const LOT_POLY = buildLotPolys();

    let hideTimer = null;

    function showTooltip(marker) {
        const id = marker.dataset.id;
        const t = LOTES[id];
        if (!t) return;

        clearTimeout(hideTimer);

        ttNum.textContent = id;
        ttSup.textContent = `${t.sup} m²`;
        ttFrente.textContent = `${t.frente} m de frente`;
        ttEstado.textContent = t.estado;
        ttEstado.className = 'tt-estado est-' + t.estado.toLowerCase();
        ttLink.href = `pages/villa.html?id=${id}`;

        const rect = marker.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const x = rect.left - canvasRect.left + rect.width / 2;
        const y = rect.top - canvasRect.top;

        const offsetX = x > canvasRect.width / 2 ? -180 : 180;
        const offsetY = -60;

        tooltip.style.left = (x + offsetX) + 'px';
        tooltip.style.top  = (y + offsetY) + 'px';
        tooltip.classList.add('show');

        markers.forEach(m => m.classList.remove('active'));
        marker.classList.add('active');

        drawOutline(marker);
    }

    function hideTooltip() {
        hideTimer = setTimeout(() => {
            tooltip.classList.remove('show');
            markers.forEach(m => m.classList.remove('active'));
            clearOutline();
        }, 200);
    }

    function drawOutline(marker) {
        const pts = LOT_POLY[marker.dataset.id];
        if (!pts) return;
        outline.innerHTML = `<polygon class="active" points="${polyStr(pts)}"/>`;
    }

    function clearOutline() {
        outline.innerHTML = '';
    }

    markers.forEach(marker => {
        marker.addEventListener('mouseenter', () => showTooltip(marker));
        marker.addEventListener('click', (e) => {
            e.preventDefault();
            showTooltip(marker);
        });
    });

    tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    tooltip.addEventListener('mouseleave', hideTooltip);
    canvas.addEventListener('mouseleave', hideTooltip);

    markers.forEach(marker => {
        marker.addEventListener('mouseleave', (e) => {
            const to = e.relatedTarget;
            if (to && (to === tooltip || tooltip.contains(to))) return;
            hideTooltip();
        });
    });

    // ===== BLOCK / ROW FILTER =====
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

    // ===========================================
    //  CALIBRATION MODE  ·  index.html?edit=1
    // ===========================================
    if (new URLSearchParams(location.search).has('edit')) {
        initCalibration(stage, markers, labels, outline, LOT_POLY);
    }
});

function initCalibration(stage, markers, labels, outline, LOT_POLY) {
    document.body.classList.add('calib');
    const all = [...markers, ...labels];
    let mode = 'points';          // 'points' = mover · 'lotes' = deformar lote
    let dragEl = null;
    let activeLot = null;
    let readout;

    function pctFromEvent(e) {
        const r = stage.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        return [Math.max(-5, Math.min(105, x)), Math.max(-5, Math.min(105, y))];
    }

    // ----- marker / label dragging (only in 'points' mode) -----
    all.forEach(el => {
        el.addEventListener('pointerdown', (e) => {
            if (mode !== 'points') return;
            e.preventDefault();
            dragEl = el;
            el.setPointerCapture(e.pointerId);
            el.classList.add('dragging');
        });
        el.addEventListener('pointermove', (e) => {
            if (dragEl !== el) return;
            const [x, y] = pctFromEvent(e);
            el.style.left = x.toFixed(2) + '%';
            el.style.top  = y.toFixed(2) + '%';
            if (readout) readout.textContent =
                (el.dataset.id ? 'Terreno ' + el.dataset.id : 'Fila ' + el.dataset.block) +
                ` · ${x.toFixed(1)}% , ${y.toFixed(1)}%`;
        });
        el.addEventListener('pointerup', () => { dragEl = null; el.classList.remove('dragging'); });
        el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, true);
    });

    // ----- 4 corner handles for reshaping the active lot -----
    const handles = [0, 1, 2, 3].map(i => {
        const h = document.createElement('div');
        h.className = 'calib-handle';
        h.dataset.k = i;
        stage.appendChild(h);
        let on = false;
        h.addEventListener('pointerdown', (e) => {
            e.preventDefault(); e.stopPropagation();
            on = true; h.setPointerCapture(e.pointerId); h.classList.add('dragging');
        });
        h.addEventListener('pointermove', (e) => {
            if (!on || !activeLot) return;
            const [x, y] = pctFromEvent(e);
            LOT_POLY[activeLot][i] = [x, y];
            redrawLot();
            placeHandles();
            if (readout) readout.textContent =
                `Lote ${activeLot} · esquina ${i + 1} · ${x.toFixed(1)}% , ${y.toFixed(1)}%`;
        });
        h.addEventListener('pointerup', () => { on = false; h.classList.remove('dragging'); });
        return h;
    });

    function redrawLot() {
        if (!activeLot) return;
        outline.innerHTML = `<polygon class="active" points="${polyStr(LOT_POLY[activeLot])}"/>`;
    }
    function placeHandles() {
        const show = mode === 'lotes' && activeLot;
        handles.forEach((h, i) => {
            h.style.display = show ? 'block' : 'none';
            if (!show) return;
            const p = LOT_POLY[activeLot][i];
            h.style.left = p[0] + '%';
            h.style.top  = p[1] + '%';
        });
    }
    function selectLot(id) {
        activeLot = id;
        redrawLot();
        placeHandles();
        if (readout) readout.textContent = `Lote ${id} — arrastra sus 4 esquinas`;
    }

    // hovering a marker in 'lotes' mode picks that lot to reshape
    markers.forEach(m => {
        m.addEventListener('mouseenter', () => { if (mode === 'lotes') selectLot(m.dataset.id); });
        m.addEventListener('click', (e) => {
            if (mode === 'lotes') { e.preventDefault(); e.stopPropagation(); selectLot(m.dataset.id); }
        });
    });

    function dumpPoints() {
        const out = {};
        markers.forEach(m => { out[m.dataset.id] = [
            +parseFloat(m.style.left).toFixed(2), +parseFloat(m.style.top).toFixed(2)]; });
        labels.forEach(l => { out['B' + l.dataset.block] = [
            +parseFloat(l.style.left).toFixed(2), +parseFloat(l.style.top).toFixed(2)]; });
        return ['MARKER_POS', out];
    }
    function dumpShapes() {
        const out = {};
        markers.forEach(m => {
            const id = m.dataset.id;
            out[id] = LOT_POLY[id].map(p => [+p[0].toFixed(2), +p[1].toFixed(2)]);
        });
        return ['LOT_SHAPES', out];
    }

    const bar = document.createElement('div');
    bar.className = 'calib-bar';
    bar.innerHTML = `
        <code>calibración</code>
        <button id="calibMode" class="ghost">Modo: Puntos</button>
        <span id="calibReadout">arrastra los 12 puntos sobre los lotes</span>
        <button id="calibCopy">Copiar coords</button>
        <button id="calibLog" class="ghost">Consola</button>`;
    document.body.appendChild(bar);
    readout = bar.querySelector('#calibReadout');

    bar.querySelector('#calibMode').addEventListener('click', (e) => {
        mode = mode === 'points' ? 'lotes' : 'points';
        e.target.textContent = 'Modo: ' + (mode === 'points' ? 'Puntos' : 'Lotes');
        document.body.classList.toggle('calib-lotes', mode === 'lotes');
        if (mode === 'lotes') {
            selectLot(activeLot || markers[0].dataset.id);
        } else {
            outline.innerHTML = '';
            placeHandles();
            readout.textContent = 'arrastra los 12 puntos / etiquetas';
        }
    });

    function currentDump() {
        return mode === 'lotes' ? dumpShapes() : dumpPoints();
    }
    bar.querySelector('#calibCopy').addEventListener('click', async () => {
        const [name, obj] = currentDump();
        const txt = `const ${name} = ${JSON.stringify(obj)};`;
        try {
            await navigator.clipboard.writeText(txt);
            readout.textContent = `✓ Copiado — pégalo en ${name} (genplan.js)`;
        } catch {
            console.log(txt);
            readout.textContent = 'Copia falló — revisa la consola';
        }
    });
    bar.querySelector('#calibLog').addEventListener('click', () => {
        const [name, obj] = currentDump();
        console.log(`const ${name} = ${JSON.stringify(obj, null, 2)};`);
        readout.textContent = `Volcado de ${name} en consola`;
    });
}
