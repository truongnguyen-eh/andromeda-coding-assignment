import { useMemo } from "react";
import { useFinanceStore } from "../store/financeStore";
import type { Transaction, TransactionFilter } from "../types";

export function useFilteredTransactions(
  filter: TransactionFilter,
): Transaction[] {
  const transactions = useFinanceStore((s) => s.transactions);

  return useMemo(() => {
    return transactions
      .filter((t) => {
        if (filter.dateFrom && t.date < filter.dateFrom) return false;
        if (filter.dateTo && t.date > filter.dateTo) return false;
        if (
          filter.categoryIds &&
          filter.categoryIds.length > 0 &&
          !filter.categoryIds.includes(t.categoryId)
        )
          return false;
        if (
          filter.types &&
          filter.types.length > 0 &&
          !filter.types.includes(t.type)
        )
          return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filter]);
}
