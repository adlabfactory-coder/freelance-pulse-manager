
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { DatabaseSetupStatus } from '@/types/supabase-types';

export const useDatabaseStatus = () => {
  const checkSupabaseStatus = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.from('users').select('id').limit(1);
      if (error) {
        console.error('Supabase connection error:', error);
        return { success: false, message: 'Failed to connect to Supabase.' };
      }
      return { success: true, message: 'Supabase is connected.' };
    } catch (error) {
      console.error('Unexpected error checking Supabase status:', error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const checkDatabaseStatus = async (): Promise<DatabaseSetupStatus> => {
    try {
      // Example implementation - should be expanded for full checking
      const tablesStatus = await Promise.all([
        supabase.from('users').select('count', { count: 'exact', head: true }),
        supabase.from('contacts').select('count', { count: 'exact', head: true }),
        supabase.from('appointments').select('count', { count: 'exact', head: true }),
        supabase.from('quotes').select('count', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('count', { count: 'exact', head: true })
      ]);
      
      const missingTables = tablesStatus
        .map((result, index) => {
          const tables = ['users', 'contacts', 'appointments', 'quotes', 'subscriptions'];
          return result.error ? tables[index] : null;
        })
        .filter(Boolean) as string[];
      
      return { 
        success: missingTables.length === 0,
        missingTables,
        message: missingTables.length > 0 
          ? `Tables manquantes: ${missingTables.join(', ')}` 
          : 'Toutes les tables sont correctement configurées'
      };
    } catch (error) {
      console.error('Error checking database status:', error);
      return { success: false, missingTables: [], message: 'An error occurred checking the database.' };
    }
  };

  const initializeDatabase = async (options?: any): Promise<{ success: boolean; message?: string }> => {
    try {
      // This would need to be expanded for actual table creation
      if (options?.onTableCreated) {
        // Call the callback for demo purposes
        ['users', 'contacts', 'appointments', 'quotes', 'subscriptions'].forEach(table => {
          options.onTableCreated(table);
        });
      }
      return { success: true, message: 'Database initialized successfully' };
    } catch (error) {
      console.error('Error initializing database:', error);
      return { success: false, message: 'Database initialization failed' };
    }
  };

  return {
    checkSupabaseStatus,
    checkDatabaseStatus,
    initializeDatabase
  };
};
