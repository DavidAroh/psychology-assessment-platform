# Database Setup Guide

## Environment Configuration

Your `.env.local` file needs to have the correct PostgreSQL connection string format.

### Required Format

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### Example Configurations

#### Local PostgreSQL Database
```bash
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/psychology_assessment"
```

#### PostgreSQL with different port
```bash
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5433/psychology_assessment"
```

#### Remote PostgreSQL Database
```bash
DATABASE_URL="postgresql://username:password@your-host.com:5432/database_name"
```

#### Alternative Protocol (both work)
```bash
DATABASE_URL="postgres://username:password@localhost:5432/database_name"
```

## Current Error Fix

The error you're seeing indicates that your current `DATABASE_URL` doesn't start with `postgresql://` or `postgres://`.

**To fix this:**

1. Open your `.env.local` file
2. Update the `DATABASE_URL` line to match one of the formats above
3. Make sure to replace:
   - `username` with your PostgreSQL username
   - `password` with your PostgreSQL password  
   - `localhost` with your database host (if different)
   - `5432` with your PostgreSQL port (if different)
   - `database_name` with your actual database name

## After Updating

1. Save the `.env.local` file
2. Restart your Next.js development server
3. Run `npm run prisma:migrate` if you haven't set up the database schema yet

## Common Database Names
- `psychology_assessment`
- `psych_platform`
- `assessment_db`
