/* ===========================================
   MIRADOR · DATOS DE LOTES (fuente única)
   -------------------------------------------
   Compartido por el genplan (js/genplan.js) y
   la ficha de villa (pages/villa.html · main.js).
   Mantener UN solo lugar evita que el mapa y la
   ficha muestren datos distintos para el mismo lote.
   =========================================== */

/* Filas del genplan (bloques). */
const BLOCKS = {
    1: {
        name: 'Fila Fondo',
        tag: 'Jardín y áreas comunes',
        ubicTitle: ['Rodeado de', 'jardín'],
        ubicText: 'La Fila Fondo se abre hacia las áreas verdes y el club del conjunto. Villas con orientación poniente, doble patio y la vista del mar enmarcada por la vegetación endémica.'
    },
    2: {
        name: 'Fila Frente',
        tag: 'Primera línea al Pacífico',
        ubicTitle: ['Pies en la', 'arena'],
        ubicText: 'La Fila Frente es la línea más cercana al Pacífico. Villas con orientación poniente, acceso directo a playa privada y vistas despejadas al horizonte.'
    }
};

/* 12 terrenos · Fila Fondo (1-6) y Fila Frente (7-12).
   sup = terreno (m²) · construido (m²) · frente (m lineales). */
const LOTES = {
    '1':  { block: 1, estado: 'Disponible', sup: 412, frente: 14, construido: 286, recamaras: 3, banos: 3, salas: 1, alberca: 1, terraza: 64, estac: 2 },
    '2':  { block: 1, estado: 'Disponible', sup: 388, frente: 14, construido: 272, recamaras: 3, banos: 3, salas: 1, alberca: 1, terraza: 58, estac: 2 },
    '3':  { block: 1, estado: 'Apartado',   sup: 401, frente: 15, construido: 280, recamaras: 3, banos: 3, salas: 1, alberca: 1, terraza: 60, estac: 2 },
    '4':  { block: 1, estado: 'Disponible', sup: 376, frente: 14, construido: 264, recamaras: 3, banos: 3, salas: 1, alberca: 1, terraza: 56, estac: 2 },
    '5':  { block: 1, estado: 'Vendido',    sup: 420, frente: 15, construido: 298, recamaras: 4, banos: 4, salas: 1, alberca: 1, terraza: 72, estac: 2 },
    '6':  { block: 1, estado: 'Disponible', sup: 455, frente: 16, construido: 322, recamaras: 4, banos: 4, salas: 2, alberca: 1, terraza: 86, estac: 3 },
    '7':  { block: 2, estado: 'Disponible', sup: 498, frente: 17, construido: 356, recamaras: 4, banos: 4, salas: 2, alberca: 1, terraza: 98, estac: 3 },
    '8':  { block: 2, estado: 'Apartado',   sup: 472, frente: 16, construido: 338, recamaras: 4, banos: 4, salas: 2, alberca: 1, terraza: 92, estac: 3 },
    '9':  { block: 2, estado: 'Disponible', sup: 463, frente: 16, construido: 330, recamaras: 4, banos: 4, salas: 2, alberca: 1, terraza: 88, estac: 3 },
    '10': { block: 2, estado: 'Disponible', sup: 451, frente: 16, construido: 320, recamaras: 4, banos: 4, salas: 2, alberca: 1, terraza: 84, estac: 3 },
    '11': { block: 2, estado: 'Vendido',    sup: 489, frente: 17, construido: 350, recamaras: 5, banos: 5, salas: 2, alberca: 1, terraza: 104, estac: 3 },
    '12': { block: 2, estado: 'Disponible', sup: 524, frente: 18, construido: 391, recamaras: 5, banos: 5, salas: 2, alberca: 1, terraza: 112, estac: 3 }
};

/* Nombre legible de la fila para un lote. */
function loteLinea(id) {
    const t = LOTES[id];
    return t ? (BLOCKS[t.block] || {}).name || '' : '';
}
