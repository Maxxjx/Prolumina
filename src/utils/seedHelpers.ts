import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

// Type for our user data
type User = Database['public']['Tables']['users']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

// Helper function to seed test data programmatically
export const seedTestData = async () => {
  try {
    console.log('Starting to seed database...');
    
    // Check if we already have data to avoid duplicates
    const { data: existingProjects } = await supabase.from('projects').select('*').limit(1);
    
    if (existingProjects && existingProjects.length > 0) {
      console.log('Database already contains data. Skipping seeding process.');
      return { success: true, message: 'Database already contains data' };
    }
    
    // Create test users with auth accounts and profiles
    const testUsers = [
      {
        email: 'rajesh.kumar@example.com',
        name: 'Rajesh Kumar',
        role: 'admin' as const,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
      },
      {
        email: 'priya.sharma@example.com',
        name: 'Priya Sharma',
        role: 'team' as const,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
      },
      {
        email: 'amit.patel@example.com',
        name: 'Amit Patel',
        role: 'team' as const,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
      },
      {
        email: 'neha.gupta@example.com',
        name: 'Neha Gupta',
        role: 'team' as const,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha'
      },
      {
        email: 'vikram.singh@example.com',
        name: 'Vikram Singh',
        role: 'client' as const,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram'
      },
      {
        email: 'ananya.desai@example.com',
        name: 'Ananya Desai',
        role: 'client' as const,
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya'
      }
    ];
    
    const createdUsers = [];
    
    // Create auth users and profiles
    for (const user of testUsers) {
      // Create Auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'password123',
        email_confirm: true,
      });
      
      if (authError) {
        console.error('Error creating auth user:', authError);
        
        // If user already exists, try to fetch their ID
        if (authError.message.includes('already exists')) {
          // Fix: Use correct parameters for listUsers
          const { data: existingAuthUser } = await supabase.auth.admin.listUsers({
            perPage: 100,
            page: 1,
          });
          
          if (existingAuthUser && existingAuthUser.users) {
            // Fix: Type annotation for matchingUser to avoid 'never' type
            const matchingUser = existingAuthUser.users.find(u => u.email === user.email);
            
            if (matchingUser && matchingUser.email) {
              const userId = matchingUser.id;
              
              // Check if user profile exists
              const { data: existingProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
                
              if (!existingProfile) {
                // Create user profile with existing auth user ID
                const { error: profileError } = await supabase
                  .from('users')
                  .insert({
                    id: userId,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    avatar_url: user.avatar_url
                  });
                  
                if (profileError) {
                  throw profileError;
                }
                
                createdUsers.push({ ...user, id: userId });
              } else {
                createdUsers.push(existingProfile);
              }
            }
          }
          continue;
        } else {
          throw authError;
        }
      }
      
      if (!authData || !authData.user) {
        throw new Error('Failed to create auth user');
      }
      
      const userId = authData.user.id;
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar_url: user.avatar_url
        });
        
      if (profileError) {
        throw profileError;
      }
      
      createdUsers.push({ ...user, id: userId });
    }
    
    console.log('Test users created successfully:', createdUsers);
    
    // Create projects
    const projects = [
      {
        name: 'Mumbai Smart City Initiative',
        description: 'Digital transformation of Mumbai urban infrastructure with IoT integration',
        status: 'In Progress',
        deadline: '2023-12-31',
        progress: 45
      },
      {
        name: 'Bangalore Tech Park',
        description: 'Development of a new technology park in Electronic City Phase II',
        status: 'Planning',
        deadline: '2024-06-30',
        progress: 20
      },
      {
        name: 'Delhi Metro Expansion',
        description: 'Project management for Delhi Metro expansion to Noida Extension',
        status: 'Active',
        deadline: '2024-03-15',
        progress: 65
      },
      {
        name: 'Jaipur Heritage Conservation',
        description: 'Digital documentation and conservation of Jaipur historical monuments',
        status: 'On Hold',
        deadline: '2023-09-30',
        progress: 10
      },
      {
        name: 'Kerala Tourism Portal',
        description: 'Developing an immersive digital experience for Kerala tourism',
        status: 'Completed',
        deadline: '2023-07-31',
        progress: 100
      }
    ];
    
    const createdProjects = [];
    
    // Insert projects
    for (const project of projects) {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select();
        
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Failed to create project');
      
      createdProjects.push(data[0]);
    }
    
    console.log('Projects created successfully:', createdProjects);
    
    // Create project members assignments
    const projectAssignments = [
      { project_id: createdProjects[0].id, user_ids: [createdUsers[0].id, createdUsers[1].id, createdUsers[2].id] },
      { project_id: createdProjects[1].id, user_ids: [createdUsers[0].id, createdUsers[3].id] },
      { project_id: createdProjects[2].id, user_ids: [createdUsers[1].id, createdUsers[2].id] },
      { project_id: createdProjects[3].id, user_ids: [createdUsers[3].id] },
      { project_id: createdProjects[4].id, user_ids: [createdUsers[1].id, createdUsers[2].id] }
    ];
    
    // Insert project members
    for (const assignment of projectAssignments) {
      const members = assignment.user_ids.map(user_id => ({
        project_id: assignment.project_id,
        user_id
      }));
      
      const { error } = await supabase
        .from('project_members')
        .insert(members);
        
      if (error) throw error;
    }
    
    console.log('Project members assigned successfully');
    
    // Create tasks with updated status values to match what the app expects
    const tasks = [
      {
        title: 'Install IoT sensors',
        description: 'Install smart sensors across Bandra area for traffic monitoring',
        project_id: createdProjects[0].id,
        status: 'in-progress',
        priority: 'High',
        due_date: '2023-09-15'
      },
      {
        title: 'Develop mobile app',
        description: 'Create citizen engagement mobile app for Mumbai Smart City',
        project_id: createdProjects[0].id,
        status: 'todo',
        priority: 'Medium',
        due_date: '2023-10-20'
      },
      {
        title: 'Land acquisition',
        description: 'Complete land acquisition process for Tech Park Phase 1',
        project_id: createdProjects[1].id,
        status: 'in-progress',
        priority: 'High',
        due_date: '2023-11-30'
      },
      {
        title: 'Environmental clearance',
        description: 'Obtain environmental clearances from Karnataka State Pollution Control Board',
        project_id: createdProjects[1].id,
        status: 'todo',
        priority: 'High',
        due_date: '2023-08-15'
      },
      {
        title: 'Station design review',
        description: 'Review and approve designs for new metro stations',
        project_id: createdProjects[2].id,
        status: 'completed',
        priority: 'Medium',
        due_date: '2023-07-10'
      },
      {
        title: 'Tender preparation',
        description: 'Prepare tender documents for construction contracts',
        project_id: createdProjects[2].id,
        status: 'in-progress',
        priority: 'High',
        due_date: '2023-08-25'
      },
      {
        title: '3D scanning of Hawa Mahal',
        description: 'Complete 3D laser scanning of Hawa Mahal exterior',
        project_id: createdProjects[3].id,
        status: 'todo',
        priority: 'Medium',
        due_date: '2023-09-05'
      },
      {
        title: 'VR experience design',
        description: 'Design virtual reality experience for Kerala backwaters',
        project_id: createdProjects[4].id,
        status: 'completed',
        priority: 'Low',
        due_date: '2023-06-20'
      },
      {
        title: 'Content translation',
        description: 'Translate website content to Hindi, Tamil, and German',
        project_id: createdProjects[4].id,
        status: 'review',
        priority: 'Medium',
        due_date: '2023-07-15'
      }
    ];
    
    const createdTasks = [];
    
    // Insert tasks
    for (const task of tasks) {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select();
        
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Failed to create task');
      
      createdTasks.push(data[0]);
    }
    
    console.log('Tasks created successfully:', createdTasks);
    
    // Assign tasks to users
    const taskAssignments = [
      { task_id: createdTasks[0].id, user_ids: [createdUsers[2].id] },
      { task_id: createdTasks[1].id, user_ids: [createdUsers[1].id] },
      { task_id: createdTasks[2].id, user_ids: [createdUsers[0].id, createdUsers[3].id] },
      { task_id: createdTasks[3].id, user_ids: [createdUsers[3].id] },
      { task_id: createdTasks[4].id, user_ids: [createdUsers[1].id] },
      { task_id: createdTasks[5].id, user_ids: [createdUsers[1].id, createdUsers[2].id] },
      { task_id: createdTasks[6].id, user_ids: [createdUsers[3].id] },
      { task_id: createdTasks[7].id, user_ids: [createdUsers[2].id] },
      { task_id: createdTasks[8].id, user_ids: [createdUsers[1].id] }
    ];
    
    // Insert task assignees
    for (const assignment of taskAssignments) {
      const assignees = assignment.user_ids.map(user_id => ({
        task_id: assignment.task_id,
        user_id
      }));
      
      const { error } = await supabase
        .from('task_assignees')
        .insert(assignees);
        
      if (error) throw error;
    }
    
    console.log('Task assignees created successfully');
    
    // Create task comments
    const taskComments = [
      {
        task_id: createdTasks[0].id,
        user_id: createdUsers[2].id,
        text: 'Sensors have arrived from Chennai. Will begin installation tomorrow.'
      },
      {
        task_id: createdTasks[0].id,
        user_id: createdUsers[0].id,
        text: 'Make sure to coordinate with BMC officials before installation.'
      },
      {
        task_id: createdTasks[2].id,
        user_id: createdUsers[3].id,
        text: 'The landowners in Sector 6 are requesting higher compensation. Need approval.'
      },
      {
        task_id: createdTasks[3].id,
        user_id: createdUsers[3].id,
        text: 'Environmental impact assessment report needs revision before submission.'
      },
      {
        task_id: createdTasks[3].id,
        user_id: createdUsers[0].id,
        text: 'Please expedite this as it is blocking other tasks.'
      },
      {
        task_id: createdTasks[4].id,
        user_id: createdUsers[1].id,
        text: 'All station designs have been reviewed and approved by the committee.'
      },
      {
        task_id: createdTasks[5].id,
        user_id: createdUsers[2].id,
        text: 'Draft tender documents are ready for legal review.'
      },
      {
        task_id: createdTasks[6].id,
        user_id: createdUsers[3].id,
        text: 'Awaiting permission from Archaeological Survey of India to proceed.'
      },
      {
        task_id: createdTasks[7].id,
        user_id: createdUsers[2].id,
        text: 'VR experience prototype is ready for testing.'
      },
      {
        task_id: createdTasks[8].id,
        user_id: createdUsers[1].id,
        text: 'All translations completed and integrated into the CMS.'
      }
    ];
    
    // Insert task comments
    for (const comment of taskComments) {
      const { error } = await supabase
        .from('task_comments')
        .insert(comment);
        
      if (error) throw error;
    }
    
    console.log('Task comments created successfully');
    
    // Create activity logs
    const activityLogs = [
      {
        user_id: createdUsers[0].id,
        user_name: createdUsers[0].name,
        action: 'created',
        entity_type: 'project',
        entity_id: createdProjects[0].id,
        details: `Created ${createdProjects[0].name} project`
      },
      {
        user_id: createdUsers[0].id,
        user_name: createdUsers[0].name,
        action: 'created',
        entity_type: 'project',
        entity_id: createdProjects[1].id,
        details: `Created ${createdProjects[1].name} project`
      },
      {
        user_id: createdUsers[1].id,
        user_name: createdUsers[1].name,
        action: 'created',
        entity_type: 'task',
        entity_id: createdTasks[4].id,
        details: `Created ${createdTasks[4].title} task`
      },
      {
        user_id: createdUsers[2].id,
        user_name: createdUsers[2].name,
        action: 'updated',
        entity_type: 'task',
        entity_id: createdTasks[0].id,
        details: 'Updated status to In Progress'
      },
      {
        user_id: createdUsers[3].id,
        user_name: createdUsers[3].name,
        action: 'commented',
        entity_type: 'task',
        entity_id: createdTasks[3].id,
        details: 'Added comment about environmental assessment'
      },
      {
        user_id: createdUsers[1].id,
        user_name: createdUsers[1].name,
        action: 'completed',
        entity_type: 'task',
        entity_id: createdTasks[4].id,
        details: 'Marked task as complete'
      },
      {
        user_id: createdUsers[0].id,
        user_name: createdUsers[0].name,
        action: 'assigned',
        entity_type: 'task',
        entity_id: createdTasks[2].id,
        details: `Assigned task to ${createdUsers[3].name}`
      },
      {
        user_id: createdUsers[2].id,
        user_name: createdUsers[2].name,
        action: 'created',
        entity_type: 'task',
        entity_id: createdTasks[7].id,
        details: `Created ${createdTasks[7].title} task`
      },
      {
        user_id: createdUsers[1].id,
        user_name: createdUsers[1].name,
        action: 'updated',
        entity_type: 'project',
        entity_id: createdProjects[4].id,
        details: 'Updated project progress to 100%'
      },
      {
        user_id: createdUsers[0].id,
        user_name: createdUsers[0].name,
        action: 'created',
        entity_type: 'project',
        entity_id: createdProjects[3].id,
        details: `Created ${createdProjects[3].name} project`
      }
    ];
    
    // Insert activity logs
    for (const log of activityLogs) {
      const { error } = await supabase
        .from('activity_logs')
        .insert(log);
        
      if (error) throw error;
    }
    
    console.log('Activity logs created successfully');
    
    return { 
      success: true, 
      message: 'Database seeded successfully with auth users and sample data' 
    };
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return { 
      success: false, 
      message: `Error seeding database: ${error.message}`, 
      error 
    };
  }
};

// Helper to create random users for testing
export const generateRandomUser = () => {
  const firstNames = ['Arjun', 'Vikram', 'Neha', 'Priya', 'Rahul', 'Aditya', 'Kavita', 'Anjali', 'Sanjay', 'Deepak'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Desai', 'Kumar', 'Mehta', 'Joshi', 'Verma', 'Reddy'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  
  return {
    name,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    role: ['admin', 'team', 'client'][Math.floor(Math.random() * 3)] as 'admin' | 'team' | 'client',
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
  };
};
