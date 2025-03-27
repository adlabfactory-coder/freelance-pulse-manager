
import { supabase } from "@/lib/supabase";
import { User } from "@/types";

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
    
  if (error) throw error;
  return data as User[];
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
    return null;
  }
  
  return data as User;
};

export const fetchFreelancers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'freelancer');
    
  if (error) throw error;
  return data as User[];
};
