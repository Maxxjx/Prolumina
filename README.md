# Prolumina - Project Management System

A modern, feature-rich project management system built with React and Supabase, designed to help teams collaborate effectively on projects.

![Prolumina Dashboard](public/dashboard.png)

## 📚 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Management**: Multiple user roles (admin, team, client) with role-based permissions
- **Project Dashboard**: Visual project progress and statistics
- **Task Management**: Create, assign, and track tasks
- **Team Collaboration**: Team member assignment and management
- **Activity Logging**: Comprehensive action tracking
- **Responsive Design**: Mobile-first approach

## 🛠 Technology Stack

### Frontend
- React + TypeScript
- Vite (build tool)
- ShadCN UI + Tailwind CSS
- Framer Motion (animations)
- React Router (navigation)
- Zustand (state management)
- React Query (data fetching)
- Recharts (data visualization)

### Backend
- Supabase (Backend as a Service)
- PostgreSQL (database)
- Row Level Security (RLS)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/prolumina.git
cd prolumina
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Start development server
```bash
npm run dev
```

## 🗄️ Database Setup

> **Important**: Do not use the database credentials from the repository. Set up your own Supabase instance.

### Supabase Setup Steps

1. Create a [Supabase](https://supabase.com) account and new project
2. Set up database tables:
   - Navigate to SQL editor in Supabase dashboard
   - Run the schema setup script from `src/lib/schema.sql`
   - Run the sample data script from `src/lib/seedDatabase.sql`

3. Configure environment variables
```bash
# .env.local
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Required Database Tables
- Users
- Projects
- Tasks
- ActivityLogs
- Teams

### Security Configuration

Set up Row Level Security (RLS) policies:

```sql
-- Example RLS policy for activity_logs
CREATE POLICY "Enable insert for authenticated users" 
ON "public"."activity_logs"
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

## 💻 Development

### Project Structure
```
src/
├── components/     # UI components
├── hooks/         # Custom React hooks
├── lib/           # Utilities & configs
├── pages/         # Route components
├── stores/        # State management
├── styles/        # Global styles
└── types/         # TypeScript types
```

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - Code linting
- `npm run test` - Run tests

## 🌐 Deployment

1. Build the application
```bash
npm run build
```

2. Deploy using your preferred platform:
   - Vercel (recommended)
   - Netlify
   - GitHub Pages

## 🔧 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Verify authentication status
   - Check RLS policy configuration
   - Ensure all required fields are included

2. **Database Connection Issues**
   - Confirm environment variables are set
   - Check Supabase project status
   - Verify network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
