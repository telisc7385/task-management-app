# Full Stack Application Suite

A full-stack application suite with **Task Manager** and **Job Application Manager**, built with Next.js 15, Express.js, TypeScript, and PostgreSQL.

---

## Applications

### 1. Task Manager
Manage personal tasks with CRUD operations, filtering, search, and pagination.

### 2. Job Application Manager
Manage and send job applications via email with CSV import, resume upload, and WhatsApp integration.

---

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios
- Context API

### Backend
- Node.js / Express.js
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication + bcryptjs
- Nodemailer (Gmail SMTP)
- Multer (file uploads)
- csv-parser
- express-validator, Helmet, CORS

---

## Project Structure

```
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   ├── uploads/          # Resume storage
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   ├── admin/login/
│   │   │   └── jobs/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.local
│   └── package.json
└── README.md
```

---

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
# Edit .env with your credentials
npx prisma migrate dev --name init
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:3000`

---

## Environment Variables

### Backend (.env)
| Variable       | Description                     |
|---------------|---------------------------------|
| DATABASE_URL  | PostgreSQL connection string    |
| JWT_SECRET    | Secret key for JWT signing      |
| PORT          | Server port (default: 5000)     |
| ADMIN_EMAIL   | Admin login email               |
| ADMIN_PASSWORD| Admin login password            |
| SMTP_HOST     | SMTP server (smtp.gmail.com)    |
| SMTP_PORT     | SMTP port (587)                 |
| SMTP_USER     | Gmail address                   |
| SMTP_PASS     | Gmail App Password              |

### Frontend (.env.local)
| Variable            | Description          |
|-------------------|----------------------|
| NEXT_PUBLIC_API_URL | http://localhost:5000/api |

---

## Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App Passwords** (search in Google Account settings)
4. Select **Mail** and your device, generate a 16-character password
5. Use this password as `SMTP_PASS` in `.env`

---

## API Endpoints

### Health
```
GET /api/health
```

### Auth (Task Manager)
```
POST /api/auth/register   { name, email, password }
POST /api/auth/login      { email, password }
```

### Tasks (Bearer Token required)
```
GET    /api/tasks          ?status=&search=&page=&limit=
GET    /api/tasks/stats
GET    /api/tasks/:id
POST   /api/tasks          { title, description, status }
PUT    /api/tasks/:id      { title, description, status }
DELETE /api/tasks/:id
```

### Admin Auth (Job Manager)
```
POST /api/admin/login      { email, password }
```

### Jobs (Admin Token required)
```
GET    /api/jobs           ?search=&emailStatus=&page=&limit=
GET    /api/jobs/stats
GET    /api/jobs/:id
POST   /api/jobs           { companyName, role, hrName, email, phone?, location? }
PUT    /api/jobs/:id       { companyName, role, hrName, email, phone?, location?, notes? }
DELETE /api/jobs/:id
POST   /api/jobs/import    (multipart/form-data with CSV file)
```

### Email (Admin Token required)
```
POST /api/email/send/:jobId
```

### Templates (Admin Token required)
```
GET  /api/template/email
PUT  /api/template/email      { subject, body }
GET  /api/template/whatsapp
PUT  /api/template/whatsapp   { body }
```

### Resume (Admin Token required)
```
GET  /api/resume
POST /api/resume/upload       (multipart/form-data with PDF)
```

---

## CSV Import Format

The CSV file must have these columns:

```csv
companyName,role,hrName,email,phone,location
Google,Software Engineer,John Doe,john@google.com,+1 234 567 890,Mountain View CA
```

Duplicate email addresses are skipped. Import summary shows imported/skipped counts.

---

## Architecture

### Backend
- **Controllers** — HTTP request handling
- **Services** — Business logic
- **Repositories** — Prisma data access
- **Middleware** — Auth, validation, error handling
- **Utils** — API responses, custom errors

### Frontend
- **Context API** — Auth state management
- **Components** — Reusable UI
- **Lib** — Axios API client with interceptors
- **App Router** — File-based routing with protected routes

---

## Placeholders

Available for email and WhatsApp templates:
- `{company}` — Company name
- `{role}` — Job role
- `{hrName}` — HR contact name
