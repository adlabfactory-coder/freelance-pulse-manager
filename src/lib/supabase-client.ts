
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Définition des variables d'environnement pour Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Création d'un singleton pour le client Supabase
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
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
