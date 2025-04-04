# Prolumina - Project Management System

Prolumina is a modern, feature-rich project management system built with React and Supabase, designed to help teams collaborate effectively on projects.

![Prolumina Dashboard](https://example.com/dashboard-screenshot.png)

## Features

- **User Management**: Handle multiple user roles (admin, team, client) with appropriate permissions
- **Project Dashboard**: Visual representation of project progress and statistics
- **Task Management**: Create, assign, and track tasks with priority levels and deadlines
- **Team Collaboration**: Assign team members to projects and tasks
- **Activity Logging**: Track all changes and actions within the system
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**:
  - React with TypeScript
  - Vite for fast development and building
  - ShadCN UI for modern, accessible components 
  - Tailwind CSS for styling
  - Framer Motion for animations
  - React Router for navigation
  - Zustand for state management
  - React Query for data fetching
  - Recharts for data visualization

- **Backend**:
  - Supabase for authentication and database
  - PostgreSQL for data storage
  - Row Level Security (RLS) for data protection

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account (for the backend)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/prolumina.git
   cd prolumina
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Supabase Configuration

This project uses Supabase for authentication and database functionality. You'll need to set up the following:

1. Create a new Supabase project
2. Set up the database tables according to the schema in `src/types/supabase.ts`
3. Configure Row Level Security (RLS) policies for the tables

#### Setting up RLS Policies

The application is experiencing issues with RLS policies for the `activity_logs` table. To fix this:

1. Navigate to your Supabase dashboard
2. Go to Authentication -> Policies
3. Add the following RLS policy for the `activity_logs` table:

```sql
-- For insert operations
CREATE POLICY "Enable insert for authenticated users" ON "public"."activity_logs"
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- For select operations
CREATE POLICY "Enable select for authenticated users" ON "public"."activity_logs"
FOR SELECT USING (auth.uid() IS NOT NULL);
```

These policies ensure that authenticated users can read and create activity logs.

## Supabase (Database) Configuration

This project uses Supabase for authentication and database functionality. **Do not use my database credentials.** Follow these steps to set up your own database:

1. Go to [Supabase](https://supabase.com/) and create your own account and new project.
2. In your new project, create the necessary tables and import the schema as described in [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) and [src/lib/seedDatabase.sql](src/lib/seedDatabase.sql).
3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. To seed your database with sample data, run the provided SQL script ([src/lib/seedDatabase.sql](src/lib/seedDatabase.sql)) in your Supabase dashboard or execute the [`seedTestData`](src/utils/seedHelpers.ts) function.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configurations
├── pages/          # Application pages/routes
├── stores/         # Zustand state stores
├── styles/         # Global styles
└── types/          # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Deployment

To deploy the application:

1. Build the project:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider of choice (Netlify, Vercel, etc.)

## Troubleshooting Common Issues

### Activity Log Errors

If you see errors like `new row violates row-level security policy for table "activity_logs"`, check that:

1. Your Supabase RLS policies are correctly configured as described above
2. The user has proper authentication
3. The insert operation includes all required fields

### UI Components and DOM Nesting

If you encounter DOM nesting warnings like `validateDOMNesting(...): <tr> cannot appear as a child of <div>`, follow these solutions:

1. **Using Framer Motion with Tables**:
   - Use shadcn's Table components (`Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`) instead of HTML elements
   - When using Framer Motion with tables, wrap individual cells rather than rows:
     ```tsx
     <TableRow>
       {row.getVisibleCells().map((cell) => (
         <TableCell key={cell.id}>
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
           >
             {flexRender(cell.column.columnDef.cell, cell.getContext())}
           </motion.div>
         </TableCell>
       ))}
     </TableRow>
     ```

2. **Correct Structure with TanStack Table**:
   - Follow the correct nesting hierarchy: `Table > TableHeader > TableRow > TableHead` and `Table > TableBody > TableRow > TableCell`
   - When using `AnimatePresence` with tables, apply it to the children of `TableBody` rather than to `TableBody` itself

3. **Using the `as` prop**:
   - Leverage Framer Motion's `as` prop to maintain proper DOM structure:
     ```tsx
     <motion.tr
       as={TableRow}
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
     >
       {/* Cell contents */}
     </motion.tr>
     ```

4. **Animation Mode**:
   - Use `<AnimatePresence mode="wait">` when animating table components to prevent nesting issues

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
