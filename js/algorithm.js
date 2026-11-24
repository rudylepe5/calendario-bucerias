/**
 * Calendario Bucerías - Algoritmo de distribución de semanas (departamento 502).
 *
 * Módulo ES puro: sin acceso al DOM, usable desde la página y desde pruebas.
 * Todas las fechas son Date en UTC (medianoche UTC) para evitar problemas de
 * zona horaria y horario de verano.
 */

// ---------------------------------------------------------------------------
// Constantes (única zona de configuración)
// ---------------------------------------------------------------------------

/** Orden del ciclo de familias. */
export const FAMILIES = ['Nilda', 'Pecky', 'Mylene', 'Eva', 'Lourdes', 'Lulú'];

/**
 * Parejas de días festivos, en el orden de rotación (ocasión n -> pareja n mod 3).
 * La primera familia de cada pareja es la de menor posición en el ciclo.
 */
export const HOLIDAY_PAIRS = [
  ['Nilda', 'Pecky'],
  ['Mylene', 'Eva'],
  ['Lourdes', 'Lulú'],
];

/** Temporada ancla: la temporada 2022/23 empieza con Mylene (+1 por temporada). */
export const ANCHOR_SEASON_YEAR = 2022;
export const ANCHOR_START_FAMILY = 'Mylene';

/** Primera semana de renta (lunes 4 de marzo de 2024). Antes de esta fecha nunca hay renta. */
export const FIRST_RENTAL_WEEK = utc(2024, 3, 4);

/** Las semanas de renta deben terminar a más tardar el 31 de marzo. */
export const RENTAL_LAST_MONTH = 3;
export const RENTAL_LAST_DAY = 31;

/** Tipos de semana. */
export const WEEK_TYPES = Object.freeze({
  NORMAL: 'normal',
  SEMANA_SANTA: 'semana-santa',
  PASCUA: 'pascua',
  NAVIDAD: 'navidad',
  ANO_NUEVO: 'ano-nuevo',
});

/** Cuántas apariciones seguidas tiene cada familia de la pareja como "primera semana". */
const APPEARANCES_PER_TURN = 2;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Ayudantes de fechas (UTC)
// ---------------------------------------------------------------------------

/** Crea una fecha UTC; el mes es 1-12. */
function utc(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day));
}

/** Suma días a una fecha UTC y devuelve una fecha nueva. */
export function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/** Lunes de la semana que contiene a `date` (semana de lunes a lunes). */
export function mondayOnOrBefore(date) {
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  return addDays(date, -daysSinceMonday);
}

/** Primer lunes de marzo del año dado. */
export function firstMondayOfMarch(year) {
  const march1 = utc(year, 3, 1);
  const daysUntilMonday = (8 - march1.getUTCDay()) % 7;
  return addDays(march1, daysUntilMonday);
}

/** Módulo que siempre devuelve un valor no negativo. */
function mod(n, m) {
  return ((n % m) + m) % m;
}

// ---------------------------------------------------------------------------
// Pascua (algoritmo gregoriano anónimo / Meeus-Jones-Butcher)
// ---------------------------------------------------------------------------

/** Domingo de Pascua del año dado, como fecha UTC. */
export function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(year, month, day);
}

// ---------------------------------------------------------------------------
// Familia inicial y días festivos
// ---------------------------------------------------------------------------

/** Familia que tiene la primera semana de la temporada que empieza en marzo de `seasonYear`. */
export function startFamily(seasonYear) {
  const anchorIndex = FAMILIES.indexOf(ANCHOR_START_FAMILY);
  return FAMILIES[mod(anchorIndex + (seasonYear - ANCHOR_SEASON_YEAR), FAMILIES.length)];
}

/**
 * Dueños de una ocasión festiva.
 * @param {number} occasion Índice de la ocasión (Pascua 2022 = 0, Navidad 2022 = 1, ...).
 * @returns {{first: string, second: string}} `first` tiene Semana Santa / Navidad;
 *          `second` tiene Pascua / Año Nuevo.
 */
export function holidayOwners(occasion) {
  const [lower, higher] = HOLIDAY_PAIRS[mod(occasion, HOLIDAY_PAIRS.length)];
  const appearance = Math.floor(occasion / HOLIDAY_PAIRS.length);
  const lowerFirst = mod(appearance, 2 * APPEARANCES_PER_TURN) < APPEARANCES_PER_TURN;
  return lowerFirst ? { first: lower, second: higher } : { first: higher, second: lower };
}

/**
 * Las cuatro semanas festivas de una temporada (lunes de inicio, tipo y dueño),
 * en orden cronológico.
 */
export function holidayWeeks(seasonYear) {
  const easterOccasion = 2 * (seasonYear - ANCHOR_SEASON_YEAR);
  const christmasOccasion = easterOccasion + 1;

  const semanaSanta = mondayOnOrBefore(easterSunday(seasonYear));
  const anoNuevo = mondayOnOrBefore(utc(seasonYear, 12, 31));

  const easter = holidayOwners(easterOccasion);
  const christmas = holidayOwners(christmasOccasion);

  return [
    { start: semanaSanta, type: WEEK_TYPES.SEMANA_SANTA, owner: easter.first },
    { start: addDays(semanaSanta, 7), type: WEEK_TYPES.PASCUA, owner: easter.second },
    { start: addDays(anoNuevo, -7), type: WEEK_TYPES.NAVIDAD, owner: christmas.first },
    { start: anoNuevo, type: WEEK_TYPES.ANO_NUEVO, owner: christmas.second },
  ];
}

// ---------------------------------------------------------------------------
// Temporada completa
// ---------------------------------------------------------------------------

/**
 * Calcula todas las semanas de la temporada que empieza el primer lunes de marzo
 * de `seasonYear` (p. ej. 2026 para 2026/27).
 *
 * @param {number} seasonYear
 * @returns {Array<{start: Date, end: Date, owner: string, type: string, rented: boolean}>}
 *   `end` es el lunes siguiente (start + 7 días), como en las hojas ("Marzo 2 - 9").
 */
export function buildSeason(seasonYear) {
  const seasonStart = firstMondayOfMarch(seasonYear);
  const seasonEnd = firstMondayOfMarch(seasonYear + 1);

  const holidays = new Map(holidayWeeks(seasonYear).map((h) => [h.start.getTime(), h]));
  const newYearStart = mondayOnOrBefore(utc(seasonYear, 12, 31));
  // Regla 7: semana normal que empieza después de la semana de Año Nuevo (enero y
  // febrero, hasta el fin de temporada) o que cae en marzo al inicio de la temporada
  // y termina (fecha "fin" de la hoja, el lunes siguiente) a más tardar el 31 de marzo.
  const rentalLimit = utc(seasonYear, RENTAL_LAST_MONTH, RENTAL_LAST_DAY);

  const weeks = [];
  let cycleIndex = FAMILIES.indexOf(startFamily(seasonYear));

  for (let start = seasonStart; start < seasonEnd; start = addDays(start, 7)) {
    const end = addDays(start, 7);
    const holiday = holidays.get(start.getTime());

    if (holiday) {
      weeks.push({ start, end, owner: holiday.owner, type: holiday.type, rented: false });
      continue; // los días festivos no avanzan la rotación
    }

    const rented =
      start >= FIRST_RENTAL_WEEK && (start > newYearStart || end <= rentalLimit);
    weeks.push({ start, end, owner: FAMILIES[cycleIndex], type: WEEK_TYPES.NORMAL, rented });
    cycleIndex = (cycleIndex + 1) % FAMILIES.length;
  }

  return weeks;
}
