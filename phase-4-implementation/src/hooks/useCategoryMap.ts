import { useMemo } from "react";
import { useFinanceStore } from "../store/financeStore";
import type { CategoryId, Category } from "../types";

export function useCategoryMap(): Map<CategoryId, Category> {
  const categories = useFinanceStore((s) => s.categories);
  return useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
}
