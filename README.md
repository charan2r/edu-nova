# 🎓 Edu Nova — Adaptive Learning Management System

An **Adaptive LMS** where students receive personalized, AI-generated learning roadmaps based on their career goals, existing skills, and weekly time commitments. Institutes and instructors can manage courses and students, backed by a dedicated admin portal.

---

## 🚀 Key Features

- 🧠 **AI Adaptive Learning Path Generator**: Analyzes the student's career goals, identifies skill gaps, and constructs a prerequisite-ordered curriculum from the catalog.
- 🗺️ **Interactive Visual Roadmap**: Step-by-step progress tracking with locked, available, and completed milestones, plus AI explanations for why each course was recommended.
- 🔓 **Progressive Course Unlocking**: Completing a prerequisite step automatically unlocks the next course in the sequence.
- 💬 **AI Course Advisor**: Built-in floating chat assistant with starter prompt chips for instant course recommendations.
- 👥 **Multi-Role LMS**: Support for Admins, Instructors, and Students with role-based access control (RBAC).
- 🏢 **Multi-Institute Support**: Institute-scoped courses with seamless fallback to global platform offerings.

---

## 🛠️ Tech Stack

| Layer       | Technology                                                   |
| ----------- | ------------------------------------------------------------ |
| Frontend    | Next.js 16 (App Router), TypeScript, Tailwind CSS, Radix UI  |
| Admin Panel | Next.js 16, TypeScript, Tailwind CSS                         |
| Backend     | Node.js, Express.js (REST API)                               |
| Database    | MongoDB (Mongoose ODM)                                       |
| Auth        | JWT (Short-lived Access + Long-lived Refresh Tokens), bcrypt |
| AI & Engine | Groq SDK                                                     |
| Media CDN   | ImageKit CDN                                                 |
| Deployment  | Docker, Docker Compose, Nginx                                |

---

## 👥 User Roles

| Role           | Capabilities                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Admin**      | Manage institutes, platform users, system analytics, and force-moderate courses via the Admin Dashboard.         |
| **Instructor** | Create, edit, and publish rich courses; upload thumbnail media; view and manage enrolled students.               |
| **Student**    | Generate AI adaptive learning paths, track roadmap milestones, browse & enroll in courses, chat with AI advisor. |

---

## 🧠 How the Adaptive Learning Path Works

```
Student Profile Inputs:
• Target Career Goal (e.g. "Full Stack Developer")
• Current Known Skills (e.g. "HTML, CSS, JavaScript")
• Experience Level ("Beginner", "Intermediate", "Advanced")
• Weekly Time Commitment (e.g. 10 hrs/week)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  AI Goal & Skill Gap Analysis                               │
│  - Normalizes skills and breaks down target domain stack    │
│  - Computes exact missing skills                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Catalog Search & Prerequisite Sequencing                   │
│  - Matches published institute & platform courses           │
│  - Topologically sequences prerequisites                    │
│  - Ensures foundational skills are taught first             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  AI Path Synthesis & Timeline Estimation                    │
│  - Explains why each course was chosen to fill gaps         │
│  - Calculates estimated weeks based on weekly study hours   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Student Interactive Roadmap                                │
│  - Step 1: Available (Ready to start)                       │
│  - Step 2..N: Locked (Unlocks upon completing step 1)       │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js 18+**
- **MongoDB** (Local instance or MongoDB Atlas)
- **Groq API Key** (for AI recommendations & path generation)
- **Docker & Docker Compose** (optional, for containerized deployment)

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

---

### Running Locally

```bash
# 1. Start Backend (port 5000)
cd backend && npm install && npm run dev

# 2. Start Student/Instructor Frontend (port 3000)
cd frontend && npm install && npm run dev

# 3. Start Admin Dashboard (port 3001)
cd admin && npm install && npm run dev
```

Seed the database with sample courses and institutes (optional):

```bash
cd backend && npm run seed
```

---

### Docker Deployment

```bash
docker-compose up --build
```

Nginx serves the frontend on port `80` and proxies API requests `/api/*` to the Express backend.

---

## 📡 API Overview

**Base URL:** `http://localhost:5000/api/v1`  
**Detailed Reference:** [`api-documentation.md`](./api-documentation.md)

### 1. Adaptive Learning Path `/learning-path`

| Method | Endpoint                      | Auth | Description                                                    |
| ------ | ----------------------------- | ---- | -------------------------------------------------------------- |
| POST   | `/learning-path/generate`     | 🔒   | Generate an AI-tailored, prerequisite-ordered learning path    |
| GET    | `/learning-path/my-path`      | 🔒   | Retrieve student's current active roadmap with course metadata |
| PATCH  | `/learning-path/step/:stepId` | 🔒   | Mark step status (e.g. `completed` $\rightarrow$ unlocks next) |
| DELETE | `/learning-path/my-path`      | 🔒   | Reset current learning path to generate a new one              |

### 2. Authentication `/auth`

| Method | Endpoint         | Auth | Description                                     |
| ------ | ---------------- | ---- | ----------------------------------------------- |
| POST   | `/auth/register` | No   | Register new student or instructor              |
| POST   | `/auth/login`    | No   | Authenticate and receive access & refresh token |
| POST   | `/auth/refresh`  | No   | Refresh expired access token                    |
| POST   | `/auth/logout`   | No\* | Invalidate active refresh token                 |

### 3. Courses `/course`

| Method | Endpoint                  | Auth          | Description                              |
| ------ | ------------------------- | ------------- | ---------------------------------------- |
| GET    | `/course`                 | Public        | List all courses (paginated)             |
| GET    | `/course/search/query?q=` | 🔒            | Search courses by keywords or skills     |
| GET    | `/course/enrolled`        | 🔒            | Retrieve student's enrolled courses      |
| GET    | `/course/my-courses`      | 🔒 instructor | Retrieve instructor's authored courses   |
| GET    | `/course/:id`             | 🔒            | Get single course details                |
| GET    | `/course/:id/students`    | 🔒 instructor | View enrolled students in a course       |
| POST   | `/course`                 | 🔒 instructor | Create a course (with ImageKit upload)   |
| POST   | `/course/:id/enroll`      | 🔒            | Enroll authenticated student in a course |
| POST   | `/course/:id/unenroll`    | 🔒            | Unenroll student from a course           |
| PUT    | `/course/:id`             | 🔒 instructor | Update course metadata                   |
| DELETE | `/course/:id`             | 🔒 instructor | Delete course                            |

### 4. AI Chat Advisor `/chat`

| Method | Endpoint                | Auth | Description                                         |
| ------ | ----------------------- | ---- | --------------------------------------------------- |
| POST   | `/chat/recommendations` | 🔒   | Get conversational advice and course recommendation |

### 5. Admin Portal `/admin`

| Method | Endpoint                  | Auth     | Description                         |
| ------ | ------------------------- | -------- | ----------------------------------- |
| GET    | `/admin/institutes`       | 🔒 admin | List all registered institutes      |
| GET    | `/admin/institutes/:id`   | 🔒 admin | View specific institute profile     |
| POST   | `/admin/institutes`       | 🔒 admin | Create an institute                 |
| PUT    | `/admin/institutes/:id`   | 🔒 admin | Update institute details            |
| DELETE | `/admin/institutes/:id`   | 🔒 admin | Soft-delete institute               |
| GET    | `/admin/users`            | 🔒 admin | List all users (filter by `?role=`) |
| PATCH  | `/admin/users/:id/toggle` | 🔒 admin | Activate / Deactivate user account  |
| GET    | `/admin/courses`          | 🔒 admin | View all courses across institutes  |
| DELETE | `/admin/courses/:id`      | 🔒 admin | Force delete a course               |

---

## 📂 Project Structure

```
edu-nova/
├── backend/
│   ├── config/              # ImageKit and database configurations
│   ├── controllers/         # Express controllers (LearningPath, Course, Auth, Admin)
│   ├── middleware/          # JWT auth, error handler, rate limiters, multer
│   ├── models/              # Mongoose schemas (LearningPath, Course, User, Institute)
│   ├── repositories/        # Database access layer
│   ├── routes/              # Express API routers (V1 index, learningPath, chat, etc.)
│   ├── services/            # Business logic layer
│   └── utils/               # AI pathService, courseSearch, prerequisites sequencing
├── frontend/
│   ├── app/
│   │   ├── courses/         # Course browsing & details
│   │   ├── instructor/      # Instructor course authoring & student roster
│   │   └── student/         # Student dashboard & adaptive roadmap
│   ├── components/          # UI components (adaptive-roadmap, learning-path-dialog, chat)
│   └── lib/                 # API clients, auth context, chat context
├── admin/                   # Dedicated Next.js admin management application
├── docker-compose.yml       # Production multi-container orchestration
├── default.conf             # Nginx reverse proxy configuration
├── api-documentation.md     # Full API specifications
└── architecture.md          # Architectural decisions & system design
```
