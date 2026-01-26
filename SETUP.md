# Setup Guide

Complete step-by-step guide to set up the Multi-Tenant SaaS Ticket Management System.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Testing the Setup](#testing-the-setup)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| Node.js | v14.x or higher | [nodejs.org](https://nodejs.org/) |
| npm | v6.x or higher | Comes with Node.js |
| PostgreSQL | v12.x or higher | [postgresql.org](https://www.postgresql.org/download/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Verify Installation
```bash
# Check Node.js version
node --version
# Expected: v14.x.x or higher

# Check npm version
npm --version
# Expected: v6.x.x or higher

# Check PostgreSQL version
psql --version
# Expected: psql (PostgreSQL) 12.x or higher

# Check Git version
git --version
# Expected: git version 2.x.x
```

---

## Installation

### Step 1: Clone the Repository
```bash
# Clone the project
git clone <repository-url>

# Navigate to project directory
cd <project-directory>
```

### Step 2: Install Dependencies
```bash
# Install all Node.js packages
npm install
```

**Expected packages installed:**
- express
- pg (PostgreSQL client)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- cookie-parser (cookie handling)
- cors (Cross-Origin Resource Sharing)

### Step 3: Verify Installation
```bash
# Check if node_modules was created
ls -la

# You should see:
# - node_modules/
# - package.json
# - package-lock.json
```

---

## Database Setup

### Step 1: Start PostgreSQL

**On macOS (using Homebrew):**
```bash
brew services start postgresql
```

**On Ubuntu/Debian:**
```bash
sudo service postgresql start
```

**On Windows:**
- Start PostgreSQL service from Services app
- Or use pgAdmin

### Step 2: Create Database User (Optional)

If you want a dedicated user for this project:
```bash
# Access PostgreSQL as superuser
psql postgres

# Create new user
CREATE USER ticket_admin WITH PASSWORD 'secure_password_here';

# Grant privileges
ALTER USER ticket_admin CREATEDB;

# Exit
\q
```

### Step 3: Create Database
```bash
# Option 1: Using createdb command
createdb -U ticket_admin ticket_system

# Option 2: Using psql
psql -U postgres
CREATE DATABASE ticket_system;
\q
```

### Step 4: Run Schema
```bash
# Navigate to database directory
cd database

# Run schema file
psql -U ticket_admin -d ticket_system -f schema.sql

# Or if using default postgres user:
psql -U postgres -d ticket_system -f schema.sql
```

**Expected Output:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
...
```

### Step 5: Verify Database Setup
```bash
# Connect to database
psql -U ticket_admin -d ticket_system

# List all tables
\dt

# Expected output:
#  Schema |       Name        | Type  |  Owner   
# --------+-------------------+-------+----------
#  public | memberships       | table | ticket_admin
#  public | organizations     | table | ticket_admin
#  public | ticket_history    | table | ticket_admin
#  public | ticket_messages   | table | ticket_admin
#  public | tickets           | table | ticket_admin
#  public | users             | table | ticket_admin

# Describe users table
\d users

# Exit
\q
```

---

## Environment Configuration

### Step 1: Create Environment File
```bash
# Navigate to project root
cd ..

# Create .env file
touch .env
```

### Step 2: Configure Environment Variables

Open `.env` file in your text editor and add:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticket_system
DB_USER=ticket_admin
DB_PASSWORD=secure_password_here

# Alternative: Use DATABASE_URL (choose one approach)
# DATABASE_URL=postgresql://ticket_admin:secure_password_here@localhost:5432/ticket_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Cookie Configuration (optional)
COOKIE_EXPIRE=7

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Secure Your Environment File
```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Never commit .env to version control!
```

### Environment Variables Explained

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 3000 | Yes |
| `NODE_ENV` | Environment mode | development/production | Yes |
| `DB_HOST` | Database host | localhost | Yes |
| `DB_PORT` | Database port | 5432 | Yes |
| `DB_NAME` | Database name | ticket_system | Yes |
| `DB_USER` | Database username | ticket_admin | Yes |
| `DB_PASSWORD` | Database password | your_password | Yes |
| `DATABASE_URL` | Alternative DB connection string | postgresql://... | Alternative |
| `JWT_SECRET` | Secret key for JWT signing | random_string | Yes |
| `JWT_EXPIRES_IN` | Token expiration time | 7d | Yes |
| `COOKIE_EXPIRE` | Cookie expiration (days) | 7 | Optional |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 | Optional |

**Security Note:** Use a strong, random `JWT_SECRET` in production. You can generate one using:
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Running the Application

### Development Mode
```bash
# Start development server with auto-reload
npm run dev
```

**Expected Output:**
```
Server running on port 3000
Database connected successfully
```

### Production Mode
```bash
# Start production server
npm start
```

### Verify Server is Running

Open your browser and navigate to:
```
http://localhost:3000
```

Or use curl:
```bash
curl http://localhost:3000
```

You should see a response (or check your defined root route).

---

## Testing the Setup

### Test 1: Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "Test User",
      "created_at": "2024-01-26T10:30:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

### Test 2: Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "Test User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Save the token** for subsequent requests!

### Test 3: Create Organization
```bash
# Replace YOUR_TOKEN with the token from login response
curl -X POST http://localhost:3000/org/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Organization",
    "description": "My first organization"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "Test Organization",
      "description": "My first organization",
      "created_by": 1,
      "created_at": "2024-01-26T11:00:00.000Z"
    },
    "membership": {
      "user_id": 1,
      "org_id": 1,
      "role": "ADMIN"
    }
  },
  "message": "Organization created successfully"
}
```

### Test 4: Check Database
```bash
# Connect to database
psql -U ticket_admin -d ticket_system

# Check users
SELECT * FROM users;

# Check organizations
SELECT * FROM organizations;

# Check memberships
SELECT * FROM memberships;

# Exit
\q
```

---

## Troubleshooting

### Problem 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3001
```

### Problem 2: Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Check if PostgreSQL is running:**
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo service postgresql status

# If not running, start it
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
```

2. **Verify database credentials:**
```bash
# Test connection manually
psql -U ticket_admin -d ticket_system

# If this fails, your credentials are wrong
```

3. **Check PostgreSQL is listening on port 5432:**
```bash
netstat -an | grep 5432
```

### Problem 3: JWT_SECRET Not Defined

**Error:**
```
Error: JWT_SECRET is not defined
```

**Solution:**
```bash
# Make sure .env file exists
ls -la .env

# Check if JWT_SECRET is set
cat .env | grep JWT_SECRET

# If missing, add it
echo "JWT_SECRET=your-secret-key-here" >> .env

# Restart server
npm run dev
```

### Problem 4: Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# If still failing, install specific package
npm install express
```

### Problem 5: Schema File Not Found

**Error:**
```
psql: error: schema.sql: No such file or directory
```

**Solution:**
```bash
# Make sure you're in the right directory
pwd

# Navigate to project root
cd /path/to/project

# Run schema from correct path
psql -U ticket_admin -d ticket_system -f database/schema.sql
```

### Problem 6: Permission Denied (Database)

**Error:**
```
ERROR: permission denied for database ticket_system
```

**Solution:**
```bash
# Grant all privileges to user
psql -U postgres

GRANT ALL PRIVILEGES ON DATABASE ticket_system TO ticket_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ticket_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ticket_admin;

\q
```

### Problem 7: Bcrypt Installation Issues

**Error (on Windows):**
```
Error: node-gyp rebuild failed
```

**Solution:**
```bash
# Install windows build tools (run as Administrator)
npm install --global windows-build-tools

# Then reinstall bcrypt
npm install bcrypt
```

**Solution (on macOS/Linux):**
```bash
# Install build essentials
# macOS: Xcode command line tools should be installed
xcode-select --install

# Linux (Ubuntu/Debian)
sudo apt-get install build-essential

# Then reinstall
npm install bcrypt
```

---

## Next Steps

### 1. Import Postman Collection

- Open Postman
- Click Import
- Select `POSTMAN_COLLECTION.json`
- Set environment variable `token` after login
- Test all endpoints

### 2. Read Documentation

- [API Reference](./API_REFERENCE.md) - Learn all endpoints
- [Database Schema](./DATABASE.md) - Understand data structure
- [Architecture](./ARCHITECTURE.md) - System design

### 3. Customize Configuration

- Update CORS settings for your frontend
- Configure cookie options
- Set up logging (future enhancement)
- Add input validation (future enhancement)

### 4. Development Workflow
```bash
# Create a feature branch
git checkout -b feature/your-feature

# Make changes
# ...

# Test changes
npm run dev

# Commit changes
git add .
git commit -m "Add your feature"

# Push to remote
git push origin feature/your-feature
```

### 5. Deploy to Production

See deployment guides for:
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Render

---

## Quick Reference

### Start Everything
```bash
# Terminal 1: Start PostgreSQL (if not running)
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Terminal 2: Start application
npm run dev
```

### Stop Everything
```bash
# Stop application
Ctrl + C

# Stop PostgreSQL (optional)
brew services stop postgresql   # macOS
sudo service postgresql stop    # Linux
```

### Reset Database
```bash
# Drop and recreate database
psql -U postgres

DROP DATABASE ticket_system;
CREATE DATABASE ticket_system;
\q

# Rerun schema
psql -U postgres -d ticket_system -f database/schema.sql
```

### View Logs
```bash
# Application logs are in terminal where you ran npm run dev

# PostgreSQL logs location:
# macOS: /usr/local/var/log/postgres.log
# Linux: /var/log/postgresql/postgresql-12-main.log
```

---

## Support

If you encounter issues not covered here:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [API Reference](./API_REFERENCE.md)
3. Check database connection in [DATABASE.md](./DATABASE.md)
4. Open an issue on GitHub

---

**Setup complete! 🎉 You're ready to start developing.**