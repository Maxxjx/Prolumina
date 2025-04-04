
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use the preconfigured client from the integration
import { supabase as preconfiguredClient } from '@/integrations/supabase/client';

// Configure the client with proper auth settings to ensure session persistence
const supabase = preconfiguredClient;

// Export the configured client
export { supabase };
