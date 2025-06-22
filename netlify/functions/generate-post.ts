import { Handler } from '@netlify/functions';
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const generatePostRequestSchema = z.object({
  idea: z.string().optional(),
  platform: z.string(),
  tone: z.string(),
  addEmojis: z.boolean(),
  addHashtags: z.boolean(),
  suggestImages: z.boolean(),
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function generatePost(options: any): Promise<string> {
  const {
    idea,
    platform,
    tone,
    addEmojis,
    addHashtags,
    suggestImages,
  } = options;

  let prompt = `Create a social media post for ${platform} with a ${tone} tone.`;

  if (idea) {
    prompt += ` The post should be based on this idea: "${idea}".`;
  } else {
    prompt += ` Create an engaging post about a relevant and interesting topic.`;
  }

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

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-firebase-uid',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const validatedData = generatePostRequestSchema.parse(JSON.parse(event.body || '{}'));
    
    const content = await generatePost({
      idea: validatedData.idea,
      platform: validatedData.platform,
      tone: validatedData.tone,
      addEmojis: validatedData.addEmojis,
      addHashtags: validatedData.addHashtags,
      suggestImages: validatedData.suggestImages,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content,
        platform: validatedData.platform,
        tone: validatedData.tone,
      }),
    };
  } catch (error: any) {
    console.error("Error generating post:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: error.message || "Failed to generate post" 
      }),
    };
  }
};