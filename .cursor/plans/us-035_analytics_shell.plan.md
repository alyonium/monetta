---
name: US-035 Analytics shell
overview: "Собрать каркас страницы Analytics (US-035): переключатель Diagram/Chart, отдельные From/To у каждого вида, общий тег и блок Expenses/Incomes, подпись периода. Без графиков, списков и свайпа."
todos:
  - id: period-helpers
    content: "Хелперы периода: дефолты Diagram/Chart, clamp From/To, формат подписи и тесты"
    status: pending
  - id: analytics-shell
    content: "Страница Analytics: переключатели, фильтры, слот визуализации, блок Expenses/Incomes, i18n"
    status: pending
  - id: verify
    content: npm test, tsc, eslint и проверка каркаса в браузере на /monetta/analytics
    status: pending
isProject: false
---

# US-035: каркас страницы Analytics

Следующая история с `passes: false` — **US-035** (priority 35). Роутер уже отдаёт [`src/modules/analytics/Analytics.tsx`](src/modules/analytics/Analytics.tsx) на `/monetta/analytics`; сейчас это заглушка `<div>Analytics</div>`. Ссылок на Figma в `designReference` нет.

В эту историю не входят DonutChart и списки (US-036), свайп месяцев и точки (US-037), LineChart (US-038). Запросы insight не добавлять. `@mantine/charts` не импортировать.

## Поведение

Страница — колонка на всю высоту `main` (`height: 100%`, `min-height: 0`, свой `overflow: auto`). У [`AppLayout`](src/components/AppLayout/AppLayout.module.css) `main` с `overflow: hidden`, скролл остаётся внутри страницы, как список History.

Сверху вниз:

1. `SegmentedControl` на всю ширину: Diagram | Chart. По умолчанию Diagram.
2. Подпись периода **активного** вида.
3. Фильтры этого вида: From (год и месяц), To (год и месяц), тег.
4. Пустой слот визуализации с фиксированной минимальной высотой, чтобы блок ниже был отдельным.
5. Второй `SegmentedControl`: Expenses | Incomes. По умолчанию Expenses. Списков под ним нет.

From/To хранятся отдельно для Diagram и для Chart. Переключение вида восстанавливает период этого вида и не трогает другой. Тег и Expenses | Incomes общие и при переключении вида не сбрасываются.

Стартовые значения считаются от `todayIso()` (часы только там, как в History):

- Diagram: From = To = текущий месяц.
- Chart: From = январь того же года, To = текущий месяц.
- Тег: `null` (плейсхолдер All tags).

Состояние — `useState` на странице, без localStorage. Уход на другую вкладку размонтирует страницу, как History.

Подпись периода, тесты на чистой функции:

- один месяц: `Nov 2026`
- один год, разные месяцы: `Jan - Aug 2026`
- разные годы: `Dec 2025 - Jan 2026`

Короткие имена месяцев — ключи `analytics.months.*` в [`src/i18n/en.ts`](src/i18n/en.ts). В хелпер передаётся массив из 12 подписей, чтобы тест не тянул i18n.

## From не позже To, будущие месяцы выключены

Точка периода — `{ year, month }` с месяцем `1–12`. Сравнение через `YYYY-MM`, без dayjs в модуле analytics.

`clampAnalyticsRange(range, bound, part, value, today)`:

1. Записать изменённый год или месяц.
2. Если эта точка позже месяца `today`, прижать её к месяцу `today` (смена года на текущий при будущем месяце).
3. Если From оказался позже To, вторую границу приравнять к изменённой. Тот же приём, что `clampHistoryDateRange` в [`src/modules/history/helpers/historyFilters.ts`](src/modules/history/helpers/historyFilters.ts).

В селектах годов только `ANALYTICS_MIN_YEAR` (2000) … год `today`. В селекте месяцев пункты позже `today` с `disabled`. `allowDeselect={false}`.

Тег — тот же `Select`, что в [`HistoryFiltersModal`](src/modules/history/components/HistoryFiltersModal/HistoryFiltersModal.tsx): `useQuery` + `TAGS_QUERY_KEY` + `fetchTags`, `clearable`, значение `string | null`.

## Файлы

Новый код только в `src/modules/analytics/` и каталог строк. Роутер, `src/api` и Budget не трогать.

- [`src/modules/analytics/Analytics.tsx`](src/modules/analytics/Analytics.tsx) и `Analytics.module.css` — порядок блоков и два `SegmentedControl` (образец разметки контрола — [`ExpenseKindControl`](src/modules/budget/components/ExpenseKindControl/ExpenseKindControl.tsx)).
- `constants/` — `ANALYTICS_VIEW` (`diagram` | `chart`), `ANALYTICS_CATEGORY` (`expenses` | `incomes`), `ANALYTICS_MIN_YEAR`.
- `types/` — месяц, диапазон, какая граница и какое поле меняются.
- `helpers/analyticsPeriod.ts` — дефолтные диапазоны, clamp, `formatAnalyticsPeriod`. Тест в `helpers/tests/analyticsPeriod.test.ts` (`describe`/`it`/`expect` из `vitest`). Сегодня в тестах зафиксировать строкой, например `2026-11-25`.
- `hooks/useAnalyticsFilters.ts` — состояние страницы; инициализатор вызывает `todayIso()` один раз.
- `components/AnalyticsFilters/` — пять полей, CSS module рядом с компонентом. Подписи From / To / Year / Month / Tag.

Ключи i18n: `analytics.diagram`, `analytics.chart`, `analytics.from`, `analytics.to`, `analytics.year`, `analytics.month`, `analytics.tag`, `analytics.allTags`, `analytics.expenses`, `analytics.incomes`, `analytics.months.m1` … `m12` (`Jan` … `Dec`). Компоненты через `useTranslation()`.

## Проверка

- `npm test` — дефолты Diagram/Chart, clamp (From после To, To до From, будущий месяц после смены года), три формата подписи.
- `npx tsc -b --pretty false`
- `npm run lint`
- Браузер на `http://localhost:5175/monetta/analytics` (порт в [`vite.config.ts`](vite.config.ts), `strictPort`): Diagram по умолчанию, подпись текущего месяца, From и To — текущие год и месяц, Chart показывает январь–текущий месяц и возврат на Diagram восстанавливает его период, тег общий, Expenses по умолчанию, будущий месяц нельзя выбрать, сдвиг From за To двигает To. Графика и точек нет. Если сессии нет, страница уйдёт на логин — это гард US-004, не эта история.
