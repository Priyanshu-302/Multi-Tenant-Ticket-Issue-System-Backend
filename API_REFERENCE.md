# API Reference

Complete API documentation for the Multi-Tenant SaaS Ticket Management System.

## Base URL
```
http://localhost:5000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the request header:
```
Authorization: Bearer <your-jwt-token>
```

Or use HTTP-only cookies (set automatically on login).

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## Authentication Endpoints

### 1. Register User

Register a new user account.

**Endpoint:** `POST /auth/register`

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-01-26T10:30:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400` - Email already exists
- `400` - Invalid email format
- `400` - Password too weak

**Example (curl):**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

---

### 2. Login User

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `401` - Invalid credentials
- `404` - User not found

**Example (curl):**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

### 3. Logout User

Logout user and invalidate token.

**Endpoint:** `POST /auth/logout`

**Authentication Required:** Yes

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <your-token>"
```

---

## Organization Endpoints

### 4. Create Organization

Create a new organization. Creator automatically becomes ADMIN.

**Endpoint:** `POST /org/create`

**Authentication Required:** Yes

**Role Required:** Any authenticated user

**Request Body:**
```json
{
  "name": "Acme Corporation"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "Acme Corporation",
      "created_at": "2024-01-26T10:30:00.000Z"
    }
  },
  "message": "Organization created successfully"
}
```

**Error Responses:**
- `400` - Organization name required
- `401` - Unauthorized

**Example (curl):**
```bash
curl -X POST http://localhost:3000/org/create \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "description": "Leading software company"
  }'
```

---

### 5. Add Member to Organization

Add a user to an organization.

**Endpoint:** `POST /org/add-member`

**Authentication Required:** Yes

**Role Required:** ADMIN

**Request Body:**
```json
{
  "org_id": 1,
  "user_id": 5,
  "role": "MEMBER"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "membership": {
      "user_id": 5,
      "org_id": 1,
      "role": "MEMBER",
      "joined_at": "2024-01-26T11:00:00.000Z"
    }
  },
  "message": "Member added successfully"
}
```

**Error Responses:**
- `403` - Only admins can add members
- `404` - User or organization not found
- `400` - User already a member

**Example (curl):**
```bash
curl -X POST http://localhost:3000/org/add-member \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "user_id": 5,
    "role": "MEMBER"
  }'
```

---

### 6. Get User Organizations

Get all organizations the authenticated user belongs to.

**Endpoint:** `GET /org/get-user-orgs`

**Authentication Required:** Yes

**Role Required:** Any authenticated user

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": 1,
        "name": "Acme Corporation",
        "description": "Leading software company",
        "role": "ADMIN",
        "joined_at": "2024-01-26T10:30:00.000Z"
      },
      {
        "id": 2,
        "name": "Tech Startup Inc",
        "description": "Innovation hub",
        "role": "MEMBER",
        "joined_at": "2024-01-25T09:00:00.000Z"
      }
    ]
  },
  "message": "Organizations retrieved successfully"
}
```

**Example (curl):**
```bash
curl -X GET http://localhost:3000/org/get-user-orgs \
  -H "Authorization: Bearer <your-token>"
```

---

### 7. Change User Role

Change a member's role within an organization.

**Endpoint:** `PUT /org/change-user-role`

**Authentication Required:** Yes

**Role Required:** ADMIN

**Request Body:**
```json
{
  "org_id": 1,
  "user_id": 5,
  "new_role": "ADMIN"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "membership": {
      "user_id": 5,
      "org_id": 1,
      "role": "ADMIN",
      "updated_at": "2024-01-26T12:00:00.000Z"
    }
  },
  "message": "Role updated successfully"
}
```

**Error Responses:**
- `403` - Only admins can change roles
- `404` - User or organization not found
- `400` - Invalid role

**Valid Roles:** `ADMIN`, `MEMBER`

**Example (curl):**
```bash
curl -X PUT http://localhost:3000/org/change-user-role \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "user_id": 5,
    "new_role": "ADMIN"
  }'
```

---

## Ticket Endpoints

### 8. Create Ticket

Create a new ticket in an organization.

**Endpoint:** `POST /ticket/create`

**Authentication Required:** Yes

**Role Required:** MEMBER or ADMIN

**Request Body:**
```json
{
  "org_id": 1,
  "title": "Login page not working",
  "description": "Users cannot login on mobile devices",
  "priority": "HIGH",
  "status": "OPEN"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "id": 101,
      "org_id": 1,
      "title": "Login page not working",
      "description": "Users cannot login on mobile devices",
      "priority": "HIGH",
      "status": "OPEN",
      "created_by": 1,
      "assigned_to": null,
      "created_at": "2024-01-26T13:00:00.000Z"
    }
  },
  "message": "Ticket created successfully"
}
```

**Error Responses:**
- `403` - User not a member of organization
- `400` - Invalid priority or status

**Valid Priority:** `LOW`, `MEDIUM`, `HIGH`, `URGENT`
**Valid Status:** `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

**Example (curl):**
```bash
curl -X POST http://localhost:3000/ticket/create \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": 1,
    "title": "Login page not working",
    "description": "Users cannot login on mobile devices",
    "priority": "HIGH",
    "status": "OPEN"
  }'
```

---

### 9. Get Tickets

Get all tickets for an organization.

**Endpoint:** `GET /ticket/get-tickets`

**Authentication Required:** Yes

**Role Required:** MEMBER or ADMIN

**Query Parameters:**
- `org_id` (required) - Organization ID
- `status` (optional) - Filter by status
- `assigned_to` (optional) - Filter by assigned user

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": 101,
        "org_id": 1,
        "title": "Login page not working",
        "description": "Users cannot login on mobile devices",
        "priority": "HIGH",
        "status": "OPEN",
        "created_by": 1,
        "creator_name": "John Doe",
        "assigned_to": null,
        "assignee_name": null,
        "created_at": "2024-01-26T13:00:00.000Z",
        "updated_at": "2024-01-26T13:00:00.000Z"
      }
    ]
  },
  "message": "Tickets retrieved successfully"
}
```

**Error Responses:**
- `403` - User not a member of organization
- `400` - Organization ID required

**Example (curl):**
```bash
curl -X GET "http://localhost:3000/ticket/get-tickets?org_id=1&status=OPEN" \
  -H "Authorization: Bearer <your-token>"
```

---

### 10. Assign Ticket

Assign a ticket to a user.

**Endpoint:** `PUT /ticket/assign-ticket`

**Authentication Required:** Yes

**Role Required:** ADMIN or MEMBER (can assign to themselves)

**Request Body:**
```json
{
  "ticket_id": 101,
  "assigned_to": 5
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "id": 101,
      "assigned_to": 5,
      "assignee_name": "Jane Smith",
      "updated_at": "2024-01-26T14:00:00.000Z"
    }
  },
  "message": "Ticket assigned successfully"
}
```

**Error Responses:**
- `403` - Permission denied
- `404` - Ticket not found
- `400` - Assignee not a member of organization

**Example (curl):**
```bash
curl -X PUT http://localhost:3000/ticket/assign-ticket \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": 101,
    "assigned_to": 5
  }'
```

---

### 11. Update Ticket Status

Update the status of a ticket.

**Endpoint:** `PUT /ticket/update-ticket-status`

**Authentication Required:** Yes

**Role Required:** MEMBER or ADMIN

**Request Body:**
```json
{
  "ticket_id": 101,
  "status": "IN_PROGRESS"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "id": 101,
      "status": "IN_PROGRESS",
      "updated_at": "2024-01-26T15:00:00.000Z"
    }
  },
  "message": "Ticket status updated successfully"
}
```

**Error Responses:**
- `403` - Permission denied
- `404` - Ticket not found
- `400` - Invalid status

**Valid Status:** `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

**Example (curl):**
```bash
curl -X PUT http://localhost:3000/ticket/update-ticket-status \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": 101,
    "status": "IN_PROGRESS"
  }'
```

---

### 12. Update Ticket

Update ticket title, description, or priority.

**Endpoint:** `PUT /ticket/update-ticket`

**Authentication Required:** Yes

**Role Required:** MEMBER or ADMIN

**Request Body:**
```json
{
  "ticket_id": 101,
  "title": "Login page not working on mobile",
  "description": "Updated description with more details",
  "priority": "URGENT"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "id": 101,
      "title": "Login page not working on mobile",
      "description": "Updated description with more details",
      "priority": "URGENT",
      "updated_at": "2024-01-26T16:00:00.000Z"
    }
  },
  "message": "Ticket updated successfully"
}
```

**Error Responses:**
- `403` - Permission denied
- `404` - Ticket not found

**Example (curl):**
```bash
curl -X PUT http://localhost:3000/ticket/update-ticket \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": 101,
    "title": "Login page not working on mobile",
    "description": "Updated description with more details",
    "priority": "URGENT"
  }'
```

---

### 13. Delete Ticket

Delete a ticket permanently.

**Endpoint:** `DELETE /ticket/delete-ticket`

**Authentication Required:** Yes

**Role Required:** ADMIN only

**Request Body:**
```json
{
  "ticket_id": 101
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

**Error Responses:**
- `403` - Only admins can delete tickets
- `404` - Ticket not found

**Example (curl):**
```bash
curl -X DELETE http://localhost:3000/ticket/delete-ticket \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": 101
  }'
```

---

### 14. Add Ticket Message

Add a comment/message to a ticket (threaded discussion).

**Endpoint:** `POST /ticket/add-ticket-message`

**Authentication Required:** Yes

**Role Required:** MEMBER or ADMIN

**Request Body:**
```json
{
  "ticket_id": 101,
  "message": "I found the root cause. It's a CSS media query issue.",
  "parent_message_id": null
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": 501,
      "ticket_id": 101,
      "user_id": 1,
      "user_name": "John Doe",
      "message": "I found the root cause. It's a CSS media query issue.",
      "parent_message_id": null,
      "created_at": "2024-01-26T17:00:00.000Z"
    }
  },
  "message": "Message added successfully"
}
```

**Error Responses:**
- `403` - Permission denied
- `404` - Ticket not found
- `400` - Message cannot be empty

**Note:** Use `parent_message_id` for threaded replies

**Example (curl):**
```bash
curl -X POST http://localhost:3000/ticket/add-ticket-message \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": 101,
    "message": "I found the root cause. It'\''s a CSS media query issue.",
    "parent_message_id": null
  }'
```

---

### 15. Get Ticket Messages

Get all messages/comments for a ticket.

**Endpoint:** `GET /ticket/get-ticket-message`

**Authentication Required:** Yes

**Role Required:** MEMBER or ADMIN

**Query Parameters:**
- `ticket_id` (required) - Ticket ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 501,
        "ticket_id": 101,
        "user_id": 1,
        "user_name": "John Doe",
        "message": "I found the root cause. It's a CSS media query issue.",
        "parent_message_id": null,
        "created_at": "2024-01-26T17:00:00.000Z"
      },
      {
        "id": 502,
        "ticket_id": 101,
        "user_id": 5,
        "user_name": "Jane Smith",
        "message": "Great! Can you submit a PR?",
        "parent_message_id": 501,
        "created_at": "2024-01-26T17:15:00.000Z"
      }
    ]
  },
  "message": "Messages retrieved successfully"
}
```

**Error Responses:**
- `403` - Permission denied
- `404` - Ticket not found
- `400` - Ticket ID required

**Example (curl):**
```bash
curl -X GET "http://localhost:3000/ticket/get-ticket-message?ticket_id=101" \
  -H "Authorization: Bearer <your-token>"
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid token` | JWT token expired or invalid | Login again |
| `User not a member of organization` | Trying to access org you're not in | Check org membership |
| `Only admins can perform this action` | Insufficient role | Contact org admin |
| `Email already exists` | Registration with existing email | Use different email |
| `Invalid credentials` | Wrong email/password | Check credentials |

---

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

---

## Postman Collection

Import the `POSTMAN_COLLECTION.json` file into Postman for ready-to-use API requests with examples.

---

For more information, see [ARCHITECTURE.md](./ARCHITECTURE.md) and [DATABASE.md](./DATABASE.md).