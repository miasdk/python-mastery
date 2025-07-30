import dotenv from 'dotenv';
dotenv.config();

import { db } from '../server/db';
import { sections, lessons, problems } from '../shared/schema';
import { eq } from 'drizzle-orm';
// Comprehensive curriculum data based on CodePath TIP2025 structure
const curriculumData = {
  sections: [
    {
      id: 1,
      title: "Foundation Concepts",
      description: "Python syntax fundamentals, built-in functions, and basic programming concepts",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 2,
      title: "Data Structures",
      description: "Master linked lists, trees, graphs, and advanced data structures",
      orderIndex: 2,
      isLocked: false
    },
    {
      id: 3,
      title: "Algorithms & Problem Solving",
      description: "Recursion, divide & conquer, backtracking, and two-pointer techniques",
      orderIndex: 3,
      isLocked: false
    },
    {
      id: 4,
      title: "Advanced Programming Techniques",
      description: "Matrix operations, string manipulation, and advanced Python syntax",
      orderIndex: 4,
      isLocked: false
    },
    {
      id: 5,
      title: "Graph Theory & Algorithms",
      description: "Graph traversal, advanced graph algorithms, and representations",
      orderIndex: 5,
      isLocked: false
    },
    {
      id: 6,
      title: "Dynamic Programming",
      description: "1-D and 2-D dynamic programming with optimization techniques",
      orderIndex: 6,
      isLocked: false
    },
    {
      id: 7,
      title: "Interview Preparation",
      description: "Problem-solving strategies, coding best practices, and interview techniques",
      orderIndex: 7,
      isLocked: false
    }
  ],
  lessons: [
    // Foundation Concepts (Section 1)
    {
      id: 1,
      sectionId: 1,
      title: "Python Syntax & Fundamentals",
      description: "Built-in functions, variables, data types, and control flow",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 2,
      sectionId: 1,
      title: "Object-Oriented Programming",
      description: "Classes, objects, inheritance, and encapsulation",
      orderIndex: 2,
      isLocked: false
    },
    {
      id: 3,
      sectionId: 1,
      title: "Collections & Data Manipulation",
      description: "Lists, dictionaries, sets, and data manipulation techniques",
      orderIndex: 3,
      isLocked: false
    },
    
    // Data Structures (Section 2)
    {
      id: 4,
      sectionId: 2,
      title: "Linked Lists",
      description: "Node structures, traversal, and pointer techniques",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 5,
      sectionId: 2,
      title: "Trees",
      description: "Binary trees, BSTs, and tree traversal algorithms",
      orderIndex: 2,
      isLocked: false
    },
    {
      id: 6,
      sectionId: 2,
      title: "Advanced Data Structures",
      description: "Priority queues, heaps, and Union Find",
      orderIndex: 3,
      isLocked: false
    },
    
    // Algorithms & Problem Solving (Section 3)
    {
      id: 7,
      sectionId: 3,
      title: "Recursion",
      description: "Base cases, recursive cases, and call stack understanding",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 8,
      sectionId: 3,
      title: "Divide & Conquer",
      description: "Binary search, merge sort, and problem decomposition",
      orderIndex: 2,
      isLocked: false
    },
    {
      id: 9,
      sectionId: 3,
      title: "Two-Pointer Technique",
      description: "Opposite and same direction pointers for efficient solutions",
      orderIndex: 3,
      isLocked: false
    },
    
    // Advanced Programming Techniques (Section 4)
    {
      id: 10,
      sectionId: 4,
      title: "Matrix Operations",
      description: "Grid traversal, flood fill, and path finding",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 11,
      sectionId: 4,
      title: "String Manipulation",
      description: "Pattern matching, string operations, and text processing",
      orderIndex: 2,
      isLocked: false
    },
    
    // Graph Theory & Algorithms (Section 5)
    {
      id: 12,
      sectionId: 5,
      title: "Graph Traversal",
      description: "BFS, DFS, and cycle detection algorithms",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 13,
      sectionId: 5,
      title: "Advanced Graph Algorithms",
      description: "Topological sort, Dijkstra's, and minimum spanning trees",
      orderIndex: 2,
      isLocked: false
    },
    
    // Dynamic Programming (Section 6)
    {
      id: 14,
      sectionId: 6,
      title: "1-D Dynamic Programming",
      description: "State definition, recurrence relations, and memoization",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 15,
      sectionId: 6,
      title: "2-D Dynamic Programming",
      description: "2D state tables, knapsack problems, and grid DP",
      orderIndex: 2,
      isLocked: false
    },
    
    // Interview Preparation (Section 7)
    {
      id: 16,
      sectionId: 7,
      title: "Problem-Solving Strategies",
      description: "Pattern recognition, algorithm selection, and complexity analysis",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 17,
      sectionId: 7,
      title: "Coding Best Practices",
      description: "Code organization, testing strategies, and interview techniques",
      orderIndex: 2,
      isLocked: false
    }
  ],
  problems: [
    {
      id: 1,
      lessonId: 1,
      title: "Built-in Functions Master",
      description: "Practice essential Python built-in functions through data analysis tasks. Create a function called analyze_sales_data() that processes a list of daily sales amounts using sum(), max(), min(), and len().",
      difficulty: "easy",
      orderIndex: 1,
      starterCode: "def analyze_sales_data(sales):\n    total_sales = sum(sales)\n    best_day = max(sales)\n    worst_day = min(sales)\n    total_days = len(sales)\n    return {'total': total_sales, 'best': best_day, 'worst': worst_day, 'days': total_days}",
      solution: "def analyze_sales_data(sales):\n    total_sales = sum(sales)\n    best_day = max(sales)\n    worst_day = min(sales)\n    total_days = len(sales)\n    return {'total': total_sales, 'best': best_day, 'worst': worst_day, 'days': total_days, 'average': total_sales / total_days if total_days > 0 else 0}",
      testCases: [
        {
          input: [[100, 150, 200, 75, 300]],
          expected: {"total": 825, "best": 300, "worst": 75, "days": 5, "average": 165.0},
          description: "Should correctly analyze sales data"
        }
      ],
      hints: [
        "Use sum() to add all values in the list",
        "max() and min() work directly on lists",
        "len() returns the number of items"
      ],
      xpReward: 50,
      researchTopics: ["Python built-in functions", "List operations", "Dictionary creation"],
      learningObjectives: ["Master essential built-in functions", "Process numerical data"],
      professionalContext: "Data analysis is fundamental in business intelligence systems.",
      businessCategory: "data-analysis"
    },
    {
      id: 2,
      lessonId: 1,
      title: "Control Flow Logic",
      description: "Build conditional logic for a grading system. Create calculate_grade() function that assigns letter grades: A(90-100), B(80-89), C(70-79), D(60-69), F(below 60).",
      difficulty: "easy",
      orderIndex: 2,
      starterCode: "def calculate_grade(score):\n    if score >= 90:\n        return 'A'\n    elif score >= 80:\n        return 'B'\n    elif score >= 70:\n        return 'C'\n    elif score >= 60:\n        return 'D'\n    else:\n        return 'F'",
      solution: "def calculate_grade(score):\n    if score < 0 or score > 100:\n        return 'Invalid Score'\n    if score >= 90:\n        return 'A'\n    elif score >= 80:\n        return 'B'\n    elif score >= 70:\n        return 'C'\n    elif score >= 60:\n        return 'D'\n    else:\n        return 'F'",
      testCases: [
        {
          input: [95],
          expected: "A",
          description: "Score of 95 should return A"
        },
        {
          input: [85],
          expected: "B", 
          description: "Score of 85 should return B"
        }
      ],
      hints: [
        "Check for invalid inputs first",
        "Use elif for multiple conditions"
      ],
      xpReward: 75,
      researchTopics: ["Conditional statements", "Boolean logic"],
      learningObjectives: ["Implement branching logic", "Handle edge cases"],
      professionalContext: "Conditional logic is essential for business rules.",
      businessCategory: "education-tech"
    },
    {
      id: 3,
      lessonId: 2,
      title: "Employee Class System",
      description: "Create Employee class with name, id, salary properties and get_info(), give_raise() methods. Demonstrates object-oriented programming concepts.",
      difficulty: "medium",
      orderIndex: 1,
      starterCode: "class Employee:\n    def __init__(self, name, emp_id, salary):\n        self.name = name\n        self.emp_id = emp_id\n        self.salary = salary\n    \n    def get_info(self):\n        return f'Employee {self.name} (ID: {self.emp_id}) - Salary: ${self.salary}'\n    \n    def give_raise(self, amount):\n        self.salary += amount\n        return self.salary",
      solution: "class Employee:\n    def __init__(self, name, emp_id, salary):\n        self.name = name\n        self.emp_id = emp_id\n        self.salary = salary\n    \n    def get_info(self):\n        return f'Employee {self.name} (ID: {self.emp_id}) - Salary: ${self.salary}'\n    \n    def give_raise(self, amount):\n        self.salary += amount\n        return self.salary",
      testCases: [
        {
          input: ["John", 101, 50000],
          expected: "Employee John (ID: 101) - Salary: $50000",
          description: "Employee class should work correctly"
        }
      ],
      hints: [
        "Use __init__ method for initialization",
        "Properties are accessed with self.property_name"
      ],
      xpReward: 125,
      researchTopics: ["Python classes", "Object-oriented programming"],
      learningObjectives: ["Create classes and objects", "Implement encapsulation"],
      professionalContext: "OOP is fundamental for scalable business applications.",
      businessCategory: "hr-systems"
    }
  ]
};

async function seedCurriculum() {
  try {
    console.log('🌱 Starting curriculum seed...');

    // Clear existing data (optional - comment out if you want to preserve data)
    console.log('🗑️  Clearing existing curriculum data...');
    await db.delete(problems);
    await db.delete(lessons);
    await db.delete(sections);

    // Insert sections
    console.log('📚 Inserting sections...');
    for (const section of curriculumData.sections) {
      await db.insert(sections).values(section);
    }

    // Insert lessons
    console.log('📖 Inserting lessons...');
    for (const lesson of curriculumData.lessons) {
      await db.insert(lessons).values(lesson);
    }

    // Insert problems
    console.log('🧩 Inserting problems...');
    for (const problem of curriculumData.problems) {
      await db.insert(problems).values(problem);
    }

    console.log('✅ Curriculum seed completed successfully!');
    console.log(`📊 Seeded: ${curriculumData.sections.length} sections, ${curriculumData.lessons.length} lessons, ${curriculumData.problems.length} problems`);

    // Verify the data
    const sectionCount = await db.select().from(sections);
    const lessonCount = await db.select().from(lessons);
    const problemCount = await db.select().from(problems);

    console.log('🔍 Verification:');
    console.log(`   Sections in DB: ${sectionCount.length}`);
    console.log(`   Lessons in DB: ${lessonCount.length}`);
    console.log(`   Problems in DB: ${problemCount.length}`);

  } catch (error) {
    console.error('❌ Error seeding curriculum:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCurriculum().then(() => {
  console.log('🎉 Seed script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Seed script failed:', error);
  process.exit(1);
});