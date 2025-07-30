#!/usr/bin/env node

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;
import * as fs from 'fs';
import * as path from 'path';

async function setupDatabase() {
  console.log('🗄️  Setting up database...');
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'migrations', '0000_sharp_pepper_potts.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.log('❌ Migration file not found. Creating tables directly...');
      
      // If no migration file exists, create tables directly
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

      console.log('✅ Database tables created successfully');
    } else {
      // Execute migration file
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Split by statement breakpoint and execute each statement
      const statements = migrationSQL
        .split('--> statement-breakpoint')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        if (statement.trim()) {
          await pool.query(statement);
        }
      }
      
      console.log('✅ Migration executed successfully');
    }
    
    // Verify tables exist
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Created tables:', result.rows.map((r: any) => r.table_name).join(', '));
    console.log('✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { setupDatabase };