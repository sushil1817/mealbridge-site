import { createClient } from '@supabase/supabase-js';

// 1. PASTE YOUR REAL URL INSIDE THE QUOTES BELOW (No spaces!)
const supabaseUrl = "https://lyhpuudyyhfpemxcupca.supabase.co"; 

// 2. PASTE YOUR REAL ANON KEY INSIDE THE QUOTES BELOW (The long eyJ... string)
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aHB1dWR5eWhmcGVteGN1cGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODk1MjcsImV4cCI6MjA4MDk2NTUyN30.uNDUiAJq1vlA3pYVS8u4Cy8v0LG5GF3YbYwQVlmRSRs"; 

export const supabase = createClient(supabaseUrl, supabaseKey);