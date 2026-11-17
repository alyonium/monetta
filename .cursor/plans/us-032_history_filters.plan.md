---
name: US-032 History Filters
overview: Добавить на History модалку фильтров (период, тип, один тег). Список запрашивается у Firefly заново с первой страницы, бейдж считает фильтры не по умолчанию. Поиск US-031 остаётся клиентским поверх этого ответа.
todos:
  - id: filter-model
    content: Тип фильтров, маппинг в start/end/type/tag и тесты helper
    status: pending
  - id: fetch-query
    content: fetchHistoryTransactionsPage и useInfiniteQuery с ключом-префиксом history/transactions
    status: pending
  - id: filters-modal
    content: Кнопка Filter, бейдж и модалка с Reset/Close, строки i18n
    status: pending
  - id: verify
    content: tsc, vitest, eslint и проверка фильтров в браузере
    status: pending
isProject: false
---

# US-032: фильтры History

Figma-ссылок нет (`designReference: []`).

Фильтры применяются сразу: в story нет кнопки Apply. Reset возвращает дефолты и тоже сразу меняет список. Close, клик снаружи и Escape только закрывают модалку. Сортировку (US-033) и клик по карточке (US-034) не трогать.

## Запрос

`listTransaction` умеет `start`, `end`, `type`. Тега в этом запросе нет — один выбранный тег идёт в [`listTransactionByTag`](src/api/sdk.gen.ts) (`path.tag` — имя тега), с теми же `start` / `end` / `type` / `page` / `limit`.

Дефолт (All history, All types, без тега) по-прежнему `{ page, limit }` без `start`, `end`, `type`. Иначе в query только заданные поля:

- Month: `startOfMonth` … `endOfMonth` выбранного месяца. Это календарный месяц, не [`monthRange`](src/modules/budget/helpers/month/budgetMonth.ts) (тот обрезает текущий месяц по сегодня).
- Date range: выбранные Start и End, включительно. Если Start позже End, сдвинуть вторую границу к той, которую только что меняли.
- Type: `deposit` | `withdrawal` | `transfer` | `reconciliation` | `opening_balance`. All types поле не шлёт. Маппинг — `Record`, без `never` в `default`.
- Tag: `null` — `listTransaction`; строка — `listTransactionByTag`.

Ключ: `[...HISTORY_TRANSACTIONS_QUERY_KEY, { start, end, type, tag }]`. Префикс `['history', 'transactions']` остаётся, чтобы [`invalidateTransactionQueries`](src/modules/budget/helpers/transactions/invalidateTransactionQueries.ts) сбрасывал и отфильтрованные страницы. Страницу и строку поиска в ключ не класть. Смена ключа начинает infinite query с первой страницы. `placeholderData` не добавлять.

Поиск по-прежнему после ответа сервера: `filterAccountTransactions` в [`useHistoryList`](src/modules/history/hooks/useHistoryList.ts). Пустая первая страница — `history.empty`.

## Состояние и UI

Состояние в `useHistoryList`, не в `localStorage`.

Дефолт: scope All history, type All types, tag `null`. При переключении на Month месяц — текущий (`todayIso()`, `maxDate` как у Budget). На Date range: Start — первое число текущего месяца, End — сегодня. Часы только через `todayIso` / `startOfMonth` / `endOfMonth` из [`budgetMonth.ts`](src/modules/budget/helpers/month/budgetMonth.ts). React-файлы dayjs не импортируют.

Бейдж — число отличий от дефолта, максимум 3: scope не All history, type не All types, тег выбран. Месяц и даты внутрь scope не считаются отдельно. При 0 бейджа нет.

В [`History.tsx`](src/modules/history/History.tsx) над списком: поле поиска, кнопка с `FunnelIcon` (`aria-label` Filter), рядом `Badge` со счётчиком. Модалка [`HistoryFiltersModal`](src/modules/history/components/HistoryFiltersModal/HistoryFiltersModal.tsx) + CSS module в той же папке:

- Select scope: All history | Month | Date range
- Month — `MonthPickerInput` (`MMM YYYY`, `maxDate={todayIso()}`, `allowDeselect={false}`)
- Date range — два `DatePickerInput` (Start date, End date), без запрета будущих дней
- Select type: All types, Deposit, Withdrawal, Transfer, Reconciliation, Opening Balance
- Select тега: `useQuery` с `TAGS_QUERY_KEY` и `fetchTags`, один тег, `clearable`, placeholder All tags. `TagsField` не использовать
- Reset и Close

Строки — в [`src/i18n/en.ts`](src/i18n/en.ts) под `history.filters.*`. Подпись типа на карточке (`Opening balance`) не менять; в селекте — `Opening Balance`. Подписи Deposit / Withdrawal / Transfer / Reconciliation можно взять из `history.type.*`.

## Файлы

- Тип и дефолт: `src/modules/history/types/historyFilters.ts`, константы scope/type: `src/modules/history/constants/filters.ts`
- Чистые функции (query Firefly, счётчик, смена scope, clamp диапазона): `src/modules/history/helpers/historyFilters.ts`, тесты в `helpers/tests/historyFilters.test.ts`
- [`fetchHistoryTransactionsPage`](src/modules/history/helpers/fetchHistoryTransactionsPage.ts) принимает query и выбирает SDK-метод. `src/api` не править
- [`useHistoryTransactions`](src/modules/history/hooks/useHistoryTransactions.ts) кладёт query в `queryKey` и `queryFn`

## Проверка

- `npx tsc -b --pretty false`
- `npm test` — дефолтный вызов без `start`/`end`/`type`; месяц и диапазон; тип; тег бьёт в `listTransactionByTag`; счётчик 0/1/2/3; clamp Start/End
- `npm run lint`
- Браузер на `/monetta/history`: модалка, бейдж, смена списка по типу / месяцу / диапазону / тегу, Reset, Close без сброса, поиск и догрузка по скроллу поверх активного фильтра
