/**
 * API Client Layer for Admin Dashboard
 * This client provides type-safe interfaces for all API calls
 * Replace BASE_URL and implement actual endpoints as needed
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

interface ApiError {
  message: string
  status: number
  details?: any
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        data,
        status: response.status,
      }
    } catch (error) {
      const apiError = error instanceof Error ? error.message : 'Unknown error'
      return {
        data: null as any,
        error: apiError,
        status: 500,
      }
    }
  }

  // Institutes endpoints
  async getInstitutes(filters?: {
    page?: number
    limit?: number
    search?: string
  }) {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)

    return this.request('/institutes', {
      method: 'GET',
    })
  }

  async getInstituteById(id: string) {
    return this.request(`/institutes/${id}`, {
      method: 'GET',
    })
  }

  async createInstitute(data: any) {
    return this.request('/institutes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateInstitute(id: string, data: any) {
    return this.request(`/institutes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteInstitute(id: string) {
    return this.request(`/institutes/${id}`, {
      method: 'DELETE',
    })
  }

  // Users endpoints
  async getUsers(filters?: {
    page?: number
    limit?: number
    search?: string
    role?: string
  }) {
    return this.request('/users', {
      method: 'GET',
    })
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`, {
      method: 'GET',
    })
  }

  async createUser(data: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Courses endpoints
  async getCourses(filters?: {
    page?: number
    limit?: number
    search?: string
  }) {
    return this.request('/courses', {
      method: 'GET',
    })
  }

  async getCourseById(id: string) {
    return this.request(`/courses/${id}`, {
      method: 'GET',
    })
  }

  async createCourse(data: any) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCourse(id: string, data: any) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    })
  }

  // Analytics endpoints
  async getDashboardStats() {
    return this.request('/analytics/dashboard-stats', {
      method: 'GET',
    })
  }

  async getEnrollmentData(timeRange?: string) {
    const params = timeRange ? `?timeRange=${timeRange}` : ''
    return this.request(`/analytics/enrollment${params}`, {
      method: 'GET',
    })
  }

  async getCoursePerformance() {
    return this.request('/analytics/course-performance', {
      method: 'GET',
    })
  }

  // Reports endpoints
  async getReports(filters?: {
    page?: number
    limit?: number
    type?: string
    status?: string
  }) {
    return this.request('/reports', {
      method: 'GET',
    })
  }

  async generateReport(data: any) {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async downloadReport(id: string) {
    return this.request(`/reports/${id}/download`, {
      method: 'GET',
    })
  }

  async deleteReport(id: string) {
    return this.request(`/reports/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
export type { ApiResponse, ApiError }
