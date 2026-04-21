/**
 * API Client for authenticated requests to the backend
 * Handles token management and automatic token refresh
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiClient {
  private apiBaseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.apiBaseUrl = baseUrl;
  }

  /**
   * Get the access token from localStorage
   */
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  /**
   * Get the refresh token from localStorage
   */
  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  }

  /**
   * Set tokens in localStorage
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  /**
   * Refresh the access token
   */
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.clearTokens();
        return null;
      }

      const response = await fetch(`${this.apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Clear all tokens from localStorage
   */
  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  }

  /**
   * Make an authenticated request with automatic token refresh
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const accessToken = this.getAccessToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    let response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    // If token expired, try to refresh and retry
    if (response.status === 401) {
      const newAccessToken = await this.refreshAccessToken();

      if (newAccessToken) {
        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
          credentials: "include",
        });
      } else {
        // Redirect to login if refresh fails
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Authentication failed");
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data as T;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or advanced usage
export default ApiClient;
