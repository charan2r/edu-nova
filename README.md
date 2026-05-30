# 🎓 Edu Nova - Learning Management System

A comprehensive **Software-as-a-Service (SaaS)** learning management platform built with modern web technologies. Edu Nova enables institutes to manage their online courses, instructors, and students at scale with features including AI-powered recommendations, multi-tenant architecture, and comprehensive admin dashboards.

## 📦 Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens), Bcrypt Password Hashing
- **AI & ML**: Groq SDK for intelligent recommendations
- **Media Management**: ImageKit for image optimization and hosting
- **DevOps**: Docker, Docker Compose

## 🏗️ Architecture

Edu Nova follows a **multi-tenant SaaS architecture** with role-based access control:

- **Super Admin**: Platform management and analytics
- **Institute Admin**: Institution management, instructor oversight, analytics
- **Instructors**: Course creation, management, and student engagement
- **Students**: Course enrollment, learning, and AI-powered recommendations

## 🧩 Core Features

### 🔐 **Authentication & Authorization**

- Multi-role authentication (Student, Instructor, Institute Admin, Super Admin)
- JWT-based secure authentication
- Password encryption with bcrypt
- Session management and token refresh

### 📚 **Course Management**

- Instructors can create, update, and manage courses
- Course categorization and organization
- Student enrollment tracking
- Course search and filtering capabilities

### 🤖 **AI-Powered Intelligence**

- Personalized course recommendations using Groq API
- Context-aware chat assistant for course guidance
- Smart course suggestions based on user preferences and learning history

### 📊 **Admin Dashboards**

- **Super Admin Portal**: Platform-wide analytics and institute management
- **Institute Admin Portal**: Institution-specific KPIs, instructor management, student analytics

### 🎨 **User Experience**

- Responsive design for all devices
- Modern, intuitive UI with Radix components
- Dark mode support with theme switching

## � Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Docker & Docker Compose (for containerized deployment)
- Git

### Environment Variables

Create `.env` files in respective directories:

#### Backend `.env` (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/edu-nova
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

GROQ_API_KEY=your_groq_api_key

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

NODE_ENV=development
```

#### Frontend `.env.local` (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

#### Admin `.env.local` (`admin/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Installation & Setup

#### 1. Clone the repository

```bash
git clone <repository-url>
cd edu-nova
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Start the development server:

```bash
npm run dev
```

Or run in production mode:

```bash
npm start
```

Seed the database (optional):

```bash
npm run seed
```

Backend runs on: `http://localhost:5000`

#### 3. Frontend Setup (Student Portal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

#### 4. Admin Dashboard Setup

```bash
cd admin
npm install
npm run dev
```

Admin dashboard runs on: `http://localhost:3001`

### Docker Deployment

Deploy all services with Docker Compose:

```bash
docker-compose up --build
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`

### Authentication

| Method | Endpoint         | Description                              | Auth Required |
| ------ | ---------------- | ---------------------------------------- | ------------- |
| POST   | `/auth/register` | Register a new user (student/instructor) | No            |
| POST   | `/auth/login`    | Login user and receive JWT token         | No            |
| POST   | `/auth/refresh`  | Refresh access token                     | Yes           |
| POST   | `/auth/logout`   | Logout user and invalidate token         | Yes           |

### Courses

| Method | Endpoint                | Description                                | Auth Required |
| ------ | ----------------------- | ------------------------------------------ | ------------- |
| GET    | `/course/`              | Get all courses (paginated)                | Yes           |
| GET    | `/course/search/:query` | Search courses by title/description        | Yes           |
| GET    | `/course/enrolled`      | Get student's enrolled courses             | Yes           |
| GET    | `/course/my-courses`    | Get instructor's created courses           | Yes           |
| GET    | `/course/:id`           | Get course details                         | Yes           |
| GET    | `/course/:id/students`  | Get students in a course (instructor only) | Yes           |
| POST   | `/course/`              | Create a new course (instructor only)      | Yes           |
| POST   | `/course/:id/enroll`    | Enroll in a course                         | Yes           |
| PUT    | `/course/:id`           | Update course (instructor only)            | Yes           |
| DELETE | `/course/:id`           | Delete course (instructor only)            | Yes           |

### Institutes (Admin Only)

| Method | Endpoint         | Description                   | Auth Required |
| ------ | ---------------- | ----------------------------- | ------------- |
| GET    | `/institute/`    | Get all institutes            | Yes           |
| GET    | `/institute/:id` | Get institute details         | Yes           |
| POST   | `/institute/`    | Create new institute          | Yes           |
| PUT    | `/institute/:id` | Update institute (admin only) | Yes           |
| DELETE | `/institute/:id` | Delete institute (admin only) | Yes           |

### Chat & Recommendations

| Method | Endpoint                | Description                           | Auth Required |
| ------ | ----------------------- | ------------------------------------- | ------------- |
| POST   | `/chat/recommendations` | Get AI-powered course recommendations | Yes           |

## 🤖 AI Features

### Personalized Course Recommendations

The platform uses Groq API to provide context-aware course recommendations:

- **Student Input**: "Show me courses for web development"
- **AI Analysis**: Analyzes course descriptions, user preferences, and learning history
- **Smart Recommendations**: Returns relevant courses with explanations
