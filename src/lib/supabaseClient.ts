import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evtnaebzypszybyotjlp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dG5hZWJ6eXBzenlieW90amxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4OTYyODMsImV4cCI6MjA2ODQ3MjI4M30.QD1WE7T9qnJVyRl7taHMLVzKCEhbzeHCGjk_XzdY6k4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 