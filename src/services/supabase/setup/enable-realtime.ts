
import { supabase } from "@/lib/supabase-client";

/**
 * Active la fonctionnalité Realtime pour les tables spécifiées
 * Cela permet de suivre les modifications en temps réel
 */
export const enableRealtimeForTables = async (tables: string[]) => {
  try {
    // Vérifier si l'utilisateur a les droits d'administration
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    // Vérifier si l'utilisateur est un administrateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || !['admin', 'super_admin'].includes(userData.role)) {
      throw new Error("Vous n'avez pas les droits nécessaires pour effectuer cette action");
    }

    // Activer Realtime pour chaque table spécifiée
    for (const table of tables) {
      // Définir REPLICA IDENTITY FULL pour permettre le suivi des modifications
      const { error: replicaError } = await supabase.rpc('execute_sql', {
        sql: `ALTER TABLE public.${table} REPLICA IDENTITY FULL;`
      });

      if (replicaError) {
        console.error(`Erreur lors de la configuration de REPLICA IDENTITY pour ${table}:`, replicaError);
        continue;
      }

      // Ajouter la table à la publication de realtime
      const { error: pubError } = await supabase.rpc('execute_sql', {
        sql: `
          BEGIN;
          -- Créer la publication si elle n'existe pas
          CREATE PUBLICATION IF NOT EXISTS supabase_realtime FOR ALL TABLES;
          
          -- Ajouter la table à la publication
          ALTER PUBLICATION supabase_realtime ADD TABLE public.${table};
          COMMIT;
        `
      });

      if (pubError) {
        console.error(`Erreur lors de l'ajout de ${table} à la publication realtime:`, pubError);
      }
    }

    return { success: true, message: "Configuration Realtime activée avec succès" };
  } catch (error: any) {
    console.error("Erreur lors de l'activation de Realtime:", error);
    return { success: false, message: error.message || "Une erreur s'est produite" };
  }
};
