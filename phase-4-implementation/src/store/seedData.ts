import type { Category, Transaction } from "../types";
import { newCategoryId, newTransactionId } from "../lib/idFactory";

export const seedCategories: Category[] = [
  {
    id: newCategoryId(),
    name: "Salary",
    type: "income",
    visual: { color: "#22c55e", icon: "dollar-sign" },
  },
  {
    id: newCategoryId(),
    name: "Groceries",
    type: "expense",
    visual: { color: "#ef4444", icon: "shopping-cart" },
  },
  {
    id: newCategoryId(),
    name: "Transport",
    type: "expense",
    visual: { color: "#f97316", icon: "car" },
  },
  {
    id: newCategoryId(),
    name: "Entertainment",
    type: "expense",
    visual: { color: "#8b5cf6", icon: "film" },
  },
  {
    id: newCategoryId(),
    name: "Utilities",
    type: "expense",
    visual: { color: "#3b82f6", icon: "zap" },
  },
];

export function buildSeedTransactions(categories: Category[]): Transaction[] {
  const salary = categories.find((c) => c.name === "Salary")!;
  const groceries = categories.find((c) => c.name === "Groceries")!;
  const transport = categories.find((c) => c.name === "Transport")!;
  const entertainment = categories.find((c) => c.name === "Entertainment")!;
  const utilities = categories.find((c) => c.name === "Utilities")!;

  return [
    {
      id: newTransactionId(),
      amount: 5000,
      date: "2025-05-01",
      note: "May salary",
      categoryId: salary.id,
      type: "income",
    },
    {
      id: newTransactionId(),
      amount: 120,
      date: "2025-05-03",
      note: "Weekly groceries",
      categoryId: groceries.id,
      type: "expense",
    },
    {
      id: newTransactionId(),
      amount: 45,
      date: "2025-05-05",
      note: "Monthly bus pass",
      categoryId: transport.id,
      type: "expense",
    },
    {
      id: newTransactionId(),
      amount: 18,
      date: "2025-05-07",
      note: "Netflix subscription",
      categoryId: entertainment.id,
      type: "expense",
    },
    {
      id: newTransactionId(),
      amount: 85,
      date: "2025-05-10",
      note: "Electricity bill",
      categoryId: utilities.id,
      type: "expense",
    },
    {
      id: newTransactionId(),
      amount: 95,
      date: "2025-05-12",
      note: "Supermarket run",
      categoryId: groceries.id,
      type: "expense",
    },
    {
      id: newTransactionId(),
      amount: 200,
      date: "2025-05-14",
      note: "Concert tickets",
      categoryId: entertainment.id,
      type: "expense",
    },
    {
      id: newTransactionId(),
      amount: 30,
      date: "2025-05-16",
      note: "Petrol",
      categoryId: transport.id,
      type: "expense",
    },
  ];
}
