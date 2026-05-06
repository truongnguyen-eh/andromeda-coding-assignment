# Phase 1 — UI/UX Wireframes

## Deliverables

| File | Description |
|------|-------------|
| [Truong Nguyen - Personal Finance Tracker.pdf](Truong%20Nguyen%20-%20Personal%20Finance%20Tracker.pdf) | Exported wireframe PDF |
| [Interactive wireframe (Claude Design)](https://claude.ai/design/p/2d48a191-a4c0-4c90-bd09-4a791378c15b?file=Personal+Finance+Tracker+Wireframes.html&via=share) | Live interactive prototype |

---

## Screens Covered

### 1. Dashboard
- Monthly summary cards: Total Income, Total Expenses, Net Balance
- Spending breakdown chart (bar or donut)
- Recent transactions preview
- Filter controls: date range, category, type

### 2. Transaction List
- Full table: Date, Note, Category (color badge), Type chip, Amount
- Inline edit and delete per row
- Filter bar: date range picker, category multi-select, type toggle

### 3. Add / Edit Transaction Form
- Modal overlay
- Fields: Amount, Date, Type (segmented control), Category (with color swatch), Note
- Save and Cancel actions

### 4. Budget Overview
- Card grid, one card per category
- Each card shows: budget limit, amount spent, progress bar
- Color coding: green (on track), amber (>80%), red (over budget)
- "Add Budget" entry point

### 5. Category Management
- List of categories with color swatch, name, edit/delete
- "Add Category" inline form with color/icon picker

---

## Design Decisions

**Navigation:** Left sidebar with icons for Dashboard, Transactions, Budgets, Categories — keeps the primary navigation persistent and out of the content area.

**Layout aesthetic:** Clean, high-density layout (Notion/Linear style) — prioritises information over decoration, suits a power-user tool.

**Transaction type — Transfer:** A transfer moves money between accounts owned by the same user (e.g. savings → checking). It does not affect net balance, unlike income (positive) or expense (negative). The type selector uses a segmented control to make this distinction explicit at the point of entry.

**Budget progress bars:** Three-state color coding (green/amber/red) gives at-a-glance status without requiring the user to read numbers. The 80% amber threshold acts as an early warning before the limit is hit.
