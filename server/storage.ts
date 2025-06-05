import { users, type User, type InsertUser } from "@shared/schema";

// Updated interface to use string IDs to match your actual usage
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Use the provided ID from insertUser (which should include the id)
    const user: User = { ...insertUser } as User;
    this.users.set(user.id, user);
    return user;
  }
}

export const storage = new MemStorage();