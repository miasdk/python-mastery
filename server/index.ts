import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Database setup function
async function setupDatabase() {
  console.log('🗄️  Setting up database...');
  
  const { Pool } = await import('pg');
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new (Pool as any)({ connectionString });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();

    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" text PRIMARY KEY NOT NULL,
        "username" text NOT NULL,
        "email" text,
        "first_name" text,
        "last_name" text,
        "profile_image_url" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "current_streak" integer DEFAULT 0 NOT NULL,
        "total_problems" integer DEFAULT 0 NOT NULL,
        "total_xp" integer DEFAULT 0 NOT NULL,
        "current_section" integer DEFAULT 1 NOT NULL,
        "current_lesson" integer DEFAULT 1 NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "sid" text PRIMARY KEY NOT NULL,
        "sess" jsonb NOT NULL,
        "expire" timestamp NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "sections" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "order_index" integer NOT NULL,
        "is_locked" boolean DEFAULT true NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "lessons" (
        "id" serial PRIMARY KEY NOT NULL,
        "section_id" integer NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "order_index" integer NOT NULL,
        "is_locked" boolean DEFAULT true NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "problems" (
        "id" serial PRIMARY KEY NOT NULL,
        "lesson_id" integer NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "difficulty" text NOT NULL,
        "order_index" integer NOT NULL,
        "starter_code" text NOT NULL,
        "solution" text NOT NULL,
        "test_cases" jsonb NOT NULL,
        "hints" jsonb NOT NULL,
        "xp_reward" integer DEFAULT 50 NOT NULL,
        "research_topics" jsonb,
        "learning_objectives" jsonb,
        "professional_context" text,
        "business_category" text
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user_progress" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "problem_id" integer NOT NULL,
        "is_completed" boolean DEFAULT false NOT NULL,
        "attempts" integer DEFAULT 0 NOT NULL,
        "best_time" integer,
        "hints_used" integer DEFAULT 0 NOT NULL,
        "completed_at" timestamp,
        "last_attempt_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "code_submissions" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "problem_id" integer NOT NULL,
        "code" text NOT NULL,
        "is_correct" boolean NOT NULL,
        "execution_time" integer,
        "output" text,
        "error" text,
        "submitted_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "achievements" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "type" text NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "icon" text NOT NULL,
        "earned_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Verify tables exist
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Database tables ready:', result.rows.map((r: any) => r.table_name).join(', '));
    console.log('✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'python-learning-platform-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Set up database tables before starting the server
  if (process.env.NODE_ENV === 'production') {
    await setupDatabase();
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error('❌ Express error:', err);
    res.status(status).json({ message });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from env, defaulting to 3000
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    log(`🚀 PythonMastery serving on http://localhost:${port}`);
    log(`🔗 GitHub OAuth callback: http://localhost:${port}/api/auth/github/callback`);
  });
})();