# Edu Nova — Architecture

---

## Overview

Three independent applications share one REST API backend:

| App      | Tech            | Port | Users                      |
| -------- | --------------- | ---- | -------------------------- |
| Backend  | Node.js/Express | 5000 | API server                 |
| Frontend | Next.js 16      | 3000 | Students & Instructors     |
| Admin    | Next.js 16      | 3001 | Platform admins            |
| Nginx    | nginx:alpine    | 80   | Reverse proxy (production) |

---

## System Diagram

```
Browser
  ├── Frontend (students & instructors)
  └── Admin Dashboard

       ↓ HTTP requests

Nginx (production)
  ├── / → serves frontend static files
  └── /api/* → proxies to backend:5000

Backend API (Express)
  └── MongoDB (users, courses, institutes)
       └── External services:
            ├── Groq AI (course recommendations)
            └── ImageKit CDN (course images)
```

---

## Roles

| Role         | What they can do                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `admin`      | Full control: create/edit/delete institutes, manage all users and courses via `/admin/*` routes |
| `instructor` | Create and manage their own courses; view enrolled students                                     |
| `student`    | Browse courses, enroll/unenroll, use AI chat advisor                                            |

---

## Backend Structure

Follows a layered architecture:

```
routes/       → maps HTTP paths to controllers
controllers/  → handles request/response, role checks
services/     → business logic and validation
repositories/ → all database queries (Mongoose)
models/       → MongoDB schemas
middleware/   → JWT auth, rate limiting, error handling, file upload
utils/        → Groq AI integration, custom error classes
```

**Request flow:** `Route → [Auth middleware] → Controller → Service → Repository → MongoDB`

---

## Authentication

- **Access token** — JWT, 15-minute lifetime, stored in `localStorage`
- **Refresh token** — JWT, 7-day lifetime, stored in `localStorage` and MongoDB

When the access token expires, the client silently calls `POST /auth/refresh`. If the refresh also fails, the user is redirected to login.

Logout removes the specific refresh token from the database, invalidating that session only (multiple device sessions are supported).

---

## Data Models

### User

```
fullname, email, password (bcrypt), role, institute → Institute,
enrolledCourses → [Course], refreshTokens[], isActive, isDeleted
```

### Course

```
name, description, image (ImageKit URL), category, level, language,
content, instructor → User, institute → Institute, students → [User],
subscription { isFree, price, currency }, totalDuration, rating,
status (draft/published/archived), isDeleted
```

### Institute

```
name, description, logo, email, phone, website,
address { street, city, state, country, zipCode },
isActive, isDeleted
```

---

## API Routes

| Prefix           | Description                      |
| ---------------- | -------------------------------- |
| `/api/v1/auth`   | Register, login, refresh, logout |
| `/api/v1/course` | Course CRUD, enroll/unenroll     |
| `/api/v1/chat`   | AI course recommendations        |
| `/api/v1/admin`  | Institute/user/course management |

Full endpoint reference → [`api-documentation.md`](./api-documentation.md)

---

## Rate Limiting

| Limiter         | Window | Limit | Applied to          |
| --------------- | ------ | ----- | ------------------- |
| General         | 15 min | 100   | All `/api/*` routes |
| Auth login      | 15 min | 5     | `/auth/login`       |
| Course creation | 1 hour | 10    | `POST /course`      |

Disabled automatically in `NODE_ENV=development`.

---

## Media Uploads

Course images are uploaded via `multipart/form-data`. The backend converts the file buffer to base64 and pushes it to **ImageKit CDN** (`/courses` folder). The returned CDN URL is stored on the course document.

---

## Production Deployment

Docker Compose runs three containers:

1. **backend** — Node.js API (internal, port 5000)
2. **frontend** — Next.js build copies static files to a shared volume
3. **nginx** — serves static frontend + proxies `/api/*` to backend

Admin dashboard is deployed separately (not in the current `docker-compose.yml`).

---

## Key Decisions

**Single admin role** — There is no "institute admin". The platform `admin` has full control over all institutes, users, and courses through the `/admin` API prefix.

**Soft deletes** — Courses and institutes use `isDeleted: true` instead of hard deletion, preserving data integrity and enabling future audit features.

**Separate admin app** — The admin dashboard is a fully independent Next.js app with its own auth flow, keeping admin code completely separate from student/instructor code.

**Groq over OpenAI** — Groq provides significantly faster inference for Llama 3.3-70B, with a 20-second timeout for edge cases.
