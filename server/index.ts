import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Import curriculum data for seeding
import { comprehensiveProblems } from "../scripts/simple-problems";

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
    
    // Check if curriculum data exists, if not, seed it
    const sectionCheck = await pool.query('SELECT COUNT(*) FROM sections');
    const sectionCount = parseInt(sectionCheck.rows[0].count);
    
    if (sectionCount === 0) {
      console.log('🌱 No curriculum data found, seeding comprehensive curriculum...');
      await seedCurriculumData(pool);
    } else {
      console.log(`📚 Found ${sectionCount} sections in curriculum, skipping seed`);
    }
    
    console.log('✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Curriculum seeding function
async function seedCurriculumData(pool: any) {
  try {
    console.log('📚 Seeding curriculum sections...');
    
    // Sections data
    const sections = [
      { id: 1, title: "Foundation Concepts", description: "Python syntax fundamentals, built-in functions, and basic programming concepts", order_index: 1, is_locked: false },
      { id: 2, title: "Data Structures", description: "Master linked lists, trees, graphs, and advanced data structures", order_index: 2, is_locked: false },
      { id: 3, title: "Algorithms & Problem Solving", description: "Recursion, divide & conquer, backtracking, and two-pointer techniques", order_index: 3, is_locked: false },
      { id: 4, title: "Advanced Programming Techniques", description: "Matrix operations, string manipulation, and advanced Python syntax", order_index: 4, is_locked: false },
      { id: 5, title: "Graph Theory & Algorithms", description: "Graph traversal, advanced graph algorithms, and representations", order_index: 5, is_locked: false },
      { id: 6, title: "Dynamic Programming", description: "1-D and 2-D dynamic programming with optimization techniques", order_index: 6, is_locked: false },
      { id: 7, title: "Interview Preparation", description: "Problem-solving strategies, coding best practices, and interview techniques", order_index: 7, is_locked: false }
    ];

    for (const section of sections) {
      await pool.query(
        'INSERT INTO sections (id, title, description, order_index, is_locked) VALUES ($1, $2, $3, $4, $5)',
        [section.id, section.title, section.description, section.order_index, section.is_locked]
      );
    }

    console.log('📖 Seeding curriculum lessons...');
    
    // Lessons data
    const lessons = [
      { id: 1, section_id: 1, title: "Python Syntax & Fundamentals", description: "Built-in functions, variables, data types, and control flow", order_index: 1, is_locked: false },
      { id: 2, section_id: 1, title: "Object-Oriented Programming", description: "Classes, objects, inheritance, and encapsulation", order_index: 2, is_locked: false },
      { id: 3, section_id: 1, title: "Collections & Data Manipulation", description: "Lists, dictionaries, sets, and data manipulation techniques", order_index: 3, is_locked: false },
      { id: 4, section_id: 2, title: "Linked Lists", description: "Node structures, traversal, and pointer techniques", order_index: 1, is_locked: false },
      { id: 5, section_id: 2, title: "Trees", description: "Binary trees, BSTs, and tree traversal algorithms", order_index: 2, is_locked: false },
      { id: 6, section_id: 2, title: "Advanced Data Structures", description: "Priority queues, heaps, and Union Find", order_index: 3, is_locked: false },
      { id: 7, section_id: 3, title: "Recursion", description: "Base cases, recursive cases, and call stack understanding", order_index: 1, is_locked: false },
      { id: 8, section_id: 3, title: "Divide & Conquer", description: "Binary search, merge sort, and problem decomposition", order_index: 2, is_locked: false },
      { id: 9, section_id: 3, title: "Two-Pointer Technique", description: "Opposite and same direction pointers for efficient solutions", order_index: 3, is_locked: false },
      { id: 10, section_id: 4, title: "Matrix Operations", description: "Grid traversal, flood fill, and path finding", order_index: 1, is_locked: false },
      { id: 11, section_id: 4, title: "String Manipulation", description: "Pattern matching, string operations, and text processing", order_index: 2, is_locked: false },
      { id: 12, section_id: 5, title: "Graph Traversal", description: "BFS, DFS, and cycle detection algorithms", order_index: 1, is_locked: false },
      { id: 13, section_id: 5, title: "Advanced Graph Algorithms", description: "Topological sort, Dijkstra's, and minimum spanning trees", order_index: 2, is_locked: false },
      { id: 14, section_id: 6, title: "1-D Dynamic Programming", description: "State definition, recurrence relations, and memoization", order_index: 1, is_locked: false },
      { id: 15, section_id: 6, title: "2-D Dynamic Programming", description: "2D state tables, knapsack problems, and grid DP", order_index: 2, is_locked: false },
      { id: 16, section_id: 7, title: "Problem-Solving Strategies", description: "Pattern recognition, algorithm selection, and complexity analysis", order_index: 1, is_locked: false },
      { id: 17, section_id: 7, title: "Coding Best Practices", description: "Code organization, testing strategies, and interview techniques", order_index: 2, is_locked: false }
    ];

    for (const lesson of lessons) {
      await pool.query(
        'INSERT INTO lessons (id, section_id, title, description, order_index, is_locked) VALUES ($1, $2, $3, $4, $5, $6)',
        [lesson.id, lesson.section_id, lesson.title, lesson.description, lesson.order_index, lesson.is_locked]
      );
    }

    console.log('🧩 Seeding curriculum problems...');
    
    // Problems data
    for (const problem of comprehensiveProblems) {
      await pool.query(
        'INSERT INTO problems (id, lesson_id, title, description, difficulty, order_index, starter_code, solution, test_cases, hints, xp_reward, research_topics, learning_objectives, professional_context, business_category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        [
          problem.id,
          problem.lessonId,
          problem.title,
          problem.description,
          problem.difficulty,
          problem.orderIndex,
          problem.starterCode,
          problem.solution,
          JSON.stringify(problem.testCases),
          JSON.stringify(problem.hints),
          problem.xpReward,
          JSON.stringify(problem.researchTopics),
          JSON.stringify(problem.learningObjectives),
          problem.professionalContext,
          problem.businessCategory
        ]
      );
    }

    console.log(`✅ Curriculum seeded successfully! ${sections.length} sections, ${lessons.length} lessons, ${comprehensiveProblems.length} problems`);
    
  } catch (error) {
    console.error('❌ Error seeding curriculum:', error);
    throw error;
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session with proper production settings
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'python-learning-platform-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for now since we're having CORS issues
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax' as const // More permissive for cross-origin
  }
};

// In production, we might need to use a database-backed session store
// For now, using memory store but with better configuration
app.use(session(sessionConfig));

// Add CORS headers for cross-origin requests from Vercel frontend
app.use((req, res, next) => {
  const origin = req.get('Origin');
  
  // Allow requests from your Vercel frontend or localhost in development
  if (origin && (
    origin.includes('vercel.app') || 
    origin.includes('localhost') ||
    origin.includes('127.0.0.1')
  )) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,Pragma');
  }
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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