// ─── Primitives ──────────────────────────────────────────────────────────────

// ISO 8601 date string (YYYY-MM-DD). Kept as string to avoid timezone
// serialization issues when storing in localStorage or JSON.
export type DateString = string;

// Opaque ID aliases using a phantom brand. At runtime these are plain strings,
// but the intersection with `{ readonly __brand }` makes each ID type
// structurally unique so the compiler rejects cross-entity ID misuse —
// e.g. passing a CategoryId where a TransactionId is expected — without any
// runtime overhead or wrapping.
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
  // Incremented whenever the shape of the store changes. On app load, if the
  // stored version differs from the current schema version, a migration path
  // can transform old data rather than silently dropping or corrupting it.
  version: number;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
}

// ─── Generic utilities ────────────────────────────────────────────────────────

// Used as the argument type for "add" service functions. The caller supplies all
// fields except `id`, which the service generates (e.g. crypto.randomUUID()).
//   addTransaction(payload: CreatePayload<Transaction>) { ... }
export type CreatePayload<T extends { id: unknown }> = Omit<T, "id">;

// Used as the argument type for "edit" service functions. `id` is required so
// the service can locate the record; every other field is optional so callers
// only send what changed — no need to re-supply the full object.
//   updateBudget(payload: UpdatePayload<Budget>) { ... }
export type UpdatePayload<T extends { id: unknown }> = Pick<T, "id"> &
  Partial<Omit<T, "id">>;

// ─── Branded ID example ───────────────────────────────────────────────────────
const category: Category = {
  id: "cat_456" as CategoryId,
  name: "Groceries",
  visual: { kind: "color", value: "#ef4444" },
};

const transaction: Transaction = {
  id: "txn_123" as TransactionId,
  amount: 100,
  date: "2024-06-01",
  note: "Grocery shopping",
  categoryId: category.id,
  type: "expense",
};

const budget: Budget = {
  id: "bud_789" as BudgetId,
  categoryId: category.id,
  month: "2024-06",
  limitAmount: 500,
};
