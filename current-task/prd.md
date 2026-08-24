# Monetta documentation

General information about app:

Monetta is a personal-finance PWA.

Users sign in with a Firefly III Personal Access Token and the URL of their Firefly III instance. After signing in, the app provides four screens (tabs): Budget, History, Analytics, and Settings.

Mobile-first design. 

Login Form:

Two text fields:

1. Firefly III token
2. Backend URL

To authorize, you need:

Firefly III Personal Access Token: create it in Firefly III → Options → Profile → OAuth / Personal Access Tokens. 
Backend URL - the root URL of the Firefly III API, including /api, e.g. [https://firefly.example.com/api](https://firefly.example.com/api) or [http://127.0.0.1/api](http://127.0.0.1/api).

The token and Backend URL are required to sign in.

Application:

1. Budget
    1. Parameters bar
        1. Income
        2. Expenses
        3. Balance
        4. Month
        5. Edit button
    2. Income accounts (revenue)
        1. Account item
            1. Account name
            2. Account icon
            3. Account color
            4. Account balance
            5. Account currency
        2. Create income account
            1. Account name
            2. Account color
            3. Account icon (Select account icon)
        3. Income account details
            1. Edit account button
            2. Delete account button
            3. Close button
            4. Search bar
            5. Transaction history
                1. Transaction card
                    1. Date
                    2. To *account name*
                    3. Description
                    4. Amount
                    5. Currency
                2. Edit transaction button
            6. Hide account button
        4. Edit income account
            1. Account name
            2. Account color
            3. Account icon (Select account icon)
            4. Discard button
    3. Current accounts (asset)
        1. Account item
            1. Account name
            2. Account icon
            3. Account color
            4. Account balance
            5. Account currency
        2. Create current account
            1. Account name
            2. Initial balance
            3. Currency
            4. Account color
            5. Account icon (Select account icon)
        3. Current account details
            1. Edit account button
            2. Delete account button
            3. Close button
            4. Search bar
            5. Transaction history
                1. Transaction card
                    1. Date
                    2. To *account name*
                    3. Description
                    4. Amount
                    5. Currency
                2. Edit transaction button
            6. Hide account button
        4. Edit current account
            1. Account name
            2. Account balance
            3. Account color
            4. Account icon (Select account icon)
            5. Discard button
    4. Expense accounts
        1. Account item
            1. Account name
            2. Account icon
            3. Account color
            4. Account balance
                1. Debt amount
                2. Paid amount
            5. Account currency
        2. Create expense account
            1. Account type
            2. Account name
            3. Balance
            4. Currency
            5. Account color
            6. Account icon (Select account icon)
        3. Expense account details
            1. Edit account button
            2. Delete account button
            3. Close button
            4. Search bar
            5. Transaction history
                1. Edit transaction button
            6. Hide account button
        4. Edit expense account
            1. Account name
            2. Account color
            3. Account icon (Select account icon)
            4. Discard button
    5. Transactions
        1. Income accounts → Current accounts
            1. Record income
                1. Income account
                2. Current account
                3. Amount
                4. Currency
                5. Date
                6. Description (opt)
                7. Tags (opt)
                8. Tags suggestions
                9. Cancel button
                10. Save button
        2. Current accounts → Expense accounts
            1. Record expense
                1. Current account
                2. Expense account
                3. Amount
                4. Date
                5. Description (opt)
                6. Tags (opt)
                7. Tags suggestions
                8. Cancel button
                9. Save button
        3. Current accounts → Current accounts
            1. Record transfer
                1. From
                2. To
                3. Amount
                    1. Amount debited
                    2. Amount credited
                4. Currency
                5. Date
                6. Description (opt)
                7. Tags (opt)
                8. Tags suggestions
                9. Cancel button
                10. Save button
    6. Mutual components
        1. Select account icon
        2. Create account
        3. Edit account
        4. Edit transaction
            1. Initial state (from-to)
            2. From account
            3. To account
            4. Amount
                1. Debited
                2. Credited
            5. Date
            6. Description (opt)
            7. Tags (opt)
            8. Tags suggestions
            9. Delete button
            10. Cancel button
            11. Save button
        5. Account details
2. History
    1. Search bar
        1. Filters
            1. History scope
                1. All history
                2. Month
                3. Date range
            2. Transaction type
            3. Filter by tag
            4. Reset filters button
            5. Close button
        2. Sorting
    2. Transactions list
        1. Transaction card
            1. Date
            2. From *account name*
            3. To *account name*
            4. Amount
            5. Description
            6. Tags
            7. Transaction type
            8. Edit transaction button
3. Analytics
    1. Diagram
        1. Filters
            1. From
            2. To
            3. Tags
        2. Diagram
        3. Expenses
        4. Incomes
    2. Chart
        1. Filters
            1. From
            2. To
            3. Tags
        2. Chart
        3. Expenses
        4. Incomes
4. Settings
    1. Logout button

## 1 Budget

Tab with 4 components: Parameters bar, Income accounts block, Current accounts block, Expense accounts block. Navigation is located in the footer, navigation is the same for all the tabs.

When the app is opened again, cached data should be displayed to avoid long loading times.

### 1.1 Parameters bar

#### 1.1.1 Income

A non-editable text field showing the total income for the selected month in the wallet's main currency.

#### 1.1.2 Expenses

A non-editable text field showing the total expenses for the selected month in the wallet's main currency.

#### 1.1.3 Balance

A non-editable text field showing the total wallet balance for the selected month in the wallet's main currency.

#### 1.1.4 Month

A month picker with the ability to switch between years. Future months cannot be selected.

#### 1.1.5 Edit button

In edit mode, accounts can be moved to other positions within the block using drag and drop, including being moved to a new page.

### 1.2 Income accounts (revenue)

The block displays 4 accounts per page. Navigation between pages is done by swiping. Below the accounts, page indicator dots should be displayed, with the active page highlighted. On desktop, pagination works by clicking arrow buttons, and the page displays as many accounts as can fit in one row. The desktop layout applies at widths of 961 px and above. The last element - the “Add account” button - takes up the same amount of space as any other account.

#### 1.2.1 Account item

An account card displaying brief information about the account.

1.2.1.1 Account name 

Set when the account is created. If the name exceeds the available space, it is truncated with “...”.

1.2.1.2 Account icon

Set when the account is created.

1.2.1.3 Account color

Set when the account is created.

1.2.1.4 Account balance

Updated after each transaction. The default value is 0.

1.2.1.5 Account currency

Set when the account is created.

#### 1.2.2 Create income account

A button that opens the “Create income account” modal. The button is displayed at the end of the accounts block.

1.2.2.1 Account name

Editable text field. Required.

1.2.2.2 Account icon

Button which shows currently selected or default icon. Opens the “Select account icon” modal window. Required.

1.2.2.3 Account color

Allows the user to select a color from the available color set. Required.

#### 1.2.3 Income account details

Modal window. Opens on click on income account. Provide the information about income account.

1.2.3.1 Edit account button

A block displaying brief account information with a button that allows the user to edit the selected account. The short information should include 1.2.2.1-1.2.2.3 fields.

1.2.3.2 Delete account button

A button that allows the user to delete the selected account. Before deleting an account, the confirmation modal window should appears (”Do you want to delete the *account name* account? This action cannot be undone.”)

1.2.3.3 Close button

A button that closes the account details modal. The modal can also be closed by clicking outside it.

1.2.3.4 Search bar

An editable text field for searching transactions. The search applies to all available transaction information, including description, source and destination account names, currency, etc.

1.2.3.5 Transaction history

A scrollable list of all transactions associated with the account. If there are no transactions, display “No transactions found for this account”.

1.2.3.5.1 Transaction card

Item in the transaction history list. Should show short information about each transaction. Transaction cards should be combined into one block by date.

1.2.3.5.1.1 Date

The transaction date. Required.

1.2.3.5.1.2 To *Account name*

The name of the account that received the money. Required.

1.2.3.5.1.3 Description

A short description of the transaction. Optional.

1.2.3.5.1.4 Amount

The transaction amount. Required.

1.2.3.5.1.5 Currency

The transaction currency. Required.

1.2.3.5.2 Edit transaction button

Transaction card should be clickable. On click, the “Edit transaction” modal window opens.

1.2.3.6 Hide account button

A button that allows the user to hide the selected account. Before hiding the account, a confirmation modal is displayed: “Do you want to hide the *account name* account? You can get the selected account back through the Firefly interface.”

#### 1.2.4 Edit income account

A button which opens the “Edit income account” modal window. The button should be at the “Income account details” modal window.

1.2.4.1 Account name

Editable text field. Required.

1.2.4.2 Account icon

Button which shows currently selected or default icon. Opens the “Select account icon” modal window. Required.

1.2.4.3 Account color

Allows the user to select a color from the available color set. Required.

1.2.4.4 Discard button

Discards all changes and restores the previously saved account values.

### 1.3 Current accounts (asset)

The block displays 4 accounts per page. Navigation between pages is done by swiping. Below the accounts, page indicator dots should be displayed, with the active page highlighted. On the desktop version, pagination works by clicking arrow buttons, and the page displays as many accounts as can fit on it in one row (the desktop version works up to and including 961 px). The last element - the “Add account” button - takes up the same amount of space as any other account.

#### 1.3.1 Account item

Block which shows short information about the account in the account list.

1.3.1.1 Account name 

Set upon creation. When overflowed, shows “…”.

1.3.1.2 Account icon

Set when the account is created.

1.3.1.3 Account color

Set when the account is created.

1.3.1.4 Account balance

The current account balance. Updated after each transaction.

1.3.1.5 Account currency

Set when the account is created.

#### 1.3.2 Create current account

A button that opens the “Create current account” modal. The button is displayed at the end of the accounts block.

1.3.2.1 Account name

Editable text field. Required.

1.3.2.2 Initial balance

The initial account balance. If not specified, it defaults to 0. Required.

1.3.2.3 Currency

A select picker with the available currencies. The wallet's main currency is selected by default. Required.

1.3.2.4 Account color

Allows the user to select a color from the available color set. Required.

1.3.2.5 Account icon

Button which shows currently selected or default icon. Opens the “Select account icon” modal window. Required.

#### 1.3.3 Current account details

Modal window. Opens on click on current account. Provide the information about current account.

1.3.3.1 Edit account button

A block displaying brief account information with a button that allows the user to edit the selected account. The short information should include 1.3.2.1-1.3.2.5 fields.

1.3.3.2 Delete account button

A button that allows the user to delete the selected account. Before deleting an account, the confirmation modal window should appears (”Do you want to delete the *account name* account? This action cannot be undone.”)

1.3.3.3 Close button

A button that closes the account details modal. The modal can also be closed by clicking outside it.

1.3.3.4 Search bar

An editable text field for searching transactions. The search applies to all available transaction information, including description, source and destination account names, currency, etc.

1.3.3.5 Transaction history

A scrollable list of all transactions associated with the account. If there are no transactions, display “No transactions found for this account”.

1.3.3.5.1 Transaction card

Item in the transaction history list. Should show short information about each transaction. Transaction cards should be combined into one block by date.

1.3.3.5.1.1 Date

The transaction date. Required.

1.3.3.5.1.2 To *Account name*

The name of the account that received the money. Required.

1.3.3.5.1.3 Description

A short description of the transaction. Optional.

1.3.3.5.1.4 Amount

The transaction amount. Required.

1.3.3.5.1.5 Currency

The transaction currency. Required.

1.3.3.5.2 Edit transaction button

Transaction card should be clickable. On click, the “Edit transaction” modal window opens.

1.3.3.6 Hide account button

A button that allows the user to hide the selected account. Before hiding the account, a confirmation modal is displayed: “Do you want to hide the *account name* account? You can get the selected account back through the Firefly interface.”

#### 1.3.4 Edit current account

A button which opens the “Edit current account” modal window. The button should be at the “Current account details” modal window.

1.3.4.1 Account name

Editable text field. Required.

1.3.4.2 Account balance

Editable number field. Set the current balance for the account. Required. 

1.3.4.3 Account icon

Button which shows currently selected or default icon. Opens the “Select account icon” modal window. Required.

1.3.4.4 Account color

Allows the user to select a color from the available color set. Required.

1.3.4.5 Discard button

Discards all changes and restores the previously saved account values.

### 1.4 Expense account

The block displays as many rows of accounts as can fit before the footer, with space reserved below for the page indicator dots. Each row contains 4 accounts. Navigation between pages is done by swiping.

Below the accounts, page indicator dots should be displayed, with the active page highlighted. On desktop, pagination works by clicking arrow buttons, and each page displays as many accounts as can fit in the available space. The desktop layout applies at widths of 961 px and above. The last element - the “Add account” button - takes up the same amount of space as any other account.

#### 1.4.1 Account item

Block which shows short information about the account in the account list.

1.4.1.1 Account name 

Set when the account is created. If the name exceeds the available space, it is truncated with “...”.

1.4.1.2 Account icon

Set when the account is created.

1.4.1.3 Account color

Set when the account is created.

1.4.1.4 Account balance

Set upon creation. If the type of the account is expense, only the balance should be shown. If the type of the account is debt, debt amount and paid amount should be shown.

1.4.1.4.1 Debt amount

The amount of debt. Should be highlight in red.

1.4.1.4.2 Paid amount

The amount of debt. Should be highlight in green.

1.4.1.5 Account currency

Set when the account is created.

#### 1.4.2 Create expense account

A button which opens the “Create expense account” modal window. The button should be at the end of the block of accounts.

1.4.2.1 Account type

Select picker from 2 options: “Expense” or “Debt” (non-editable after creation). Required.

1.4.2.2 Account name

Editable text field. Required.

1.4.2.3 Balance

Displayed only when “Debt” is selected. Represents the initial debt amount (non-editable after creation). Defaults to 0. Required.

1.4.2.4 Currency

Should be shown only for “Debt” type. Select picker from the currencies list. Initially set to the main currency of the wallet (non-editable after creation). Required. 

1.4.2.5 Account color

Allows to pick a color from set. Required.

1.4.2.6 Account icon

Button which shows currently selected or default icon. Opens the “Select account icon” modal window. Required.

#### 1.4.3 Expense account details

Modal window. Opens on click on current account. Provide the information about current account.

1.4.3.1 Edit account button

A block displaying brief account information with a button that allows the user to edit the selected account. The short information should include 1.4.2.1-1.4.2.6 fields.

1.4.3.2 Delete account button

A button that allows the user to delete the selected account. Before deleting an account, the confirmation modal window should appears (”Do you want to delete the *account name* account? This action cannot be undone.”)

1.4.3.3 Close button

A button that closes the account details modal. The modal can also be closed by clicking outside it.

1.4.3.4 Search bar

Editable text field for searching transaction. Search work for all the available information about transaction (description, from/to account names, currency, etc.). 

1.4.3.5 Transaction history

A scrollable list of all transactions associated with the account. If there are no transactions, display “No transactions found for this account”.

1.4.3.5.1 Transaction card

Item in the transaction history list. Should show short information about each transaction. Transaction cards should be combined into one block by date.

1.4.3.5.1.1 Date

The transaction date. Required.

1.4.3.5.1.2 To *Account name*

The name of the account that received the money. Required.

1.4.3.5.1.3 Description

A short description of the transaction. Optional.

1.4.3.5.1.4 Amount

The transaction amount. Required.

1.4.3.5.1.5 Currency

The transaction currency. Required.

1.4.3.5.2 Edit transaction button

Transaction card should be clickable. On click, the “Edit transaction” modal window opens.

1.4.3.6 Hide account button

A button that allows the user to hide the selected account. Before hiding the account, a confirmation modal is displayed: “Do you want to hide the *account name* account? You can get the selected account back through the Firefly interface.”

#### 1.4.4 Edit expense account

A button which opens the “Edit expense account” modal window. The button should be at the “Expense account details” modal window.

1.4.4.1 Account name

Editable text field. Required.

1.4.4.2 Account icon

Button which shows currently selected or default icon. Opens the “Select account icon” modal window. Required.

1.4.4.3 Account color

Allows to pick a color from set. Required.

1.4.4.4 Discard button

Discards all changes and restores the previously saved account values.

### 1.5 Transactions

Account balances are updated after a transaction is created, edited, or deleted.

#### 1.5.1 Income accounts → Current accounts

1.5.1.1 Record income

A modal containing the transaction form. It opens when an income account is dragged and dropped onto a current account.

1.5.1.1.1 Income account

A select picker showing all available income accounts, excluding hidden accounts. The account from which the drag started is selected by default. Required.

1.5.1.1.2 Current account

A select picker showing all available current accounts, excluding hidden accounts. The account to which dropped is selected by default. Required.

1.5.1.1.3 Amount

Number field. The amount of the transaction in the currency of current account. Required.

1.5.1.1.4 Currency

Non-editable text field near amount field. The currency of the current account. Required.

1.5.1.1.5 Date

Date field. Today’s date by default, or the first day of the selected in Parameters bar month filter. Required.

1.5.1.1.6 Description

Text field. Description of the transaction. Optional.

1.5.1.1.7 Tags

A text field for creating a new tag or searching existing tags. Optional.

1.5.1.1.8 Tags suggestions

Up to 10 existing tag suggestions displayed as badges. The suggestions are filtered based on the Tags field.

1.5.1.1.9 Cancel button

A button that closes the modal without saving changes.

1.5.1.1.10 Save button

A button that saves the transaction.

#### 1.5.2 Current accounts → Expense accounts

1.5.2.1 Record expense

A modal containing the transaction form. It opens when a current account is dragged and dropped onto an expense account.

1.5.2.1.1 Current account

A select picker showing all available current accounts, excluding hidden accounts. The account to which dropped is selected by default. Required.

1.5.2.1.2 Expense account

A select picker showing all available expense accounts, excluding hidden accounts. The account from which the drag started is selected by default. Required.

1.5.2.1.3 Amount

Number field. The amount of the transaction in the currency of current account. Required.

1.5.2.1.4 Currency

Non-editable text field near amount field. The currency of the current account. Required

1.5.2.1.5 Date

Date field. Today’s date by default, or the first day of the selected in Parameters bar month filter. Required.

1.5.2.1.6 Description 

Text field. Description of the transaction. Optional.

1.5.2.1.7 Tags 

A text field for creating a new tag or searching existing tags. Optional.

1.5.2.1.8 Tags suggestions

Up to 10 existing tag suggestions displayed as badges. The suggestions are filtered based on the Tags field.

1.5.2.1.9 Cancel button

A button that closes the modal without saving changes.

1.5.2.1.10 Save button

A button that saves the transaction.

#### 1.5.3 Current accounts → Current accounts

1.5.3.1 Record transfer

Modal window with form which opens on the drag and drop of one current account over another. 

1.5.3.1.1 From 

Select picker. Shows all available current accounts, excluding hidden accounts. By default set to the account from drag started. Required.

1.5.3.1.2 To

Select picker. Shows all the available current accounts (beside the hidden ones). By default set to the account to which the drop was made. Required.

1.5.3.1.3 Amount

A number field for the transfer amount. For accounts with the same currency, the transfer amount is entered in that currency. For accounts with different currencies, separate “Amount debited” and “Amount credited” fields are displayed, each with its corresponding currency. Required.

1.5.3.1.3.1 Amount debited

Number field. Required.

1.5.3.1.3.2 Amount credited

Number field. Required.

1.5.3.1.4 Currency

For transfers between accounts with the same currency, displays the account currency. For transfers between accounts with different currencies, the currency is displayed next to each amount field.

1.5.3.1.5 Date

Date field. Today’s date by default, or the first day of the selected in Parameters bar month filter. Required.

1.5.3.1.6 Description

Text field. Description of the transaction. Optional.

1.5.3.1.7 Tags

A text field for creating a new tag or searching existing tags. Optional.

1.5.3.1.8 Tags suggestions

Up to 10 existing tag suggestions displayed as badges. The suggestions are filtered based on the Tags field. 

1.5.3.1.9 Cancel button

A button that closes the modal without saving changes.

1.5.3.1.10 Save button

A button that saves the transaction.

### 1.6 Mutual components

#### 1.6.1 Select account icon

A modal that opens from the “Create account” (1.2.2, 1.3.2, 1.4.2) or “Edit account” (1.2.4, 1.3.4, 1.4.4) modal when the user clicks the “Select account icon” button. Select account icon button should look like an icon-button with the default or selected by the user icon inside. 

The modal displays all available icons. The currently selected icon is highlighted. Clicking an icon selects it and closes the modal. The selected icon is then displayed in the “Create account” or “Edit account” modal. Clicking outside the modal closes it without changing the previously selected icon.

#### 1.6.2 Create account

Modal window which opens when clicking on the “Add account” button (the last element in the Income, Current, and Expense accounts blocks 1.2.2, 1.3.2, 1.4.2).

Should be mutual for all 3 types of accounts. Should include all the fields which mentioned in 1.2.2, 1.3.2, 1.4.2. The set of the fields should be defined by enum AccountType = {INCOME, CURRENT, EXPENSE}. 

#### 1.6.3 Edit account

A button (1.2.3.1, 1.3.3.1, 1.4.3.1) that opens the “Edit account” modal. The button is located in the “Account details” (1.2.3, 1.3.3, 1.4.3) modal.

Edit button should look like an icon-button with pencil-icon inside.

Should be mutual for all 3 types of accounts. Should include all the fields which mentioned in 1.2.4, 1.3.4, 1.4.4. The set of the fields should be defined by enum AccountType = {INCOME, CURRENT, EXPENSE}. 

#### 1.6.4 Edit transaction

Modal window which opens inside the “Account details” (1.2.3, 1.3.3, 1.4.3) modal window, and also from History tab (2), by clicking on the “Transaction card”. (1.2.3.5.1, 1.2.3.5.2, 1.3.3.5.1, 1.3.3.5.2, 1.4.3.5.1, 1.4.3.5.2, 2.2.1). 

Should be mutual for all 3 types of accounts. 

1.6.4.1 Initial state (from-to)

Displays the original “From” and “To” accounts for the selected transaction.

1.6.4.2 From account

A select picker containing only visible income and current accounts. The account type must match the original transaction type. Required.

The available account types depend on the transaction type:

Income: Income → Current

Expense: Current → Expense

Transfer: Current → Current

1.6.4.3 To account

A select picker containing only visible current and expense accounts. The account type must match the original transaction type. Required.

The available account types depend on the transaction type:

Income: Income → Current

Expense: Current → Expense

Transfer: Current → Current

1.6.4.4 Amount

A number field for the transaction amount. Required. For transfers between current accounts with different currencies, “Debited” and “Credited” fields are displayed instead.

1.6.4.4.1 Debited

Number. Amount of money in the currency of “From” account. Required.

Near the field is the currency of the “From” account. Non-editable.

1.6.4.4.2 Credited

Number. Amount of money in the currency of “To” account. Required.

Near the field is the currency of the “To” account. Non-editable.

1.6.4.5 Date

Date field. Initial transaction date by default. Required.

1.6.4.6 Description

Text field. Description of the transaction. Optional.

1.6.4.7 Tags

A text field for creating a new tag or searching existing tags. Optional.

1.6.4.8 Tags suggestions

Up to 10 existing tag suggestions displayed as badges. The suggestions are filtered based on the Tags field.

1.6.4.9 Delete button

Before deleting the transaction, display a confirmation modal: “Delete this transaction? This action cannot be undone.”

On delete, the account balance should be updated.

1.6.4.10 Cancel button

A button that closes the modal without saving changes, also the modal window should be closable on click outside.

1.6.4.11 Save button

Saves the changes, updates the affected account balances, closes the modal, and immediately updates the transaction in the History tab.

#### 1.6.5 Account details

Modal window (1.2.3, 1.3.3, 1.4.3) which opens on click on the selected account (1.2.1, 1.3.1, 1.4.1). 

Should be mutual for all 3 types of accounts. Should include all the fields which mentioned in 1.2.3, 1.3.3, 1.4.3. The set of the fields should be defined by enum AccountType = {INCOME, CURRENT, EXPENSE}. 

## 2 History

Displays all wallet transactions grouped by date. The list uses scroll pagination.

When a transaction is created, edited, or deleted in the Budget tab, the changes should be reflected in the History tab immediately.

### 2.1 Search bar

An editable text field for searching transactions. The search applies to all available transaction information, including description, source and destination account names, currency, etc. Should work with applied Filters and Sorting. 

#### 2.1.1 Filters

A button with a “Filter” icon. When at least one filter is applied, the number of active filters is displayed next to the button. Clicking the button opens the “Filters” modal.

2.1.1.1 History scope

A select picker with three options: “All history”, “Month”, and “Date range”. “All history” is selected by default. Depending on the selected option, the corresponding additional fields are displayed.

2.1.1.1.1 All history

Doesn’t show any additional field. All history displays when applied. 

2.1.1.1.2 Month

Shows the Month picker. When applied, displays only transactions by the selected month. 

2.1.1.1.3 Date range

Displays two date pickers: “Start date” and “End date”. When applied, only transactions within the selected date range are displayed.

2.1.1.2 Transaction type

Select picker with 6 options: ”All types”, “Deposit”, “Withdrawal”, “Transfer”, “Reconciliation”, “Opening Balance”. “All types” by default.

2.1.1.3 Filter by tag

Shows all the created tags in a select picker, allows to select one tag.

2.1.1.4 Reset filters button

Reset all the filters to default.

2.1.1.5 Close button

Close the filters modal window.

#### 2.1.2 Sorting

A button with a “Sort” icon. By default, desc is selected: newest first. On click, it switches to asc: oldest first.

### 2.2 Transactions list

A scrollable list of all transactions.

2.2.1 Transaction card

Item in the transaction history list. Should show short information about each transaction. Transaction cards should be combined into one block by date.

2.2.1.1 Date

The date of the transaction. Required.

2.2.1.2 From *Account name*

The name of the account from which the money was sent. Required.

2.2.1.3 To *Account name*

The name of the account to which the money was sent. Required.

2.2.1.4 Amount

The amount of the transaction. If the currencies of “From” and “To” accounts are different, we provide “Amount debited” and “Amount credited” fields. Required.

2.2.1.4.1 Amount debited

The debited amount. Displayed in red with a “−” sign and the currency next to it.

2.2.1.4.2 Amount credited

The credited amount. Displayed in green with a “+” sign and the currency next to it.

2.2.1.5 Description

Short description of the transaction. Optional.

2.2.1.6 Tags 

A list of tags assigned to the transaction.

2.2.1.7 Transaction type

The transaction type.

2.2.1.8 Edit transaction button

Transaction card should be clickable. On click, the “Edit transaction” modal window opens.

## 3 Analytics

A block for visually displaying income and expenses.

### 3.1 Diagram

A block consisting of the following elements: a switch between Diagram and Chart (Diagram by default), a block with filters and a diagram, and a switch between Expenses and Incomes (Expenses by default).

#### 3.1.1 Filters

Filters applied to the diagram. By default: from - current month and year, to - current month and year, tags - All tags.

When no date filters are selected, the current month is displayed. The user can navigate between available months by swiping left or right on diagram. Future months cannot be selected. Three page indicator dots are displayed at the bottom: previous month, current month, and next month. If the next month has not started yet, two page indicator dots are displayed: previous month and current month. 

When navigating between months this way, the filters are updated to the month currently displayed on the diagram.

Above the filters, display the diagram title “Expense breakdown” and the currently selected period in the format Jan - Aug 2026.

3.1.1.1 From

Two fields: one for selecting the year and one for selecting the month. The selected date cannot be later than the To date.

3.1.1.2 To

Two fields: one for selecting the year and one for selecting the month. The selected date cannot be earlier than the From date.

3.1.1.3 Tags

A select picker with a list of tags. Only one tag can be selected.

#### 3.1.2 Diagram

A pie chart showing the percentage breakdown of **Expenses** for the selected period. The center of the chart should display the total amount of expenses for the selected period.

To the right of the chart, display a legend listing the Expenses shown on the chart, including the name of each Expense, its total amount for the selected period, and the color used to represent it on the chart.

#### 3.1.3 Expenses

A list of Expenses for the selected period, sorted from highest to lowest. Display the name, percentage, and amount.

#### 3.1.4 Incomes

A list of Incomes for the selected period, sorted from highest to lowest. Display the name, percentage, and amount. The diagram does not change when switching to this list.

### 3.2 Chart

A block consisting of the following elements: a switch between Diagram and Chart (Diagram by default), a block with filters and a chart, and a switch between Expenses and Incomes (Expenses by default).

#### 3.2.1 Filters

Filters applied to the chart. By default: from - January of the current year, to - current month and year, tags - All tags.

Above the filters, display the chart title “Incomes vs Expenses” on one side, and on the other side show that Incomes are represented by a green line and Expenses by a red line, along with the currently selected period in the format Jan - Aug 2026.

3.2.1.1 From

Two fields: one for selecting the year and one for selecting the month. The selected date cannot be later than the To date.

3.2.1.2 To

Two fields: one for selecting the year and one for selecting the month. The selected date cannot be earlier than the From date.

3.2.1.3 Tags

A select picker with a list of tags. Only one tag can be selected.

#### 3.2.2 Chart

A chart consisting of two curves: Incomes (green) and Expenses (red). The Y-axis represents money, and the X-axis represents months.

When hovering over the chart, a tooltip should display the Incomes and Expenses values for the selected month.

#### 3.2.3 Expenses

A list of Expenses for the selected period, sorted from highest to lowest. Display the name, percentage, and amount.

#### 3.2.4 Incomes

A list of Incomes for the selected period, sorted from highest to lowest. Display the name, percentage, and amount. The chart does not change when switching to this list.

## 4 Settings

### 4.1 Log out button

On logout, the authentication token is removed from localStorage, and the user is redirected to the login page.