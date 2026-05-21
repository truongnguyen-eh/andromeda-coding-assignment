import { useState } from "react";
import { Button, Typography } from "@hero-design/react";
import styled from "styled-components";
import { useFinanceStore } from "../store/financeStore";
import { useFilteredTransactions } from "../hooks/useFilteredTransactions";
import { useCategoryMap } from "../hooks/useCategoryMap";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { TransactionTable } from "../components/transactions/TransactionTable";
import { TransactionModal } from "../components/transactions/TransactionModal";
import type {
  Transaction,
  TransactionFilter,
  CreatePayload,
  UpdatePayload,
} from "../types";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const EMPTY_FILTER: TransactionFilter = {};

export function TransactionsPage() {
  const { addTransaction, updateTransaction, deleteTransaction, categories } =
    useFinanceStore();
  const categoryMap = useCategoryMap();

  const [filter, setFilter] = useState<TransactionFilter>(EMPTY_FILTER);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const filtered = useFilteredTransactions(filter);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(t: Transaction) {
    setEditing(t);
    setModalOpen(true);
  }

  function handleSave(
    payload: CreatePayload<Transaction> | UpdatePayload<Transaction>,
  ) {
    if ("id" in payload) {
      updateTransaction(payload as UpdatePayload<Transaction>);
    } else {
      addTransaction(payload as CreatePayload<Transaction>);
    }
  }

  function handleDelete(t: Transaction) {
    if (window.confirm(`Delete "${t.note || "this transaction"}"?`)) {
      deleteTransaction(t.id);
    }
  }

  return (
    <>
      <Header>
        <Typography.Text fontSize={18} fontWeight="bold">
          Transactions
        </Typography.Text>
        <Button
          variant="filled"
          intent="primary"
          text="Add transaction"
          icon="plus"
          onClick={openAdd}
        />
      </Header>

      <TransactionFilters
        filter={filter}
        categories={categories}
        onChange={setFilter}
        onReset={() => setFilter(EMPTY_FILTER)}
      />

      <TransactionTable
        transactions={filtered}
        categoryMap={categoryMap}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <TransactionModal
        open={modalOpen}
        editing={editing}
        categories={categories}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
