# Architecture Documentation

This document describes the system architecture, design patterns, and technical decisions for the Multi-Tenant SaaS Ticket Management System.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Pattern](#architecture-pattern)
3. [Multi-Tenancy Model](#multi-tenancy-model)
4. [Authentication Flow](#authentication-flow)
5. [Authorization Flow](#authorization-flow)
6. [Request Flow](#request-flow)
7. [Layer Responsibilities](#layer-responsibilities)
8. [Design Decisions](#design-decisions)
9. [Security Architecture](#security-architecture)
10. [Scalability Considerations](#scalability-considerations)

---

## System Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│                  (Postman / API Consumers)                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     Express Application                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Middleware Layer                        │    │
│  │  • CORS                                              │    │
│  │  • Body Parser                                       │    │
│  │  • Cookie Parser                                     │    │
│  │  • Authentication Middleware                         │    │
│  │  • Role Authorization Middleware                     │    │
│  │  • Error Handler                                     │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                       │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │              Routes Layer                            │    │
│  │  • auth.routes.js                                    │    │
│  │  • organization.routes.js                            │    │
│  │  • ticket.routes.js                                  │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                       │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │            Controllers Layer                         │    │
│  │  • auth.controller.js                                │    │
│  │  • organization.controller.js                        │    │
│  │  • ticket.controller.js                              │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                       │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │             Services Layer                           │    │
│  │  • auth.service.js                                   │    │
│  │  • organization.service.js                           │    │
│  │  • ticket.service.js                                 │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                       │
│  ┌────────────────────▼────────────────────────────────┐    │
│  │              Models Layer                            │    │
│  │  • user.model.js                                     │    │
│  │  • organization.model.js                             │    │
│  │  • membership.model.js                               │    │
│  │  • ticket.model.js                                   │    │
│  │  • ticketHistory.model.js                            │    │
│  └────────────────────┬────────────────────────────────┘    │
│                       │                                       │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        │ SQL Queries
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  PostgreSQL Database                      │
│                                                           │
│  • users                • tickets                         │
│  • organizations        • ticket_history                  │
│  • memberships          • ticket_messages                 │
└───────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Runtime | Node.js | JavaScript runtime environment |
| Framework | Express.js | Web application framework |
| Database | PostgreSQL | Relational database |
| Authentication | JWT (jsonwebtoken) | Stateless authentication |
| Password Hashing | bcrypt | Secure password storage |
| Environment Config | dotenv | Environment variable management |
| HTTP Client | Native http | Cookie handling |
| CORS | cors | Cross-origin resource sharing |

---

## Architecture Pattern

### MVC + Service Layer

This project follows a **layered architecture** with clear separation of concerns:
```
Request → Middleware → Routes → Controllers → Services → Models → Database
                                                              ↓
Response ← Middleware ← Routes ← Controllers ← Services ← Models
```

#### Why MVC + Service Layer?

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Business logic in services can be tested independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features without modifying existing code
5. **Reusability**: Services can be reused across multiple controllers

### Alternative Patterns Considered

| Pattern | Why Not Chosen |
|---------|----------------|
| **Monolithic MVC** | Business logic would be scattered in controllers |
| **Repository Pattern** | Overkill for this project size; models serve this purpose |
| **Microservices** | Unnecessary complexity for a single-team backend |
| **Clean Architecture** | Too many layers for the current scope |

---

## Multi-Tenancy Model

### Organization-Based Multi-Tenancy

Each **organization** represents a separate tenant with isolated data.
```
┌─────────────────────────────────────────────────┐
│                   User Account                   │
│              (email: user@example.com)           │
└───────────┬──────────────────┬──────────────────┘
            │                  │
            │                  │
    ┌───────▼────────┐   ┌────▼──────────┐
    │  Organization A │   │ Organization B │
    │  (Acme Corp)    │   │ (TechStart)    │
    │  Role: ADMIN    │   │ Role: MEMBER   │
    └───────┬─────────┘   └────┬───────────┘
            │                  │
    ┌───────▼─────────┐   ┌────▼───────────┐
    │ Tickets (Org A) │   │ Tickets (Org B)│
    │ • Ticket #1     │   │ • Ticket #10   │
    │ • Ticket #2     │   │ • Ticket #11   │
    │ • Ticket #3     │   │ • Ticket #12   │
    └─────────────────┘   └────────────────┘
```

### Key Characteristics

1. **Single User, Multiple Organizations**
   - A user registers once
   - Can belong to multiple organizations
   - Has different roles in each organization

2. **Data Isolation**
   - All tenant data filtered by `org_id`
   - No cross-organization data access
   - Enforced at application and database level

3. **Role-Based Within Tenants**
   - Roles are organization-specific
   - `ADMIN` in Org A ≠ `ADMIN` in Org B
   - No global roles

### Data Isolation Strategy
```sql
-- Every query includes org_id filter
SELECT * FROM tickets
WHERE org_id = $1  -- Tenant isolation
  AND id = $2;     -- Resource identifier
```

### Membership Validation

Before accessing any resource:
```javascript
// 1. Check user is authenticated
// 2. Check user belongs to organization
// 3. Check user has required role
// 4. Then access resource
```

---

## Authentication Flow

### Registration Flow
```
┌──────┐                                              ┌──────────┐
│Client│                                              │ Server   │
└───┬──┘                                              └────┬─────┘
    │                                                      │
    │ POST /auth/register                                  │
    │ { email, password, name }                            │
    ├─────────────────────────────────────────────────────►│
    │                                                      │
    │                                         Validate input
    │                                                      │
    │                                      Hash password (bcrypt)
    │                                                      │
    │                                      INSERT INTO users
    │                                                      │
    │                                                      │
    │ 201 Created                                          │
    │ { user: { id, email, name } }                        │
    │◄─────────────────────────────────────────────────────┤
    │                                                      │
```

**Steps:**
1. Client sends registration data
2. Server validates email format and password strength
3. Password hashed using bcrypt (10 salt rounds)
4. User record created in database
5. User details returned (password excluded)

### Login Flow
```
┌──────┐                                              ┌──────────┐
│Client│                                              │ Server   │
└───┬──┘                                              └────┬─────┘
    │                                                      │
    │ POST /auth/login                                     │
    │ { email, password }                                  │
    ├─────────────────────────────────────────────────────►│
    │                                                      │
    │                                         Find user by email
    │                                                      │
    │                                         Compare passwords
    │                                         (bcrypt.compare)
    │                                                      │
    │                                         Generate JWT token
    │                                         (with user.id payload)
    │                                                      │
    │                                         Set HTTP-only cookie
    │                                         (optional)
    │                                                      │
    │ 200 OK                                               │
    │ { user, token }                                      │
    │◄─────────────────────────────────────────────────────┤
    │                                                      │
    │ Store token                                          │
    │                                                      │
```

**JWT Payload:**
```javascript
{
  userId: 1,
  email: "user@example.com",
  iat: 1706270400,  // Issued at
  exp: 1706875200   // Expires at (7 days later)
}
```

### Token Validation
```
┌──────┐                                              ┌──────────┐
│Client│                                              │ Server   │
└───┬──┘                                              └────┬─────┘
    │                                                      │
    │ GET /org/get-user-orgs                               │
    │ Authorization: Bearer <token>                        │
    ├─────────────────────────────────────────────────────►│
    │                                                      │
    │                                         Extract token from header
    │                                                      │
    │                                         Verify token signature
    │                                         (using JWT_SECRET)
    │                                                      │
    │                                         Check token expiration
    │                                                      │
    │                                         Decode payload → user.id
    │                                                      │
    │                                         Attach user to req.user
    │                                                      │
    │                                         Continue to controller
    │                                                      │
```

### Logout Flow
```
┌──────┐                                              ┌──────────┐
│Client│                                              │ Server   │
└───┬──┘                                              └────┬─────┘
    │                                                      │
    │ POST /auth/logout                                    │
    │ Authorization: Bearer <token>                        │
    ├─────────────────────────────────────────────────────►│
    │                                                      │
    │                                         Clear HTTP-only cookie
    │                                                      │
    │ 200 OK                                               │
    │ { message: "Logout successful" }                     │
    │◄─────────────────────────────────────────────────────┤
    │                                                      │
    │ Delete token from storage                            │
    │                                                      │
```

**Note:** Since JWT is stateless, true logout requires client-side token deletion. Server can maintain a blacklist for revoked tokens (future enhancement).

---

## Authorization Flow

### Role-Based Access Control (RBAC)
```
┌──────────────────────────────────────────────────────┐
│                   Authorization Check                 │
└───────────────────────┬──────────────────────────────┘
                        │
         ┌──────────────▼──────────────┐
         │   Is user authenticated?    │
         │   (Valid JWT token)         │
         └──────────────┬──────────────┘
                        │ Yes
         ┌──────────────▼──────────────┐
         │   Does resource belong to   │
         │   an organization?          │
         └──────────────┬──────────────┘
                        │ Yes
         ┌──────────────▼──────────────┐
         │   Is user a member of       │
         │   that organization?        │
         │   (Check memberships table) │
         └──────────────┬──────────────┘
                        │ Yes
         ┌──────────────▼──────────────┐
         │   Does user have required   │
         │   role? (ADMIN / MEMBER)    │
         └──────────────┬──────────────┘
                        │ Yes
         ┌──────────────▼──────────────┐
         │   Grant Access              │
         └─────────────────────────────┘
```

### Permission Matrix

| Action | ADMIN | MEMBER |
|--------|-------|--------|
| **Organization** | | |
| Create organization | ✓ | ✓ |
| View organization | ✓ | ✓ |
| Add members | ✓ | ✗ |
| Change roles | ✓ | ✗ |
| **Tickets** | | |
| Create ticket | ✓ | ✓ |
| View tickets | ✓ | ✓ |
| Assign ticket | ✓ | ✓ (to self) |
| Update ticket | ✓ | ✓ |
| Update status | ✓ | ✓ |
| Delete ticket | ✓ | ✗ |
| **Messages** | | |
| Add message | ✓ | ✓ |
| View messages | ✓ | ✓ |

### Authorization Middleware
```javascript
// Example: requireRole middleware
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    // 1. Get user from token (set by auth middleware)
    const userId = req.user.id;
    
    // 2. Get org_id from request (body/params/query)
    const orgId = req.body.org_id || req.params.org_id || req.query.org_id;
    
    // 3. Check membership
    const membership = await getMembership(userId, orgId);
    
    if (!membership) {
      return res.status(403).json({ 
        error: 'Not a member of this organization' 
      });
    }
    
    // 4. Check role
    if (!allowedRoles.includes(membership.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }
    
    // 5. Attach membership to request
    req.membership = membership;
    next();
  };
};

// Usage in routes
router.delete('/delete-ticket', 
  authenticate, 
  requireRole(['ADMIN']), 
  ticketController.deleteTicket
);
```

---

## Request Flow

### Complete Request Lifecycle
```
1. Client Request
   ↓
2. Express Server
   ↓
3. CORS Middleware (allow origins)
   ↓
4. Body Parser (parse JSON)
   ↓
5. Cookie Parser (parse cookies)
   ↓
6. Authentication Middleware (verify JWT)
   ↓
7. Route Handler (match endpoint)
   ↓
8. Role Middleware (check permissions)
   ↓
9. Controller (handle request/response)
   ↓
10. Service (business logic)
    ↓
11. Model (database query)
    ↓
12. PostgreSQL Database
    ↓
13. Model (return data)
    ↓
14. Service (process data)
    ↓
15. Controller (format response)
    ↓
16. Error Middleware (catch errors)
    ↓
17. Client Response
```

### Example: Create Ticket Flow
```
POST /ticket/create
Authorization: Bearer <token>
Body: { org_id: 1, title: "Bug", description: "..." }

↓

[auth.middleware.js]
- Extract token from header
- Verify JWT signature
- Decode payload → req.user = { id: 5 }
- Continue

↓

[ticket.routes.js]
- Match route: POST /ticket/create
- Apply role middleware: requireRole(['ADMIN', 'MEMBER'])

↓

[role.middleware.js]
- Get org_id from body: org_id = 1
- Query memberships: WHERE user_id=5 AND org_id=1
- Check role: 'MEMBER' in ['ADMIN', 'MEMBER'] → ✓
- req.membership = { role: 'MEMBER', org_id: 1 }
- Continue

↓

[ticket.controller.js]
- Extract data from req.body
- Call ticketService.createTicket(data, req.user.id)

↓

[ticket.service.js]
- Validate input (title, description, priority, status)
- Prepare ticket data
- Call ticketModel.create(ticketData)

↓

[ticket.model.js]
- Execute SQL INSERT
- Return ticket object

↓

[ticket.service.js]
- Log history: ticketHistoryModel.create(...)
- Return ticket to controller

↓

[ticket.controller.js]
- Format response
- Send 201 Created with ticket data

↓

Client receives response
```

---

## Layer Responsibilities

### 1. Routes Layer (`src/routes/`)

**Purpose:** Define API endpoints and attach middlewares

**Responsibilities:**
- Map HTTP methods to controller functions
- Apply authentication middleware
- Apply role-based authorization
- Group related endpoints

**Example:**
```javascript
// ticket.routes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

router.post('/create', 
  authenticate, 
  requireRole(['ADMIN', 'MEMBER']), 
  ticketController.createTicket
);

router.delete('/delete-ticket', 
  authenticate, 
  requireRole(['ADMIN']), 
  ticketController.deleteTicket
);

module.exports = router;
```

### 2. Controllers Layer (`src/controllers/`)

**Purpose:** Handle HTTP request/response

**Responsibilities:**
- Extract data from request (body, params, query)
- Call appropriate service methods
- Format and send responses
- Handle HTTP status codes
- NO business logic

**Example:**
```javascript
// ticket.controller.js
const ticketService = require('../services/ticket.service');

const createTicket = async (req, res, next) => {
  try {
    const { org_id, title, description, priority, status } = req.body;
    const userId = req.user.id;
    
    const ticket = await ticketService.createTicket({
      org_id,
      title,
      description,
      priority,
      status,
      created_by: userId
    });
    
    res.status(201).json({
      success: true,
      data: { ticket },
      message: 'Ticket created successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTicket };
```

### 3. Services Layer (`src/services/`)

**Purpose:** Implement business logic

**Responsibilities:**
- Validate business rules
- Coordinate multiple model calls
- Transform data
- Handle complex operations
- Return processed data
- NO HTTP-specific code

**Example:**
```javascript
// ticket.service.js
const ticketModel = require('../models/ticket.model');
const ticketHistoryModel = require('../models/ticketHistory.model');

const createTicket = async (ticketData) => {
  // Validate business rules
  if (!ticketData.title || ticketData.title.trim().length === 0) {
    throw new Error('Title is required');
  }
  
  // Set defaults
  ticketData.status = ticketData.status || 'OPEN';
  ticketData.priority = ticketData.priority || 'MEDIUM';
  
  // Create ticket
  const ticket = await ticketModel.create(ticketData);
  
  // Log creation in history
  await ticketHistoryModel.create({
    ticket_id: ticket.id,
    changed_by: ticketData.created_by,
    field_name: 'created',
    old_value: null,
    new_value: 'Ticket created'
  });
  
  return ticket;
};

module.exports = { createTicket };
```

### 4. Models Layer (`src/models/`)

**Purpose:** Interact with database

**Responsibilities:**
- Execute SQL queries
- Map database rows to objects
- Return raw data
- NO business logic
- NO validation

**Example:**
```javascript
// ticket.model.js
const pool = require('../config/db');

const create = async (ticketData) => {
  const query = `
    INSERT INTO tickets 
      (org_id, title, description, priority, status, created_by, assigned_to)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  
  const values = [
    ticketData.org_id,
    ticketData.title,
    ticketData.description,
    ticketData.priority,
    ticketData.status,
    ticketData.created_by,
    ticketData.assigned_to || null
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { create };
```

### 5. Middlewares Layer (`src/middlewares/`)

**Purpose:** Process requests before controllers

**Types:**

**a) Authentication Middleware**
```javascript
// auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    // Extract token
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request
    req.user = { id: decoded.userId, email: decoded.email };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticate };
```

**b) Role Middleware**
```javascript
// role.middleware.js
const membershipModel = require('../models/membership.model');

const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const orgId = req.body.org_id || req.params.org_id || req.query.org_id;
      
      // Get membership
      const membership = await membershipModel.findByUserAndOrg(userId, orgId);
      
      if (!membership) {
        return res.status(403).json({ 
          error: 'Not a member of this organization' 
        });
      }
      
      // Check role
      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions' 
        });
      }
      
      req.membership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { requireRole };
```

**c) Error Handling Middleware**
```javascript
// error.middleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(400).json({
      success: false,
      error: 'Resource already exists'
    });
  }
  
  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: 'Referenced resource not found'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
};

module.exports = { errorHandler };
```

### 6. Utils Layer (`src/utils/`)

**Purpose:** Reusable helper functions

**Example:**
```javascript
// jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
```

---

## Design Decisions

### 1. Why PostgreSQL over MongoDB?

**Decision:** Use PostgreSQL

**Rationale:**
- **Relationships:** Complex relationships (users ↔ orgs ↔ tickets)
- **ACID Compliance:** Critical for multi-tenancy and data integrity
- **Foreign Keys:** Enforce referential integrity
- **Transactions:** Support for complex operations
- **Mature Ecosystem:** Better tooling and support

**Trade-offs:**
- Less flexible schema changes
- Requires schema definition upfront

### 2. Why JWT over Session-Based Auth?

**Decision:** Use JWT tokens

**Rationale:**
- **Stateless:** No server-side session storage needed
- **Scalable:** Easy to scale horizontally
- **API-friendly:** Works well with API consumers
- **Cross-domain:** Can be used across different domains

**Trade-offs:**
- Cannot revoke tokens easily (need blacklist)
- Tokens can become large with lots of claims
- Need to store on client side

### 3. Why Bcrypt over Argon2?

**Decision:** Use bcrypt

**Rationale:**
- **Battle-tested:** Widely used and trusted
- **Good enough:** 10 salt rounds provides strong security
- **Simple:** Easy to implement
- **Compatible:** Works on all platforms

**Trade-offs:**
- Argon2 is technically more secure
- Bcrypt slower than some alternatives

### 4. Why No ORM?

**Decision:** Use raw SQL with parameterized queries

**Rationale:**
- **Performance:** No ORM overhead
- **Control:** Full control over queries
- **Transparency:** See exactly what queries run
- **Learning:** Better understanding of SQL

**Trade-offs:**
- More boilerplate code
- Manual query writing
- No automatic migrations

### 5. Why Organization-Based Multi-Tenancy?

**Decision:** Use shared database with org_id isolation

**Rationale:**
- **Cost-effective:** Single database for all tenants
- **Simple:** Easy to implement and maintain
- **Flexible:** Users can belong to multiple orgs
- **Scalable:** Can handle many tenants

**Alternatives Considered:**
- **Database-per-tenant:** Too expensive, hard to manage
- **Schema-per-tenant:** Complex, migration nightmares

### 6. Why Role-Based (not Scope-Based)?

**Decision:** Simple role-based authorization

**Rationale:**
- **Simplicity:** Only 2 roles (ADMIN, MEMBER)
- **Sufficient:** Covers all use cases
- **Easy to understand:** Clear permission model

**Trade-offs:**
- Less granular control
- May need to add more roles in future

---

## Security Architecture

### Defense in Depth
```
┌─────────────────────────────────────────┐
│         1. Network Layer                │
│         • HTTPS/TLS                     │
│         • Firewall                      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         2. Application Layer            │
│         • CORS                          │
│         • Rate Limiting (future)        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         3. Authentication               │
│         • JWT validation                │
│         • Token expiration              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         4. Authorization                │
│         • Role-based access             │
│         • Organization membership       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         5. Data Layer                   │
│         • Parameterized queries         │
│         • Input validation              │
│         • SQL injection prevention      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         6. Database Layer               │
│         • Row-level security (future)   │
│         • Encrypted connections         │
└─────────────────────────────────────────┘
```

### Security Measures

| Threat | Mitigation |
|--------|------------|
| **SQL Injection** | Parameterized queries, input sanitization |
| **XSS** | Input validation, output encoding (future) |
| **CSRF** | CSRF tokens (future), SameSite cookies |
| **Brute Force** | Rate limiting (future), account lockout (future) |
| **Token Theft** | HTTP-only cookies, short expiration |
| **Data Leakage** | Organization-level isolation, role checks |
| **Password Leaks** | Bcrypt hashing, salting |

---

## Scalability Considerations

### Current Limitations

1. **Single Server:** No horizontal scaling yet
2. **No Caching:** Every request hits database
3. **No CDN:** Static assets served from app
4. **Connection Pool:** Limited database connections
