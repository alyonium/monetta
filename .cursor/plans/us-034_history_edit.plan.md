---
name: US-034 History edit
overview: Клик по карточке History открывает ту же EditTransactionModal, что и детали счёта. После Save или Delete список History и счета Budget обновляются через уже существующую инвалидацию запросов.
todos:
  - id: card-click
    content: Сделать карточку History кликабельной только для editable-транзакций и пробросить onSelect из списка
    status: pending
  - id: mount-modal
    content: На History открыть существующую EditTransactionModal со счетами текущего месяца и Modal.Stack
    status: pending
  - id: verify
    content: Прогнать tsc, lint, vitest и проверить save/delete в браузере
    status: pending
isProject: false
---

# US-034: правка транзакции из History

Figma-ссылок в `designReference` нет.

История с `passes: false` и наивысшим приоритетом — **US-034**. Карточка History остаётся обычным `div` до этой истории ([progress.txt](current-task/progress.txt), US-033). Модалка, форма, save и delete уже собраны в US-029.

## Что уже есть

- [EditTransactionModal](src/components/EditTransactionModal/EditTransactionModal.tsx) принимает `EditableAccountTransaction` и `BudgetAccountsByBlock`. Save вызывает `updateBudgetTransaction`, delete — `deleteBudgetTransaction`.
- Оба пути инвалидируют `TRANSACTION_QUERY_KEYS`: счета Budget, insights, транзакции счёта, теги и `['history', 'transactions']`. Префикс History совпадает с ключом `[...HISTORY_TRANSACTIONS_QUERY_KEY, filters]`, поэтому активный infinite query на History перезапросится сам. Неактивный запрос счетов Budget пометится устаревшим и обновится при возврате на вкладку.
- Кликабельны только deposit, withdrawal и transfer с настоящим `journalId`: [isEditableAccountTransaction](src/modules/budget/helpers/transactions/isEditableAccountTransaction.ts). Reconciliation, opening balance и запись без journal id не открывают модалку. Тесты этого предиката уже есть.

```12:18:src/modules/budget/helpers/transactions/isEditableAccountTransaction.ts
export const isEditableAccountTransaction = (
  transaction: AccountTransaction,
): transaction is EditableAccountTransaction =>
  transaction.journalId !== null &&
  (transaction.type === FIREFLY_TRANSACTION_TYPE.DEPOSIT ||
    transaction.type === FIREFLY_TRANSACTION_TYPE.WITHDRAWAL ||
    transaction.type === FIREFLY_TRANSACTION_TYPE.TRANSFER);
```

## Изменения

1. **Карточка.** В [HistoryTransactionCard.tsx](src/modules/history/components/HistoryTransactionCard/HistoryTransactionCard.tsx) принять необязательный `onSelect`. Если передан и `isEditableAccountTransaction(transaction)`, карточка становится `role="button"` с `tabIndex={0}`, кликом и `onEnterOrSpace` — тот же приём, что в [AccountTransactionCard.tsx](src/modules/budget/components/AccountDetailsModal/AccountTransactionCard/AccountTransactionCard.tsx). Иначе остаётся обычным `div`. В [HistoryTransactionCard.module.css](src/modules/history/components/HistoryTransactionCard/HistoryTransactionCard.module.css) добавить `.interactive { cursor: pointer }`. Не делать нативный `<button>`.

2. **Список.** [HistoryTransactionList.tsx](src/modules/history/components/HistoryTransactionList/HistoryTransactionList.tsx) пробрасывает `onSelect` в карточку. Ключ строки не менять: `journalId ?? \`${id}:${index}\``.

3. **Страница.** В [History.tsx](src/modules/history/History.tsx):
   - сессия `useModalSession<EditableAccountTransaction>` из [useModalSession.ts](src/modules/budget/hooks/useModalSession.ts);
   - счета для селектов: `useBudgetAccounts(startOfMonth(todayIso()))` и `toRecordAccounts`. Текущий месяц даёт живой каталог и тот же ключ Query, что Budget на текущем месяце. Список History от этой загрузки не блокировать;
   - пока есть `session.payload`, рендерить тот же `EditTransactionModal` внутри `Modal.Stack` (как Details на Budget), чтобы confirm удаления встал поверх формы. `stackId="edit-transaction"`, `key={session.id}`, `opened={session.opened}`, `onClose` → `close`, `onExitTransitionEnd` → `dispose`. Свою модалку и свою инвалидацию не писать.

```139:148:src/modules/budget/Budget.tsx
{editTransaction.session.payload && (
  <EditTransactionModal
    key={editTransaction.session.id}
    stackId='edit-transaction'
    opened={editTransaction.session.opened}
    onClose={editTransaction.close}
    onExitTransitionEnd={editTransaction.dispose}
    transaction={editTransaction.session.payload}
    accounts={recordAccounts}
  />
)}
```

Новых строк i18n нет: заголовок, поля, delete confirm и ошибки уже в `budget.editTransaction.*`.

## Проверка

- `npx tsc -b --pretty false`
- `npm run lint`
- `npm test`
- В браузере на History: клик по deposit, withdrawal и transfer открывает ту же форму (from, to, сумма, дата, описание, теги); reconciliation и opening balance не открывают её; Cancel, клик снаружи и Escape закрывают без записи; Save меняет карточку в списке без перезагрузки; Delete спрашивает «Delete this transaction? This action cannot be undone.», убирает строку и после перехода на Budget показывает обновлённые балансы без ручного refresh.
