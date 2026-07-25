# 🎓 Edu Nova — Learning Management System

A full-stack LMS where institutes can manage courses, instructors, and students. Includes AI-powered course recommendations and a dedicated admin dashboard.

---

## Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Frontend    | Next.js 16, TypeScript, Tailwind CSS  |
| Admin Panel | Next.js 16, TypeScript, Tailwind CSS  |
| Backend     | Node.js, Express.js                   |
| Database    | MongoDB (Mongoose)                    |
| Auth        | JWT (access + refresh tokens), bcrypt |
| AI          | Groq SDK — Llama 3.3-70B              |
| Media       | ImageKit CDN                          |
| Deployment  | Docker, Docker Compose, Nginx         |

---

## User Roles

| Role           | Capabilities                                                      |
| -------------- | ----------------------------------------------------------------- |
| **Admin**      | Manage institutes, users, and all courses via the admin dashboard |
| **Instructor** | Create and manage their own courses; view enrolled students       |
| **Student**    | Browse courses, enroll/unenroll, get AI recommendations           |

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Docker & Docker Compose (for production deployment)

### Environment Variables

**`backend/.env`**

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/edu-nova
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

GROQ_API_KEY=your_groq_api_key

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

NODE_ENV=development
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**`admin/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Running Locally

```bash
# Backend (port 5000)
cd backend && npm install && npm run dev

# Frontend — Students & Instructors (port 3000)
cd frontend && npm install && npm run dev

# Admin Dashboard (port 3001)
cd admin && npm install && npm run dev
```

Seed the database with sample data (optional):

```bash
cd backend && npm run seed
```

### Docker Deployment

```bash
docker-compose up --build
```

Nginx serves the frontend on port `80` and proxies `/api/*` to the backend.

---

## API Overview

Base URL: `http://localhost:5000/api/v1`  
Full reference: [`api-documentation.md`](./api-documentation.md)

### Authentication

| Method | Endpoint         | Auth | Description                    |
| ------ | ---------------- | ---- | ------------------------------ |
| POST   | `/auth/register` | No   | Register student or instructor |
| POST   | `/auth/login`    | No   | Login and receive JWT tokens   |
| POST   | `/auth/refresh`  | No   | Get a new access token         |
| POST   | `/auth/logout`   | No\* | Invalidate refresh token       |

\*Requires `user-id` header.

### Courses

| Method | Endpoint                  | Auth          | Description                         |
| ------ | ------------------------- | ------------- | ----------------------------------- |
| GET    | `/course`                 | Public        | List all courses (paginated)        |
| GET    | `/course/search/query?q=` | 🔒            | Search courses by keyword           |
| GET    | `/course/enrolled`        | 🔒            | Student's enrolled courses          |
| GET    | `/course/my-courses`      | 🔒 instructor | Instructor's created courses        |
| GET    | `/course/:id`             | 🔒            | Single course details               |
| GET    | `/course/:id/students`    | 🔒 instructor | Students enrolled in a course       |
| POST   | `/course`                 | 🔒 instructor | Create a course (with image upload) |
| POST   | `/course/:id/enroll`      | 🔒            | Enroll in a course                  |
| POST   | `/course/:id/unenroll`    | 🔒            | Unenroll from a course              |
| PUT    | `/course/:id`             | 🔒 instructor | Update own course                   |
| DELETE | `/course/:id`             | 🔒 instructor | Delete own course                   |

### Chat / AI

| Method | Endpoint                | Auth | Description                       |
| ------ | ----------------------- | ---- | --------------------------------- |
| POST   | `/chat/recommendations` | 🔒   | AI-powered course recommendations |

### Admin

| Method | Endpoint                  | Auth     | Description                        |
| ------ | ------------------------- | -------- | ---------------------------------- |
| GET    | `/admin/institutes`       | 🔒 admin | List all institutes                |
| GET    | `/admin/institutes/:id`   | 🔒 admin | Get single institute               |
| POST   | `/admin/institutes`       | 🔒 admin | Create institute                   |
| PUT    | `/admin/institutes/:id`   | 🔒 admin | Update institute                   |
| DELETE | `/admin/institutes/:id`   | 🔒 admin | Soft-delete institute              |
| GET    | `/admin/users`            | 🔒 admin | List all users (`?role=` optional) |
| PATCH  | `/admin/users/:id/toggle` | 🔒 admin | Toggle user active status          |
| GET    | `/admin/courses`          | 🔒 admin | List all platform courses          |
| DELETE | `/admin/courses/:id`      | 🔒 admin | Force-delete any course            |

---

## AI Recommendations

Students can chat with the built-in AI advisor:

1. Student types a query: _"I want to learn web development from scratch"_
2. Groq (Llama 3.3-70B) generates a personalized response
3. Keywords are extracted and used to query the course catalog
4. The response includes both the AI message and matching courses

---

## Project Structure

```
edu-nova/
  backend/          Node.js + Express REST API
  frontend/         Next.js app for students & instructors
  admin/            Next.js admin dashboard
  docker-compose.yml
  default.conf      Nginx config
  api-documentation.md
  architecture.md
```
