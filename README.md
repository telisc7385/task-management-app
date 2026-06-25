# Task Management Application

A full-stack task management application built with Next.js, Express.js, TypeScript, and PostgreSQL.

## Features

- **Authentication**: User registration and login with JWT-based authentication
- **Task Management**: Create, read, update, and delete tasks
- **Dashboard**: Overview with task statistics (total, pending, in-progress, completed)
- **Filtering**: Filter tasks by status (All, Pending, In Progress, Completed)
- **Search**: Search tasks by title or description
- **Pagination**: Paginated task listing
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Security**: Password hashing with bcryptjs, request validation, protected routes
- **State Management**: Auth state via React Context API
- **Error Handling**: Global error handler with standardized API responses

## Tech Stack

### Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios
- Context API

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcryptjs
- express-validator
- Helmet
- CORS

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   └── tasks/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── types/
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npx prisma migrate dev --name init
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:3000`.

## Environment Variables

### Backend (.env)

| Variable     | Description                  | Default                                      |
| ------------ | ---------------------------- | -------------------------------------------- |
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@localhost:5432/dbname |
| JWT_SECRET   | Secret key for JWT signing   | (required)                                   |
| PORT         | Server port                  | 5000                                         |

### Frontend (.env.local)

| Variable            | Description          | Default                         |
| ------------------- | -------------------- | ------------------------------- |
| NEXT_PUBLIC_API_URL | Backend API base URL | http://localhost:5000/api |

## API Endpoints

### Health Check

```
GET /api/health
```

### Authentication

```
POST /api/auth/register
Body: { "name": "John", "email": "john@example.com", "password": "123456" }
Response: { "success": true, "message": "User registered successfully" }
```

```
POST /api/auth/login
Body: { "email": "john@example.com", "password": "123456" }
Response: { "success": true, "data": { "token": "jwt...", "user": { "id": 1, "name": "John", "email": "john@example.com" } } }
```

### Tasks (Requires Bearer Token)

```
GET /api/tasks
Query: ?status=Pending&search=keyword&page=1&limit=10
Response: { "success": true, "data": [...], "meta": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 } }
```

```
GET /api/tasks/stats
Response: { "success": true, "data": { "total": 10, "pending": 3, "inProgress": 4, "completed": 3 } }
```

```
GET /api/tasks/:id
Response: { "success": true, "data": { "id": 1, "title": "...", "description": "...", "status": "Pending", ... } }
```

```
POST /api/tasks
Body: { "title": "Build API", "description": "Create Express API", "status": "Pending" }
Response: { "success": true, "data": { ... }, "message": "Task created successfully" }
```

```
PUT /api/tasks/:id
Body: { "title": "...", "description": "...", "status": "In Progress" }
Response: { "success": true, "data": { ... }, "message": "Task updated successfully" }
```

```
DELETE /api/tasks/:id
Response: { "success": true, "message": "Task deleted successfully" }
```

## Architecture

The backend follows a layered architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic layer
- **Repositories**: Data access layer using Prisma ORM
- **Middleware**: Authentication, validation, and error handling
- **Utils**: Shared utilities, custom errors, and API response helpers

The frontend uses:

- **Context API**: Auth state management
- **Components**: Reusable UI components
- **Lib**: API client with Axios interceptors
- **App Router**: Next.js 15 file-based routing with protected routes
