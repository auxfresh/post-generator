import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GeneratePostOptions {
  idea?: string;
  platform: string;
  tone: string;
  addEmojis: boolean;
  addHashtags: boolean;
  suggestImages: boolean;
}

export async function generatePost(options: GeneratePostOptions): Promise<string> {
  const {
    idea,
    platform,
    tone,
    addEmojis,
    addHashtags,
    suggestImages,
  } = options;

  // Build the prompt based on user preferences
  let prompt = `Create a social media post for ${platform} with a ${tone} tone.`;

  if (idea) {
    prompt += ` The post should be based on this idea: "${idea}".`;
  } else {
    prompt += ` Create an engaging post about a relevant and interesting topic.`;
  }

  // Add platform-specific guidelines
  switch (platform) {
    case "twitter":
      prompt += ` Keep it under 280 characters and make it engaging and shareable.`;
      break;
    case "linkedin":
      prompt += ` Make it professional and suitable for LinkedIn audience. Can be longer form content.`;
      break;
    case "facebook":
      prompt += ` Make it conversational and engaging for Facebook audience.`;
      break;
    case "instagram":
      prompt += ` Make it visually engaging and suitable for Instagram audience.`;
      break;
    case "threads":
      prompt += ` Keep it conversational and authentic for Threads audience.`;
      break;
  }

  // Add tone-specific guidelines
  switch (tone) {
    case "professional":
      prompt += ` Use professional language and maintain a business-appropriate tone.`;
      break;
    case "friendly":
      prompt += ` Use warm, approachable language that feels personal and friendly.`;
      break;
    case "funny":
      prompt += ` Add humor and wit to make the post entertaining and shareable.`;
      break;
    case "bold":
      prompt += ` Use strong, confident language that makes a statement.`;
      break;
    case "inspiring":
      prompt += ` Make it motivational and uplifting to inspire the audience.`;
      break;
    case "casual":
      prompt += ` Use relaxed, informal language as if talking to a friend.`;
      break;
  }

  // Add optional features
  if (addEmojis) {
    prompt += ` Include relevant emojis to make the post more engaging.`;
  }

  if (addHashtags) {
    prompt += ` Include 2-5 relevant hashtags at the end.`;
  }

  if (suggestImages) {
    prompt += ` At the end, suggest 1-2 types of images that would work well with this post.`;
  }

  prompt += ` Return only the post content, no additional commentary or explanation.`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    return text.trim();
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}
