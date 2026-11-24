/**
 * Calendario Bucerías - Ayudantes puros de formato y disposición de la vista.
 *
 * Sin acceso al DOM: se pueden probar desde Node. Las fechas son UTC, como en
 * js/algorithm.js.
 */

import {
  FAMILIES,
  WEEK_TYPES,
  firstMondayOfMarch,
  startFamily,
} from './algorithm.js';

export const FIRST_SEASON_YEAR = 2022;
export const SEASONS_AHEAD = 6;

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

/** Etiquetas de las semanas festivas, como en las hojas. */
export const HOLIDAY_LABELS = Object.freeze({
  [WEEK_TYPES.SEMANA_SANTA]: 'SEMANA SANTA',
  [WEEK_TYPES.PASCUA]: 'SEMANA PASCUA',
  [WEEK_TYPES.NAVIDAD]: 'NAVIDAD',
  [WEEK_TYPES.ANO_NUEVO]: 'AÑO NUEVO',
});

/**
 * Rango de fechas de una semana en español.
 * Mismo mes: "Marzo 2 - 9". Meses distintos: "Mar 31 – Abr 7".
 */
export function formatRange(start, end) {
  const startMonth = start.getUTCMonth();
  const endMonth = end.getUTCMonth();
  if (startMonth === endMonth) {
    return `${MONTHS[startMonth]} ${start.getUTCDate()} - ${end.getUTCDate()}`;
  }
  return `${MONTHS_SHORT[startMonth]} ${start.getUTCDate()} – ${MONTHS_SHORT[endMonth]} ${end.getUTCDate()}`;
}

/** Etiqueta de temporada: 2026 -> "2026/2027". */
export function seasonLabel(seasonYear) {
  return `${seasonYear}/${seasonYear + 1}`;
}

/** Año de marzo de la temporada que contiene a `today` (fecha UTC). */
export function currentSeasonYear(today) {
  const year = today.getUTCFullYear();
  return today < firstMondayOfMarch(year) ? year - 1 : year;
}

/** Años de temporada del selector: desde 2022/23 hasta SEASONS_AHEAD después de la actual. */
export function seasonYears(today) {
  const last = currentSeasonYear(today) + SEASONS_AHEAD;
  const years = [];
  for (let y = FIRST_SEASON_YEAR; y <= last; y += 1) years.push(y);
  return years;
}

/** Columnas de familias en orden del ciclo, empezando por la familia inicial de la temporada. */
export function columnOrder(seasonYear) {
  const first = FAMILIES.indexOf(startFamily(seasonYear));
  return FAMILIES.map((_, i) => FAMILIES[(first + i) % FAMILIES.length]);
}

/**
 * Reparte las semanas en filas de seis celdas (una por familia). Las semanas se
 * colocan en orden cronológico en la columna de su dueño; cuando la columna no
 * está a la derecha de la anterior, empieza una fila nueva. Así cada fila se lee
 * de izquierda a derecha en orden de tiempo. Las celdas vacías son `null`.
 *
 * @returns {Array<Array<object|null>>}
 */
export function layoutRows(weeks, columns) {
  const rows = [];
  let row = null;
  let lastColumn = Infinity;
  for (const week of weeks) {
    const column = columns.indexOf(week.owner);
    if (row === null || column <= lastColumn) {
      row = new Array(columns.length).fill(null);
      rows.push(row);
    }
    row[column] = week;
    lastColumn = column;
  }
  return rows;
}

/** ¿La temporada tiene semanas de renta? */
export function hasRental(weeks) {
  return weeks.some((w) => w.rented);
}
