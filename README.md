# 🎓 Edu Nova - Online Learning Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application that allows students to enroll in IT-related courses and instructors to create and manage them. Integrated a chat recommendation feature with the OpenAI API to give course recommendations to students based on their preferences.

## 📦 Tech Stack

- **Frontend**: Next.js, Tainwind CSS
- **Backend**: Node.js, Express.js, JWT Auth, Imagekit
- **Database**: MongoDB
- **API Integration**: REST API and OpenAI API
- **DevOps**: Docker

## 🧩 Features

- Instructor and student authentication (JWT)
- Course creation for instructors
- View and enroll in courses for students
- Role-based access control
- Course recommendation AI assistant

## 🔧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_api_key
```

Start server:

```bash
node server
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:

```bash
npm run dev
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`

### Authentication

- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login user
- `POST /auth/refresh` – Refresh access token
- `POST /auth/logout` – Logout user

### Courses

- `GET /course/` – Get all courses
- `GET /course/search/query` – Search courses by query
- `GET /course/enrolled` – Get user's enrolled courses
- `GET /course/my-courses` – Get instructor's courses
- `GET /course/:id` – Get course details
- `GET /course/:id/students` – Get students enrolled in a course (instructor only)
- `POST /course/` – Create a new course (instructor only)
- `POST /course/:id/enroll` – Enroll in a course
- `PUT /course/:id` – Update course details (instructor only)
- `DELETE /course/:id` – Delete a course (instructor only)

### Chat & Recommendations

- `POST /chat/recommendations` – Get AI-powered course recommendations based on user input

## 🗃 Database Models

1. User

- Include user details and role identifier, such as Student and Instructor.

2. Course

- Include course details, instructor ID, and enrolled student IDs as foreign keys.

---

## 🤖 Chat Assistant Features

### **Personalized Course Recommendations**

- Show related courses according to user inputs.
- Ex: "Hi, can you show me courses for software engineering?", "Are there any courses for web development?"

---

Built with ❤️ using MERN Stack.
