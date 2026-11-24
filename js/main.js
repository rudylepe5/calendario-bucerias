/**
 * Calendario Bucerías - Módulo principal (DOM).
 * ES Modules sin paso de compilación. El cálculo vive en algorithm.js y los
 * ayudantes puros de formato en format.js.
 */

import { buildSeason, WEEK_TYPES } from './algorithm.js';
import {
  HOLIDAY_LABELS,
  columnOrder,
  currentSeasonYear,
  formatRange,
  hasRental,
  layoutRows,
  seasonLabel,
  seasonYears,
} from './format.js';

/** Temporadas con nota sobre diferencias respecto a la hoja impresa. */
const SEASON_NOTES = {
  2026:
    'Nota: en la hoja impresa de 2026/2027, Semana Santa y Semana Pascua aparecen con Lourdes y Lulú ' +
    'al revés. Esta página sigue la regla de rotación: Semana Santa es de Lulú y Semana Pascua es de Lourdes.',
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderCell(week, family) {
  const td = el('td');
  if (!week) {
    td.className = 'empty';
    return td;
  }
  td.dataset.family = family;
  const range = el('span', 'range', formatRange(week.start, week.end));
  td.append(range);

  if (week.type !== WEEK_TYPES.NORMAL) {
    td.classList.add('holiday');
    td.append(el('span', 'holiday-label', HOLIDAY_LABELS[week.type]));
  }
  if (week.rented) {
    td.classList.add('rented');
    const hidden = el('span', 'visually-hidden', ' (semana de renta)');
    td.append(hidden);
  }
  return td;
}

function renderSeason(seasonYear, container) {
  const weeks = buildSeason(seasonYear);
  const columns = columnOrder(seasonYear);
  const rows = layoutRows(weeks, columns);
  const label = seasonLabel(seasonYear);

  container.replaceChildren();

  const title = el('h2', 'season-title', `Temporada ${label}`);
  title.id = 'season-title';
  container.append(title);

  if (hasRental(weeks)) {
    const legend = el('p', 'legend');
    legend.append(el('span', 'legend-swatch'), document.createTextNode(' RENTA ENERO-FEBRERO-MARZO'));
    container.append(legend);
  }

  const wrapper = el('div', 'table-wrapper');
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-labelledby', 'season-title');

  const table = el('table', 'season-table');
  table.append(el('caption', 'visually-hidden', `Distribución de semanas, temporada ${label}`));

  const thead = el('thead');
  const headRow = el('tr');
  for (const family of columns) {
    const th = el('th', undefined, family);
    th.scope = 'col';
    headRow.append(th);
  }
  thead.append(headRow);

  const tbody = el('tbody');
  for (const cells of rows) {
    const tr = el('tr');
    cells.forEach((week, i) => tr.append(renderCell(week, columns[i])));
    tbody.append(tr);
  }

  table.append(thead, tbody);
  wrapper.append(table);
  container.append(wrapper);

  if (SEASON_NOTES[seasonYear]) {
    container.append(el('p', 'footnote', SEASON_NOTES[seasonYear]));
  }
}

function init() {
  const select = document.getElementById('season-select');
  const container = document.getElementById('calendar-container');
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const current = currentSeasonYear(todayUtc);

  select.replaceChildren();
  for (const year of seasonYears(todayUtc)) {
    const option = el('option', undefined, seasonLabel(year));
    option.value = String(year);
    select.append(option);
  }
  select.value = String(current);
  select.disabled = false;

  const show = () => renderSeason(Number(select.value), container);
  select.addEventListener('change', show);
  show();
}

init();
