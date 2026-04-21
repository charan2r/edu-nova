const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CourseInput {
  name: string;
  description: string;
  content: string;
  image?: File;
}

export interface CourseResponse {
  _id: string;
  name: string;
  description: string;
  content: string;
  image: string;
  instructor: string;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export const courseApi = {
  // Get all courses with pagination
  async getAllCourses(page: number = 1, limit: number = 10) {
    const response = await fetch(
      `${API_BASE_URL}/course?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
        },
      },
    );
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  },

  // Get user's enrolled courses
  async getEnrolledCourses() {
    const response = await fetch(`${API_BASE_URL}/course/enrolled`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch enrolled courses");
    return response.json();
  },

  // Get instructor's courses
  async getInstructorCourses() {
    const response = await fetch(`${API_BASE_URL}/course/my-courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch instructor courses");
    return response.json();
  },

  // Get single course
  async getCourseById(courseId: string) {
    const response = await fetch(`${API_BASE_URL}/course/${courseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch course");
    return response.json();
  },

  // Create course
  async createCourse(data: CourseInput) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("content", data.content);
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await fetch(`${API_BASE_URL}/course`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create course");
    }
    return response.json();
  },

  // Update course
  async updateCourse(courseId: string, data: Partial<CourseInput>) {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.content) formData.append("content", data.content);
    if (data.image) formData.append("image", data.image);

    const response = await fetch(`${API_BASE_URL}/course/${courseId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update course");
    return response.json();
  },

  // Delete course
  async deleteCourse(courseId: string) {
    const response = await fetch(`${API_BASE_URL}/course/${courseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete course");
    return response.json();
  },

  // Search courses
  async searchCourses(query: string) {
    const response = await fetch(
      `${API_BASE_URL}/course/search/query?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""}`,
        },
      },
    );
    if (!response.ok) throw new Error("Failed to search courses");
    return response.json();
  },
};
