# Python Learning Platform

A comprehensive Python learning platform with interactive coding challenges, progress tracking, and business-focused curriculum designed to take you from beginner to workplace-ready.

## Features

- 🎯 8-section comprehensive Python curriculum
- 💻 Interactive Monaco code editor with syntax highlighting
- 📊 XP-based progress tracking and achievements
- 🏢 Business-focused problems with real-world contexts
- 🔐 Session-based authentication system
- 📱 Responsive design with Tailwind CSS

## Technology Stack

- **Frontend**: React, TypeScript, Monaco Editor, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **Authentication**: Express sessions

## Local Development Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/python-learning-platform.git
   cd python-learning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Install PostgreSQL locally or use a cloud service
   - Create a new database for the project
   - Note your connection string

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/python_learning
   SESSION_SECRET=your-super-secret-session-key-here
   NODE_ENV=development
   ```

5. **Initialize the database**
   ```bash
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## System Architecture

### Authentication System

The platform uses **session-based authentication** with the following flow:

1. **Landing Page**: Displays when user is not authenticated
2. **Demo Login**: `/api/auth/demo-login` creates a session and redirects to dashboard
3. **Session Management**: Express sessions store user authentication state
4. **Protected Routes**: Check session before serving user-specific data

**Authentication Flow:**
```
User clicks "Start Learning" → /api/auth/demo-login → Creates session → Redirects to / → Dashboard loads
```

**Session Configuration** (in `server/index.ts`):
```typescript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
```

**Authentication Check** (in API routes):
```typescript
const sessionUserId = (req as any).session?.userId;
if (!sessionUserId) {
  return res.status(401).json({ error: "Not authenticated" });
}
```

### Database Schema

The platform uses Drizzle ORM with PostgreSQL. Here are the complete table schemas:

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,           -- User identifier
  username VARCHAR,                 -- Display name
  email VARCHAR UNIQUE,            -- Email address
  first_name VARCHAR,              -- First name
  last_name VARCHAR,               -- Last name
  profile_image_url VARCHAR,       -- Profile picture URL
  created_at TIMESTAMP DEFAULT NOW,
  updated_at TIMESTAMP DEFAULT NOW
);
```

#### Sessions Table (Required for authentication)
```sql
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,         -- Session ID
  sess JSONB NOT NULL,            -- Session data
  expire TIMESTAMP NOT NULL       -- Expiration time
);
```

#### Curriculum Structure
```sql
-- Course sections (Python Foundations, Control Flow, etc.)
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,         -- "Python Foundations"
  description TEXT NOT NULL,      -- Section overview
  order_index INTEGER NOT NULL,  -- Display order
  is_locked BOOLEAN DEFAULT true -- Progression control
);

-- Lessons within sections
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id),
  title VARCHAR NOT NULL,         -- "Variables and Data Types"
  description TEXT NOT NULL,      -- Lesson overview
  order_index INTEGER NOT NULL,
  is_locked BOOLEAN DEFAULT true
);

-- Individual coding problems
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id),
  title VARCHAR NOT NULL,         -- "Digital Business Card Creator"
  description TEXT NOT NULL,      -- Full problem description with context
  difficulty VARCHAR NOT NULL,    -- "Beginner", "Intermediate", "Advanced"
  order_index INTEGER NOT NULL,
  starter_code TEXT NOT NULL,     -- Initial code template
  solution TEXT NOT NULL,         -- Working solution
  test_cases JSONB NOT NULL,      -- Array of test cases
  hints JSONB NOT NULL,           -- Array of progressive hints
  xp_reward INTEGER DEFAULT 50   -- XP awarded on completion
);
```

#### Progress Tracking
```sql
-- User progress on individual problems
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  problem_id INTEGER REFERENCES problems(id),
  is_completed BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  best_time INTEGER,              -- Best completion time in seconds
  hints_used INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  last_attempt_at TIMESTAMP DEFAULT NOW,
  UNIQUE(user_id, problem_id)
);

-- Code submissions and execution results
CREATE TABLE code_submissions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  problem_id INTEGER REFERENCES problems(id),
  code TEXT NOT NULL,             -- Submitted code
  is_correct BOOLEAN NOT NULL,    -- Whether solution passed all tests
  execution_time INTEGER,         -- Execution time in milliseconds
  output TEXT,                    -- Program output
  error TEXT,                     -- Error message if failed
  submitted_at TIMESTAMP DEFAULT NOW
);

-- User achievements and milestones
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  type VARCHAR NOT NULL,          -- "first_solve", "streak_5", etc.
  title VARCHAR NOT NULL,         -- "First Steps"
  description TEXT NOT NULL,      -- Achievement description
  icon VARCHAR NOT NULL,          -- Icon identifier
  earned_at TIMESTAMP DEFAULT NOW
);
```

### Data Flow Architecture

```
Frontend (React) ←→ API Routes (Express) ←→ Database (PostgreSQL)
      ↓                    ↓                       ↓
  Monaco Editor      Authentication         Drizzle ORM
  Progress UI        Session Management     Progress Tracking
  Problem Display    Code Execution         Curriculum Data
```

### API Endpoints

**Authentication:**
- `GET /api/auth/demo-login` - Create demo session and redirect
- `GET /api/auth/user` - Get current user (requires session)

**Core Application:**
- `GET /api/dashboard` - Get curriculum and user progress
- `GET /api/problems/:id` - Get specific problem details
- `POST /api/problems/:id/submit` - Submit solution for grading
- `POST /api/problems/:id/hint` - Record hint usage
- `POST /api/code/execute` - Execute code with test cases
- `POST /api/code/validate` - Validate code syntax

### Frontend State Management

**React Query** handles all server state:
- User authentication status
- Curriculum data loading
- Problem submissions
- Progress updates

**Key Hooks:**
- `useAuth()` - Authentication state and user data
- `useQuery(['/api/dashboard'])` - Dashboard data
- `useMutation()` - Code submissions and progress updates

### Code Execution System

The platform includes a secure Python code execution environment:

**Backend Python Service** (`server/code_executor.py`):
- Validates syntax before execution
- Runs code against test cases
- Returns execution results and errors
- Includes security restrictions

**API Integration**:
- `POST /api/code/execute` - Execute code with test cases
- `POST /api/code/validate` - Syntax validation only

### Troubleshooting Authentication

**Common Local Development Issues:**

1. **Session Not Persisting**
   - Ensure `SESSION_SECRET` is set in `.env`
   - Check that session middleware is loaded before routes
   - Verify cookie settings for local development

2. **401 Unauthorized Errors**
   - Clear browser cookies and try again
   - Check that `/api/auth/demo-login` creates session correctly
   - Verify database connection is working

3. **Database Connection Issues**
   - Confirm PostgreSQL is running locally
   - Check `DATABASE_URL` format: `postgresql://user:password@localhost:5432/dbname`
   - Run `npm run db:push` to ensure tables exist

**Debug Authentication:**
```bash
# Check if session is being created
curl -v http://localhost:5000/api/auth/demo-login

# Verify user endpoint with session
curl -v -b cookies.txt http://localhost:5000/api/auth/user
```

## Development Workflow

### Adding New Problems

1. Add problem data to the curriculum initialization in `server/routes.ts`
2. Include problem description, starter code, test cases, and hints
3. Run `npm run db:push` to update the database

### Modifying the UI

- Frontend components are in `client/src/components/`
- Pages are in `client/src/pages/`
- Shared types are in `shared/schema.ts`

### API Development

- API routes are defined in `server/routes.ts`
- Database operations use Drizzle ORM
- All routes include proper error handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   └── storage.ts         # Data access layer
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── README.md
```

## Deployment

The project is configured for deployment on Replit but can be deployed anywhere that supports Node.js applications.

### Environment Variables for Production

```env
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_production_session_secret
NODE_ENV=production
```

## Curriculum Overview

1. **Python Foundations** - Variables, data types, basic operations
2. **Control Flow Mastery** - Conditionals, loops, logical operations  
3. **Functions & Modularity** - Function definitions, parameters, scope
4. **Data Structures & Algorithms** - Lists, dictionaries, sets, basic algorithms
5. **File Operations & Data Persistence** - File I/O, data formats, persistence
6. **Error Handling & Debugging** - Exception handling, debugging techniques
7. **Object-Oriented Programming** - Classes, objects, inheritance
8. **Real-World Applications** - APIs, databases, web scraping, data analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details