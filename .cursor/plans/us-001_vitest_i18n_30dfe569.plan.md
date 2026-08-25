---
name: US-001 Vitest i18n
overview: Подключить Vitest с npm-скриптом `test` и i18next с английским каталогом. App, роутер и заглушку Budget не переписывать.
todos:
  - id: vitest-setup
    content: Поставить vitest, скрипт test, vitest.config.ts с alias @ и environment node
    status: completed
  - id: i18n-setup
    content: Поставить i18next и react-i18next, каталог en, init, типизированный t(), тесты
    status: completed
  - id: verify-quality
    content: Прогнать test, build (typecheck), lint; смоук /monetta/budget без регрессии App/router
    status: completed
isProject: false
---

# US-001: Vitest и английский i18n

**История:** US-001 «Подключить Vitest и английский каталог i18n» (priority 1, `passes: false`).

**Figma:** в `designReference` ссылок нет.

**Не трогать логику оболочки:** [src/App.tsx](src/App.tsx) (тёмная тема Mantine, `BrowserRouter`), [src/router/AppRouter.tsx](src/router/AppRouter.tsx), [src/constants/router.ts](src/constants/router.ts), заглушку [src/modules/budget/Budget.tsx](src/modules/budget/Budget.tsx). В App/main допустим только точечный импорт init i18n — без смены темы, роутера и вёрстки.

`current-task/progress.txt` отсутствует — создать при закрытии истории (append).

## Почему раньше был helper

В тексте истории — «i18n-helper», в зафиксированном стеке i18next не было. Это не значило, что пакет уже стоит: его как раз не ставили. Решение обновлено: в этой истории ставим `i18next` и `react-i18next`.

## Vitest

- Поставить `vitest` (Vite 8 → Vitest 4.1+). Testing Library и jsdom не ставить: в этой истории только unit-тесты i18n.
- Скрипт в [package.json](package.json): `"test": "vitest run"` (без watch, чтобы CI не зависал).
- Отдельный [vitest.config.ts](vitest.config.ts) с `defineConfig` из `vitest/config`, чтобы тесты не поднимали `vite-plugin-pwa`. Скопировать alias `@` → `src`. `environment: 'node'`, `include: ['src/**/*.test.ts']`.
- Добавить `vitest.config.ts` в `include` [tsconfig.node.json](tsconfig.node.json).
- Импорты `describe` / `it` / `expect` из `vitest`, без `globals: true` (проект с `verbatimModuleSyntax`).

## i18n (i18next)

- Зависимости: `i18next`, `react-i18next`.
- Каталог [src/i18n/en.ts](src/i18n/en.ts): вложенный объект. Seed-ключ, например `app.name: 'Monetta'`. Остальные ключи добавляют следующие истории. UI этой историей не переводим (заглушка Budget остаётся как есть).
- Init в [src/i18n/index.ts](src/i18n/index.ts): `lng: 'en'`, `fallbackLng: 'en'`, ресурсы `{ en: { translation: en } }`. Экспорт инстанса и `t` для не-React кода (helpers, тесты). В компонентах следующих историй — `useTranslation()`.
- Типы ключей через module augmentation `i18next` (`CustomTypeOptions.resources`), чтобы неверный ключ ломал typecheck.
- Интерполяция i18next: `{{name}}`.
- Подключить init в [src/main.tsx](src/main.tsx) (side-effect import) или обернуть App в `I18nextProvider` — минимальная правка, без смены провайдеров Mantine/Router.
- Тесты: [src/i18n/tests/i18n.test.ts](src/i18n/tests/i18n.test.ts) (или `src/helpers/tests`, если тонкую обёртку положим в helpers) — известный ключ, интерполяция `{{name}}`, неизвестный ключ (fallback = ключ).

Пример контракта:

```ts
t('app.name'); // 'Monetta'
t('account.deleteConfirm', { name: 'Cash' }); // '... {{name}} ...'
```

## Что не делать

- Не хардкодить новые пользовательские строки вне `t()` / `useTranslation()`.
- Не править `src/api`.
- Не создавать модули login/history/analytics/settings (это следующие истории).
- Не переводить заглушку `Budget` — история явно её сохраняет.

## Проверка

- `npm test` — зелёный.
- `npm run build` (`tsc -b && vite build`) — typecheck и сборка без ошибок.
- `npm run lint` — 0 ошибок.
- Смоук в браузере: `/monetta/budget` открывается, тёмная тема, текст `Budget`, роутер на месте. Новых UI-строк нет — полный e2e не нужен.
