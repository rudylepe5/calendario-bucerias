import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSeason,
  startFamily,
  holidayWeeks,
  holidayOwners,
  firstMondayOfMarch,
  FAMILIES,
  WEEK_TYPES,
} from '../js/algorithm.js';

function toISO(date) {
  return date.toISOString().slice(0, 10);
}

function findWeek(weeks, isoStartDate) {
  return weeks.find((w) => toISO(w.start) === isoStartDate);
}

describe('Calendario Bucerías - Algoritmo (departamento 502)', () => {
  describe('Pruebas puntuales (spot-checks de las hojas)', () => {
    describe('Temporada 2022/23', () => {
      const weeks = buildSeason(2022);

      it('7 mar 2022: Mylene (primera semana, normal, no rentada)', () => {
        const w = findWeek(weeks, '2022-03-07');
        assert.ok(w, 'Debe existir la semana del 2022-03-07');
        assert.equal(w.owner, 'Mylene');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, false);
      });

      it('4, 11, 18 y 25 abr 2022: Nilda, Santa (Nilda), Pascua (Pecky), Pecky', () => {
        const apr04 = findWeek(weeks, '2022-04-04');
        const apr11 = findWeek(weeks, '2022-04-11');
        const apr18 = findWeek(weeks, '2022-04-18');
        const apr25 = findWeek(weeks, '2022-04-25');

        assert.equal(apr04.owner, 'Nilda');
        assert.equal(apr04.type, WEEK_TYPES.NORMAL);
        assert.equal(apr04.rented, false);

        assert.equal(apr11.owner, 'Nilda');
        assert.equal(apr11.type, WEEK_TYPES.SEMANA_SANTA);
        assert.equal(apr11.rented, false);

        assert.equal(apr18.owner, 'Pecky');
        assert.equal(apr18.type, WEEK_TYPES.PASCUA);
        assert.equal(apr18.rented, false);

        assert.equal(apr25.owner, 'Pecky');
        assert.equal(apr25.type, WEEK_TYPES.NORMAL);
        assert.equal(apr25.rented, false);
      });

      it('19 y 26 dic 2022: Navidad (Mylene), Año Nuevo (Eva)', () => {
        const dec19 = findWeek(weeks, '2022-12-19');
        const dec26 = findWeek(weeks, '2022-12-26');

        assert.equal(dec19.owner, 'Mylene');
        assert.equal(dec19.type, WEEK_TYPES.NAVIDAD);
        assert.equal(dec19.rented, false);

        assert.equal(dec26.owner, 'Eva');
        assert.equal(dec26.type, WEEK_TYPES.ANO_NUEVO);
        assert.equal(dec26.rented, false);
      });

      it('27 feb 2023: Pecky (última semana, normal, no rentada)', () => {
        const w = findWeek(weeks, '2023-02-27');
        assert.ok(w);
        assert.equal(w.owner, 'Pecky');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, false);
      });
    });

    describe('Temporada 2023/24', () => {
      const weeks = buildSeason(2023);

      it('6 mar 2023: Eva (primera semana, normal, no rentada)', () => {
        const w = findWeek(weeks, '2023-03-06');
        assert.ok(w);
        assert.equal(w.owner, 'Eva');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, false);
      });

      it('3 y 10 abr 2023: Santa (Lourdes), Pascua (Lulú)', () => {
        const apr03 = findWeek(weeks, '2023-04-03');
        const apr10 = findWeek(weeks, '2023-04-10');

        assert.equal(apr03.owner, 'Lourdes');
        assert.equal(apr03.type, WEEK_TYPES.SEMANA_SANTA);
        assert.equal(apr03.rented, false);

        assert.equal(apr10.owner, 'Lulú');
        assert.equal(apr10.type, WEEK_TYPES.PASCUA);
        assert.equal(apr10.rented, false);
      });

      it('18 y 25 dic 2023: Navidad (Nilda), Año Nuevo (Pecky)', () => {
        const dec18 = findWeek(weeks, '2023-12-18');
        const dec25 = findWeek(weeks, '2023-12-25');

        assert.equal(dec18.owner, 'Nilda');
        assert.equal(dec18.type, WEEK_TYPES.NAVIDAD);
        assert.equal(dec18.rented, false);

        assert.equal(dec25.owner, 'Pecky');
        assert.equal(dec25.type, WEEK_TYPES.ANO_NUEVO);
        assert.equal(dec25.rented, false);
      });

      it('26 feb 2024: Mylene (última semana, no rentada antes del 4 mar 2024)', () => {
        const w = findWeek(weeks, '2024-02-26');
        assert.ok(w);
        assert.equal(w.owner, 'Mylene');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, false);
      });
    });

    describe('Temporada 2024/25', () => {
      const weeks = buildSeason(2024);

      it('4 mar 2024: Lourdes (primera semana, rentada)', () => {
        const w = findWeek(weeks, '2024-03-04');
        assert.ok(w);
        assert.equal(w.owner, 'Lourdes');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, true);
      });

      it('25 mar y 1 abr 2024: Santa (Mylene), Pascua (Eva) - festivos no se rentan', () => {
        const mar25 = findWeek(weeks, '2024-03-25');
        const apr01 = findWeek(weeks, '2024-04-01');

        assert.equal(mar25.owner, 'Mylene');
        assert.equal(mar25.type, WEEK_TYPES.SEMANA_SANTA);
        assert.equal(mar25.rented, false);

        assert.equal(apr01.owner, 'Eva');
        assert.equal(apr01.type, WEEK_TYPES.PASCUA);
        assert.equal(apr01.rented, false);
      });

      it('23 y 30 dic 2024: Navidad (Lourdes), Año Nuevo (Lulú)', () => {
        const dec23 = findWeek(weeks, '2024-12-23');
        const dec30 = findWeek(weeks, '2024-12-30');

        assert.equal(dec23.owner, 'Lourdes');
        assert.equal(dec23.type, WEEK_TYPES.NAVIDAD);
        assert.equal(dec23.rented, false);

        assert.equal(dec30.owner, 'Lulú');
        assert.equal(dec30.type, WEEK_TYPES.ANO_NUEVO);
        assert.equal(dec30.rented, false);
      });

      it('6 ene 2025: Mylene (primera semana de renta después de Año Nuevo)', () => {
        const w = findWeek(weeks, '2025-01-06');
        assert.ok(w);
        assert.equal(w.owner, 'Mylene');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, true);
      });
    });

    describe('Temporada 2025/26', () => {
      const weeks = buildSeason(2025);

      it('3 mar 2025: Lulú (primera semana, rentada)', () => {
        const w = findWeek(weeks, '2025-03-03');
        assert.ok(w);
        assert.equal(w.owner, 'Lulú');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, true);
      });

      it('14 y 21 abr 2025: Santa (Pecky), Pascua (Nilda)', () => {
        const apr14 = findWeek(weeks, '2025-04-14');
        const apr21 = findWeek(weeks, '2025-04-21');

        assert.equal(apr14.owner, 'Pecky');
        assert.equal(apr14.type, WEEK_TYPES.SEMANA_SANTA);
        assert.equal(apr14.rented, false);

        assert.equal(apr21.owner, 'Nilda');
        assert.equal(apr21.type, WEEK_TYPES.PASCUA);
        assert.equal(apr21.rented, false);
      });

      it('22 y 29 dic 2025: Navidad (Eva), Año Nuevo (Mylene)', () => {
        const dec22 = findWeek(weeks, '2025-12-22');
        const dec29 = findWeek(weeks, '2025-12-29');

        assert.equal(dec22.owner, 'Eva');
        assert.equal(dec22.type, WEEK_TYPES.NAVIDAD);
        assert.equal(dec22.rented, false);

        assert.equal(dec29.owner, 'Mylene');
        assert.equal(dec29.type, WEEK_TYPES.ANO_NUEVO);
        assert.equal(dec29.rented, false);
      });

      it('23 feb 2026: Lourdes (rentada)', () => {
        const w = findWeek(weeks, '2026-02-23');
        assert.ok(w);
        assert.equal(w.owner, 'Lourdes');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, true);
      });
    });

    describe('Temporada 2026/27', () => {
      const weeks = buildSeason(2026);

      it('2 mar 2026: Nilda (primera semana, rentada)', () => {
        const w = findWeek(weeks, '2026-03-02');
        assert.ok(w);
        assert.equal(w.owner, 'Nilda');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
        assert.equal(w.rented, true);
      });

      it('30 mar y 6 abr 2026: Santa (Lulú), Pascua (Lourdes) [corrección de error en hoja]', () => {
        const mar30 = findWeek(weeks, '2026-03-30');
        const apr06 = findWeek(weeks, '2026-04-06');

        // La hoja impresa tenía invertidos a Lourdes y Lulú; el algoritmo corregido asigna Lulú a Santa y Lourdes a Pascua
        assert.equal(mar30.owner, 'Lulú');
        assert.equal(mar30.type, WEEK_TYPES.SEMANA_SANTA);
        assert.equal(mar30.rented, false);

        assert.equal(apr06.owner, 'Lourdes');
        assert.equal(apr06.type, WEEK_TYPES.PASCUA);
        assert.equal(apr06.rented, false);
      });

      it('13, 20 y 27 abr 2026: Lourdes, Lulú, Nilda (semanas normales tras Pascua)', () => {
        const apr13 = findWeek(weeks, '2026-04-13');
        const apr20 = findWeek(weeks, '2026-04-20');
        const apr27 = findWeek(weeks, '2026-04-27');

        assert.equal(apr13.owner, 'Lourdes');
        assert.equal(apr13.type, WEEK_TYPES.NORMAL);
        assert.equal(apr13.rented, false);

        assert.equal(apr20.owner, 'Lulú');
        assert.equal(apr20.type, WEEK_TYPES.NORMAL);
        assert.equal(apr20.rented, false);

        assert.equal(apr27.owner, 'Nilda');
        assert.equal(apr27.type, WEEK_TYPES.NORMAL);
        assert.equal(apr27.rented, false);
      });

      it('21 y 28 dic 2026: Navidad (Pecky), Año Nuevo (Nilda)', () => {
        const dec21 = findWeek(weeks, '2026-12-21');
        const dec28 = findWeek(weeks, '2026-12-28');

        assert.equal(dec21.owner, 'Pecky');
        assert.equal(dec21.type, WEEK_TYPES.NAVIDAD);
        assert.equal(dec21.rented, false);

        assert.equal(dec28.owner, 'Nilda');
        assert.equal(dec28.type, WEEK_TYPES.ANO_NUEVO);
        assert.equal(dec28.rented, false);
      });
    });

    describe('Temporada 2027/28', () => {
      const weeks = buildSeason(2027);

      it('1 mar 2027: Pecky (primera semana)', () => {
        const w = findWeek(weeks, '2027-03-01');
        assert.ok(w);
        assert.equal(w.owner, 'Pecky');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
      });

      it('22 y 29 mar 2027: Santa (Eva), Pascua (Mylene)', () => {
        const mar22 = findWeek(weeks, '2027-03-22');
        const mar29 = findWeek(weeks, '2027-03-29');

        assert.equal(mar22.owner, 'Eva');
        assert.equal(mar22.type, WEEK_TYPES.SEMANA_SANTA);
        assert.equal(mar22.rented, false);

        assert.equal(mar29.owner, 'Mylene');
        assert.equal(mar29.type, WEEK_TYPES.PASCUA);
        assert.equal(mar29.rented, false);
      });

      it('20 y 27 dic 2027: Navidad (Lulú), Año Nuevo (Lourdes)', () => {
        const dec20 = findWeek(weeks, '2027-12-20');
        const dec27 = findWeek(weeks, '2027-12-27');

        assert.equal(dec20.owner, 'Lulú');
        assert.equal(dec20.type, WEEK_TYPES.NAVIDAD);
        assert.equal(dec20.rented, false);

        assert.equal(dec27.owner, 'Lourdes');
        assert.equal(dec27.type, WEEK_TYPES.ANO_NUEVO);
        assert.equal(dec27.rented, false);
      });

      it('3, 10 y 17 ene 2028: Lulú (rentada), Nilda, Pecky [corrección de semanas omitidas en la hoja]', () => {
        const jan03 = findWeek(weeks, '2028-01-03');
        const jan10 = findWeek(weeks, '2028-01-10');
        const jan17 = findWeek(weeks, '2028-01-17');

        // La hoja omitió las filas del 10 y 17 de enero; el algoritmo las asigna correctamente en orden del ciclo
        assert.equal(jan03.owner, 'Lulú');
        assert.equal(jan03.type, WEEK_TYPES.NORMAL);
        assert.equal(jan03.rented, true);

        assert.equal(jan10.owner, 'Nilda');
        assert.equal(jan10.type, WEEK_TYPES.NORMAL);
        assert.equal(jan10.rented, true);

        assert.equal(jan17.owner, 'Pecky');
        assert.equal(jan17.type, WEEK_TYPES.NORMAL);
        assert.equal(jan17.rented, true);
      });
    });

    describe('Temporada 2028/29', () => {
      const weeks = buildSeason(2028);

      it('6 mar 2028: Mylene (primera semana)', () => {
        const w = findWeek(weeks, '2028-03-06');
        assert.ok(w);
        assert.equal(w.owner, 'Mylene');
        assert.equal(w.type, WEEK_TYPES.NORMAL);
      });

      it('Pascua 2028 (10 y 17 abr): Santa (Nilda), Pascua (Pecky)', () => {
        const apr10 = findWeek(weeks, '2028-04-10');
        const apr17 = findWeek(weeks, '2028-04-17');

        assert.equal(apr10.owner, 'Nilda');
        assert.equal(apr10.type, WEEK_TYPES.SEMANA_SANTA);
        assert.equal(apr10.rented, false);

        assert.equal(apr17.owner, 'Pecky');
        assert.equal(apr17.type, WEEK_TYPES.PASCUA);
        assert.equal(apr17.rented, false);
      });
    });
  });

  describe('Verificaciones estructurales (temporadas 2022 a 2030)', () => {
    const seasons = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

    it('Cada temporada inicia exactamente el primer lunes de marzo', () => {
      for (const year of seasons) {
        const weeks = buildSeason(year);
        const expectedStart = firstMondayOfMarch(year);
        assert.equal(
          toISO(weeks[0].start),
          toISO(expectedStart),
          `La temporada ${year} debe iniciar el primer lunes de marzo`
        );
      }
    });

    it('Total de semanas: 53 semanas para 2027/28 y 52 para el resto', () => {
      for (const year of seasons) {
        const weeks = buildSeason(year);
        const expectedCount = year === 2027 ? 53 : 52;
        assert.equal(
          weeks.length,
          expectedCount,
          `La temporada ${year} debe tener ${expectedCount} semanas (obtenidas: ${weeks.length})`
        );
      }
    });

    it('Continuidad estricta sin huecos: el fin de cada semana es el inicio de la siguiente (exactamente 7 días)', () => {
      const MS_IN_7_DAYS = 7 * 24 * 60 * 60 * 1000;
      for (const year of seasons) {
        const weeks = buildSeason(year);
        for (let i = 0; i < weeks.length; i++) {
          const w = weeks[i];
          assert.equal(
            w.end.getTime() - w.start.getTime(),
            MS_IN_7_DAYS,
            `Semana ${toISO(w.start)} en ${year} debe durar exactamente 7 días`
          );
          if (i > 0) {
            const prev = weeks[i - 1];
            assert.equal(
              w.start.getTime(),
              prev.end.getTime(),
              `Semana ${toISO(w.start)} debe iniciar exactamente cuando termina la anterior ${toISO(prev.start)}`
            );
          }
        }
      }
    });

    it('Cada temporada tiene exactamente 4 semanas festivas (una de cada tipo)', () => {
      const expectedHolidayTypes = [
        WEEK_TYPES.SEMANA_SANTA,
        WEEK_TYPES.PASCUA,
        WEEK_TYPES.NAVIDAD,
        WEEK_TYPES.ANO_NUEVO,
      ];

      for (const year of seasons) {
        const hw = holidayWeeks(year);
        assert.equal(hw.length, 4, `holidayWeeks(${year}) debe devolver 4 semanas`);

        const weeks = buildSeason(year);
        const seasonHolidays = weeks.filter((w) => w.type !== WEEK_TYPES.NORMAL);
        assert.equal(seasonHolidays.length, 4, `Temporada ${year} debe tener 4 festivos`);

        const holidayTypes = seasonHolidays.map((w) => w.type);
        assert.deepEqual(
          holidayTypes,
          expectedHolidayTypes,
          `Temporada ${year} debe tener los 4 tipos festivos en orden cronológico`
        );

        // Ningún festivo puede estar marcado como rentado
        for (const h of seasonHolidays) {
          assert.equal(h.rented, false, `El festivo ${h.type} en ${year} no debe estar rentado`);
        }
      }
    });

    it('La familia que inicia cada temporada avanza 1 paso en el ciclo continuo', () => {
      for (let i = 0; i < seasons.length - 1; i++) {
        const currentYear = seasons[i];
        const nextYear = seasons[i + 1];

        const currentStarter = startFamily(currentYear);
        const nextStarter = startFamily(nextYear);

        const currentIndex = FAMILIES.indexOf(currentStarter);
        const expectedNextIndex = (currentIndex + 1) % FAMILIES.length;
        const expectedNextStarter = FAMILIES[expectedNextIndex];

        assert.equal(
          nextStarter,
          expectedNextStarter,
          `El inicio de ${nextYear} (${nextStarter}) debe ser el siguiente de ${currentYear} (${currentStarter})`
        );
      }
    });

    it('La familia inicial de 2028 es Mylene', () => {
      assert.equal(startFamily(2028), 'Mylene');
    });

    it('Las semanas festivas no avanzan la rotación de semanas ordinarias', () => {
      for (const year of seasons) {
        const weeks = buildSeason(year);
        const normalWeeks = weeks.filter((w) => w.type === WEEK_TYPES.NORMAL);
        const startFam = startFamily(year);
        let expectedCycleIdx = FAMILIES.indexOf(startFam);

        for (const nw of normalWeeks) {
          assert.equal(
            nw.owner,
            FAMILIES[expectedCycleIdx],
            `En la temporada ${year}, la semana normal ${toISO(nw.start)} debe asignarse según el ciclo continuo sin saltos`
          );
          expectedCycleIdx = (expectedCycleIdx + 1) % FAMILIES.length;
        }
      }
    });
  });
});
