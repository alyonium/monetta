---
name: US-002 Firefly client
overview: Настроить helpers для токена и URL Firefly в localStorage и функцию configureApiClient, которая задаёт baseUrl, Bearer и Accept у уже сгенерированного клиента — без правок src/api и без UI.
todos:
  - id: normalize-url
    content: "Чистая normalizeBackendUrl: trim, хвостовой слэш, /v1, дописать /api"
    status: pending
  - id: auth-storage
    content: Helpers localStorage для токена и backend URL с нормализацией при записи
    status: pending
  - id: configure-client
    content: "configureApiClient: setConfig baseUrl + Bearer + Accept; вызов из main.tsx"
    status: pending
  - id: tests-quality
    content: Тесты helpers + npm test, tsc, lint
    status: pending
isProject: false
---

# US-002: Настроить клиент Firefly из сохранённых токена и URL

**История:** priority 2, `passes: false`. Ссылки на Figma нет (`designReference: []`).

**Вне скоупа:** экран логина (US-003), гард и вкладки (US-004), правки `src/api`, App/роутер/заглушка Budget.

## Контекст

Сгенерированный клиент — синглтон в [`src/api/client.gen.ts`](src/api/client.gen.ts):

```ts
export const client = createClient(createConfig<ClientOptions2>({
  baseUrl: 'https://demo.firefly-iii.org/api',
}));
```

SDK ходит на `baseUrl + /v1/...` (например `/v1/about`). У `client` есть `setConfig` / `getConfig`; заголовок `Authorization` мержится через `mergeHeaders`. Файлы в `src/api` не трогаем.

FR-1: URL нормализуется до корня API (`…/api`). Токен и URL живут в `localStorage`.

## Шаги

### 1. Нормализация URL

Добавить чистую функцию, например [`src/helpers/normalizeBackendUrl.ts`](src/helpers/normalizeBackendUrl.ts):

1. `trim`
2. убрать хвостовые `/`
3. убрать опциональный суффикс `/v1` (клиент сам клеит `/v1/...`; иначе `…/api/v1` + `/v1/about` → `…/api/v1/v1/about`)
4. если путь ещё не заканчивается на `/api` (без учёта регистра) — дописать `/api`

Примеры: `https://x.com` → `https://x.com/api`; `https://x.com/api/` → `https://x.com/api`; `  http://127.0.0.1/api  ` → `http://127.0.0.1/api`.

### 2. Helpers localStorage

Файлы в `src/helpers` (отдельный модуль, не внутри `src/api`):

- ключи: `monetta.token`, `monetta.backendUrl`
- `getAccessToken` / `setAccessToken`
- `getBackendUrl` / `setBackendUrl` — перед записью вызывать `normalizeBackendUrl`; при чтении тоже нормализовать (старые значения без `/api`)

`clearAuth*` в этой истории не нужен (это US-039).

Vitest сейчас `environment: 'node'` — в тестах заглушить `localStorage` через `vi.stubGlobal` (как в [`vitest.config.ts`](vitest.config.ts)).

### 3. `configureApiClient`

Добавить [`src/helpers/configureApiClient.ts`](src/helpers/configureApiClient.ts):

- импорт `client` из `@/api/client.gen.ts` (не править generated-файлы)
- аргументы опциональны: `{ token, backendUrl }` или чтение из storage
- если токена или URL нет — ничего не менять (остаётся demo `baseUrl`)
- иначе `client.setConfig({ baseUrl: normalizeBackendUrl(...), headers: { Authorization: \`Bearer ${token}\`, Accept: 'application/json' } })`

Вызов из [`src/main.tsx`](src/main.tsx) при старте (после импорта i18n), чтобы после перезагрузки страницы клиент брал сохранённые креды. UI логина не трогаем.

### 4. Тесты

По конвенции: `src/helpers/tests/*.test.ts`, `describe`/`it`/`expect` из `vitest`, без globals (как [`src/i18n/tests/i18n.test.ts`](src/i18n/tests/i18n.test.ts)).

- нормализация: trim, слэш, добавление `/api`, уже `…/api`, суффикс `/v1`
- storage: запись/чтение; URL на диске уже нормализован
- `configureApiClient`: после вызова `client.getConfig()` — `baseUrl` без хвостового `/`, `Authorization` = `Bearer …`, `Accept` = `application/json`; без кред не затирает конфиг
- после тестов клиента восстанавливать исходный `setConfig` (синглтон)

Новых i18n-строк нет.

## Верификация

- `npm test` — все тесты зелёные, включая новые helpers
- `npx tsc -b` (или `npm run build`) — typecheck
- `npm run lint`
- Браузер не нужен: UI в истории нет
