
// Main Supabase export file
// This file re-exports all Supabase-related functionality to maintain compatibility

export { supabase } from './supabase-client';
export { checkSupabaseConnection } from './supabase-connection';
export { checkDatabaseSetup, setupDatabase } from './supabase-setup';
export { createDatabaseFunctions } from './supabase-functions';
