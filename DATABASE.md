# Database Schema

This document describes the PostgreSQL database schema for the Multi-Tenant SaaS Ticket Management System.

## Overview

The database uses PostgreSQL and consists of 6 main tables that support multi-tenancy, user management, and ticket tracking.

## Entity Relationship Diagram
```
┌──────────────┐
│    users     │
└──────┬───────┘
       │
       │ created_by
       ├─────────────────────────┐
       │                         │
       │ user_id            ┌────▼──────────────┐
       ├────────────────────►│ organizations    │
       │                     └────┬──────────────┘
       │                          │
       │                          │ org_id
       │                          │
       │ user_id    ┌─────────────▼──────┐
       └────────────►│   memberships      │◄───────┐
                    └─────────┬──────────┘        │
                              │                    │
                              │ org_id             │
                              │                    │
                    ┌─────────▼──────────┐         │
                    │     tickets        │         │
                    └─────────┬──────────┘         │
                              │                    │
                 ┌────────────┼────────────┐       │
                 │            │            │       │
        ticket_id│   ticket_id│   ticket_id│       │
                 │            │            │       │
       ┌─────────▼──┐  ┌──────▼───┐  ┌────▼───────▼──┐
       │ticket_     │  │ticket_   │  │ticket_messages │
       │history     │  │messages  │  └────────────────┘
       └────────────┘  └──────────┘
```

---

## Tables

### 1. users

Stores user account information.

**Table Name:** `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email (used for login) |
| `password` | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| `name` | VARCHAR(255) | NOT NULL | User's full name |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Unique index on `email`

**Example Row:**
```sql
id: 1
email: 'john.doe@example.com'
password: '$2b$10$abcdefghijklmnopqrstuvwxyz...'
name: 'John Doe'
created_at: '2024-01-26 10:30:00'
updated_at: '2024-01-26 10:30:00'
```

---

### 2. organizations

Stores organization/tenant information.

**Table Name:** `organizations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique organization identifier |
| `name` | VARCHAR(255) | NOT NULL | Organization name |
| `description` | TEXT | NULL | Optional description |
| `created_by` | INTEGER | FOREIGN KEY → users(id) | User who created the org |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Foreign key index on `created_by`

**Relationships:**
- `created_by` references `users(id)` ON DELETE SET NULL

**Example Row:**
```sql
id: 1
name: 'Acme Corporation'
description: 'Leading software company'
created_by: 1
created_at: '2024-01-26 10:35:00'
updated_at: '2024-01-26 10:35:00'
```

---

### 3. memberships

Manages user-organization relationships and roles (multi-tenancy core).

**Table Name:** `memberships`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique membership identifier |
| `user_id` | INTEGER | FOREIGN KEY → users(id), NOT NULL | User identifier |
| `org_id` | INTEGER | FOREIGN KEY → organizations(id), NOT NULL | Organization identifier |
| `role` | VARCHAR(50) | NOT NULL, CHECK (role IN ('ADMIN', 'MEMBER')) | User role in organization |
| `joined_at` | TIMESTAMP | DEFAULT NOW() | When user joined org |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last role update timestamp |

**Constraints:**
- UNIQUE constraint on (`user_id`, `org_id`) - prevents duplicate memberships
- CHECK constraint on `role` - only 'ADMIN' or 'MEMBER' allowed

**Indexes:**
- Primary key on `id`
- Unique composite index on (`user_id`, `org_id`)
- Foreign key indexes on `user_id` and `org_id`

**Relationships:**
- `user_id` references `users(id)` ON DELETE CASCADE
- `org_id` references `organizations(id)` ON DELETE CASCADE

**Example Row:**
```sql
id: 1
user_id: 1
org_id: 1
role: 'ADMIN'
joined_at: '2024-01-26 10:35:00'
updated_at: '2024-01-26 10:35:00'
```

**Note:** This is the core multi-tenancy table. All access control checks involve this table.

---

### 4. tickets

Stores ticket information within organizations.

**Table Name:** `tickets`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique ticket identifier |
| `org_id` | INTEGER | FOREIGN KEY → organizations(id), NOT NULL | Organization owning the ticket |
| `title` | VARCHAR(255) | NOT NULL | Ticket title |
| `description` | TEXT | NULL | Detailed description |
| `status` | VARCHAR(50) | NOT NULL, CHECK | Ticket status |
| `priority` | VARCHAR(50) | NOT NULL, CHECK | Ticket priority |
| `created_by` | INTEGER | FOREIGN KEY → users(id), NOT NULL | User who created ticket |
| `assigned_to` | INTEGER | FOREIGN KEY → users(id), NULL | User assigned to ticket |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Constraints:**
- CHECK constraint on `status` - valid values: 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
- CHECK constraint on `priority` - valid values: 'LOW', 'MEDIUM', 'HIGH', 'URGENT'

**Indexes:**
- Primary key on `id`
- Index on `org_id` (for fast org-based queries)
- Index on `status` (for filtering)
- Index on `assigned_to` (for user assignments)
- Foreign key indexes

**Relationships:**
- `org_id` references `organizations(id)` ON DELETE CASCADE
- `created_by` references `users(id)` ON DELETE SET NULL
- `assigned_to` references `users(id)` ON DELETE SET NULL

**Example Row:**
```sql
id: 101
org_id: 1
title: 'Login page not working'
description: 'Users cannot login on mobile devices'
status: 'OPEN'
priority: 'HIGH'
created_by: 1
assigned_to: 5
created_at: '2024-01-26 13:00:00'
updated_at: '2024-01-26 14:00:00'
```

---

### 5. ticket_history

Tracks all changes made to tickets for auditing.

**Table Name:** `ticket_history`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique history record identifier |
| `ticket_id` | INTEGER | FOREIGN KEY → tickets(id), NOT NULL | Ticket being modified |
| `changed_by` | INTEGER | FOREIGN KEY → users(id), NOT NULL | User who made the change |
| `field_name` | VARCHAR(100) | NOT NULL | Name of field changed |
| `old_value` | TEXT | NULL | Previous value |
| `new_value` | TEXT | NULL | New value |
| `changed_at` | TIMESTAMP | DEFAULT NOW() | When change occurred |

**Indexes:**
- Primary key on `id`
- Index on `ticket_id` (for retrieving ticket history)
- Index on `changed_at` (for chronological queries)

**Relationships:**
- `ticket_id` references `tickets(id)` ON DELETE CASCADE
- `changed_by` references `users(id)` ON DELETE SET NULL

**Example Rows:**
```sql
-- Status change
id: 1001
ticket_id: 101
changed_by: 1
field_name: 'status'
old_value: 'OPEN'
new_value: 'IN_PROGRESS'
changed_at: '2024-01-26 15:00:00'

-- Assignment
id: 1002
ticket_id: 101
changed_by: 1
field_name: 'assigned_to'
old_value: NULL
new_value: '5'
changed_at: '2024-01-26 14:00:00'

-- Title update
id: 1003
ticket_id: 101
changed_by: 1
field_name: 'title'
old_value: 'Login issue'
new_value: 'Login page not working'
changed_at: '2024-01-26 13:30:00'
```

**Tracked Fields:**
- `title`
- `description`
- `status`
- `priority`
- `assigned_to`

---

### 6. ticket_messages

Stores threaded messages/comments on tickets.

**Table Name:** `ticket_messages`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unique message identifier |
| `ticket_id` | INTEGER | FOREIGN KEY → tickets(id), NOT NULL | Ticket this message belongs to |
| `user_id` | INTEGER | FOREIGN KEY → users(id), NOT NULL | User who posted message |
| `message` | TEXT | NOT NULL | Message content |
| `parent_message_id` | INTEGER | FOREIGN KEY → ticket_messages(id), NULL | Parent message (for threading) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Message creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last edit time |

**Indexes:**
- Primary key on `id`
- Index on `ticket_id` (for retrieving all messages)
- Index on `parent_message_id` (for threaded replies)
- Index on `created_at` (for chronological ordering)

**Relationships:**
- `ticket_id` references `tickets(id)` ON DELETE CASCADE
- `user_id` references `users(id)` ON DELETE SET NULL
- `parent_message_id` references `ticket_messages(id)` ON DELETE CASCADE (self-referencing)

**Example Rows:**
```sql
-- Top-level message
id: 501
ticket_id: 101
user_id: 1
message: 'I found the root cause. It is a CSS media query issue.'
parent_message_id: NULL
created_at: '2024-01-26 17:00:00'
updated_at: '2024-01-26 17:00:00'

-- Reply to message 501
id: 502
ticket_id: 101
user_id: 5
message: 'Great! Can you submit a PR?'
parent_message_id: 501
created_at: '2024-01-26 17:15:00'
updated_at: '2024-01-26 17:15:00'

-- Nested reply to message 502
id: 503
ticket_id: 101
user_id: 1
message: 'Sure, I will have it ready by EOD.'
parent_message_id: 502
created_at: '2024-01-26 17:20:00'
updated_at: '2024-01-26 17:20:00'
```

**Threading Logic:**
- `parent_message_id = NULL` → Top-level message
- `parent_message_id = X` → Reply to message X

---

## Key Relationships Summary
```
users (1) ──creates──> (M) organizations
users (M) ──belongs to──> (M) organizations [through memberships]
users (1) ──creates──> (M) tickets
users (1) ──assigned──> (M) tickets
organizations (1) ──contains──> (M) tickets
tickets (1) ──has──> (M) ticket_history
tickets (1) ──has──> (M) ticket_messages
ticket_messages (1) ──parent of──> (M) ticket_messages [self-referencing]
```

**Legend:**
- (1) = One
- (M) = Many

---

## Multi-Tenancy Implementation

### Data Isolation Strategy

All tenant-specific data is isolated using `org_id`:

1. **Organizations** are tenants
2. **Memberships** define user-tenant relationships
3. **Tickets** belong to organizations via `org_id`
4. **Access control** enforced at application layer:
   - Check if user is member of organization
   - Check user's role within organization
   - Filter all queries by `org_id`

### Sample Access Control Query
```sql
-- Check if user can access ticket
SELECT t.*
FROM tickets t
JOIN memberships m ON t.org_id = m.org_id
WHERE t.id = $1
  AND m.user_id = $2;
```

This ensures:
- User must be a member of the organization
- Ticket must belong to that organization

---

## Common Queries

### Get all organizations for a user
```sql
SELECT o.*, m.role, m.joined_at
FROM organizations o
JOIN memberships m ON o.id = m.org_id
WHERE m.user_id = $1
ORDER BY m.joined_at DESC;
```

### Get all tickets in an organization
```sql
SELECT 
  t.*,
  creator.name as created_by_name,
  assignee.name as assigned_to_name
FROM tickets t
LEFT JOIN users creator ON t.created_by = creator.id
LEFT JOIN users assignee ON t.assigned_to = assignee.id
WHERE t.org_id = $1
ORDER BY t.created_at DESC;
```

### Get ticket history
```sql
SELECT 
  th.*,
  u.name as changed_by_name
FROM ticket_history th
JOIN users u ON th.changed_by = u.id
WHERE th.ticket_id = $1
ORDER BY th.changed_at DESC;
```

### Get threaded messages for a ticket
```sql
SELECT 
  tm.*,
  u.name as user_name
FROM ticket_messages tm
JOIN users u ON tm.user_id = u.id
WHERE tm.ticket_id = $1
ORDER BY tm.created_at ASC;
```

---

## Database Setup

### 1. Create Database
```bash
createdb ticket_system
```

### 2. Run Schema
```bash
psql -U your_username -d ticket_system -f database/schema.sql
```

### 3. Verify Tables
```sql
\dt
```

Expected output:
```
              List of relations
 Schema |       Name        | Type  |  Owner   
--------+-------------------+-------+----------
 public | memberships       | table | postgres
 public | organizations     | table | postgres
 public | ticket_history    | table | postgres
 public | ticket_messages   | table | postgres
 public | tickets           | table | postgres
 public | users             | table | postgres
```

---

## Data Validation Rules

### User Table
- Email must be unique
- Email must be valid format (enforced at application layer)
- Password must be hashed (bcrypt with salt rounds ≥ 10)

### Memberships Table
- User can only have one role per organization
- Role must be either 'ADMIN' or 'MEMBER'
- At least one ADMIN must exist per organization

### Tickets Table
- Status: OPEN, IN_PROGRESS, RESOLVED, CLOSED
- Priority: LOW, MEDIUM, HIGH, URGENT
- assigned_to user must be a member of the ticket's organization

### Ticket Messages
- Message cannot be empty
- parent_message_id must reference a message in the same ticket

---

## Indexes for Performance

Current indexes optimize for:
- User authentication (email lookup)
- Organization membership checks
- Ticket filtering by org_id, status, assigned_to
- History retrieval by ticket_id
- Message threading by parent_message_id

**Future Index Considerations:**
- Full-text search on ticket title/description
- Composite index on (org_id, status, priority) for complex filters

---

## Backup & Maintenance

### Backup Database
```bash
pg_dump -U your_username ticket_system > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U your_username ticket_system < backup_20240126.sql
```

### Analyze Tables (for query optimization)
```sql
ANALYZE users;
ANALYZE organizations;
ANALYZE memberships;
ANALYZE tickets;
ANALYZE ticket_history;
ANALYZE ticket_messages;
```

---

## Migration Strategy

Currently, no migration framework is used. Schema changes should be:

1. Documented in a migration file
2. Applied manually via SQL scripts
3. Tested on staging environment first
4. Versioned with semantic versioning

**Future:** Consider adding a migration tool like `node-pg-migrate` or `db-migrate`.

---

For more information, see:
- [API Reference](./API_REFERENCE.md)
- [Architecture](./ARCHITECTURE.md)
- [Setup Guide](./SETUP.md)