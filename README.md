# 💰 Personal Finance Tracker — Team Technical Assignment

## Overview

Build a Personal Finance Tracker web application using React and TypeScript. The requirements below define what the app must do — the design, architecture, and implementation approach are left open. Code, structure, and written deliverables are all part of the evaluation.

There is no prescribed folder structure, no mandated state management library, and no required patterns. Engineering judgment is part of the assignment.

---

## Functional Requirements

### Transactions

- Users can add, edit, and delete transactions
- Each transaction has: amount, date, note, category, and a type (income, expense, or transfer)
- Transactions must be persisted — refreshing the page should not lose data

### Categories

- Users can create and manage custom categories
- Each category has a name and a visual identifier (color or icon)

### Budgets

- Users can set a monthly budget limit per category
- The app must clearly indicate when spending in a category has exceeded its budget

### Dashboard

- Show a monthly summary: total income, total expenses, net balance
- Include at least one chart visualizing spending (type and design are open)
- Users can filter transactions by date range, category, and type

---

## Non-Functional Requirements

- The codebase must be written in TypeScript with strict mode enabled
- The app must run locally with a single command:
  ```
  npm install && npm run dev
  ```
  or equivalent
- The UI does not need to be polished, but must be functional and usable

---

## What Is Deliberately Left Open

These decisions are not prescribed. How they are handled is part of what is being evaluated:

- Folder and file structure
- State management approach and tooling
- TypeScript type modeling strategy
- Where business logic lives
- How (or whether) the persistence layer is abstracted
- Error handling approach
- Performance considerations
- Component reusability strategy

---

## Phases

Work through the phases in order. No code is written until Phase 3.

### Phase 1 — UI/UX Mockup

Create low-fidelity wireframes for the application. Any tool is acceptable: pen and paper, Figma, Excalidraw, etc.

Cover at minimum:

- Dashboard / summary view
- Transaction list with filters
- Add/edit transaction form
- Budget overview screen
- Navigation structure

Visual polish is not required — clarity of thinking matters more than aesthetics.

**Deliverable:** Wireframe file or exported images committed to the repository.

---

### Phase 2 — Data Modeling & TypeScript Design

Write a `types.ts` file — no component code, no UI, just the full TypeScript domain model.

Must include:

- All entity types (`Transaction`, `Category`, `Budget`, etc.)
- Any enums or union types
- Any generic or utility types deemed necessary
- A short comment on each type explaining the design decision behind it

**Deliverable:** `types.ts` file.

---

### Phase 3 — System & Architecture Design

Write an `ARCHITECTURE.md` document before writing any implementation code.

Must cover:

- **Component tree** — how the UI breaks down into components (a diagram or indented list is fine)
- **State management** — what tool is used, what state lives where, and the reasoning
- **Persistence layer** — how the app stores and retrieves data
- **Folder structure** — the intended directory tree with a one-line explanation per folder
- **Trade-offs** — weaknesses of the chosen approach

**Deliverable:** `ARCHITECTURE.md`.

---

### Phase 4 — Core Feature Implementation

Implement one feature slice end-to-end with Hero Design — not the whole app. Pick one:

- Transaction CRUD (add, edit, delete, list with filters)
- Budget management with over-budget indicators
- Dashboard summary with one chart

**Rules:**

- Must use the types defined in Phase 2
- Must follow the architecture documented in Phase 3
- State management and folder structure must match what was documented

**Deliverable:** Working feature.

---

## Phase Summary

| Phase | Deliverable       | Primary Skill Tested                  |
|-------|-------------------|---------------------------------------|
| 1     | Wireframes        | UX thinking, feature prioritization   |
| 2     | `types.ts`        | TypeScript depth, domain modeling     |
| 3     | `ARCHITECTURE.md` | System design, trade-off reasoning    |
| 4     | One feature slice | Execution, consistency with prior decisions |

