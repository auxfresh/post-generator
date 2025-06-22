import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertUserSchema } from "@shared/schema";
import { generatePost } from "./services/gemini";
import { z } from "zod";

const generatePostRequestSchema = z.object({
  idea: z.string().optional(),
  platform: z.string(),
  tone: z.string(),
  addEmojis: z.boolean(),
  addHashtags: z.boolean(),
  suggestImages: z.boolean(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create or get user endpoint
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      let user = await storage.getUserByFirebaseUid(validatedData.firebaseUid);
      
      if (!user) {
        // Create new user
        user = await storage.createUser(validatedData);
      }
      
      res.json(user);
    } catch (error: any) {
      console.error("Error creating/getting user:", error);
      res.status(500).json({ 
        message: error.message || "Failed to create/get user" 
      });
    }
  });

  // Generate post endpoint
  app.post("/api/generate-post", async (req, res) => {
    try {
      const validatedData = generatePostRequestSchema.parse(req.body);
      
      const content = await generatePost({
        idea: validatedData.idea,
        platform: validatedData.platform,
        tone: validatedData.tone,
        addEmojis: validatedData.addEmojis,
        addHashtags: validatedData.addHashtags,
        suggestImages: validatedData.suggestImages,
      });

      res.json({
        content,
        platform: validatedData.platform,
        tone: validatedData.tone,
      });
    } catch (error: any) {
      console.error("Error generating post:", error);
      res.status(500).json({ 
        message: error.message || "Failed to generate post" 
      });
    }
  });

  // Get user posts
  app.get("/api/posts", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const posts = await storage.getUserPosts(user.id);
      res.json(posts);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch posts" 
      });
    }
  });

  // Create new post
  app.post("/api/posts", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const validatedData = insertPostSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const post = await storage.createPost(validatedData);
      res.json(post);
    } catch (error: any) {
      console.error("Error creating post:", error);
      res.status(500).json({ 
        message: error.message || "Failed to create post" 
      });
    }
  });

  // Delete post
  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      await storage.deletePost(postId);
      res.json({ message: "Post deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting post:", error);
      res.status(500).json({ 
        message: error.message || "Failed to delete post" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
