# Multi-Tenant SaaS Ticket Management System

A robust multi-tenant SaaS backend system for ticket management built with Node.js, Express, and PostgreSQL.

## Features

- 🔐 JWT-based authentication
- 👥 Multi-organization support (multi-tenancy)
- 🎫 Complete ticket management system
- 💬 Threaded ticket messages/comments
- 📊 Ticket history tracking
- 🔑 Role-based access control (ADMIN/MEMBER)
- 🏢 Organization-level data isolation

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Architecture:** MVC + Service Layer

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=443
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Set up the database

```bash
# Create database
createdb your_database_name

# Run schema
psql -U your_username -d your_database_name -f database/schema.sql
```

### 5. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

The server will start at `https://localhost:443`

## Project Structure

```
├── database/
│   └── schema.sql          # Database schema
|   certs/                  # SSL certificates
│   └── server.key
|   └── server.cert
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/             # Configuration files
│   │   ├── db.js           # Database connection
│   │   └── env.js          # Environment variables
│   ├── routes/             # API routes
│   │   ├── auth.routes.js
│   │   ├── organization.routes.js
│   │   ├── ticket.routes.js
│   │   └── index.js
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.js
│   │   ├── organization.controller.js
│   │   └── ticket.controller.js
│   ├── services/           # Business logic
│   │   ├── auth.service.js
│   │   ├── organization.service.js
│   │   └── ticket.service.js
│   ├── models/             # Database queries
│   │   ├── user.model.js
│   │   ├── organization.model.js
│   │   ├── membership.model.js
│   │   ├── ticket.model.js
│   │   └── ticketHistory.model.js
│   ├── middlewares/        # Custom middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── role.middleware.js
│   └── utils/              # Helper functions
│       └── jwt.js
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Organization

- `POST /org/create` - Create organization
- `POST /org/add-member` - Add member to organization
- `GET /org/get-user-orgs` - Get user's organizations
- `PUT /org/change-user-role` - Change member role

### Tickets

- `POST /ticket/create` - Create ticket
- `GET /ticket/get-tickets` - Get organization tickets
- `PUT /ticket/assign-ticket` - Assign ticket to user
- `PUT /ticket/update-ticket-status` - Update ticket status
- `PUT /ticket/update-ticket` - Update ticket content
- `DELETE /ticket/delete-ticket` - Delete ticket
- `POST /ticket/add-ticket-message` - Add message to ticket
- `GET /ticket/get-ticket-message` - Get ticket messages

For detailed API documentation, see [API_REFERENCE.md](./API_REFERENCE.md)

## Multi-Tenancy Model

- Each **organization** represents a separate tenant
- Users can belong to **multiple organizations**
- User roles (ADMIN/MEMBER) are **organization-specific**
- All data is isolated by `org_id`
- Access control validates: user authentication → organization membership → role permissions

## Authentication & Authorization

### Authentication

- JWT tokens issued on login
- Tokens stored in HTTP-only cookies (or Authorization header)
- Passwords hashed with bcrypt

### Authorization

- **ADMIN**: Full control within their organization
- **MEMBER**: Limited access within their organization
- Organization creator automatically becomes ADMIN

## Testing

Import the Postman collection from `POSTMAN_COLLECTION.json` to test all endpoints.

## Documentation

- [Setup Guide](./SETUP.md) - Detailed installation instructions
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Database Schema](./DATABASE.md) - Database structure
- [Architecture](./ARCHITECTURE.md) - System design and patterns

## Development

### Adding New Features

1. **Model** - Add database queries in `src/models/`
2. **Service** - Add business logic in `src/services/`
3. **Controller** - Add request handlers in `src/controllers/`
4. **Route** - Add endpoints in `src/routes/`
5. **Middleware** - Add validation/auth if needed

### Code Style

- Use consistent naming conventions
- Follow MVC + Service layer pattern
- Keep business logic in services, not controllers
- Use async/await for asynchronous operations

## Environment Variables

| Variable         | Description                          | Default     |
| ---------------- | ------------------------------------ | ----------- |
| `PORT`           | Server port                          | 3000        |
| `DATABASE_URL`   | PostgreSQL connection string         | -           |
| `JWT_SECRET`     | Secret key for JWT                   | -           |
| `JWT_EXPIRES_IN` | Token expiration time                | 7d          |
| `NODE_ENV`       | Environment (development/production) | development |

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens for stateless authentication
- Role-based access control
- SQL injection prevention via parameterized queries
- CORS enabled (configure as needed)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)

## Support

For issues and questions, please open an issue on GitHub.

---
