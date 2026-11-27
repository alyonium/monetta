---
name: US-038 line chart
overview: "На вкладке Chart нарисовать помесячный LineChart доходов и расходов в основной валюте: свои From/To, общий тег, без свайпа. Списки Expenses/Incomes и диаграмма остаются как есть."
todos:
  - id: chart-helpers
    content: Месяцы диапазона, раскладка deposit/withdrawal и конвертация в точки LineChart
    status: pending
  - id: chart-query
    content: fetch + useAnalyticsChart, ключ в TRANSACTION_QUERY_KEYS
    status: pending
  - id: chart-ui
    content: Шапка Incomes vs Expenses, легенда, LineChart в слоте Chart
    status: pending
  - id: verify
    content: Тесты, tsc, lint и проверка Chart/Diagram в браузере
    status: pending
isProject: false
---

# US-038: график доходов и расходов

Следующая история с `passes: false` — **US-038** (priority 38). Figma нет: `designReference` пустой.

Сейчас [Analytics.tsx](src/modules/analytics/Analytics.tsx) на Chart оставляет `.visualization` пустым, как только загрузился breakdown. Заголовок «Expense breakdown» есть только у Diagram. `DiagramMonthPager` на Chart не монтируется. Списки уже идут из `useAnalyticsBreakdown` по диапазону активного вида.

## Данные

Помесячный ряд собирать из транзакций, тем же правилом, что теговый breakdown в [analyticsBreakdown.ts](src/modules/analytics/helpers/analyticsBreakdown.ts):

- `deposit` → доход по `source`, `withdrawal` → расход по `destination`
- сумма — `amount` и `currencyCode`; `foreignAmount` не добавлять
- transfer, reconciliation и opening balance пропускать
- период как у списков: `analyticsBreakdownPeriod` (`from` … `endOfMonth(to)`)
- без тега — `listTransaction`, с тегом — `listTransactionByTag` и `collectFireflyPages`
- свой лимит страницы `ANALYTICS_CHART_PAGE_LIMIT = 50`
- каждый месяц From…To есть в ряду; пустой месяц — 0
- конвертация через уже существующий `sumToPrimary`. Нет курса хотя бы у одной суммы — ряд `null`, на экране `—`, линии нет
- ключ `['analytics', 'chart', start, end, tag]` добавить в `TRANSACTION_QUERY_KEYS`, чтобы save/delete транзакции обновляли график

`getChartAccountOverview` — балансы счетов и без тега. `pc_entries` — серверная конвертация Firefly; её не используем (так же, как `getBasicSummary` в US-014).

Запрос графика живёт только в компоненте Chart, поэтому на Diagram транзакции за год не качаются. Списки по-прежнему идут из breakdown.

## UI

В шапке Chart, в том же `.heading` под фильтрами:

- слева заголовок `Incomes vs Expenses` (`analytics.incomesVsExpenses`)
- справа зелёная черта + `Incomes`, красная черта + `Expenses` (`analytics.incomes` / `analytics.expenses`, цвета `green.6` / `red.6`, как у карточек рейтинга) и подпись периода активного Chart
- Diagram оставляет свой заголовок и период

В слоте Chart — `LineChart` из `@mantine/charts` 9.5.2 (стили уже в [App.tsx](src/App.tsx)):

- `dataKey` месяца, серии `incomes` (`green.6`) и `expenses` (`red.6`), подписи серий из i18n
- ось X — короткие месяцы `analytics.months.*`; если одно имя месяца встречается дважды (диапазон через год), к подписи добавляется год
- ось Y — деньги через `formatWalletAmount`
- `gridAxis="xy"`. Пунктир уже дефолт Mantine: `strokeDasharray="5 5"`
- тултип дефолтный (`withTooltip`): доход и расход месяца, те же суммы через `valueFormatter`
- `withLegend` не включать: легенда в шапке
- высота около `16rem`, чтобы список под графиком по-прежнему скроллился
- пустые данные и ошибка курса: `—`, `LineChart` не монтировать (как пустой `DonutChart`)
- загрузка и ошибка запроса — существующий `AnalyticsStatus`

Переключатель Expenses | Incomes график не меняет. Свайп и точки месяцев на Chart не появляются.

## Файлы

- [src/modules/analytics/helpers/analyticsChart.ts](src/modules/analytics/helpers/analyticsChart.ts) — месяцы диапазона, раскладка транзакций, конвертация в точки графика
- [src/modules/analytics/helpers/fetchAnalyticsChart.ts](src/modules/analytics/helpers/fetchAnalyticsChart.ts) — страницы Firefly
- [src/modules/analytics/hooks/useAnalyticsChart.ts](src/modules/analytics/hooks/useAnalyticsChart.ts) — `useQuery` + валюта и курсы, как `useAnalyticsBreakdown`
- [src/modules/analytics/components/IncomeExpenseChart/](src/modules/analytics/components/IncomeExpenseChart/) — `LineChart` и CSS рядом
- [src/modules/analytics/constants/queries.ts](src/modules/analytics/constants/queries.ts) — ключ и лимит
- [src/modules/budget/helpers/transactions/invalidateTransactionQueries.ts](src/modules/budget/helpers/transactions/invalidateTransactionQueries.ts) — новый ключ в списке
- [src/modules/analytics/Analytics.tsx](src/modules/analytics/Analytics.tsx) и [Analytics.module.css](src/modules/analytics/Analytics.module.css) — шапка и слот
- [src/i18n/en.ts](src/i18n/en.ts) — `analytics.incomesVsExpenses`
- тесты в `src/modules/analytics/helpers/tests/` (мок SDK, как у breakdown)

## Проверка

- `npm test`
- `npx tsc -b --pretty false`
- `npm run lint`
- в браузере на `/#/monetta/analytics`: Chart показывает заголовок, зелёно-красную легенду, период `Jan - …`, две линии и тултип с обеими суммами; смена From/To и тега меняет график и список; Expenses | Incomes меняет только список; свайпа и точек нет; Diagram со своим диапазоном и свайпом остаётся прежним
