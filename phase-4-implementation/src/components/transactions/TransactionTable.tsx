import { useMemo } from "react";
import { Table, Tag, Typography } from "@hero-design/react";
import type { Column } from "@hero-design/react/types/components/Table/types";
import type { Transaction, Category } from "../../types";

interface RowData extends Record<string, unknown> {
  id: string;
  date: string;
  note: string;
  category: string;
  categoryColor: string;
  type: string;
  amount: number;
  _original: Transaction;
}

const TYPE_INTENT: Record<string, "success" | "danger" | "primary"> = {
  income: "success",
  expense: "danger",
  transfer: "primary",
};

interface Props {
  transactions: Transaction[];
  categoryMap: Map<string, Category>;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

export function TransactionTable({
  transactions,
  categoryMap,
  onEdit,
  onDelete,
}: Props) {
  const data: RowData[] = useMemo(
    () =>
      transactions.map((t) => {
        const cat = categoryMap.get(t.categoryId);
        return {
          id: t.id,
          date: t.date,
          note: t.note || "—",
          category: cat?.name ?? "Unknown",
          categoryColor: cat?.visual.color ?? "#94a3b8",
          type: t.type,
          amount: t.amount,
          _original: t,
        };
      }),
    [transactions, categoryMap],
  );

  const columns: Column<RowData>[] = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        width: "110px",
      },
      {
        Header: "Note",
        accessor: "note",
        Cell: ({ row }) => (
          <Typography.Text fontSize={14}>{row.original.note}</Typography.Text>
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ row }) => (
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: row.original.categoryColor,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <Typography.Text fontSize={14}>
              {row.original.category}
            </Typography.Text>
          </span>
        ),
      },
      {
        Header: "Type",
        accessor: "type",
        width: "110px",
        Cell: ({ row }) => (
          <Tag
            text={row.original.type}
            variant="filled"
            intent={TYPE_INTENT[row.original.type] ?? "primary"}
            size="small"
          />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        align: "right",
        width: "120px",
        Cell: ({ row }) => {
          const sign =
            row.original.type === "income"
              ? "+"
              : row.original.type === "expense"
                ? "-"
                : "";
          const color =
            row.original.type === "income"
              ? "#16a34a"
              : row.original.type === "expense"
                ? "#dc2626"
                : "#475569";
          return (
            <Typography.Text
              fontSize={14}
              tagName="span"
              style={{ color, fontWeight: 600 }}
            >
              {sign}${row.original.amount.toFixed(2)}
            </Typography.Text>
          );
        },
      },
      {
        Header: "",
        accessor: "id",
        width: "60px",
        disableSortBy: true,
        Cell: ({ row }) => (
          <Table.RowAction
            closeOnClicked
            actions={[
              {
                key: "edit",
                text: "Edit",
                icon: "edit-2",
                onClick: () => onEdit(row.original._original),
              },
              {
                key: "delete",
                text: "Delete",
                icon: "trash-2",
                intent: "danger",
                onClick: () => onDelete(row.original._original),
              },
            ]}
          />
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <Table
      columns={columns}
      data={data}
      emptyMessage="No transactions found."
    />
  );
}
