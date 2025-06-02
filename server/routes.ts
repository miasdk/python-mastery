import type { Express } from "express";
import { createServer, type Server } from "http";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "../shared/schema";
import { eq, desc, asc } from "drizzle-orm";

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const database = drizzle(pool, { schema });

export async function registerRoutes(app: Express): Promise<Server> {
  // User creation route
  app.post("/api/users", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await database.query.users.findFirst({
        where: (users, { or, eq }) => or(eq(users.username, username), eq(users.email, email))
      });
      
      if (existingUser) {
        return res.status(400).json({ error: "Username or email already exists" });
      }
      
      // Create new user
      const [newUser] = await database.insert(schema.users).values({
        username,
        email,
        passwordHash: password, // In production, hash this properly
      }).returning();
      
      // Initialize curriculum if needed
      await initializeCurriculum();
      
      res.json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        current_streak: newUser.currentStreak,
        total_problems: newUser.totalProblems,
        total_xp: newUser.totalXp
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Get user dashboard
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user
      const user = await database.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId)
      });
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Get sections with lessons and problems
      const sections = await database.query.sections.findMany({
        orderBy: (sections, { asc }) => [asc(sections.orderIndex)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.orderIndex)],
            with: {
              problems: {
                orderBy: (problems, { asc }) => [asc(problems.orderIndex)]
              }
            }
          }
        }
      });
      
      // Get user progress
      const userProgress = await database.query.userProgress.findMany({
        where: (progress, { eq }) => eq(progress.userId, userId)
      });
      
      // Get recent achievements
      const recentAchievements = await database.query.achievements.findMany({
        where: (achievements, { eq }) => eq(achievements.userId, userId),
        orderBy: (achievements, { desc }) => [desc(achievements.earnedAt)],
        limit: 5
      });
      
      // Process sections with progress
      const sectionsWithProgress = sections.map(section => {
        const lessonsWithProgress = section.lessons.map(lesson => {
          const problemsWithProgress = lesson.problems.map(problem => {
            const progress = userProgress.find(p => p.problemId === problem.id);
            return {
              ...problem,
              is_completed: progress?.isCompleted || false,
              attempts: progress?.attempts || 0,
              best_time: progress?.bestTime || null
            };
          });
          
          const completedProblems = problemsWithProgress.filter(p => p.is_completed).length;
          return {
            ...lesson,
            problems: problemsWithProgress,
            completed_problems: completedProblems,
            total_problems: problemsWithProgress.length
          };
        });
        
        const completedLessons = lessonsWithProgress.filter(l => 
          l.completed_problems === l.total_problems && l.total_problems > 0
        ).length;
        
        return {
          ...section,
          lessons: lessonsWithProgress,
          completed_lessons: completedLessons,
          total_lessons: lessonsWithProgress.length
        };
      });
      
      // Find current problem (first incomplete)
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
      const totalProblemsInCurriculum = sectionsWithProgress.reduce((acc, section) => 
        acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.problems.length, 0), 0
      );
      const progressPercentage = totalProblemsInCurriculum > 0 ? 
        (user.totalProblems / totalProblemsInCurriculum) * 100 : 0;
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          current_streak: user.currentStreak,
          total_problems: user.totalProblems,
          total_xp: user.totalXp,
          current_section: user.currentSection,
          current_lesson: user.currentLesson
        },
        current_problem: currentProblem,
        sections: sectionsWithProgress,
        recent_achievements: recentAchievements.map(a => ({
          title: a.title,
          description: a.description,
          icon: a.icon,
          earned_at: a.earnedAt.toISOString()
        })),
        stats: {
          progress_percentage: Math.round(progressPercentage * 10) / 10,
          problems_solved: user.totalProblems,
          current_streak: user.currentStreak,
          total_xp: user.totalXp
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ error: "Failed to fetch dashboard" });
    }
  });

  // Initialize curriculum data
  async function initializeCurriculum() {
    const existingSections = await database.query.sections.findMany();
    if (existingSections.length > 0) return;
    
    // Basic curriculum data
    const curriculumData = [
      {
        title: "Python Basics",
        description: "Learn fundamental Python concepts",
        lessons: [
          {
            title: "Variables & Data Types",
            description: "Understanding variables, numbers, strings, and booleans",
            problems: [
              {
                title: "Variable Assignment",
                description: "Create variables and assign values to them.",
                difficulty: "easy",
                starter_code: "# Create a variable called 'name' and assign your name to it\n# Create a variable called 'age' and assign your age to it\n\ndef get_variables():\n    # Your code here\n    return name, age",
                solution: "def get_variables():\n    name = \"Alice\"\n    age = 25\n    return name, age",
                test_cases: [
                  {
                    function_name: "get_variables",
                    input: [],
                    expected: ["Alice", 25]
                  }
                ],
                hints: [
                  "Use the assignment operator (=) to assign values to variables",
                  "Strings should be enclosed in quotes",
                  "Numbers don't need quotes"
                ],
                xp_reward: 25
              }
            ]
          }
        ]
      }
    ];
    
    for (const [sectionIdx, sectionData] of curriculumData.entries()) {
      const [section] = await database.insert(schema.sections).values({
        title: sectionData.title,
        description: sectionData.description,
        orderIndex: sectionIdx + 1,
        isLocked: sectionIdx > 0
      }).returning();
      
      for (const [lessonIdx, lessonData] of sectionData.lessons.entries()) {
        const [lesson] = await database.insert(schema.lessons).values({
          sectionId: section.id,
          title: lessonData.title,
          description: lessonData.description,
          orderIndex: lessonIdx + 1,
          isLocked: lessonIdx > 0 || sectionIdx > 0
        }).returning();
        
        for (const [problemIdx, problemData] of lessonData.problems.entries()) {
          await database.insert(schema.problems).values({
            lessonId: lesson.id,
            title: problemData.title,
            description: problemData.description,
            difficulty: problemData.difficulty,
            orderIndex: problemIdx + 1,
            starterCode: problemData.starter_code,
            solution: problemData.solution,
            testCases: problemData.test_cases,
            hints: problemData.hints,
            xpReward: problemData.xp_reward
          });
        }
      }
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
