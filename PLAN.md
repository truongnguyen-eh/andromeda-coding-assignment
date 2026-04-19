# Phase 1:
## Step 1: Ask AI to clarify requirements and ask questions if needed
- Question: What does transfer means, how does it different with income/expense?
## Step 2: Draw iframe using different AI design tool:
- Stitch
- Claude Design
Prompt:

```
Design a **Personal Finance Tracker** web application with the following screens.
Use a clean, modern dashboard aesthetic — think Notion meets Linear.
Dark or light theme is fine. Prioritize clarity and information density over decoration.

## Screens to generate

### 1. Dashboard
- Monthly summary cards: Total Income, Total Expenses, Net Balance
- Spending breakdown chart (bar or donut)
- Recent transactions list preview
- Filter controls at the top: date range, category, type

### 2. Transaction List
- Full transaction table with columns: Date, Note, Category (color badge), Type (Income / Expense / Transfer chip), Amount
- Inline edit and delete actions per row
- Filter bar: date range picker, category multi-select, type toggle

### 3. Add / Edit Transaction Form
- Modal or side panel
- Fields: Amount (prominent, large input), Date picker, Type selector (segmented control: Income / Expense / Transfer), Category dropdown (with color swatch), Note textarea
- Save and Cancel actions

### 4. Budget Overview
- Card grid, one card per category
- Each card: category name + color/icon, monthly budget limit, amount spent, progress bar
  - Red when over budget, amber when >80%, green otherwise
- "Add Budget" button

### 5. Category Management
- List of categories: color swatch or icon, name, edit/delete actions
- "Add Category" button opening an inline form with name field and color/icon picker

## Design constraints

- **Navigation:** left sidebar with icons for Dashboard, Transactions, Budgets, Categories
- **Typography:** system font stack or Inter
- **Spacing:** generous padding, 8px grid
- **States to show:**
  - At least one over-budget category card
  - One expense and one income row in the transaction list
  - An open modal for the Add Transaction form
```
## Step 3: Adjust based on result
