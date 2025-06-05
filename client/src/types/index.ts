export interface User {
  id: string;  
  username: string;
  email: string;
  current_streak: number;
  total_problems: number;
  total_xp: number;
  current_section: number;
  current_lesson: number;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order_index: number;
  starter_code: string;
  hints: string[];
  xp_reward: number;
  test_cases: TestCase[];
  is_completed: boolean;
  attempts: number;
  best_time?: number;
}

export interface TestCase {
  function_name: string;
  input: any;
  expected: any;
}

export interface TestResult {
  test_case: number;
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error?: string;
}

export interface CodeExecutionResult {
  success: boolean;
  execution_time: number;
  test_results: TestResult[];
  output: string;
  error?: string;
  progress?: {
    is_completed: boolean;
    attempts: number;
    best_time?: number;
    hints_used: number;
    xp_gained: number;
    xp_breakdown?: {
      base_xp: number;
      efficiency_bonus: number;
      hint_penalty: number;
      total_gained: number;
    };
    new_achievements?: Achievement[];
    updated_stats?: {
      total_xp: number;
      total_problems: number;
      current_streak: number;
    };
  };
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  order_index: number;
  is_locked: boolean;
  problems: Problem[];
  completed_problems: number;
  total_problems: number;
}

export interface Section {
  id: number;
  title: string;
  description: string;
  order_index: number;
  is_locked: boolean;
  lessons: Lesson[];
  completed_lessons: number;
  total_lessons: number;
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface UserStats {
  progress_percentage: number;
  problems_solved: number;
  current_streak: number;
  total_xp: number;
}

export interface DashboardData {
  user: User;
  current_problem?: Problem;
  sections: Section[];
  recent_achievements: Achievement[];
  stats: UserStats;
}

export interface ProblemDetail extends Problem {
  progress: {
    is_completed: boolean;
    attempts: number;
    best_time?: number;
    hints_used: number;
  };
  breadcrumb: {
    section: string;
    lesson: string;
  };
}
