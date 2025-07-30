// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import * as schema from "../shared/schema";
import { eq, asc, desc, and, or, isNull } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PythonExecutor } from "./python-executor";
import { SimplePythonExecutor } from "./simple-python-executor";

const database = db;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Validate required environment variables
if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID environment variable is required');
}
if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('GITHUB_CLIENT_SECRET environment variable is required');
}

// Configure GitHub OAuth strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/api/auth/github/callback"
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    console.log('🔐 GitHub OAuth callback received for user:', profile.username);
    const githubUserId = `github_${profile.id}`;
    
    const existingUser = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, githubUserId))
      .limit(1);
    
    if (existingUser.length > 0) {
      console.log('✅ Existing user found:', existingUser[0].username);
      return done(null, existingUser[0]);
    }
    
    console.log('👤 Creating new user from GitHub profile');
    const newUser = await database
      .insert(schema.users)
      .values({
        id: githubUserId,
        username: profile.displayName || profile.username || 'GitHub User',
        email: profile.emails?.[0]?.value || '',
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        profileImageUrl: profile.photos?.[0]?.value || '',
        currentStreak: 0,
        totalProblems: 0,
        totalXp: 0,
        currentSection: 1,
        currentLesson: 1,
      })
      .returning();
    
    console.log('✅ New user created:', newUser[0].username);
    return done(null, newUser[0]);
  } catch (error) {
    console.error('❌ GitHub OAuth error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user: any, done) => {
  console.log('🔄 Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    console.log('🔄 Deserializing user:', id);
    const user = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    
    if (user.length > 0) {
      done(null, user[0]);
    } else {
      console.log('❌ User not found during deserialization:', id);
      done(null, false);
    }
  } catch (error) {
    console.error('❌ Deserialization error:', error);
    done(error, null);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(passport.initialize());
  app.use(passport.session());

  // Add debugging info
  console.log('🔧 GitHub OAuth Configuration:');
  console.log('Client ID:', process.env.GITHUB_CLIENT_ID ? 'Set ✅' : 'Missing ❌');
  console.log('Client Secret:', process.env.GITHUB_CLIENT_SECRET ? 'Set ✅' : 'Missing ❌');
  console.log('Callback URL: http://localhost:3000/api/auth/github/callback');

  const DEFAULT_USER_ID = "demo_user";
  
  const ensureDefaultUser = async () => {
    const existing = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, DEFAULT_USER_ID))
      .limit(1);
      
    if (existing.length === 0) {
      await database
        .insert(schema.users)
        .values({
          id: DEFAULT_USER_ID,
          username: "Demo User",
          email: "demo@pythonmaster.dev",
          firstName: "Demo",
          lastName: "User",
          currentStreak: 0,
          totalProblems: 0,
          totalXp: 0,
          currentSection: 1,
          currentLesson: 1,
        });
    }
  };

  await ensureDefaultUser();

  // ===============================
  // HEALTH CHECK ENDPOINT (for Render)
  // ===============================
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // ===============================
  // AUTH ROUTES
  // ===============================

  // Demo login route
  app.get('/api/auth/demo-login', async (req, res) => {
    try {
      console.log('🎭 Demo login requested');
      (req as any).session = (req as any).session || {};
      (req as any).session.userId = DEFAULT_USER_ID;
      res.redirect('/');
    } catch (error) {
      console.error("❌ Demo login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Auth user endpoint
  app.get('/api/auth/user', async (req, res) => {
    try {
      const sessionUserId = (req as any).session?.userId;
      if (!sessionUserId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await database
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, sessionUserId))
        .limit(1);
      
      if (user.length > 0) {
        res.json(user[0]);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Logout route
  app.post('/api/auth/logout', (req, res) => {
    console.log('👋 Logout requested');
    (req as any).session?.destroy((err: any) => {
      if (err) {
        console.error('❌ Logout error:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ success: true });
    });
  });

  // GitHub OAuth routes
  app.get('/api/auth/github', (req, res, next) => {
    console.log('🚀 Starting GitHub OAuth flow');
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  });

  app.get('/api/auth/github/callback', 
    (req, res, next) => {
      console.log('📥 GitHub OAuth callback received');
      passport.authenticate('github', { 
        failureRedirect: '/?error=oauth_failed',
        failureMessage: true
      })(req, res, next);
    },
    (req, res) => {
      console.log('✅ GitHub OAuth successful, redirecting to dashboard');
      (req as any).session.userId = (req.user as any).id;
      res.redirect('/');
    }
  );

  // ===============================
  // DASHBOARD ROUTES
  // ===============================

  // Dashboard endpoint
  app.get("/api/dashboard", async (req, res) => {
    try {
      // Use session user or default to demo user
      const sessionUserId = (req as any).session?.userId;
      const userId = sessionUserId || DEFAULT_USER_ID;
      
      const user = await database
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1);
      
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userData = user[0];
      
      const sections = await database
        .select()
        .from(schema.sections)
        .orderBy(asc(schema.sections.orderIndex));
      
      const lessons = await database
        .select()
        .from(schema.lessons)
        .orderBy(asc(schema.lessons.orderIndex));
      
      const problems = await database
        .select()
        .from(schema.problems)
        .orderBy(asc(schema.problems.orderIndex));
      
      const userProgress = await database
        .select()
        .from(schema.userProgress)
        .where(eq(schema.userProgress.userId, userId));
      
      const achievements = await database
        .select()
        .from(schema.achievements)
        .where(eq(schema.achievements.userId, userId))
        .orderBy(desc(schema.achievements.earnedAt))
        .limit(5);
      
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
      
      // Find current problem - FIXED VERSION
let currentProblem = null;

// Get all problems ordered by lesson, then by problem ID
const allProblemsOrdered = await database
  .select({
    id: schema.problems.id,
    title: schema.problems.title,
    description: schema.problems.description,
    difficulty: schema.problems.difficulty,
    orderIndex: schema.problems.orderIndex,
    starterCode: schema.problems.starterCode,
    hints: schema.problems.hints,
    xpReward: schema.problems.xpReward,
    testCases: schema.problems.testCases,
    lessonId: schema.problems.lessonId
  })
  .from(schema.problems)
  .innerJoin(schema.lessons, eq(schema.problems.lessonId, schema.lessons.id))
  .orderBy(
    asc(schema.lessons.orderIndex),  // Lesson order first
    asc(schema.problems.id)          // Then problem ID
  );

// Add debug logging
console.log("🔍 All problems in order:", allProblemsOrdered.map(p => ({ id: p.id, title: p.title.substring(0, 20) })));

// Find first uncompleted problem
for (const problem of allProblemsOrdered) {
  const progress = userProgress.find(p => p.problemId === problem.id);
  const isCompleted = progress?.isCompleted || false;
  
  console.log(`🔍 Problem ${problem.id}: ${isCompleted ? '✅' : '❌'} ${problem.title.substring(0, 30)}`);
  
  if (!isCompleted) {
    currentProblem = problem;
    console.log(`🎯 CURRENT PROBLEM SELECTED: ${problem.id} - ${problem.title}`);
    break;
  }
}

// Fallback to first problem if all completed
if (!currentProblem && allProblemsOrdered.length > 0) {
  currentProblem = allProblemsOrdered[0];
  console.log("🔄 All problems completed, showing first problem");
}

console.log("📤 Returning current problem:", currentProblem?.id, currentProblem?.title);
      
      const totalProblems = problems.length;
      const progressPercentage = totalProblems > 0 ? (userData.totalProblems / totalProblems) * 100 : 0;
      
      res.json({
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
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

  // ===============================
  // AI CHAT ROUTES (ADD THESE HERE!)
  // ===============================
  // Add this route to your Express app
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      const sessionUserId = (req as any).session?.userId;
      const userId = sessionUserId || DEFAULT_USER_ID;

      // Rate limiting check (basic implementation)
      // TODO: Implement proper rate limiting with Redis or database
      
      // Create context-aware system prompt
      const systemPrompt = `You are an AI Python tutor for PythonMastery, a platform that teaches Python through real business problems. Your role is to guide students without giving away complete solutions.

  CURRENT CONTEXT:
  - Problem: "${context.problem.title}" (${context.problem.difficulty})
  - Problem Description: ${context.problem.description}
  - Student Level: ${context.userLevel}
  - Hints Used: ${context.hintsUsed}
  - Research Topics: ${context.problem.researchTopics?.join(', ') || 'None specified'}

  STUDENT'S CURRENT CODE:
  \`\`\`python
  ${context.userCode || 'No code written yet'}
  \`\`\`

  GUIDELINES:
  1. **Guide, don't solve**: Help students think through problems rather than giving direct answers
  2. **Ask clarifying questions**: Help students break down the problem
  3. **Encourage research**: Point them to specific Python concepts to look up
  4. **Relate to business context**: Connect concepts to real-world applications
  5. **Be encouraging**: Celebrate progress and normalize struggling
  6. **Code review style**: If they show code, point out what's working well before suggesting improvements
  7. **Progressive hints**: Start with conceptual guidance, get more specific if they're really stuck

  EXAMPLES OF GOOD RESPONSES:
  - "I see you're working on user validation. What do you think makes a username 'valid' in a real application?"
  - "Your code structure looks good! The isinstance() check is exactly what professional developers use. What do you think should happen if the username is too short?"
  - "That's a great question about dictionaries. Try looking up 'Python dictionary syntax' - how do you think you'd store the username and email together?"

  AVOID:
  - Giving complete code solutions
  - Being overly academic or theoretical
  - Overwhelming with too much information at once
  - Making students feel bad for not knowing something

  Keep responses concise, friendly, and focused on the student's specific question. Respond in a helpful, encouraging tone.`;

      // Combine system prompt with user message
      const fullPrompt = `${systemPrompt}\n\nStudent Question: ${message}`;

      // Get Gemini model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Free tier model
        generationConfig: {
          maxOutputTokens: 300, // Keep responses concise
          temperature: 0.7, // Balanced creativity and consistency
        },
      });

      // Generate response
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const aiResponse = response.text();

      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Optional: Log the interaction for analytics
      try {
        console.log(`AI Chat - User: ${userId}, Problem: ${context.problem.title}`);
      } catch (logError) {
        console.error('Error logging chat interaction:', logError);
      }

      res.json({
        response: aiResponse,
        model: 'gemini-1.5-flash'
      });

    } catch (error) {
      console.error('AI Chat error:', error);
      
      // Provide helpful fallback response
      const fallbackResponse = "I'm having trouble right now, but here's what I'd suggest: try breaking down the problem into smaller steps. Look at the research topics for guidance on what Python concepts to explore. If you're stuck on validation, think about what makes data 'valid' for a real application.";
      
      res.json({
        response: fallbackResponse,
        error: true
      });
    }
  });

  // Optional: Add usage tracking endpoint
  app.get('/api/ai-chat/usage', async (req, res) => {
    try {
      const sessionUserId = (req as any).session?.userId;
      const userId = sessionUserId || DEFAULT_USER_ID;
      
      // TODO: Implement usage tracking in database
      // For now, return mock data based on Gemini's generous limits
      res.json({
        questionsUsed: 3,
        questionsRemaining: 1497, // Gemini allows 1,500 per day!
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        model: 'gemini-1.5-flash'
      });
    } catch (error) {
      console.error('Error fetching AI usage:', error);
      res.status(500).json({ error: 'Failed to fetch usage data' });
    }
  });


  // ===============================
  // PROBLEM ROUTES (ORIGINAL SYSTEM - SCHEMA CORRECTED)
  // ===============================

  // ONLY UPDATE THIS PART in your routes.ts file
// Replace the existing /api/problems/:problemId endpoint with this enhanced version

// Get problem details - ENHANCED with research framework fields
app.get("/api/problems/:problemId", async (req, res) => {
  try {
    const problemId = parseInt(req.params.problemId);
    const sessionUserId = (req as any).session?.userId;
    const userId = sessionUserId || DEFAULT_USER_ID;
    
    console.log(`🧩 Fetching problem ${problemId} for user ${userId}`);
    
    // Get problem using schema that matches your DB structure - ENHANCED
    const problem = await database
      .select({
        // Existing fields (keep all your current functionality)
        id: schema.problems.id,
        title: schema.problems.title,
        description: schema.problems.description,
        difficulty: schema.problems.difficulty,
        orderIndex: schema.problems.orderIndex,
        starterCode: schema.problems.starterCode,
        hints: schema.problems.hints,
        xpReward: schema.problems.xpReward,
        testCases: schema.problems.testCases,
        lessonId: schema.problems.lessonId,
        // NEW: Research framework fields (optional, won't break if missing)
        researchTopics: schema.problems.researchTopics,
        learningObjectives: schema.problems.learningObjectives,
        professionalContext: schema.problems.professionalContext,
        businessCategory: schema.problems.businessCategory,
      })
      .from(schema.problems)
      .where(eq(schema.problems.id, problemId))
      .limit(1);
    
    if (problem.length === 0) {
      return res.status(404).json({ error: "Problem not found" });
    }
    
    const problemData = problem[0];
    
    // Get lesson info (using lessonId from problems table) - UNCHANGED
    const lesson = await database
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.id, problemData.lessonId))
      .limit(1);
    
    let section = null;
    if (lesson.length > 0) {
      const sectionResult = await database
        .select()
        .from(schema.sections)
        .where(eq(schema.sections.id, lesson[0].sectionId))
        .limit(1);
      section = sectionResult.length > 0 ? sectionResult[0] : null;
    }
    
    // Get user progress for this specific problem - UNCHANGED
    const progress = await database
      .select()
      .from(schema.userProgress)
      .where(and(
        eq(schema.userProgress.userId, userId),
        eq(schema.userProgress.problemId, problemId)
      ))
      .limit(1);
    
    const progressData = progress.length > 0 ? progress[0] : {
      isCompleted: false,
      attempts: 0,
      bestTime: null,
      hintsUsed: 0
    };
    
    // ENHANCED response with optional research framework fields
    res.json({
      // Existing fields (all unchanged to maintain compatibility)
      id: problemData.id,
      title: problemData.title,
      description: problemData.description,
      difficulty: problemData.difficulty,
      order_index: problemData.orderIndex,
      starter_code: problemData.starterCode,
      hints: problemData.hints,
      xp_reward: problemData.xpReward,
      test_cases: problemData.testCases,
      progress: {
        is_completed: progressData.isCompleted,
        attempts: progressData.attempts,
        best_time: progressData.bestTime,
        hints_used: progressData.hintsUsed
      },
      breadcrumb: {
        section: section?.title || "Unknown Section",
        lesson: lesson.length > 0 ? lesson[0].title : "Unknown Lesson"
      },
      // NEW: Research framework fields (only included if they exist)
      ...(typeof problemData.researchTopics !== 'undefined' ? { researchTopics: problemData.researchTopics } : {}),
      ...(typeof problemData.learningObjectives !== 'undefined' ? { learningObjectives: problemData.learningObjectives } : {}),
      ...(typeof problemData.professionalContext !== 'undefined' ? { professionalContext: problemData.professionalContext } : {}),
      ...(typeof problemData.businessCategory !== 'undefined' ? { businessCategory: problemData.businessCategory } : {}),
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ error: "Failed to fetch problem" });
  }
});

  // Execute code endpoint - ENHANCED with real Python execution
  app.post("/api/execute-code", async (req, res) => {
    try {
      const { code, test_cases } = req.body;
      
      console.log('🐍 Executing Python code...');
      
      // Quick syntax validation for better error messages
      const quickValidation = {
        hasLet: code.includes('let '),
        hasConst: code.includes('const '),
        hasVar: code.includes('var '),
        hasFunction: code.includes('def '),
        hasReturn: code.includes('return')
      };

      // Provide helpful error messages for common mistakes
      if (quickValidation.hasLet) {
        return res.json({
          success: false,
          execution_time: 0,
          test_results: [],
          output: "❌ Python doesn't use 'let'. Use: variable = value",
          error: "Python uses variable assignment without 'let' keyword"
        });
      }

      if (quickValidation.hasConst || quickValidation.hasVar) {
        return res.json({
          success: false,
          execution_time: 0,
          test_results: [],
          output: "❌ Python doesn't use 'const' or 'var'. Use: variable = value",
          error: "Python doesn't use 'const' or 'var' keywords"
        });
      }

      if (!quickValidation.hasFunction) {
        return res.json({
          success: false,
          execution_time: 0,
          test_results: [],
          output: "❌ Function definition missing. Use: def function_name():",
          error: "Missing function definition"
        });
      }

      if (!quickValidation.hasReturn) {
        return res.json({
          success: false,
          execution_time: 0,
          test_results: [],
          output: "❌ Return statement missing. Functions must return a value.",
          error: "Missing return statement"
        });
      }

      // Execute code with real Python interpreter using simple executor
      if (test_cases && test_cases.length > 0) {
        // Execute with test cases for comprehensive validation
        const result = await SimplePythonExecutor.executeWithTests(code, test_cases);
        
        res.json({
          success: result.success,
          execution_time: result.executionTime,
          test_results: result.testResults,
          output: result.output,
          error: result.error
        });
      } else {
        // Simple execution without test cases
        const result = await SimplePythonExecutor.executeCode(code);
        
        const outputMessage = result.success 
          ? `>>> Running your code...
${result.output}

✅ Code executed successfully!`
          : `>>> Running your code...
${result.output}

❌ Code execution failed`;

        res.json({
          success: result.success,
          execution_time: result.executionTime,
          test_results: [],
          output: outputMessage,
          error: result.error
        });
      }

    } catch (error) {
      console.error("Code execution error:", error);
      res.status(500).json({ 
        success: false,
        error: "Code execution failed",
        execution_time: 0,
        test_results: [],
        output: ">>> Error executing code\nInternal server error occurred"
      });
    }
  });

  // Submit solution endpoint - your original implementation with corrected schema
  app.post("/api/submit-solution", async (req, res) => {
    try {
      const { problem_id, code, user_id } = req.body;
      const sessionUserId = (req as any).session?.userId;
      const actualUserId = user_id || sessionUserId || DEFAULT_USER_ID;
      
      console.log(`🚀 Code submission for problem ${problem_id} by user ${actualUserId}`);
      
      // Your original validation logic
      const syntaxErrors = [] as string[];
      const friendlyErrors = [] as string[];

      // JavaScript/other language keywords
      if (code.includes('let ')) {
        syntaxErrors.push("Python uses variable assignment without 'let' keyword. Use: name = \"value\"");
        friendlyErrors.push("I see you're using 'let' - that's JavaScript! In Python, we just write: name = \"John\"");
      }
      if (code.includes('const ') || code.includes('var ')) {
        syntaxErrors.push("Python doesn't use 'const' or 'var'. Use: variable = value");
        friendlyErrors.push("Looks like you're thinking JavaScript! Python doesn't need 'const' or 'var' - just write: age = 25");
      }

      // Common Python syntax issues
      if (code.includes('function ')) {
        syntaxErrors.push("Python uses 'def' for functions, not 'function'");
        friendlyErrors.push("Almost there! Python uses 'def' instead of 'function'. Try: def my_function():");
      }
      
      if (code.includes('{') && code.includes('}')) {
        syntaxErrors.push("Python uses indentation instead of curly braces");
        friendlyErrors.push("Python doesn't use curly braces {}. We use indentation (4 spaces) to group code instead!");
      }

      if (code.includes('println') || code.includes('console.log')) {
        syntaxErrors.push("Python uses 'print()' for output");
        friendlyErrors.push("I see you want to print something! In Python, we use print() instead of console.log or println");
      }

      // Semicolon usage
      if (code.includes(';')) {
        syntaxErrors.push("Python doesn't require semicolons at the end of lines");
        friendlyErrors.push("No semicolons needed! Python is clean and simple - just end your lines naturally");
      }
      
      // Get the actual problem to determine validation rules
      const problem = await database
        .select()
        .from(schema.problems)
        .where(eq(schema.problems.id, problem_id))
        .limit(1);
      
      if (problem.length === 0) {
        return res.status(404).json({ error: "Problem not found" });
      }
      
      const problemData = problem[0];
      
      // Enhanced validation based on problem type
      const hasFunction = code.includes('def ');
      const hasReturn = code.includes('return');
      const hasValidPythonSyntax = syntaxErrors.length === 0;
      
      // Problem-specific validation
      let problemSpecificValidation = true;
      let validationErrors = [];
      
      if (problemData.title === 'Digital Business Card Creator') {
        const nameMatch = code.match(/name\s*=\s*["']([^"']+)["']/);
        const titleMatch = code.match(/title\s*=\s*["']([^"']+)["']/);
        const companyMatch = code.match(/company\s*=\s*["']([^"']+)["']/);
        const emailMatch = code.match(/email\s*=\s*["']([^"']+)["']/);
        
        if (!nameMatch || nameMatch[1].trim() === '') {
          validationErrors.push('Name variable must be assigned a non-empty string value');
          problemSpecificValidation = false;
        }
        if (!titleMatch || titleMatch[1].trim() === '') {
          validationErrors.push('Title variable must be assigned a non-empty string value');
          problemSpecificValidation = false;
        }
        if (!companyMatch || companyMatch[1].trim() === '') {
          validationErrors.push('Company variable must be assigned a non-empty string value');
          problemSpecificValidation = false;
        }
        if (!emailMatch || emailMatch[1].trim() === '') {
          validationErrors.push('Email variable must be assigned a non-empty string value');
          problemSpecificValidation = false;
        }
      }
      
      const allPassed = hasFunction && hasReturn && hasValidPythonSyntax && problemSpecificValidation;
      
      let errorMessage = null;
      let friendlyExplanation = null;
      
      if (syntaxErrors.length > 0) {
        errorMessage = syntaxErrors[0];
        friendlyExplanation = friendlyErrors[0] || null;
      } else if (!hasFunction) {
        errorMessage = "Missing function definition. Use 'def function_name():'";
        friendlyExplanation = "I don't see a function definition. Start with 'def' followed by your function name, like: def create_business_card():";
      } else if (!hasReturn) {
        errorMessage = "Missing return statement";
        friendlyExplanation = "Your function looks good, but it needs to give back a result! Add 'return' followed by what you want to return.";
      } else if (validationErrors.length > 0) {
        errorMessage = validationErrors[0];
        friendlyExplanation = "You're on the right track! Double-check that all the required variables are properly assigned.";
      }
      
      const executionTime = Math.floor(Math.random() * 100) + 50;
      
      // Use the actual test cases from the problem
      const testCases = problemData.testCases as any[];
      const testResults = testCases.map((testCase: any, index: number) => ({
        test_case: index + 1,
        passed: allPassed,
        input: testCase.input,
        expected: testCase.expected,
        actual: allPassed ? testCase.expected : null,
        error: allPassed ? null : errorMessage
      }));
      
      let outputMessage = "";
      if (allPassed) {
        const functionMatch = code.match(/def\s+(\w+)/);
        const functionName = functionMatch ? functionMatch[1] : 'your_function';
        const expectedResult = testCases[0]?.expected;
        let displayResult = 'Success';
        
        if (expectedResult !== undefined) {
          if (typeof expectedResult === 'string') {
            displayResult = `'${expectedResult}'`;
          } else if (Array.isArray(expectedResult) || (typeof expectedResult === 'object' && expectedResult !== null)) {
            displayResult = JSON.stringify(expectedResult).replace(/"/g, "'");
          } else {
            displayResult = String(expectedResult);
          }
        }
        
        const functionCall = `${functionName}()`;
        const cleanResult = displayResult;
        
        outputMessage = `${functionCall}
${cleanResult}

Function completed successfully!`;
      } else {
        const friendlyPart = friendlyExplanation ? `

💡 ${friendlyExplanation}` : '';
        
        outputMessage = `Error: ${errorMessage}${friendlyPart}

${!hasFunction ? '❌ Function definition missing' : '✅ Function definition complete'}
${!hasReturn ? '❌ Return statement missing' : '✅ Return statement present'}
${!hasValidPythonSyntax ? '❌ Python syntax invalid' : '✅ Python syntax valid'}
${!problemSpecificValidation ? '❌ Implementation incomplete' : '✅ Implementation complete'}

${friendlyExplanation ? 'Try the suggestion above and submit again!' : 'Fix the issues above and try submitting again.'}`;
      }
      
      // Enhanced progress tracking with correct schema
      let progressData: any = {
        is_completed: allPassed,
        attempts: 1,
        best_time: allPassed ? executionTime : null,
        xp_gained: 0,
        new_achievements: [],
        updated_stats: null
      };

      if (allPassed) {
        try {
          const baseXP = problemData.xpReward || 50;
          const xpGained = baseXP;

          // Check if user progress exists for this problem - CORRECTED SCHEMA
          const existingProgress = await database
            .select()
            .from(schema.userProgress)
            .where(and(
              eq(schema.userProgress.userId, actualUserId),
              eq(schema.userProgress.problemId, problem_id)
            ))
            .limit(1);

          if (existingProgress.length > 0) {
            // Update existing progress - CORRECTED FIELD NAMES
            await database
              .update(schema.userProgress)
              .set({
                isCompleted: allPassed,
                attempts: existingProgress[0].attempts + 1,
                bestTime: allPassed ? Math.min(existingProgress[0].bestTime || 999999, executionTime) : existingProgress[0].bestTime,
                completedAt: allPassed ? new Date() : existingProgress[0].completedAt,
                lastAttemptAt: new Date()
              })
              .where(eq(schema.userProgress.id, existingProgress[0].id));
          } else {
            // Create new progress record - CORRECTED FIELD NAMES
            await database.insert(schema.userProgress).values({
              userId: actualUserId,
              problemId: problem_id,
              isCompleted: allPassed,
              attempts: 1,
              bestTime: allPassed ? executionTime : null,
              hintsUsed: 0,
              completedAt: allPassed ? new Date() : null,
              lastAttemptAt: new Date()
            });
          }

          // Save code submission record if table exists
          try {
            await database.insert(schema.codeSubmissions).values({
              userId: actualUserId,
              problemId: problem_id,
              code: code,
              isCorrect: allPassed,
              executionTime: executionTime,
              output: outputMessage,
              error: allPassed ? null : errorMessage
            });
          } catch (codeSubmissionError) {
            // Continue if codeSubmissions table doesn't exist
            if (codeSubmissionError && typeof codeSubmissionError === 'object' && 'message' in codeSubmissionError) {
              console.log('Code submissions table not available:', (codeSubmissionError as { message: string }).message);
            } else {
              console.log('Code submissions table not available:', codeSubmissionError);
            }
          }

          // Update user stats only for first-time completion
          if (allPassed && existingProgress.length === 0) {
            const user = await database
              .select()
              .from(schema.users)
              .where(eq(schema.users.id, actualUserId))
              .limit(1);
              
            if (user.length > 0) {
              const currentUser = user[0];
              const newTotalXP = currentUser.totalXp + xpGained;
              const newTotalProblems = currentUser.totalProblems + 1;
              
              await database
                .update(schema.users)
                .set({
                  totalXp: newTotalXP,
                  totalProblems: newTotalProblems,
                })
                .where(eq(schema.users.id, actualUserId));

              progressData = {
                is_completed: allPassed,
                attempts: 1,
                best_time: executionTime,
                xp_gained: xpGained,
                xp_breakdown: {
                  base_xp: baseXP,
                  efficiency_bonus: 0,
                  hint_penalty: 0,
                  total_gained: xpGained
                },
                new_achievements: [],
                updated_stats: {
                  total_xp: newTotalXP,
                  total_problems: newTotalProblems,
                  total_available_problems: 60,
                  current_streak: currentUser.currentStreak
                }
              };
            }
          }
        } catch (dbError) {
          console.error("Database update error:", dbError);
          // Continue even if DB update fails
        }
      }

      res.json({
        success: allPassed,
        execution_time: executionTime,
        test_results: testResults,
        output: outputMessage,
        error: allPassed ? null : errorMessage,
        progress: progressData
      });
    } catch (error) {
      console.error("Solution submission error:", error);
      res.status(500).json({ error: "Failed to submit solution" });
    }
  });

  // ENHANCED Submit solution endpoint with real Python execution
  app.post("/api/submit-solution-enhanced", async (req, res) => {
    try {
      const { problem_id, code, user_id } = req.body;
      const sessionUserId = (req as any).session?.userId;
      const actualUserId = user_id || sessionUserId || DEFAULT_USER_ID;
      
      console.log(`🚀 Enhanced code submission for problem ${problem_id} by user ${actualUserId}`);
      
      // Get the problem data including test cases
      const problem = await database
        .select()
        .from(schema.problems)
        .where(eq(schema.problems.id, problem_id))
        .limit(1);
      
      if (problem.length === 0) {
        return res.status(404).json({ error: "Problem not found" });
      }
      
      const problemData = problem[0];
      const testCases = problemData.testCases as any[];
      
      // Execute code with real Python and test cases
      const executionResult = await SimplePythonExecutor.executeWithTests(code, testCases);
      
      // Enhanced progress tracking
      let progressData: any = {
        is_completed: executionResult.success,
        attempts: 1,
        best_time: executionResult.success ? executionResult.executionTime : null,
        xp_gained: 0,
        new_achievements: [],
        updated_stats: null
      };

      if (executionResult.success) {
        try {
          const baseXP = problemData.xpReward || 50;
          const xpGained = baseXP;

          // Check if user progress exists for this problem
          const existingProgress = await database
            .select()
            .from(schema.userProgress)
            .where(and(
              eq(schema.userProgress.userId, actualUserId),
              eq(schema.userProgress.problemId, problem_id)
            ))
            .limit(1);

          if (existingProgress.length > 0) {
            // Update existing progress
            await database
              .update(schema.userProgress)
              .set({
                isCompleted: executionResult.success,
                attempts: existingProgress[0].attempts + 1,
                bestTime: executionResult.success ? Math.min(existingProgress[0].bestTime || 999999, executionResult.executionTime) : existingProgress[0].bestTime,
                completedAt: executionResult.success ? new Date() : existingProgress[0].completedAt,
                lastAttemptAt: new Date()
              })
              .where(eq(schema.userProgress.id, existingProgress[0].id));
          } else {
            // Create new progress record
            await database.insert(schema.userProgress).values({
              userId: actualUserId,
              problemId: problem_id,
              isCompleted: executionResult.success,
              attempts: 1,
              bestTime: executionResult.success ? executionResult.executionTime : null,
              hintsUsed: 0,
              completedAt: executionResult.success ? new Date() : null,
              lastAttemptAt: new Date()
            });
          }

          // Save code submission record
          try {
            await database.insert(schema.codeSubmissions).values({
              userId: actualUserId,
              problemId: problem_id,
              code: code,
              isCorrect: executionResult.success,
              executionTime: executionResult.executionTime,
              output: executionResult.output,
              error: executionResult.error
            });
          } catch (codeSubmissionError) {
            console.log('Code submissions table not available:', codeSubmissionError);
          }

          // Update user stats only for first-time completion
          if (executionResult.success && existingProgress.length === 0) {
            const user = await database
              .select()
              .from(schema.users)
              .where(eq(schema.users.id, actualUserId))
              .limit(1);
              
            if (user.length > 0) {
              const currentUser = user[0];
              const newTotalXP = currentUser.totalXp + xpGained;
              const newTotalProblems = currentUser.totalProblems + 1;
              
              await database
                .update(schema.users)
                .set({
                  totalXp: newTotalXP,
                  totalProblems: newTotalProblems,
                })
                .where(eq(schema.users.id, actualUserId));

              progressData = {
                is_completed: executionResult.success,
                attempts: 1,
                best_time: executionResult.executionTime,
                xp_gained: xpGained,
                xp_breakdown: {
                  base_xp: baseXP,
                  efficiency_bonus: 0,
                  hint_penalty: 0,
                  total_gained: xpGained
                },
                new_achievements: [],
                updated_stats: {
                  total_xp: newTotalXP,
                  total_problems: newTotalProblems,
                  total_available_problems: 5, // Update based on actual problem count
                  current_streak: currentUser.currentStreak
                }
              };
            }
          }
        } catch (dbError) {
          console.error("Database update error:", dbError);
        }
      }

      res.json({
        success: executionResult.success,
        execution_time: executionResult.executionTime,
        test_results: executionResult.testResults,
        output: executionResult.output,
        error: executionResult.error,
        progress: progressData
      });

    } catch (error) {
      console.error("Enhanced solution submission error:", error);
      res.status(500).json({ error: "Failed to submit solution" });
    }
  });

  // Debug endpoint for troubleshooting
  app.get('/api/debug', async (req, res) => {
    try {
      const sectionCount = await database.select().from(schema.sections);
      const problemCount = await database.select().from(schema.problems);
      const sessionUserId = (req as any).session?.userId;
      
      res.json({
        sectionsFound: sectionCount.length,
        problemsFound: problemCount.length,
        sessionUserId: sessionUserId,
        defaultUserId: DEFAULT_USER_ID,
        environment: process.env.NODE_ENV,
        databaseConnected: true
      });
    } catch (error) {
      res.json({ 
        error: error instanceof Error ? error.message : String(error), 
        stack: error instanceof Error ? error.stack : undefined,
        databaseConnected: false 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}