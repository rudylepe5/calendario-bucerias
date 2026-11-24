# Calendario Bucerías – Departamento 502

Aplicación web estática (HTML, CSS y JavaScript moderno con ES Modules, sin necesidad de paso de compilación/build step) para consultar y calcular la distribución anual de semanas del **Departamento 502** entre seis familias copropietarias.

Esta herramienta sustituye las hojas impresas *"DISTRIBUCION DE SEMANAS – DEPARTAMENTO 502"*, calculando las asignaciones mediante un algoritmo reproducible en lugar de mantener tablas manuales.

**Sitio en línea:** <https://rudylepe5.github.io/calendario-bucerias/>

---

## Resumen del Algoritmo

1. **Temporadas y semanas:**
   - Cada temporada inicia el primer lunes de marzo y concluye el primer lunes de marzo del año siguiente.
   - Las semanas van de lunes a lunes. La mayoría de las temporadas constan de 52 semanas (o 53 semanas en años bisiestos/calendarios especiales como 2027/28).

2. **Ciclo de familias:**
   - El orden cíclico es: **Nilda → Pecky → Mylene → Eva → Lourdes → Lulú → Nilda**.
   - Cada semana ordinaria se asigna a una familia siguiendo este ciclo continuo.

3. **Inicio de temporada:**
   - La familia que inicia cada temporada es la siguiente en el ciclo respecto a la que inició la temporada anterior.
   - Anclaje conocido: 2022 inició con *Mylene*, 2023 con *Eva*, 2024 con *Lourdes*, etc.

4. **Semanas festivas (4 por temporada):**
   - **Semana Santa:** Semana que contiene el Domingo de Resurrección (Pascua).
   - **Semana de Pascua:** Semana inmediatamente posterior a Semana Santa.
   - **Navidad:** Semana previa a la semana de Año Nuevo.
   - **Año Nuevo:** Semana que contiene el 31 de diciembre.

5. **Regla de rotación para festivos:**
   - Las semanas festivas se intercalan fuera del ciclo regular: **no avanzan la rotación ordinaria**. La siguiente semana normal se asigna a quien le correspondía antes de la pausa festiva.
   - Los festivos se asignan por parejas de familias rotativas (*Nilda & Pecky*, *Mylene & Eva*, *Lourdes & Lulú*), alternando quién toma la primera semana de cada ocasión en bloques de 2 turnos.

6. **Semanas de renta (resaltadas en amarillo):**
   - A partir de marzo de 2024, las semanas ordinarias que inician después de la semana de Año Nuevo y concluyen a más tardar el 31 de marzo se marcan como semanas de renta. Las semanas festivas nunca se rentan.

---

## Ejecución Local

Dado que el proyecto utiliza módulos de JavaScript nativos (`ES Modules`), el navegador requiere que los archivos se sirvan a través de un servidor HTTP local en lugar del protocolo `file://`.

Puedes ejecutar un servidor local con cualquiera de los siguientes comandos desde la raíz del proyecto:

### Usando Python 3:
```bash
python3 -m http.server 8000
```
Luego abre tu navegador en [http://localhost:8000](http://localhost:8000).

### Usando Node.js / npx:
```bash
npx serve .
```

---

## Pruebas Automatizadas

El proyecto cuenta con un conjunto de pruebas unitarias y de validación estructural ejecutadas con el corredor de pruebas nativo de Node.js (`node:test` y `node:assert`).

Para correr las pruebas:

```bash
npm test
```

(o alternativamente `node --test`).

---

## Publicación en GitHub Pages

Para publicar este sitio en GitHub Pages:

1. Ve al repositorio en GitHub: [`calendario-bucerias`](https://github.com/rudylepe5/calendario-bucerias).
2. Entra a **Settings** (Configuración) > **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment**:
   - **Source:** Selecciona *Deploy from a branch*.
   - **Branch:** Selecciona la rama `main` y la carpeta `/ (root)`.
4. Haz clic en **Save**.
5. Tras unos minutos, el sitio estará disponible públicamente en la URL asignada por GitHub Pages (por ejemplo: `https://rudylepe5.github.io/calendario-bucerias/`).

---

## Estructura del Proyecto

```
calendario-bucerias/
├── index.html                  # Punto de entrada HTML
├── package.json                # Configuración ESM y script de pruebas (npm test)
├── css/
│   └── style.css              # Hoja de estilos
├── js/
│   ├── algorithm.js           # Módulo puro con el algoritmo de distribución
│   └── main.js                # Inicialización e integración UI
├── test/
│   └── algorithm.test.js      # Pruebas unitarias y de validación con las hojas
├── README.md                  # Documentación del proyecto
└── calendario-bucerias-plan.md# Plan de desarrollo y especificaciones
```
