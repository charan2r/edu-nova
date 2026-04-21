const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CourseRecommendation {
  _id: string;
  name: string;
  description: string;
  instructor: string;
  price: number;
  rating?: number;
}

interface RecommendationsResponse {
  recommendations: CourseRecommendation[];
  message: string;
}

export async function getCourseRecommendations(
  input: string,
  token: string,
): Promise<RecommendationsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400) {
        throw new Error(errorData.message || "Invalid input");
      }

      throw new Error(errorData.message || "Failed to fetch recommendations");
    }

    const data = await response.json();
    return data as RecommendationsResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection.");
  }
}
