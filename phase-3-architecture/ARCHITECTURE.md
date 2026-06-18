# Architecture — Personal Finance Tracker

## Component Tree

### App Shell

The app uses a persistent left sidebar with React Router v6. Every page renders inside the shell's `<Outlet>`.

```
App
└── AppShell                          [container — owns router outlet]
    ├── Sidebar                       [presentational — navigation links]
    └── <Outlet>
        ├── DashboardPage             [container]
        ├── TransactionsPage          [container]
        ├── BudgetsPage               [container]
        └── CategoriesPage            [container]
```

### DashboardPage

```
DashboardPage                         [container — reads store, computes summaries]
├── DashboardFilters                  [container — owns local filter state, lifts up on change]
│   ├── DateRangePicker               [presentational]
│   ├── CategoryMultiSelect           [presentational]
│   └── TypeToggleGroup               [presentational]
├── SummaryCards                      [presentational — receives {income, expenses, net}]
│   └── SummaryCard ×3
├── SpendingChart                     [presentational — receives aggregated chart data]
└── RecentTransactionList             [presentational — receives last-N transactions slice]
    └── TransactionRow                [presentational]
```

### TransactionsPage

```
TransactionsPage                      [container — owns filter state, modal open/closed]
├── TransactionFilters                [presentational — controlled]
├── TransactionTable                  [presentational — receives rows + callbacks]
│   └── TransactionRow                [local edit-mode toggle state]
│       ├── TransactionDisplay        [presentational]
│       └── TransactionInlineEditor   [presentational — controlled form fields]
├── AddTransactionButton              [presentational]
└── [Modal Portal → document.body]
    └── TransactionModal              [container — owns form state, dispatches store action]
        └── TransactionForm           [presentational — controlled]
```

### BudgetsPage

```
BudgetsPage                           [container — reads budgets + transactions, derives status]
├── MonthSelector                     [presentational — controlled]
├── BudgetGrid                        [presentational — receives BudgetViewModel[]]
│   └── BudgetCard                    [presentational — {category, spent, limit, status}]
│       └── BudgetProgressBar         [presentational]
└── AddBudgetModal                    [container — owns form state]
```

### CategoriesPage

```
CategoriesPage                        [container — reads categories, delegates mutations]
├── CategoryList                      [presentational]
│   └── CategoryItem                  [local edit-toggle state]
│       ├── CategoryDisplay           [presentational]
│       └── CategoryInlineEditor      [presentational]
└── AddCategoryForm                   [container — owns form state, inline (no modal)]
    ├── ColorPicker                   [presentational]
    └── IconPicker                    [presentational]
```

### Modal pattern

All modals are rendered via `ReactDOM.createPortal` to `document.body`. This prevents z-index stacking context conflicts with the sidebar. A shared `<Modal>` wrapper component handles the backdrop, close-on-Escape keyboard handler, and focus trapping.

---

## State Management

**Tool: Zustand** (with `persist` middleware)

### Rationale

| Option | Assessment |
|---|---|
| Context + useReducer | Every subscriber re-renders on any slice change. Multiple contexts needed to avoid this — boilerplate with no benefit at this scale. |
| Redux Toolkit | Excellent for teams; boilerplate-to-value ratio is unfavourable for a solo assignment. |
| Jotai | Atom-per-field granularity is fine but Zustand's slice pattern achieves the same ergonomics more directly. |
| **Zustand** | Minimal API, selector-based re-render control, built-in `persist` middleware, actions colocated with state. |

### Global store shape

```typescript
interface FinanceStore {
  // ── Raw entity arrays ──────────────────────────────────────────
  transactions: Transaction[];
  categories:   Category[];
  budgets:      Budget[];

  // ── Transaction actions ────────────────────────────────────────
  addTransaction(p: CreatePayload<Transaction>): void;
  updateTransaction(p: UpdatePayload<Transaction>): void;
  deleteTransaction(id: TransactionId): void;

  // ── Category actions ───────────────────────────────────────────
  addCategory(p: CreatePayload<Category>): void;
  updateCategory(p: UpdatePayload<Category>): void;
  deleteCategory(id: CategoryId): void;

  // ── Budget actions ─────────────────────────────────────────────
  addBudget(p: CreatePayload<Budget>): void;
  updateBudget(p: UpdatePayload<Budget>): void;
  deleteBudget(id: BudgetId): void;
}
```

---

## Persistence Layer

### Two-layer abstraction

**`src/lib/storage.ts`** — a plain module with no React dependency:

```typescript
const STORAGE_KEY = "finance_tracker";
const CURRENT_VERSION = 1;

function read(): PersistedStore | null   // JSON.parse + validation; returns null on error
function write(store: PersistedStore): void  // JSON.stringify inside try/catch
```

This module is the sole localStorage boundary. It is easy to test in isolation (mock `localStorage`) and easy to swap for IndexedDB or a remote API later.

**Zustand `persist` middleware** wraps the storage module, calling `write` automatically after every state-changing action (synchronous, next microtask). No manual debouncing is needed at the data volumes this app targets.

### PersistedStore → runtime store mapping

| `PersistedStore` field | Zustand store | Notes |
|---|---|---|
| `version` | handled by middleware | not exposed in `FinanceStore` interface |
| `transactions` | `transactions` | direct |
| `categories` | `categories` | direct |
| `budgets` | `budgets` | direct |

### Schema migration strategy

Migrations live in `src/lib/migrations.ts` as a versioned map of pure transform functions:

```typescript
const migrations: Record<number, (raw: unknown) => PersistedStore> = {
  1: (raw) => { /* v0 → v1 reshape */ },
};

export function runMigrations(state: unknown, fromVersion: number): PersistedStore {
  let s = state;
  for (let v = fromVersion + 1; v <= CURRENT_VERSION; v++) {
    s = migrations[v](s);
  }
  return s as PersistedStore;
}
```

Zustand `persist` calls `migrate(state, fromVersion)` automatically when the stored version is lower than `CURRENT_VERSION`. If `read()` returns `null` (corrupt or missing data) the store initialises with a safe empty state rather than crashing.

---

## Folder Structure

```
src/
├── types/
│   └── index.ts                 Re-exports all types from phase-2-types/types.ts — single import point
│
├── store/
│   └── financeStore.ts          Zustand store: state shape, CRUD actions, persist config
│
├── lib/
│   ├── storage.ts               localStorage read/write boundary (no React imports)
│   ├── migrations.ts            Versioned PersistedStore migration functions
│   └── idFactory.ts             crypto.randomUUID() wrapper with branded-type casting
│
├── hooks/
│   ├── useFilteredTransactions.ts
│   ├── useMonthlySummary.ts
│   ├── useBudgetViewModels.ts
│   └── useCategoryMap.ts
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx         Root layout: sidebar + router outlet
│   │   └── Sidebar.tsx          Navigation links
│   ├── ui/                      Shared presentational primitives: Modal, Badge, ProgressBar, SummaryCard, …
│   ├── transactions/            TransactionTable, TransactionRow, TransactionForm, TransactionModal, TransactionFilters
│   ├── budgets/                 BudgetGrid, BudgetCard, BudgetProgressBar
│   ├── categories/              CategoryList, CategoryItem, AddCategoryForm, ColorPicker, IconPicker
│   └── dashboard/               DashboardFilters, SummaryCards, SpendingChart
│
├── pages/
│   ├── DashboardPage.tsx        Container: wires store + hooks + dashboard components
│   ├── TransactionsPage.tsx     Container: filter state, modal, inline-edit orchestration
│   ├── BudgetsPage.tsx          Container: month state, budget view-model hook
│   └── CategoriesPage.tsx       Container: category CRUD
│
├── router/
│   └── index.tsx                React Router v6 route definitions
│
└── main.tsx                     Entry point: mounts App into DOM
```

**Key separation rules:**
- `types/` is the only import point for domain types. If `phase-2-types/types.ts` moves, only this barrel changes.
- `lib/` contains framework-agnostic pure modules — nothing in this folder imports React.
- `hooks/` contains only derived-state reads with `useMemo`. No mutation logic.
- `store/` contains only mutation logic (actions). No derived state.
- `pages/` are thin orchestrators that own local UI state and pass store actions down as callbacks.

---

## Trade-offs

### localStorage

- **5–10 MB quota.** Finance data at this scale fits comfortably. A `try/catch` around `write()` handles overflow gracefully without crashing.
- **No encryption.** Data is readable by any same-origin script (XSS risk) and via browser devtools. Accepted limitation for a client-only assignment; a production app would require server-side storage.
- **No query capability.** All filtering is in-process array iteration. Acceptable at hundreds to low thousands of transactions. IndexedDB with indexed queries would be the upgrade path if the dataset grows.
