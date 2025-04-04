
-- Seed Database with Sample Data (Indian Context)
-- This script can be executed in the Supabase SQL Editor

-- Clear existing data before seeding
DELETE FROM public.task_comments;
DELETE FROM public.task_assignees;
DELETE FROM public.tasks;
DELETE FROM public.project_members;
DELETE FROM public.projects;
DELETE FROM public.activity_logs;
-- Don't delete users, as they are connected to auth.users

-- Insert sample users (assuming these users already exist in auth)
-- You'll need to replace the UUIDs with actual user IDs from your auth.users table
-- or create these users first in the Supabase Auth UI/API

INSERT INTO public.users (id, email, name, role, avatar_url)
VALUES
  ('150c4e81-0ac1-457a-bd7d-cb427839dd9f', 'rajesh.kumar@prolumina.com', 'Rajesh Kumar', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'),
  ('1a29e090-9c37-47de-81bb-e31f9c2943cb', 'priya.sharma@prolumina.com', 'Priya Sharma', 'team', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'),
  ('daf1c021-7112-405f-9be3-56219155fb02', 'amit.patel@prolumina.com', 'Amit Patel', 'team', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'),
  ('e66f5c9e-fa09-4c65-876b-a19a69be87c1', 'neha.gupta@prolumina.com', 'Neha Gupta', 'team', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha'),
  ('63d6abd7-cc91-450b-8c09-c4ba7fd4400b', 'vikram.singh@prolumina.com', 'Vikram Singh', 'client', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram'),
  ('577fed63-0d38-423a-bee5-8a281e02ccce', 'ananya.desai@prolumina.com', 'Ananya Desai', 'client', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya');

-- Insert projects (Indian context)
INSERT INTO public.projects (id, name, description, status, deadline, progress)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Mumbai Smart City Initiative', 'Digital transformation of Mumbai urban infrastructure with IoT integration', 'In Progress', '2023-12-31', 45),
  ('10000000-0000-0000-0000-000000000002', 'Bangalore Tech Park', 'Development of a new technology park in Electronic City Phase II', 'Planning', '2024-06-30', 20),
  ('10000000-0000-0000-0000-000000000003', 'Delhi Metro Expansion', 'Project management for Delhi Metro expansion to Noida Extension', 'Active', '2024-03-15', 65),
  ('10000000-0000-0000-0000-000000000004', 'Jaipur Heritage Conservation', 'Digital documentation and conservation of Jaipur historical monuments', 'On Hold', '2023-09-30', 10),
  ('10000000-0000-0000-0000-000000000005', 'Kerala Tourism Portal', 'Developing an immersive digital experience for Kerala tourism', 'Completed', '2023-07-31', 100);

-- Link projects with team members
INSERT INTO public.project_members (project_id, user_id)
VALUES
  ('10000000-0000-0000-0000-000000000001', '150c4e81-0ac1-457a-bd7d-cb427839dd9f'),
  ('10000000-0000-0000-0000-000000000001', '1a29e090-9c37-47de-81bb-e31f9c2943cb'),
  ('10000000-0000-0000-0000-000000000001', 'daf1c021-7112-405f-9be3-56219155fb02'),
  ('10000000-0000-0000-0000-000000000002', '150c4e81-0ac1-457a-bd7d-cb427839dd9f'),
  ('10000000-0000-0000-0000-000000000002', 'e66f5c9e-fa09-4c65-876b-a19a69be87c1'),
  ('10000000-0000-0000-0000-000000000003', '1a29e090-9c37-47de-81bb-e31f9c2943cb'),
  ('10000000-0000-0000-0000-000000000003', 'daf1c021-7112-405f-9be3-56219155fb02'),
  ('10000000-0000-0000-0000-000000000004', 'e66f5c9e-fa09-4c65-876b-a19a69be87c1'),
  ('10000000-0000-0000-0000-000000000005', '1a29e090-9c37-47de-81bb-e31f9c2943cb'),
  ('10000000-0000-0000-0000-000000000005', 'daf1c021-7112-405f-9be3-56219155fb02');

-- Insert tasks with status values matching what the app expects (todo, in-progress, review, completed)
INSERT INTO public.tasks (id, title, description, project_id, status, priority, due_date)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Install IoT sensors', 'Install smart sensors across Bandra area for traffic monitoring', '10000000-0000-0000-0000-000000000001', 'in-progress', 'High', '2023-09-15'),
  ('20000000-0000-0000-0000-000000000002', 'Develop mobile app', 'Create citizen engagement mobile app for Mumbai Smart City', '10000000-0000-0000-0000-000000000001', 'todo', 'Medium', '2023-10-20'),
  ('20000000-0000-0000-0000-000000000003', 'Land acquisition', 'Complete land acquisition process for Tech Park Phase 1', '10000000-0000-0000-0000-000000000002', 'in-progress', 'High', '2023-11-30'),
  ('20000000-0000-0000-0000-000000000004', 'Environmental clearance', 'Obtain environmental clearances from Karnataka State Pollution Control Board', '10000000-0000-0000-0000-000000000002', 'todo', 'High', '2023-08-15'),
  ('20000000-0000-0000-0000-000000000005', 'Station design review', 'Review and approve designs for new metro stations', '10000000-0000-0000-0000-000000000003', 'completed', 'Medium', '2023-07-10'),
  ('20000000-0000-0000-0000-000000000006', 'Tender preparation', 'Prepare tender documents for construction contracts', '10000000-0000-0000-0000-000000000003', 'in-progress', 'High', '2023-08-25'),
  ('20000000-0000-0000-0000-000000000007', '3D scanning of Hawa Mahal', 'Complete 3D laser scanning of Hawa Mahal exterior', '10000000-0000-0000-0000-000000000004', 'todo', 'Medium', '2023-09-05'),
  ('20000000-0000-0000-0000-000000000008', 'VR experience design', 'Design virtual reality experience for Kerala backwaters', '10000000-0000-0000-0000-000000000005', 'completed', 'Low', '2023-06-20'),
  ('20000000-0000-0000-0000-000000000009', 'Content translation', 'Translate website content to Hindi, Tamil, and German', '10000000-0000-0000-0000-000000000005', 'review', 'Medium', '2023-07-15');

-- Assign tasks to users
INSERT INTO public.task_assignees (task_id, user_id)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'daf1c021-7112-405f-9be3-56219155fb02'),
  ('20000000-0000-0000-0000-000000000002', '1a29e090-9c37-47de-81bb-e31f9c2943cb'),
  ('20000000-0000-0000-0000-000000000003', '150c4e81-0ac1-457a-bd7d-cb427839dd9f'),
  ('20000000-0000-0000-0000-000000000003', 'e66f5c9e-fa09-4c65-876b-a19a69be87c1'),
  ('20000000-0000-0000-0000-000000000004', 'e66f5c9e-fa09-4c65-876b-a19a69be87c1'),
  ('20000000-0000-0000-0000-000000000005', '1a29e090-9c37-47de-81bb-e31f9c2943cb'),
  ('20000000-0000-0000-0000-000000000006', '1a29e090-9c37-47de-81bb-e31f9c2943cb'),
  ('20000000-0000-0000-0000-000000000006', 'daf1c021-7112-405f-9be3-56219155fb02'),
  ('20000000-0000-0000-0000-000000000007', 'e66f5c9e-fa09-4c65-876b-a19a69be87c1'),
  ('20000000-0000-0000-0000-000000000008', 'daf1c021-7112-405f-9be3-56219155fb02'),
  ('20000000-0000-0000-0000-000000000009', '1a29e090-9c37-47de-81bb-e31f9c2943cb');

-- Add task comments
INSERT INTO public.task_comments (task_id, user_id, text)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'daf1c021-7112-405f-9be3-56219155fb02', 'Sensors have arrived from Chennai. Will begin installation tomorrow.'),
  ('20000000-0000-0000-0000-000000000001', '150c4e81-0ac1-457a-bd7d-cb427839dd9f', 'Make sure to coordinate with BMC officials before installation.'),
  ('20000000-0000-0000-0000-000000000003', 'e66f5c9e-fa09-4c65-876b-a19a69be87c1', 'The landowners in Sector 6 are requesting higher compensation. Need approval.'),
  ('20000000-0000-0000-0000-000000000004', 'e66f5c9e-fa09-4c65-876b-a19a69be87c1', 'Environmental impact assessment report needs revision before submission.'),
  ('20000000-0000-0000-0000-000000000004', '150c4e81-0ac1-457a-bd7d-cb427839dd9f', 'Please expedite this as it is blocking other tasks.'),
  ('20000000-0000-0000-0000-000000000005', '1a29e090-9c37-47de-81bb-e31f9c2943cb', 'All station designs have been reviewed and approved by the committee.'),
  ('20000000-0000-0000-0000-000000000006', 'daf1c021-7112-405f-9be3-56219155fb02', 'Draft tender documents are ready for legal review.'),
  ('20000000-0000-0000-0000-000000000007', 'e66f5c9e-fa09-4c65-876b-a19a69be87c1', 'Awaiting permission from Archaeological Survey of India to proceed.'),
  ('20000000-0000-0000-0000-000000000008', 'daf1c021-7112-405f-9be3-56219155fb02', 'VR experience prototype is ready for testing.'),
  ('20000000-0000-0000-0000-000000000009', '1a29e090-9c37-47de-81bb-e31f9c2943cb', 'All translations completed and integrated into the CMS.');

-- Add activity logs
INSERT INTO public.activity_logs (user_id, user_name, action, entity_type, entity_id, details)
VALUES
  ('150c4e81-0ac1-457a-bd7d-cb427839dd9f', 'Rajesh Kumar', 'created', 'project', '10000000-0000-0000-0000-000000000001', 'Created Mumbai Smart City Initiative project'),
  ('150c4e81-0ac1-457a-bd7d-cb427839dd9f', 'Rajesh Kumar', 'created', 'project', '10000000-0000-0000-0000-000000000002', 'Created Bangalore Tech Park project'),
  ('1a29e090-9c37-47de-81bb-e31f9c2943cb', 'Priya Sharma', 'created', 'task', '20000000-0000-0000-0000-000000000005', 'Created Station design review task'),
  ('daf1c021-7112-405f-9be3-56219155fb02', 'Amit Patel', 'updated', 'task', '20000000-0000-0000-0000-000000000001', 'Updated status to In Progress'),
  ('e66f5c9e-fa09-4c65-876b-a19a69be87c1', 'Neha Gupta', 'commented', 'task', '20000000-0000-0000-0000-000000000004', 'Added comment about environmental assessment'),
  ('1a29e090-9c37-47de-81bb-e31f9c2943cb', 'Priya Sharma', 'completed', 'task', '20000000-0000-0000-0000-000000000005', 'Marked task as complete'),
  ('150c4e81-0ac1-457a-bd7d-cb427839dd9f', 'Rajesh Kumar', 'assigned', 'task', '20000000-0000-0000-0000-000000000003', 'Assigned task to Neha Gupta'),
  ('daf1c021-7112-405f-9be3-56219155fb02', 'Amit Patel', 'created', 'task', '20000000-0000-0000-0000-000000000008', 'Created VR experience design task'),
  ('1a29e090-9c37-47de-81bb-e31f9c2943cb', 'Priya Sharma', 'updated', 'project', '10000000-0000-0000-0000-000000000005', 'Updated project progress to 100%'),
  ('150c4e81-0ac1-457a-bd7d-cb427839dd9f', 'Rajesh Kumar', 'created', 'project', '10000000-0000-0000-0000-000000000004', 'Created Jaipur Heritage Conservation project');

