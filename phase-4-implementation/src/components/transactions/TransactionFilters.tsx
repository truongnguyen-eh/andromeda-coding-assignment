import { Select, Input, Button } from "@hero-design/react";
import styled from "styled-components";
import type { TransactionFilter, TransactionType, Category } from "../../types";

const Bar = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #475569;
`;

const TYPE_OPTIONS: { text: string; value: TransactionType }[] = [
  { text: "Income", value: "income" },
  { text: "Expense", value: "expense" },
  { text: "Transfer", value: "transfer" },
];

interface Props {
  filter: TransactionFilter;
  categories: Category[];
  onChange: (filter: TransactionFilter) => void;
  onReset: () => void;
}

export function TransactionFilters({
  filter,
  categories,
  onChange,
  onReset,
}: Props) {
  const categoryOptions = categories.map((c) => ({
    text: c.name,
    value: c.id,
  }));

  return (
    <Bar>
      <Field>
        <Label>From</Label>
        <Input
          type="date"
          value={filter.dateFrom ?? ""}
          onChange={(e) =>
            onChange({ ...filter, dateFrom: e.target.value || undefined })
          }
          placeholder="From date"
        />
      </Field>

      <Field>
        <Label>To</Label>
        <Input
          type="date"
          value={filter.dateTo ?? ""}
          onChange={(e) =>
            onChange({ ...filter, dateTo: e.target.value || undefined })
          }
          placeholder="To date"
        />
      </Field>

      <Field>
        <Label>Type</Label>
        <Select
          options={TYPE_OPTIONS}
          value={filter.types?.[0]}
          onChange={(v) =>
            onChange({
              ...filter,
              types: v ? [v as TransactionType] : undefined,
            })
          }
          placeholder="All types"
          clearable
        />
      </Field>

      <Field>
        <Label>Category</Label>
        <Select
          options={categoryOptions}
          value={filter.categoryIds?.[0]}
          onChange={(v) =>
            onChange({
              ...filter,
              categoryIds: v
                ? [v as string as import("../../types").CategoryId]
                : undefined,
            })
          }
          placeholder="All categories"
          clearable
        />
      </Field>

      <Button
        variant="outlined"
        intent="primary"
        text="Reset"
        onClick={onReset}
        size="medium"
      />
    </Bar>
  );
}
