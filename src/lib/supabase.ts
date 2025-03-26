
import { supabase } from './supabase-client';
import { Database } from '@/types/database';

// Re-exporter le client pour la compatibilité avec le code existant
export { supabase };

// TypeScript re-export pour la compatibilité
export type SupabaseClient = typeof supabase;
