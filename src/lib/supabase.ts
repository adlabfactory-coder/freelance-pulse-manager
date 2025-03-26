
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Utilisation des valeurs définies directement au lieu des variables d'environnement
const supabaseUrl = "https://cvgwwdwnfmnkiyxqfmnn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing!');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
