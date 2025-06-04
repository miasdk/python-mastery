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

## Database Schema

The platform uses Drizzle ORM with the following main tables:
- `users` - User accounts and progress
- `sections` - Curriculum sections
- `lessons` - Individual lessons within sections
- `problems` - Coding problems and challenges
- `user_progress` - User completion tracking
- `achievements` - User achievements and milestones

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