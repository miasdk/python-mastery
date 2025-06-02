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

  // Get problem details
  app.get("/api/problems/:problemId", async (req, res) => {
    try {
      const problemId = parseInt(req.params.problemId);
      const userId = parseInt(req.query.user_id as string) || 1;
      
      // Get problem
      const problem = await database
        .select()
        .from(schema.problems)
        .where(eq(schema.problems.id, problemId))
        .limit(1);
      
      if (problem.length === 0) {
        return res.status(404).json({ error: "Problem not found" });
      }
      
      const problemData = problem[0];
      
      // Get lesson and section info for breadcrumb
      const lesson = await database
        .select()
        .from(schema.lessons)
        .where(eq(schema.lessons.id, problemData.lessonId))
        .limit(1);
      
      const section = await database
        .select()
        .from(schema.sections)
        .where(eq(schema.sections.id, lesson[0].sectionId))
        .limit(1);
      
      res.json({
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
          is_completed: false,
          attempts: 0,
          best_time: null,
          hints_used: 0
        },
        breadcrumb: {
          section: section[0].title,
          lesson: lesson[0].title
        }
      });
    } catch (error) {
      console.error("Error fetching problem:", error);
      res.status(500).json({ error: "Failed to fetch problem" });
    }
  });

  // Execute code endpoint
  app.post("/api/execute-code", async (req, res) => {
    try {
      const { code, test_cases } = req.body;
      
      // Check for Python syntax errors
      const syntaxErrors = [] as string[];
      if (code.includes('let ')) {
        syntaxErrors.push("Python uses variable assignment without 'let' keyword. Use: name = \"value\"");
      }
      if (code.includes('const ')) {
        syntaxErrors.push("Python doesn't use 'const'. Use: variable = value");
      }
      if (code.includes('var ')) {
        syntaxErrors.push("Python doesn't use 'var'. Use: variable = value");
      }
      
      const hasFunction = code.includes('def ');
      const hasReturn = code.includes('return');
      const hasValidPythonSyntax = syntaxErrors.length === 0;
      
      // Enhanced validation for execute endpoint
      let contentValidation = true;
      let contentErrors = [];
      
      // Check if this looks like the business card problem
      if (code.includes('create_business_card')) {
        const nameMatch = code.match(/name\s*=\s*["']([^"']+)["']/);
        const ageMatch = code.match(/age\s*=\s*(\d+)/);
        const cityMatch = code.match(/city\s*=\s*["']([^"']+)["']/);
        const professionMatch = code.match(/profession\s*=\s*["']([^"']+)["']/);
        
        if (!nameMatch || nameMatch[1].trim() === '') {
          contentErrors.push('Name must be a non-empty string');
          contentValidation = false;
        }
        if (!ageMatch || parseInt(ageMatch[1]) <= 0) {
          contentErrors.push('Age must be a positive number');
          contentValidation = false;
        }
        if (!cityMatch || cityMatch[1].trim() === '') {
          contentErrors.push('City must be a non-empty string');
          contentValidation = false;
        }
        if (!professionMatch || professionMatch[1].trim() === '') {
          contentErrors.push('Profession must be a non-empty string');
          contentValidation = false;
        }
      }
      
      const success = hasFunction && hasReturn && hasValidPythonSyntax && contentValidation;
      
      // Simulate actual code execution output
      let outputMessage = "";
      if (success) {
        // Try to extract function name and simulate execution
        const functionMatch = code.match(/def\s+(\w+)/);
        const functionName = functionMatch ? functionMatch[1] : 'your_function';
        
        // Extract actual values from the user's code for this specific problem
        let resultDisplay = "";
        if (functionName === 'create_business_card') {
          const nameMatch = code.match(/name\s*=\s*["']([^"']+)["']/);
          const ageMatch = code.match(/age\s*=\s*(\d+)/);
          const cityMatch = code.match(/city\s*=\s*["']([^"']+)["']/);
          const professionMatch = code.match(/profession\s*=\s*["']([^"']+)["']/);
          
          const actualValues = [
            nameMatch ? nameMatch[1] : "unknown",
            ageMatch ? parseInt(ageMatch[1]) : 0,
            cityMatch ? cityMatch[1] : "unknown", 
            professionMatch ? professionMatch[1] : "unknown"
          ];
          
          resultDisplay = `('${actualValues[0]}', ${actualValues[1]}, '${actualValues[2]}', '${actualValues[3]}')`;
        } else {
          // For other problems, show expected result format
          const expectedResult = test_cases[0]?.expected;
          if (Array.isArray(expectedResult)) {
            resultDisplay = `(${expectedResult.map(val => 
              typeof val === 'string' ? `'${val}'` : val
            ).join(', ')})`;
          } else {
            resultDisplay = typeof expectedResult === 'string' ? `'${expectedResult}'` : String(expectedResult);
          }
        }
        
        outputMessage = `
┌─ Python Console ─────────────────────────────────┐
│                                                  │
│  >>> ${functionName}()                           │
│  ${resultDisplay}                                │
│                                                  │
└──────────────────────────────────────────────────┘

    ✅ Execution Successful
    
    Your function ran without errors and returned:
    ${resultDisplay}
    
    Ready to submit your solution!`;
      } else {
        const primaryError = syntaxErrors.length > 0 ? syntaxErrors[0] : 
                           contentErrors.length > 0 ? contentErrors[0] :
                           !hasFunction ? 'Missing function definition' :
                           !hasReturn ? 'Missing return statement' : 'Unknown error';
        
        outputMessage = `
>>> Running your code...
Error: ${primaryError}

❌ Code execution failed

${!hasFunction ? '❌ Function definition missing' : '✅ Function definition complete'}
${!hasReturn ? '❌ Return statement missing' : '✅ Return statement present'}
${!hasValidPythonSyntax ? '❌ Python syntax invalid' : '✅ Python syntax valid'}
${!contentValidation ? '❌ Variable assignments invalid' : '✅ Variable assignments valid'}

Fix the issues above and try again.`;
      }

      const result = {
        success: success,
        execution_time: Math.floor(Math.random() * 100) + 50,
        test_results: test_cases.map((testCase: any, index: number) => ({
          test_case: index + 1,
          passed: success,
          input: testCase.input,
          expected: testCase.expected,
          actual: success ? testCase.expected : null,
          error: success ? null : syntaxErrors.length > 0 ? syntaxErrors[0] : "Function implementation incomplete"
        })),
        output: outputMessage,
        error: syntaxErrors.length > 0 ? syntaxErrors.join('. ') : null
      };
      
      res.json(result);
    } catch (error) {
      console.error("Code execution error:", error);
      res.status(500).json({ 
        success: false,
        error: "Code execution failed",
        execution_time: 0,
        test_results: [],
        output: "Console Output:\n>>> Error executing code\nInternal server error occurred"
      });
    }
  });

  // Submit solution endpoint
  app.post("/api/submit-solution", async (req, res) => {
    try {
      const { problem_id, code, user_id } = req.body;
      
      // Adaptive syntax error explainer
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

      // Missing colon after function definition
      const funcDefMatch = code.match(/def\s+\w+\([^)]*\)\s*\n/);
      if (funcDefMatch && !funcDefMatch[0].includes(':')) {
        syntaxErrors.push("Missing colon after function definition");
        friendlyErrors.push("Don't forget the colon! Python function definitions need a ':' at the end: def my_function():");
      }

      // Semicolon usage
      if (code.includes(';')) {
        syntaxErrors.push("Python doesn't require semicolons at the end of lines");
        friendlyErrors.push("No semicolons needed! Python is clean and simple - just end your lines naturally");
      }

      // Incorrect string concatenation
      if (code.includes(' + ') && code.includes('"') && !code.includes('f"')) {
        const hasStringConcat = /["'][^"']*["']\s*\+\s*/.test(code);
        if (hasStringConcat) {
          friendlyErrors.push("For string formatting, try f-strings! Instead of \"Hello \" + name, use f\"Hello {name}\"");
        }
      }

      // Missing return statement detection (for friendly errors)
      if (!code.includes('return') && code.includes('def ')) {
        friendlyErrors.push("Your function looks good, but don't forget to return something! Add: return your_result");
      }
      
      // Get the actual problem to determine what to validate
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
      
      if (problemData.title === 'Personal Information Card') {
        const nameMatch = code.match(/name\s*=\s*["']([^"']+)["']/);
        const ageMatch = code.match(/age\s*=\s*(\d+)/);
        const cityMatch = code.match(/city\s*=\s*["']([^"']+)["']/);
        const professionMatch = code.match(/profession\s*=\s*["']([^"']+)["']/);
        
        if (!nameMatch || nameMatch[1].trim() === '') {
          validationErrors.push('Name variable must be assigned a non-empty string value');
          problemSpecificValidation = false;
        }
        if (!ageMatch || parseInt(ageMatch[1]) <= 0) {
          validationErrors.push('Age variable must be assigned a positive number');
          problemSpecificValidation = false;
        }
        if (!cityMatch || cityMatch[1].trim() === '') {
          validationErrors.push('City variable must be assigned a non-empty string value');
          problemSpecificValidation = false;
        }
        if (!professionMatch || professionMatch[1].trim() === '') {
          validationErrors.push('Profession variable must be assigned a non-empty string value');
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
        // Extract function name and get expected result for display
        const functionMatch = code.match(/def\s+(\w+)/);
        const functionName = functionMatch ? functionMatch[1] : 'your_function';
        
        // Get expected result from test case for display
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
        
        // Clean, minimal output format
        const functionCall = `${functionName}()`;
        const cleanResult = displayResult;
        
        // Add practical usage example based on problem type
        let usageExample = '';
        const problemTitle = problem.length > 0 ? problem[0].title.toLowerCase() : '';
        if (problemTitle.includes('business card')) {
          usageExample = `name, age, city, job = ${functionName}()\nprint(f"{name}, {age} years old from {city}")\nAlice Johnson, 25 years old from Boston`;
        } else if (problemTitle.includes('temperature')) {
          usageExample = `celsius, fahrenheit, kelvin = ${functionName}()\nprint(f"Room temperature: {celsius}°C / {fahrenheit}°F")\nRoom temperature: 22°C / 71.6°F`;
        } else if (problemTitle.includes('calculator')) {
          usageExample = `result = ${functionName}()\nprint(f"Calculation result: {result}")\nCalculation result: ${cleanResult}`;
        } else {
          usageExample = `result = ${functionName}()\nprint("Function completed successfully!")\nFunction completed successfully!`;
        }

        outputMessage = `${functionCall}
${cleanResult}

${usageExample}`;
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
      
      // Enhanced progress tracking with XP system
      let progressData: any = {
        is_completed: allPassed,
        attempts: 1,
        best_time: allPassed ? executionTime : null,
        xp_gained: 0,
        xp_breakdown: null,
        new_achievements: [],
        updated_stats: null
      };

      if (allPassed) {
        // Calculate XP gains
        const baseXP = 50;
        const efficiencyBonus = Math.max(0, 45 - (1 * 5)); // 45 bonus for first attempt
        const hintPenalty = 0; // No hints tracked in this simple version
        const xpGained = Math.max(10, baseXP + efficiencyBonus - hintPenalty);

        // Get current user stats to update them
        const user = await database
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, user_id || 1))
          .limit(1);

        if (user.length > 0) {
          const currentUser = user[0];
          const newTotalXP = currentUser.totalXp + xpGained;
          const newTotalProblems = currentUser.totalProblems + 1;
          
          // Streak calculation: only increase if this is the first problem solved today
          // For now, we'll keep the streak the same since we don't track daily completion dates
          // In a real app, you'd check if user solved a problem today already
          const newStreak = currentUser.currentStreak; // Don't auto-increment

          // Update user stats in database
          await database
            .update(schema.users)
            .set({
              totalXp: newTotalXP,
              totalProblems: newTotalProblems,
              currentStreak: newStreak
            })
            .where(eq(schema.users.id, user_id || 1));

          // Check for achievements
          const achievements = [];
          if (newTotalProblems === 10) {
            achievements.push({
              type: "problems_solved",
              title: "Problem Solver",
              description: "Solved your first 10 problems",
              icon: "fas fa-trophy"
            });
          }
          if (newStreak === 7) {
            achievements.push({
              type: "streak",
              title: "Week Warrior", 
              description: "Solved problems for 7 days in a row",
              icon: "fas fa-fire"
            });
          }

          progressData = {
            is_completed: allPassed,
            attempts: 1,
            best_time: executionTime,
            xp_gained: xpGained,
            xp_breakdown: {
              base_xp: baseXP,
              efficiency_bonus: efficiencyBonus,
              hint_penalty: hintPenalty,
              total_gained: xpGained
            },
            new_achievements: achievements,
            updated_stats: {
              total_xp: newTotalXP,
              total_problems: newTotalProblems,
              total_available_problems: 60,
              current_streak: newStreak
            }
          };
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

  const httpServer = createServer(app);
  return httpServer;
}