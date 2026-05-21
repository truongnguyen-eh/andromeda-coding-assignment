import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Transaction,
  Category,
  Budget,
  TransactionId,
  CategoryId,
  BudgetId,
  CreatePayload,
  UpdatePayload,
} from "../types";
import { newTransactionId, newCategoryId, newBudgetId } from "../lib/idFactory";
import { seedCategories, buildSeedTransactions } from "./seedData";
import { CURRENT_VERSION } from "../lib/migrations";

interface FinanceStore {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];

  addTransaction: (payload: CreatePayload<Transaction>) => void;
  updateTransaction: (payload: UpdatePayload<Transaction>) => void;
  deleteTransaction: (id: TransactionId) => void;

  addCategory: (payload: CreatePayload<Category>) => void;
  updateCategory: (payload: UpdatePayload<Category>) => void;
  deleteCategory: (id: CategoryId) => void;

  addBudget: (payload: CreatePayload<Budget>) => void;
  updateBudget: (payload: UpdatePayload<Budget>) => void;
  deleteBudget: (id: BudgetId) => void;
}

const initialCategories = seedCategories;
const initialTransactions = buildSeedTransactions(initialCategories);

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      categories: initialCategories,
      budgets: [],

      addTransaction: (payload) =>
        set((s) => ({
          transactions: [
            ...s.transactions,
            { ...payload, id: newTransactionId() },
          ],
        })),

      updateTransaction: ({ id, ...patch }) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      addCategory: (payload) =>
        set((s) => ({
          categories: [...s.categories, { ...payload, id: newCategoryId() }],
        })),

      updateCategory: ({ id, ...patch }) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        })),

      deleteCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
        })),

      addBudget: (payload) =>
        set((s) => ({
          budgets: [...s.budgets, { ...payload, id: newBudgetId() }],
        })),

      updateBudget: ({ id, ...patch }) =>
        set((s) => ({
          budgets: s.budgets.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),

      deleteBudget: (id) =>
        set((s) => ({
          budgets: s.budgets.filter((b) => b.id !== id),
        })),
    }),
    {
      name: "finance_tracker",
      storage: createJSONStorage(() => localStorage),
      version: CURRENT_VERSION,
    },
  ),
);
