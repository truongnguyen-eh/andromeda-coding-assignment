import type { TransactionId, CategoryId, BudgetId } from "../types";

export const newTransactionId = (): TransactionId =>
  crypto.randomUUID() as TransactionId;

export const newCategoryId = (): CategoryId =>
  crypto.randomUUID() as CategoryId;

export const newBudgetId = (): BudgetId => crypto.randomUUID() as BudgetId;
