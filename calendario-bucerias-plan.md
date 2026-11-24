# Calendario Bucerías: Plan

## Overview

Build a static web page (HTML, CSS and vanilla JS, no build step) that shows the yearly week distribution of apartment "502" for six families. The page replaces the sheets "DISTRIBUCION DE SEMANAS – DEPARTAMENTO 502". The sheets are the source of truth for the algorithm, but the page calculates weeks instead of copying them.

- **Scope (confirmed):** a season view that looks like the sheets, with one column per family, plus a season picker.
- **Not in scope (not selected):** a "who's next" panel, a family filter, and projected-week badges. These can be added later.
- **Hosting:** GitHub Pages, deployed from the `main` branch of `calendario-bucerias` (remote: `github.com/rudylepe5/calendario-bucerias`). The repo currently only has an empty `README.md`.
- **Language:** labels in Spanish, as on the sheets (confirmed).
- **Approach:** put the algorithm in its own module with no DOM access, test it against the sheets, then build the UI on top of it.

## The algorithm (inferred from the 2022/23 to 2027/28 sheets and confirmed by the user)

1. **Seasons and weeks.** A season runs Monday to Monday, from the first Monday of March to the first Monday of the next March. It has 52 weeks, except 2027/28, which has 53 because of the leap year. Walk real dates instead of assuming a week count.
2. **Family cycle:** Nilda → Pecky → Mylene → Eva → Lourdes → Lulú → Nilda. One family has each normal week.
3. **Start family:** the previous season's start family plus one step in the cycle. Known starters: 2022 Mylene, 2023 Eva, 2024 Lourdes, 2025 Lulú, 2026 Nilda, 2027 Pecky, so 2028 is Mylene.
4. **Holiday weeks** (four per season):
   - Semana Santa is the week containing Easter Sunday, and Semana Pascua is the following week.
   - Año Nuevo is the week containing Dec 31, and Navidad is the week before it.
5. **Holidays don't move the rotation.** A holiday week is inserted outside the cycle. The next normal week goes to whoever was next before it.
6. **Holiday owners.**
   - Number the occasions in time order, starting with Easter 2022 as occasion 0, then Dec 2022 as 1, Easter 2023 as 2, and so on.
   - Occasion `n` goes to pair `n mod 3`: Nilda & Pecky, then Mylene & Eva, then Lourdes & Lulú.
   - Within a pair, the family with the lower cycle position (Nilda, Mylene, Lourdes) has the first week of the occasion (Semana Santa or Navidad) for two appearances, then the other family has it for two. The appearance number is `floor(n / 3)`.
   - Assumption: the pattern repeats every four appearances per pair, which is 12 occasions or 6 years.
7. **Rental weeks (yellow).** A week is rented if it is a normal week that starts on or after Mar 4, 2024 (a setting) and either starts after the Año Nuevo week or ends on or before Mar 31 of the season's end year. Holiday weeks are never rented. The second condition covers the early-March weeks at the start of a season (for example Mar 4, 2024), which the sheets also show as rented. Weeks before Mar 4, 2024 are never rented.

### Expected values from the sheets (spot checks)

| Season | Week starting (Monday) | Expected |
|---|---|---|
| 2022/23 | Mar 7, 2022 | Mylene (first week of the season) |
| 2022/23 | Apr 4 / Apr 11 / Apr 18 / Apr 25, 2022 | Nilda, Santa: Nilda, Pascua: Pecky, Pecky |
| 2022/23 | Dec 19 / Dec 26, 2022 | Navidad: Mylene, Año Nuevo: Eva |
| 2022/23 | Feb 27, 2023 | Pecky (last week) |
| 2023/24 | Mar 6, 2023 | Eva (first week) |
| 2023/24 | Apr 3 / Apr 10, 2023 | Santa: Lourdes, Pascua: Lulú |
| 2023/24 | Dec 18 / Dec 25, 2023 | Navidad: Nilda, Año Nuevo: Pecky |
| 2023/24 | Feb 26, 2024 | Mylene (last week, not rented) |
| 2024/25 | Mar 4, 2024 | Lourdes (first week, rented) |
| 2024/25 | Mar 25 / Apr 1, 2024 | Santa: Mylene, Pascua: Eva (not rented) |
| 2024/25 | Dec 23 / Dec 30, 2024 | Navidad: Lourdes, Año Nuevo: Lulú |
| 2024/25 | Jan 6, 2025 | Mylene (first rental week after Año Nuevo) |
| 2025/26 | Mar 3, 2025 | Lulú (first week, rented) |
| 2025/26 | Apr 14 / Apr 21, 2025 | Santa: Pecky, Pascua: Nilda |
| 2025/26 | Dec 22 / Dec 29, 2025 | Navidad: Eva, Año Nuevo: Mylene |
| 2025/26 | Feb 23, 2026 | Lourdes (rented) |
| 2026/27 | Mar 2, 2026 | Nilda (first week, rented) |
| 2026/27 | Mar 30 / Apr 6, 2026 | Santa: **Lulú**, Pascua: **Lourdes** (the sheet has these swapped, which is a sheet error) |
| 2026/27 | Apr 13 / Apr 20 / Apr 27, 2026 | Lourdes, Lulú, Nilda |
| 2026/27 | Dec 21 / Dec 28, 2026 | Navidad: Pecky, Año Nuevo: Nilda |
| 2027/28 | Mar 1, 2027 | Pecky (first week) |
| 2027/28 | Mar 22 / Mar 29, 2027 | Santa: Eva, Pascua: Mylene |
| 2027/28 | Dec 20 / Dec 27, 2027 | Navidad: Lulú, Año Nuevo: Lourdes |
| 2027/28 | Jan 3 / Jan 10 / Jan 17, 2028 | Lulú (rented), **Nilda**, **Pecky** (the sheet skips Jan 10 and Jan 17, which is a sheet error) |
| 2028/29 | Mar 6, 2028 | Mylene (first week) |
| 2028/29 | Easter 2028 (Apr 10–17) | Santa: Nilda, Pascua: Pecky |

### Known sheet inconsistencies (do not reproduce)

- **Easter 2026** (2026/27 sheet): Lourdes has Semana Santa and Lulú has Pascua. The user says the sheet is wrong and the pattern is the real rule, so the page shows Lulú first.
- **Jan 2028** (2027/28 sheet): Jan 10–17 and Jan 17–24 are missing, so every later row is two weeks late, including the extra Mar 6–13 row for Nilda. The algorithm gives Nilda for Jan 10 and Mylene as the next season's start.
- **Rental highlighting** is inconsistent in the 2026/27 and 2027/28 sheets. Jan 4 and Jan 11, 2027 are not yellow, and neither are the Mar 2026 weeks, although the 2025/26 sheet shows them yellow. The page follows rule 7.
- **Column numbers** (1–6) in the sheet headers are not used. In 2026/27 and 2027/28 the numbering changes each year, and in 2024/25 it doesn't fit the pattern.

## Sub-tasks

### 1. Project scaffold and GitHub Pages setup

- **Intent:** create the static-site skeleton so every later task has a place to go, and so the page can be published.
- **Expected outcomes:** a loadable `index.html` served from the repo root, and a README that explains the project and how to run it locally.
- **Todo list:**
  1. Create `index.html`, a stylesheet, and a `js/` folder for the algorithm and the rendering code.
  2. Use ES modules so the algorithm can be imported both by the page and by tests.
  3. Update `README.md` with the purpose of the page and a short summary of the algorithm.
  4. Document how to publish on GitHub Pages (Settings → Pages → deploy from `main`, root folder).
- **Relevant context:** repo at `/Users/rudylepe/Documents/Personal/calendario-bucerias`, remote `rudylepe5/calendario-bucerias`, branch `main`. Scaffold created with `index.html`, `css/style.css`, and `js/main.js`.
- **Status:** [x] done

### 2. Algorithm module

- **Intent:** compute a full season from nothing but the season's start year, following the rules above.
- **Expected outcomes:** a function that takes a season year and returns a list of weeks. Each week has a start date, an end date, an owner, a type (normal, Semana Santa, Pascua, Navidad or Año Nuevo) and a rental flag. It has no DOM dependencies and works for any year, past or future.
- **Todo list:**
  1. Write date helpers that use UTC dates to avoid timezone and daylight-saving bugs, plus a first-Monday-of-March helper.
  2. Write a function for the date of Easter Sunday (Gregorian algorithm).
  3. Calculate the season start family (start year → family) from the 2022 anchor, Mylene.
  4. Calculate the four holiday weeks and the occasion index `n` for each.
  5. Implement the pair rotation and within-pair order from rule 6.
  6. Walk the season week by week, skipping holiday weeks without advancing the cycle.
  7. Add the rental flag from rule 7, with the first rental week as a named constant.
- **Relevant context:** the algorithm section and the spot-check table in this plan. The family order and pairs should live in one constants area. Scaffold in place: `js/` folder ready for pure ES module implementation (e.g. `js/algorithm.js`) with no DOM dependencies so it can be imported by both UI (`js/main.js`) and automated tests (e.g. `test/algorithm.test.js`).
- **Output (for sub-tasks 3 and 4):** `js/algorithm.js` is a pure ES module with no DOM access. All dates are UTC `Date` objects at midnight UTC. Exports:
  - `buildSeason(seasonYear)` returns `Array<{start: Date, end: Date, owner: string, type: string, rented: boolean}>`. `seasonYear` is the year of the March start (2026 for 2026/27). `start` is a Monday and `end` is the next Monday (`start + 7 days`, so "Marzo 2 - 9" is start Mar 2, end Mar 9). `type` is one of `WEEK_TYPES` (`'normal'`, `'semana-santa'`, `'pascua'`, `'navidad'`, `'ano-nuevo'`).
  - `startFamily(seasonYear)` returns the family name that has the first week.
  - `holidayWeeks(seasonYear)` returns the four holiday weeks as `{start, type, owner}`, in time order.
  - `holidayOwners(occasion)` returns `{first, second}` for occasion index `n` (Easter 2022 = 0, Dec 2022 = 1, ...).
  - `easterSunday(year)`, `firstMondayOfMarch(year)`, `mondayOnOrBefore(date)` and `addDays(date, days)` are the date helpers.
  - Constants: `FAMILIES`, `HOLIDAY_PAIRS`, `ANCHOR_SEASON_YEAR`, `ANCHOR_START_FAMILY`, `FIRST_RENTAL_WEEK` (Mar 4, 2024), `RENTAL_LAST_MONTH`, `RENTAL_LAST_DAY` and `WEEK_TYPES`.
- **Implementation notes:**
  - A season walks real dates from the first Monday of March to the next one, so 2027/28 has 53 weeks.
  - Rule 7 is implemented as a normal week with `start >= FIRST_RENTAL_WEEK` and either `start` after the Año Nuevo week or `end <= Mar 31` of the season year. The second part covers the March weeks at the start of the season. This gives 11–12 rented weeks per season from 2024/25, and none before.
  - Node 18 is installed, but the repo has no `package.json`, so Node treats `js/*.js` as CommonJS and `import` fails. Sub-task 3 needs a `package.json` with `"type": "module"` (or `.mjs` test files that import the module through a copy) so `node --test` can import `js/algorithm.js`. The browser is not affected.
- **Verification done (ad hoc, not committed):** all 45 spot-check values from the table pass, including the corrected Easter 2026 (Lulú first, Lourdes second) and Jan 2028 (Nilda Jan 10, Pecky Jan 17). Seasons 2022 to 2030 each have 4 holiday weeks and no gaps, 2027/28 has 53 weeks, and every other season has 52. The 2028 start family is Mylene. The formal test suite is sub-task 3.
- **Status:** [x] done

### 3. Validation against the sheets

- **Intent:** show that the algorithm reproduces the original sheets, so the page can be trusted.
- **Expected outcomes:** automated checks of every row in the spot-check table, with the sheet errors listed as expected differences. The checks run with a single command (`npm test`).
- **Todo list:**
  1. Turn the spot-check table into test cases (a test file using `node --test` and `node:assert` under ESM).
  2. Add checks that each season has 4 holiday weeks, that the 52 or 53 week counts are correct, and that consecutive weeks have no gaps.
  3. Add checks that the start family of each season is the previous one plus one, and 2028 starts with Mylene.
  4. Ensure all tests run and pass cleanly via `npm test`.
- **Relevant context & test results:**
  - Automated test suite implemented in `test/algorithm.test.js` using Node.js built-in `node:test` and `node:assert/strict`.
  - `package.json` configured with `"type": "module"` and `"scripts": { "test": "node --test" }`.
  - All 33 test cases pass covering:
    - Every row of the spot-check table for seasons 2022/23 through 2028/29 (owners, week types, rental flags).
    - Explicit verification of known sheet inconsistencies (Easter 2026: Lulú in Semana Santa / Lourdes in Pascua; Jan 2028: Jan 10 assigned to Nilda and Jan 17 to Pecky).
    - Structural checks across all seasons 2022–2030: exactly 4 holiday weeks per season, 53 weeks in 2027/28 and 52 in others, zero date gaps between consecutive weeks (exact 7-day duration), start on first Monday of March, continuous cycle rotation for start family and non-advancement during holidays.
- **Exports available for UI (Sub-task 4):**
  - `buildSeason(seasonYear)`: returns `Array<{start: Date, end: Date, owner: string, type: string, rented: boolean}>`.
  - `startFamily(seasonYear)`: returns the starting family name for the given season year.
  - `FAMILIES`: cycle array `['Nilda', 'Pecky', 'Mylene', 'Eva', 'Lourdes', 'Lulú']`.
  - `WEEK_TYPES`: `{ NORMAL: 'normal', SEMANA_SANTA: 'semana-santa', PASCUA: 'pascua', NAVIDAD: 'navidad', ANO_NUEVO: 'ano-nuevo' }`.
  - Date helpers: `firstMondayOfMarch(year)`, `easterSunday(year)`, `addDays(date, days)`, `holidayWeeks(seasonYear)`.
- **Status:** [x] done

### 4. Season view and season picker

- **Intent:** show the selected season the way the sheets do, with one column per family.
- **Expected outcomes:** a page that lists seasons in a picker, with a default of the season that contains today's date. For the chosen season it shows a title like "DISTRIBUCION DE SEMANAS – DEPARTAMENTO 502" and the season label (for example 2026/2027). The grid has six columns in cycle order starting with that season's start family, with each family's weeks as date ranges in Spanish (for example "Marzo 2 - 9"). Holiday weeks are labelled and in bold, rental weeks have a yellow highlight, and a "RENTA ENERO-FEBRERO-MARZO" legend is shown when the season has rental weeks.
- **Todo list:**
  1. Set the picker range from 2022/23 to about 6 seasons past the current one. Show calculated holiday owners for the later seasons without any extra warning (confirmed by the user).
  2. Render the grid from the algorithm output, grouped so the rows read left to right in time order like the sheets.
  3. Format dates in Spanish month names and abbreviations, matching the sheet style.
  4. Mark the rental and holiday cells as described, and make sure the holiday labels read clearly.
  5. Add a small footnote on the 2026/27 season saying the printed sheet differed for Semana Santa (Lulú and Lourdes were printed the other way round).
  6. Make the layout work on a phone screen (scrolling or stacking).
- **Relevant context:** the sheet layouts from the screenshots (columns in cycle order starting with the start family, yellow rental cells, bold holiday labels).
- **Output (for sub-task 5):**
  - Files: `index.html` (select `#season-select` and container `#calendar-container`), `css/style.css`, `js/main.js` (DOM only) and the new `js/format.js` (pure helpers, no DOM: `formatRange`, `seasonLabel`, `currentSeasonYear`, `seasonYears`, `columnOrder`, `layoutRows`, `hasRental`, `HOLIDAY_LABELS`). `js/algorithm.js` is untouched.
  - The picker runs from 2022/23 to the current season + 6 (`SEASONS_AHEAD` in `js/format.js`) and defaults to the season containing today's date, using the local date. A season starts on the first Monday of March.
  - The grid is a real `<table>` with `<th scope="col">` family headers, a visually hidden caption, and a focusable scroll wrapper (`role="region"`). Rental cells carry a visually hidden "(semana de renta)" text. The footnote for 2026/27 is in `SEASON_NOTES` in `js/main.js`.
  - Row layout: weeks go in time order into the owner's column, and a new row starts whenever the next owner's column is not to the right of the previous one. Holiday weeks therefore sit on sparse rows, as in the sheets.
  - Date format: same month "Marzo 2 - 9", cross-month "Mar 31 – Abr 7".
  - All asset paths are relative (`css/style.css`, `js/main.js`, and `./` imports), so the page works under the `/calendario-bucerias/` Pages sub-path.
- **Verification done:** the page was served with `python3 -m http.server`. All five assets returned 200 with correct types, and the module imports resolved. Headless Chrome (`--dump-dom`) showed 11 season options, the 2026/2027 default, six `th` headers in the order Nilda to Lulú, the four holiday labels, the legend and the footnote. Screenshots at desktop width and in a 390px iframe looked right (the table scrolls sideways on phones). A Node check of `format.js` confirmed that 52 or 53 weeks are placed for 2022, 2026, 2027 and 2028. `node --test` passes all 33 tests. No automated tests were added for `format.js`.
- **Status:** [x] done

### 5. Publish and check

- **Intent:** put the page online and confirm it works the same there.
- **Expected outcomes:** the page loads from the GitHub Pages URL with working season selection, and the README links to it.
- **Todo list:**
  1. Push to `main` and enable GitHub Pages.
  2. Check the picker, the grid and the holiday and rental formatting on the published page.
  3. Check relative paths, because Pages serves from a `/calendario-bucerias/` sub-path.
  4. Add the live link to the README.
- **Relevant context:** the Pages sub-path, and the README from sub-task 1. The site entry points are `index.html`, `css/style.css`, `js/main.js`, `js/format.js` and `js/algorithm.js`, all with relative paths. `package.json`, `test/` and the plan file don't need to be served, but they are harmless on Pages. Nothing is committed yet: git shows `README.md` modified and `calendario-bucerias-plan.md`, `css/`, `index.html`, `js/`, `package.json` and `test/` untracked, so the first push needs a commit of all of them. Pages is case-sensitive, and the files already use lowercase names. Because the default season depends on today's date, check the published page again after March, when the season changes.
- **Status:** [ ] pending

## Decisions

1. The picker runs from 2022/23 to about 6 seasons past the current one, with no extra warning on later seasons.
2. The 2026/27 season gets a small footnote about the Semana Santa difference from the printed sheet.
3. Labels are in Spanish, as on the sheets.
