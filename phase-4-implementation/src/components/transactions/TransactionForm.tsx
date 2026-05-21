import { useState } from "react";
import {
  Button,
  Input,
  Select,
  DatePicker,
  Form,
  Typography,
} from "@hero-design/react";
import styled from "styled-components";
import type {
  Transaction,
  Category,
  CreatePayload,
  UpdatePayload,
  TransactionType,
} from "../../types";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Full = styled.div`
  grid-column: 1 / -1;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

interface Props {
  initial?: Transaction;
  categories: Category[];
  onSave: (
    payload: CreatePayload<Transaction> | UpdatePayload<Transaction>,
  ) => void;
  onCancel: () => void;
}

const TYPE_OPTIONS: { text: string; value: TransactionType }[] = [
  { text: "Income", value: "income" },
  { text: "Expense", value: "expense" },
  { text: "Transfer", value: "transfer" },
];

export function TransactionForm({
  initial,
  categories,
  onSave,
  onCancel,
}: Props) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = categories.map((c) => ({
    text: c.name,
    value: c.id,
  }));

  function validate() {
    const e: Record<string, string> = {};
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) e.amount = "Enter a positive amount";
    if (!date) e.date = "Select a date";
    if (!categoryId) e.category = "Select a category";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const payload = {
      amount: parseFloat(amount),
      date,
      note,
      type,
      categoryId: categoryId as Transaction["categoryId"],
    };

    if (initial) {
      onSave({ id: initial.id, ...payload } as UpdatePayload<Transaction>);
    } else {
      onSave(payload as CreatePayload<Transaction>);
    }
  }

  return (
    <Grid>
      <Form.Field validateStatus={errors.amount ? "error" : undefined}>
        <Typography.Text tagName="label" fontSize={12} fontWeight="semi-bold">
          Amount
        </Typography.Text>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrors((prev) => ({ ...prev, amount: "" }));
          }}
          prefix="dollar-sign"
          invalid={!!errors.amount}
        />
        {errors.amount && (
          <Typography.Text fontSize={12} intent="danger">
            {errors.amount}
          </Typography.Text>
        )}
      </Form.Field>

      <Form.Field validateStatus={errors.date ? "error" : undefined}>
        <Typography.Text tagName="label" fontSize={12} fontWeight="semi-bold">
          Date
        </Typography.Text>
        <DatePicker
          format="yyyy-MM-dd"
          value={date}
          onChange={(v) => {
            setDate(v ?? "");
            setErrors((prev) => ({ ...prev, date: "" }));
          }}
          invalid={!!errors.date}
          placeholder="YYYY-MM-DD"
        />
        {errors.date && (
          <Typography.Text fontSize={12} intent="danger">
            {errors.date}
          </Typography.Text>
        )}
      </Form.Field>

      <Form.Field>
        <Typography.Text tagName="label" fontSize={12} fontWeight="semi-bold">
          Type
        </Typography.Text>
        <Select
          options={TYPE_OPTIONS}
          value={type}
          onChange={(v) => setType((v ?? "expense") as TransactionType)}
        />
      </Form.Field>

      <Form.Field validateStatus={errors.category ? "error" : undefined}>
        <Typography.Text tagName="label" fontSize={12} fontWeight="semi-bold">
          Category
        </Typography.Text>
        <Select
          options={categoryOptions}
          value={categoryId}
          onChange={(v) => {
            setCategoryId(v ?? "");
            setErrors((prev) => ({ ...prev, category: "" }));
          }}
          invalid={!!errors.category}
          placeholder="Select category"
        />
        {errors.category && (
          <Typography.Text fontSize={12} intent="danger">
            {errors.category}
          </Typography.Text>
        )}
      </Form.Field>

      <Full>
        <Form.Field>
          <Typography.Text tagName="label" fontSize={12} fontWeight="semi-bold">
            Note
          </Typography.Text>
          <Input
            placeholder="Optional note…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Field>
      </Full>

      <Full>
        <Actions>
          <Button
            variant="outlined"
            intent="primary"
            text="Cancel"
            onClick={onCancel}
          />
          <Button
            variant="filled"
            intent="primary"
            text={initial ? "Save changes" : "Add transaction"}
            onClick={handleSave}
          />
        </Actions>
      </Full>
    </Grid>
  );
}
