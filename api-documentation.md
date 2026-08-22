# Edu Nova — API Documentation

**Base URL:** `http://localhost:5000/api/v1`  
**Auth header:** `Authorization: Bearer <accessToken>`  
**Content-Type:** `application/json`

---

## Authentication `/auth`

### POST `/auth/register`

Register a new user. No auth required.

| Field             | Type   | Required | Notes                 |
| ----------------- | ------ | -------- | --------------------- |
| `fullname`        | string | Yes      |                       |
| `email`           | string | Yes      | Must be unique        |
| `password`        | string | Yes      |                       |
| `confirmPassword` | string | Yes      | Must match `password` |

```json
// 201
{ "message": "User registered successfully" }
```

---

### POST `/auth/login`

Login and receive tokens. Rate limited to **5 req / 15 min per email**.

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |

```json
// 200
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "role": "student",
  "userId": "64a3f...",
  "institute": "64b7c..."
}
```

> `accessToken` expires in **15 minutes**. `refreshToken` expires in **7 days**.

---

### POST `/auth/refresh`

Get a new access token. No auth required.

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `refreshToken` | string | Yes      |

```json
// 200
{ "accessToken": "eyJhbGci..." }
```

---

### POST `/auth/logout`

Invalidate a refresh token. Requires `user-id` header.

| Header / Field | Where  | Required |
| -------------- | ------ | -------- |
| `user-id`      | header | Yes      |
| `refreshToken` | body   | Yes      |

```json
// 200
{ "message": "Logged out successfully" }
```

---

## Courses `/course`

> `GET /course` is **public**. All other endpoints require a Bearer token.

### GET `/course`

List all courses with pagination.

| Query   | Default | Description      |
| ------- | ------- | ---------------- |
| `page`  | `1`     | Page number      |
| `limit` | `10`    | Results per page |

```json
// 200
{
  "data": [
    {
      "_id": "64a3f...",
      "name": "React for Beginners",
      "description": "Learn React from scratch",
      "image": "https://ik.imagekit.io/.../course_123.jpg",
      "category": "Web Development",
      "level": "beginner",
      "language": "English",
      "instructor": { "_id": "...", "fullname": "Jane Doe" },
      "institute": { "_id": "...", "name": "Tech Academy" },
      "subscription": { "isFree": true, "price": 0, "currency": "USD" },
      "totalDuration": 120,
      "rating": { "average": 4.5, "count": 23 },
      "status": "published"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### GET `/course/enrolled` 🔒

Get all courses the authenticated user is enrolled in.

```json
// 200
[{ "_id": "...", "name": "React for Beginners", ... }]
```

---

### GET `/course/my-courses` 🔒 `instructor`

Get all courses created by the authenticated instructor.

```json
// 200
[{ "_id": "...", "name": "...", ... }]
```

---

### GET `/course/search/query` 🔒

Search courses by keyword.

| Query   | Required | Description   |
| ------- | -------- | ------------- |
| `q`     | Yes      | Search term   |
| `page`  |          | Default: `1`  |
| `limit` |          | Default: `10` |

Returns same paginated structure as `GET /course`.

---

### GET `/course/:id` 🔒

Get a single course by ID. Returns full course object.

`404` if not found.

---

### GET `/course/:id/students` 🔒 `instructor`

Get enrolled students for a course the instructor owns.

```json
// 200
[{ "_id": "...", "fullname": "Alice", "email": "alice@example.com" }]
```

`403` if not the course owner. `404` if course not found.

---

### POST `/course` 🔒 `instructor`

Create a new course. Accepts `multipart/form-data`. Rate limited to **10 / hour per instructor**.

| Field           | Type    | Required | Notes                                                         |
| --------------- | ------- | -------- | ------------------------------------------------------------- |
| `name`          | string  | Yes      |                                                               |
| `description`   | string  | Yes      |                                                               |
| `content`       | string  |          | Syllabus / body text                                          |
| `image`         | file    |          | Uploaded to ImageKit CDN                                      |
| `category`      | string  |          |                                                               |
| `level`         | string  |          | `"beginner"` / `"intermediate"` / `"advanced"`                |
| `language`      | string  |          | Default: `"English"`                                          |
| `isFree`        | boolean |          | Default: `true`                                               |
| `price`         | number  |          | Default: `0`                                                  |
| `currency`      | string  |          | Default: `"USD"`                                              |
| `totalDuration` | number  |          | Minutes                                                       |
| `status`        | string  |          | `"draft"` / `"published"` / `"archived"` — default: `"draft"` |

```json
// 201
{ "message": "Course created successfully", "course": { ... } }
```

`400` missing required fields · `401` instructor has no institute · `403` wrong role · `429` rate limit

---

### POST `/course/:id/enroll` 🔒

Enroll the authenticated user in a course. If the student has no institute, they are auto-assigned to the course's institute.

```json
// 200
{ "message": "Enrolled successfully", "course": { ... } }
```

`400` already enrolled · `404` course not found

---

### POST `/course/:id/unenroll` 🔒

Remove the authenticated user from a course.

```json
// 200
{ "message": "Unenrolled successfully", "course": { ... } }
```

`400` not enrolled · `404` course not found

---

### PUT `/course/:id` 🔒 `instructor`

Update a course (owner only). Send only fields to change.

```json
// Request
{ "name": "Updated Title", "status": "published" }

// 200
{ "message": "Course updated successfully", "course": { ... } }
```

`401` not the owner · `403` wrong role · `404` course not found

---

### DELETE `/course/:id` 🔒 `instructor`

Soft-delete a course (sets `isDeleted: true`). Owner only.

```json
// 200
{ "message": "Course deleted successfully" }
```

`401` not the owner · `403` wrong role · `404` course not found

---

## Chat / AI Advisor `/chat`

### POST `/chat/recommendations` 🔒

Get AI-powered course recommendations. Uses **Groq (Llama 3.3-70B)** to generate a conversational reply, then searches the course catalog for matching courses using keyword extraction.

| Field   | Type   | Required | Description                      |
| ------- | ------ | -------- | -------------------------------- |
| `input` | string | Yes      | Natural language query from user |

```json
// Request
{ "input": "I want to learn Python for data science as a beginner" }

// 200
{
  "message": "Great choice! I recommend starting with...",
  "recommendations": [
    { "_id": "...", "name": "Python for Data Science", "level": "beginner" }
  ],
  "courseCount": 3
}
```

`400` missing `input` · `500` Groq API error

> Model: `llama-3.3-70b-versatile` · Max tokens: 600 · Temperature: 0.7  
> Keyword extraction covers 24 tech terms (python, react, aws, docker, etc.)

---

## Adaptive Learning Path `/learning-path`

### POST `/learning-path/generate` 🔒

Generate a personalized, prerequisite-ordered learning path using Groq AI and catalog topological sequencing.

| Field             | Type     | Required | Description                                                   |
| ----------------- | -------- | -------- | ------------------------------------------------------------- |
| `careerGoal`      | string   | Yes      | Target role/goal (e.g. `"Full Stack Developer"`)              |
| `currentSkills`   | string[] | No       | List of current skills (e.g. `["html", "css", "javascript"]`) |
| `experienceLevel` | string   | No       | `"beginner"` / `"intermediate"` / `"advanced"` (default: beg) |
| `weeklyHours`     | number   | No       | Weekly study hours commitment (default: `10`)                 |

```json
// 201 Created
{
  "status": "created",
  "summary": "This path takes you from basic web fundamentals to advanced full-stack engineering...",
  "learningPath": {
    "_id": "64a9f...",
    "title": "Full Stack Web Development Path",
    "careerGoal": "Full Stack Developer",
    "weeklyHours": 10,
    "estimatedWeeks": 12,
    "missingSkills": ["react", "node.js", "mongodb"],
    "steps": [
      {
        "_id": "64a9f1...",
        "order": 1,
        "title": "React Frontend Mastery",
        "reason": "Closes frontend skill gap and prepares for full stack projects.",
        "skillsGained": ["react", "redux"],
        "estimatedHours": 20,
        "status": "available"
      },
      {
        "_id": "64a9f2...",
        "order": 2,
        "title": "Node.js & Express APIs",
        "reason": "Teaches server development after UI principles are mastered.",
        "skillsGained": ["node.js", "express"],
        "estimatedHours": 25,
        "status": "locked"
      }
    ]
  }
}
```

---

### GET `/learning-path/my-path` 🔒

Get the authenticated student's current active adaptive learning path populated with course metadata.

```json
// 200
{
  "learningPath": {
    "_id": "64a9f...",
    "title": "Full Stack Web Development Path",
    "steps": [...]
  }
}
```

---

### PATCH `/learning-path/step/:stepId` 🔒

Update milestone step status (e.g. marking as `completed`). Automatically unlocks the subsequent step in the sequence.

| Field    | Type   | Required | Description                                                              |
| -------- | ------ | -------- | ------------------------------------------------------------------------ |
| `status` | string | No       | `"completed"` / `"in-progress"` / `"available"` (default: `"completed"`) |

```json
// 200
{
  "message": "Step updated successfully",
  "learningPath": { ... }
}
```

---

### DELETE `/learning-path/my-path` 🔒

Reset the student's current learning path to allow generating a fresh one.

```json
// 200
{ "message": "Learning paths reset successfully" }
```

---

## Admin `/admin`

All admin endpoints require a Bearer token and `role: "admin"`.

### Institutes

| Method   | Endpoint                         | Description              |
| -------- | -------------------------------- | ------------------------ |
| `GET`    | `/admin/institutes`              | List all institutes      |
| `GET`    | `/admin/institutes/:instituteId` | Get a single institute   |
| `POST`   | `/admin/institutes`              | Create a new institute   |
| `PUT`    | `/admin/institutes/:instituteId` | Update institute details |
| `DELETE` | `/admin/institutes/:instituteId` | Soft-delete an institute |

**Create / Update body:**

| Field         | Type   | Required (create)                           |
| ------------- | ------ | ------------------------------------------- |
| `name`        | string | Yes                                         |
| `email`       | string | Yes                                         |
| `phone`       | string |                                             |
| `website`     | string |                                             |
| `description` | string |                                             |
| `logo`        | string | URL                                         |
| `address`     | object | `{ street, city, state, country, zipCode }` |

```json
// POST 201
{ "message": "Institute created successfully", "data": { ... } }

// PUT 200
{ "message": "Institute updated successfully", "data": { ... } }

// DELETE 200
{ "message": "Institute deleted successfully" }
```

---

### Users

| Method  | Endpoint                      | Description                               |
| ------- | ----------------------------- | ----------------------------------------- |
| `GET`   | `/admin/users`                | List all users (optional `?role=` filter) |
| `PATCH` | `/admin/users/:userId/toggle` | Toggle user active / inactive status      |

`GET /admin/users` accepts `?role=student|instructor|admin` to filter results.

```json
// GET 200
{
  "data": [
    {
      "_id": "...",
      "fullname": "Alice",
      "email": "alice@example.com",
      "role": "student",
      "institute": { "name": "Tech Academy" },
      "isActive": true,
      "createdAt": "..."
    }
  ]
}

// PATCH 200
{ "message": "User activated successfully", "data": { "id": "...", "isActive": true } }
```

---

### Courses (Admin)

| Method   | Endpoint                   | Description               |
| -------- | -------------------------- | ------------------------- |
| `GET`    | `/admin/courses`           | List all platform courses |
| `DELETE` | `/admin/courses/:courseId` | Force-delete any course   |

```json
// GET 200
{
  "data": [ ... ],
  "pagination": { "currentPage": 1, "totalPages": 5, "total": 48 }
}

// DELETE 200
{ "message": "Course deleted successfully" }
```

---

## Error Format

All errors return:

```json
{
  "success": false,
  "errorType": "AuthError | ValidationError | JWTError | InternalError",
  "message": "Human-readable description"
}
```

| Status | Condition                               |
| ------ | --------------------------------------- |
| 400    | Invalid input / missing required fields |
| 401    | Bad credentials / expired token         |
| 403    | Insufficient role / wrong ownership     |
| 404    | Resource not found                      |
| 429    | Rate limit exceeded                     |
| 500    | Server error                            |

---

## Rate Limits

| Limiter         | Window | Limit | Keyed By      |
| --------------- | ------ | ----- | ------------- |
| General         | 15 min | 100   | IP            |
| Auth login      | 15 min | 5     | Email or IP   |
| Course creation | 1 hour | 10    | User ID or IP |

> Rate limiting is **disabled** in `NODE_ENV=development`.
