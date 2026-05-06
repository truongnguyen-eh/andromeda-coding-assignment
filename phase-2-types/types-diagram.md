# Types Diagram

To render as an image, paste any diagram block below into [mermaid.live](https://mermaid.live/), or open this file in VS Code with the [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) extension.

---

## 1 — Entity Relationships with Cardinality

```mermaid
erDiagram
    CATEGORY {
        CategoryId id PK
        string name
        string visualKind
        string visualValue
    }

    TRANSACTION {
        TransactionId id PK
        number amount
        DateString date
        string note
        CategoryId categoryId FK
        TransactionType type
    }

    BUDGET {
        BudgetId id PK
        CategoryId categoryId FK
        string month
        number limitAmount
    }

    TRANSACTION_FILTER {
        DateString dateFrom
        DateString dateTo
        CategoryId[] categoryIds
        TransactionType[] types
    }

    PERSISTED_STORE {
        number version
    }

    CATEGORY ||--o{ TRANSACTION     : "1 category → 0..* transactions"
    CATEGORY ||--o{ BUDGET          : "1 category → 0..* budgets"
    BUDGET   }o--|| CATEGORY        : "each budget → exactly 1 category"
    TRANSACTION_FILTER }o--o{ CATEGORY    : "filters by 0..* categories"
    PERSISTED_STORE ||--o{ TRANSACTION    : "stores"
    PERSISTED_STORE ||--o{ CATEGORY       : "stores"
    PERSISTED_STORE ||--o{ BUDGET         : "stores"
```

---

## 2 — Type Composition (full model)

```mermaid
erDiagram
    CATEGORY_VISUAL {
        string kind
        string value
    }

    CATEGORY {
        CategoryId id PK
        string name
    }

    TRANSACTION_TYPE {
        string value
    }

    BUDGET_STATUS {
        string value
    }

    TRANSACTION {
        TransactionId id PK
        number amount
        DateString date
        string note
        CategoryId categoryId FK
    }

    BUDGET {
        BudgetId id PK
        CategoryId categoryId FK
        string month
        number limitAmount
    }

    CATEGORY       ||--||  CATEGORY_VISUAL  : "has exactly 1 visual"
    TRANSACTION    }|--||  TRANSACTION_TYPE : "has exactly 1 type"
    BUDGET         }|--||  BUDGET_STATUS    : "resolves to 1 status (derived)"
    TRANSACTION    }|--||  CATEGORY         : "belongs to 1 category"
    BUDGET         }|--||  CATEGORY         : "scoped to 1 category"
```

---

## 3 — Branded ID Safety (compile-time only)

```mermaid
flowchart LR
    S["plain string\ne.g. 'txn_123'"]

    S -->|"as TransactionId"| TID["TransactionId\nstring + __brand:TransactionId"]
    S -->|"as CategoryId"| CID["CategoryId\nstring + __brand:CategoryId"]
    S -->|"as BudgetId"| BID["BudgetId\nstring + __brand:BudgetId"]

    TID -->|"1:1 accepted"| FN["getTransaction(id: TransactionId)"]
    CID -->|"❌ type error"| FN
    BID -->|"❌ type error"| FN
```
