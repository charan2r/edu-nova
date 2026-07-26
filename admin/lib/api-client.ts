const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data as T;
}

// Institutes 
export const instituteApi = {
  getAll: () => request<{ data: any[] }>("/admin/institutes"),
  getById: (id: string) => request<{ data: any }>(`/admin/institutes/${id}`),
  create: (body: any) =>
    request<{ message: string; data: any }>("/admin/institutes", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: any) =>
    request<{ message: string; data: any }>(`/admin/institutes/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id: string) =>
    request<{ message: string }>(`/admin/institutes/${id}`, {
      method: "DELETE",
    }),
  // Instructor assignment
  getInstructors: (instituteId: string) =>
    request<{ data: any[] }>(`/admin/institutes/${instituteId}/instructors`),
  assignInstructor: (instituteId: string, instructorId: string) =>
    request<{ message: string; cascaded: any }>(
      `/admin/institutes/${instituteId}/instructors`,
      { method: "POST", body: JSON.stringify({ instructorId }) }
    ),
  unassignInstructor: (instructorId: string) =>
    request<{ message: string }>(`/admin/instructors/${instructorId}/unassign`, {
      method: "DELETE",
    }),
  getUnassignedInstructors: () =>
    request<{ data: any[] }>("/admin/instructors/unassigned"),
};

// Users 
export const userApi = {
  getAll: (role?: string) =>
    request<{ data: any[] }>(role ? `/admin/users?role=${role}` : "/admin/users"),
  toggleStatus: (id: string) =>
    request<{ message: string; data: any }>(`/admin/users/${id}/toggle`, {
      method: "PATCH",
    }),
};

//Courses 
export const courseApi = {
  getAll: (page = 1, limit = 100) =>
    request<{ data: any[]; pagination: any }>(
      `/admin/courses?page=${page}&limit=${limit}`
    ),
  delete: (id: string) =>
    request<{ message: string }>(`/admin/courses/${id}`, {
      method: "DELETE",
    }),
};
