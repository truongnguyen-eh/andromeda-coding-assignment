// ─── Primitives ──────────────────────────────────────────────────────────────

// ISO 8601 date string (YYYY-MM-DD). Kept as string to avoid timezone
// serialization issues when storing in localStorage or JSON.
export type DateString = string;

// Opaque ID aliases — string at runtime but distinct in the type system so
// IDs cannot be mixed across entities.
export type TransactionId = string & { readonly __brand: "TransactionId" };
export type CategoryId = string & { readonly __brand: "CategoryId" };
export type BudgetId = string & { readonly __brand: "BudgetId" };

// ─── Enums ───────────────────────────────────────────────────────────────────

// Transfer is included because moving money between accounts (e.g. savings ↔
// checking) affects neither net income nor net expenses and must be excluded
// from budget calculations.
export type TransactionType = "income" | "expense" | "transfer";

// Budget status is derived, not stored — computed at read time from spend vs
// limit. Represented as a union so UI can switch on it without magic numbers.
export type BudgetStatus = "ok" | "warning" | "exceeded";

// ─── Category ────────────────────────────────────────────────────────────────

// Kept deliberately flat. Color and icon are alternative visual identifiers;
// only one is required. Using a union rather than two optional fields makes
// the intent explicit and prevents both being undefined.
export type CategoryVisual =
  | { kind: "color"; value: string }   // CSS color string, e.g. "#ef4444"
  | { kind: "icon"; value: string };   // icon name/key from the icon set

export interface Category {
  id: CategoryId;
  name: string;
  visual: CategoryVisual;
}

// ─── Transaction ─────────────────────────────────────────────────────────────

// Amount is always positive. Directionality is expressed via `type` so that
// display and aggregation logic don't need to negate values.
export interface Transaction {
  id: TransactionId;
  amount: number;
  date: DateString;
  note: string;
  categoryId: CategoryId;
  type: TransactionType;
}

// ─── Budget ──────────────────────────────────────────────────────────────────

// Budgets are per-category per-month. Month is stored as YYYY-MM so a budget
// record can be looked up without iterating full date ranges.
export interface Budget {
  id: BudgetId;
  categoryId: CategoryId;
  month: string;        // "YYYY-MM"
  limitAmount: number;
}

// ─── Derived / View types ────────────────────────────────────────────────────

// Computed at read time by joining Budget with filtered transactions.
// Kept separate from Budget to make the distinction between stored and derived
// data explicit — nothing here should ever be persisted.
export interface BudgetSummary {
  budget: Budget;
  category: Category;
  spent: number;
  remaining: number;
  status: BudgetStatus;
}

// Monthly roll-up used by the Dashboard. Transfers are excluded from both
// income and expenses; they surface separately if needed.
export interface MonthlySummary {
  month: string;        // "YYYY-MM"
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

// ─── Filter / Query types ─────────────────────────────────────────────────────

// All fields are optional so callers can build partial filters.
// undefined means "no constraint" for that dimension.
export interface TransactionFilter {
  dateFrom?: DateString;
  dateTo?: DateString;
  categoryIds?: CategoryId[];
  types?: TransactionType[];
}

// ─── Persistence shape ────────────────────────────────────────────────────────

// The single object written to / read from localStorage. Versioned so future
// migrations can detect stale data and run upgrade paths.
export interface PersistedStore {
  version: number;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
}

// ─── Generic utilities ────────────────────────────────────────────────────────

// Omits the ID so form/create payloads don't need to supply one.
export type CreatePayload<T extends { id: unknown }> = Omit<T, "id">;

// Partial update payload — ID is required for lookup, all other fields optional.
export type UpdatePayload<T extends { id: unknown }> = Pick<T, "id"> &
  Partial<Omit<T, "id">>;
