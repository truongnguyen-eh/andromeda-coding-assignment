import { Modal } from "@hero-design/react";
import type {
  Transaction,
  Category,
  CreatePayload,
  UpdatePayload,
} from "../../types";
import { TransactionForm } from "./TransactionForm";

interface Props {
  open: boolean;
  editing: Transaction | null;
  categories: Category[];
  onSave: (
    payload: CreatePayload<Transaction> | UpdatePayload<Transaction>,
  ) => void;
  onClose: () => void;
}

export function TransactionModal({
  open,
  editing,
  categories,
  onSave,
  onClose,
}: Props) {
  return (
    <Modal
      open={open}
      title={editing ? "Edit transaction" : "Add transaction"}
      onClose={onClose}
      size="medium"
      withPortal
    >
      <TransactionForm
        initial={editing ?? undefined}
        categories={categories}
        onSave={(payload) => {
          onSave(payload);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
}
