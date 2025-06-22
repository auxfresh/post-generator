import { users, posts, type User, type InsertUser, type Post, type InsertPost } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserPosts(userId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  deletePost(postId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private currentUserId: number;
  private currentPostId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;

    // Create a default user for development
    this.users.set(1, {
      id: 1,
      firebaseUid: "default-user",
      email: "user@example.com",
      displayName: "Test User",
      createdAt: new Date().toISOString(),
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id,
      firebaseUid: insertUser.firebaseUid,
      email: insertUser.email,
      displayName: insertUser.displayName || null,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter((post) => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = {
      id,
      userId: insertPost.userId!,
      content: insertPost.content,
      platform: insertPost.platform,
      tone: insertPost.tone,
      idea: insertPost.idea || null,
      hasEmojis: insertPost.hasEmojis ?? false,
      hasHashtags: insertPost.hasHashtags ?? false,
      hasSuggestedImages: insertPost.hasSuggestedImages ?? false,
      createdAt: new Date().toISOString(),
    };
    this.posts.set(id, post);
    return post;
  }

  async deletePost(postId: number): Promise<void> {
    this.posts.delete(postId);
  }
}

export const storage = new MemStorage();
