import type { Express } from "express";
import { createServer, type Server } from "http";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "../shared/schema";
import { eq, asc, desc } from "drizzle-orm";

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const database = drizzle(pool, { schema });

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user dashboard
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user
      const user = await database
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1);
      
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userData = user[0];
      
      // Get sections
      const sections = await database
        .select()
        .from(schema.sections)
        .orderBy(asc(schema.sections.orderIndex));
      
      // Get lessons
      const lessons = await database
        .select()
        .from(schema.lessons)
        .orderBy(asc(schema.lessons.orderIndex));
      
      // Get problems
      const problems = await database
        .select()
        .from(schema.problems)
        .orderBy(asc(schema.problems.orderIndex));
      
      // Get user progress
      const userProgress = await database
        .select()
        .from(schema.userProgress)
        .where(eq(schema.userProgress.userId, userId));
      
      // Get achievements
      const achievements = await database
        .select()
        .from(schema.achievements)
        .where(eq(schema.achievements.userId, userId))
        .orderBy(desc(schema.achievements.earnedAt))
        .limit(5);
      
      // Build sections with progress
      const sectionsWithProgress = sections.map(section => {
        const sectionLessons = lessons.filter(l => l.sectionId === section.id);
        const lessonsWithProgress = sectionLessons.map(lesson => {
          const lessonProblems = problems.filter(p => p.lessonId === lesson.id);
          const problemsWithProgress = lessonProblems.map(problem => {
            const progress = userProgress.find(p => p.problemId === problem.id);
            return {
              ...problem,
              is_completed: progress?.isCompleted || false,
              attempts: progress?.attempts || 0,
              best_time: progress?.bestTime || null
            };
          });
          
          return {
            ...lesson,
            problems: problemsWithProgress,
            completed_problems: problemsWithProgress.filter(p => p.is_completed).length,
            total_problems: problemsWithProgress.length
          };
        });
        
        return {
          ...section,
          lessons: lessonsWithProgress,
          completed_lessons: lessonsWithProgress.filter(l => 
            l.completed_problems === l.total_problems && l.total_problems > 0
          ).length,
          total_lessons: lessonsWithProgress.length
        };
      });
      
      // Find current problem
      let currentProblem = null;
      for (const section of sectionsWithProgress) {
        if (!section.isLocked) {
          for (const lesson of section.lessons) {
            if (!lesson.isLocked) {
              for (const problem of lesson.problems) {
                if (!problem.is_completed) {
                  currentProblem = problem;
                  break;
                }
              }
              if (currentProblem) break;
            }
          }
          if (currentProblem) break;
        }
      }
      
      // Calculate stats
      const totalProblems = sectionsWithProgress.reduce((acc, section) => 
        acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.problems.length, 0), 0
      );
      const progressPercentage = totalProblems > 0 ? (userData.totalProblems / totalProblems) * 100 : 0;
      
      res.json({
        user: {
          id: userData.id,
          username: userData.username,
          current_streak: userData.currentStreak,
          total_problems: userData.totalProblems,
          total_xp: userData.totalXp,
          current_section: userData.currentSection,
          current_lesson: userData.currentLesson
        },
        current_problem: currentProblem,
        sections: sectionsWithProgress,
        recent_achievements: achievements.map(a => ({
          title: a.title,
          description: a.description,
          icon: a.icon,
          earned_at: a.earnedAt.toISOString()
        })),
        stats: {
          progress_percentage: Math.round(progressPercentage * 10) / 10,
          problems_solved: userData.totalProblems,
          current_streak: userData.currentStreak,
          total_xp: userData.totalXp
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ error: "Failed to fetch dashboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}