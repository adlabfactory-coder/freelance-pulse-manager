
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Définition des variables d'environnement pour Supabase avec des valeurs de secours
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cvgwwdwnfmnkiyxqfmnn.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A"

// Configuration explicite pour assurer la cohérence de la gestion des sessions
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage
    }
  }
)

// Fonction d'aide pour vérifier la connexion Supabase
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1)
    if (error) {
      console.error('Erreur de connexion à Supabase:', error)
      return false
    }
    console.log('Connexion à Supabase réussie')
    return true
  } catch (err) {
    console.error('Erreur inattendue lors de la vérification de la connexion Supabase:', err)
    return false
  }
}

// Exporter par défaut pour la rétrocompatibilité
export default supabase
