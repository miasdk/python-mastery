# Database ERD - PythonMastery AI Learning Platform

## Overview
A normalized relational schema supporting adaptive learning analytics, user progress tracking, AI-powered problem management, and comprehensive educational data collection.

---

## ERD Diagram (Textual)

```
User (id, github_id, username, email, display_name, avatar_url, role, created_at, updated_at)
  |--< UserProfile (user_id, bio, learning_goals, difficulty_preference, notification_settings)
  |--< UserProgress (id, user_id, section_id, completion_percentage, xp_earned, streak_days, last_activity)
  |--< ProblemAttempt (id, user_id, problem_id, code_submission, status, execution_time, hints_used, submitted_at)
  |--< AIInteraction (id, user_id, problem_id, message_type, user_message, ai_response, context_data, timestamp)
  |--< Achievement (id, user_id, achievement_type, earned_at, metadata)

Section (id, name, description, order_index, prerequisites, difficulty_level, estimated_hours)
  |--< Problem (id, section_id, title, description, business_context, starter_code, solution_template, difficulty_score, test_cases, created_at)
  |--< UserProgress (section_id, user_id, ...)

Problem
  |--< ProblemAttempt (problem_id, user_id, ...)
  |--< TestCase (id, problem_id, input_data, expected_output, is_sample, weight)
  |--< Hint (id, problem_id, hint_text, hint_order, unlock_condition)
  |--< AIInteraction (problem_id, user_id, ...)

Session (id, user_id, session_token, expires_at, created_at)
  |-- User (user_id)

LearningAnalytics (id, user_id, problem_id, session_duration, errors_made, help_requests, completion_rate, timestamp)
  |-- User (user_id)
  |-- Problem (problem_id)

AdaptiveDifficulty (id, user_id, current_skill_level, performance_trend, next_problem_difficulty, last_updated)
  |-- User (user_id)
```

---

## Core Entities

### **User Management**
- **User**: GitHub OAuth integration, role-based access (student, instructor, admin)
- **UserProfile**: Personal settings, learning preferences, customization options
- **Session**: Secure session management with token expiration

### **Learning Content**
- **Section**: Curriculum organization with prerequisites and difficulty progression
- **Problem**: Business-focused Python challenges with adaptive difficulty metadata
- **TestCase**: Comprehensive test suites for code validation and grading
- **Hint**: Progressive hint system with intelligent unlock conditions

### **Progress Tracking**
- **UserProgress**: Section-level completion tracking with XP and streak systems
- **ProblemAttempt**: Individual code submissions with performance metrics
- **Achievement**: Gamification system with badges and milestone tracking

### **AI Integration**
- **AIInteraction**: Complete chat history with Google Gemini AI tutoring sessions
- **AdaptiveDifficulty**: Machine learning model for personalized difficulty adjustment
- **LearningAnalytics**: Behavioral data collection for AI optimization

---

## Relationships

```
# Primary Relationships
- User 1:1 UserProfile
- User 1:N UserProgress (one per section)
- User 1:N ProblemAttempt
- User 1:N AIInteraction
- User 1:N Achievement
- User 1:N Session
- User 1:1 AdaptiveDifficulty

- Section 1:N Problem
- Section 1:N UserProgress

- Problem 1:N ProblemAttempt
- Problem 1:N TestCase
- Problem 1:N Hint
- Problem 1:N AIInteraction
- Problem 1:N LearningAnalytics

# Analytics Relationships
- LearningAnalytics N:1 User
- LearningAnalytics N:1 Problem
```

---

## Advanced Schema Features

### **Adaptive Learning Support**
```sql
-- AI-powered difficulty adjustment
AdaptiveDifficulty (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES User(id),
    current_skill_level DECIMAL(3,2), -- 0.00 to 1.00 scale
    performance_trend JSONB, -- Recent success rates and trends
    next_problem_difficulty INTEGER, -- Recommended difficulty level
    confidence_score DECIMAL(3,2), -- AI confidence in recommendation
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Comprehensive attempt tracking
ProblemAttempt (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES User(id),
    problem_id INTEGER REFERENCES Problem(id),
    code_submission TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('passed', 'failed', 'partial', 'timeout')),
    execution_time DECIMAL(8,3), -- milliseconds
    memory_usage INTEGER, -- bytes
    test_results JSONB, -- individual test case results
    hints_used INTEGER DEFAULT 0,
    error_messages JSONB, -- compilation/runtime errors
    submitted_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_problem (user_id, problem_id),
    INDEX idx_status_time (status, submitted_at)
);
```

### **AI Chat Integration**
```sql
-- Complete AI interaction history
AIInteraction (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES User(id),
    problem_id INTEGER REFERENCES Problem(id) NULL, -- NULL for general questions
    message_type VARCHAR(20) CHECK (message_type IN ('question', 'hint_request', 'explanation', 'code_review')),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context_data JSONB, -- Current code, progress, session data
    response_quality INTEGER CHECK (response_quality BETWEEN 1 AND 5), -- User feedback
    processing_time DECIMAL(8,3), -- AI response time
    timestamp TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_time (user_id, timestamp),
    INDEX idx_problem_type (problem_id, message_type)
);
```

### **Learning Analytics Schema**
```sql
-- Comprehensive learning behavior tracking
LearningAnalytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES User(id),
    problem_id INTEGER REFERENCES Problem(id),
    session_duration INTEGER, -- seconds spent on problem
    errors_made INTEGER, -- syntax/logic errors before success
    help_requests INTEGER, -- hints + AI interactions
    completion_rate DECIMAL(5,4), -- percentage of test cases passed
    code_quality_score INTEGER, -- algorithmic efficiency rating
    engagement_level VARCHAR(20), -- high/medium/low based on interaction patterns
    timestamp TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_performance (user_id, completion_rate),
    INDEX idx_problem_analytics (problem_id, timestamp)
);
```

---

## Performance Optimization

### **Strategic Indexing**
- **B-tree indexes**: User.github_id, Problem.difficulty_score, Section.order_index
- **Composite indexes**: (user_id, problem_id, submitted_at) for attempt queries
- **JSONB GIN indexes**: TestCase.input_data, AIInteraction.context_data for flexible queries
- **Partial indexes**: Active sessions, recent attempts for performance

### **Database Partitioning**
```sql
-- Partition large tables by time for performance
-- ProblemAttempt partitioned by submitted_at (monthly)
-- AIInteraction partitioned by timestamp (monthly)
-- LearningAnalytics partitioned by timestamp (monthly)
```

### **Caching Strategy**
- **Application-level caching**: Problem content, section hierarchy, user profiles
- **Query result caching**: Leaderboards, popular problems, curriculum structure
- **Session caching**: User progress, adaptive difficulty models

---

## Data Integrity & Security

### **Constraints & Validation**
- Foreign key constraints with CASCADE updates
- CHECK constraints for enum values and valid ranges
- NOT NULL constraints for essential fields
- UNIQUE constraints for natural keys (github_id, session_token)

### **Audit & Compliance**
- Comprehensive audit logging for all user actions
- GDPR compliance with user data export/deletion capabilities
- Sensitive data encryption for PII and authentication tokens
- Rate limiting metadata for API abuse prevention

---

## Business Intelligence Schema

### **Analytics Views**
```sql
-- Pre-computed analytics for dashboard performance
CREATE MATERIALIZED VIEW user_performance_summary AS
SELECT 
    u.id as user_id,
    COUNT(pa.id) as total_attempts,
    AVG(CASE WHEN pa.status = 'passed' THEN 1 ELSE 0 END) as success_rate,
    AVG(pa.execution_time) as avg_execution_time,
    MAX(up.streak_days) as max_streak,
    SUM(up.xp_earned) as total_xp
FROM User u
LEFT JOIN ProblemAttempt pa ON u.id = pa.user_id
LEFT JOIN UserProgress up ON u.id = up.user_id
GROUP BY u.id;

-- Problem difficulty calibration
CREATE MATERIALIZED VIEW problem_difficulty_stats AS
SELECT 
    p.id as problem_id,
    p.difficulty_score,
    COUNT(pa.id) as attempt_count,
    AVG(CASE WHEN pa.status = 'passed' THEN 1 ELSE 0 END) as pass_rate,
    AVG(pa.execution_time) as avg_execution_time,
    AVG(pa.hints_used) as avg_hints_used
FROM Problem p
LEFT JOIN ProblemAttempt pa ON p.id = pa.problem_id
GROUP BY p.id, p.difficulty_score;
```

This comprehensive ERD supports the full adaptive learning ecosystem, enabling intelligent personalization, detailed progress tracking, and data-driven educational optimization while maintaining excellent performance and scalability for thousands of concurrent learners.