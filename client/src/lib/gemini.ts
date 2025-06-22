import { apiRequest } from "./queryClient";

export interface GeneratePostRequest {
  idea?: string;
  platform: string;
  tone: string;
  addEmojis: boolean;
  addHashtags: boolean;
  suggestImages: boolean;
}

export interface GeneratePostResponse {
  content: string;
  platform: string;
  tone: string;
}

export async function generatePost(request: GeneratePostRequest): Promise<GeneratePostResponse> {
  const response = await apiRequest("POST", "/api/generate-post", request);
  return response.json();
}
