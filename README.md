# 🎓 Edu Nova - Online Learning Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application that allows students to enroll in IT-related courses and instructors to create and manage them. Integrated a chat recommendation feature with the OpenAI API to give course recommendations to students based on their preferences.

## 📦 Tech Stack

- **Frontend**: React + Vite + Material UI
- **Backend**: Node.js + Express + Multer
- **Database**: MongoDB Atlas
- **Deployment**: Docker + Jenkins + AWS EC2
- **API Integration**: REST API and OpenAI API

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

### Auth

- `POST /auth/register` – Register user
- `POST /auth/login` – Login user

### Courses

- `GET /course/student/courses` – Get all courses for students
- `GET /course/student/courses/enrolled` – View enrolled courses for students
- `GET /course/student/courses/:id` – View details of a single course
- `POST /course/student/courses/:id/enroll` – Enroll in courses for students
- `GET /course/instructor/courses` – View added courses of a particular instructor
- `PUT /course/instructor/update/:id` – Update course details for instructors
- `POST /course/instructor/add` – Adding a new course for instructors
- `DELETE /course/instructor/delete/:id` – Removing a course for instructors
- `GET /course/instructor/courses/:id/students` – View student details of an enrolled course for instructors

### Auth

- `POST /chat/recommendations` – Getting course recommendations for students

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
