
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const createStorageService = (supabase: SupabaseClient<Database>) => {
  // Nom du bucket par défaut
  const DEFAULT_BUCKET = 'adlab-documents';

  return {
    /**
     * Télécharge un fichier dans le bucket de stockage
     */
    uploadFile: async (file: File, path?: string, bucket: string = DEFAULT_BUCKET) => {
      try {
        const filePath = path ? `${path}/${file.name}` : file.name;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.error('Erreur lors du téléchargement du fichier:', error);
          return { success: false, error: error.message };
        }

        // Récupérer l'URL publique du fichier téléchargé
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return { 
          success: true, 
          data: { 
            ...data, 
            publicUrl: publicUrlData.publicUrl 
          } 
        };
      } catch (error: any) {
        console.error('Erreur inattendue lors du téléchargement:', error);
        return { success: false, error: error.message || 'Erreur inattendue lors du téléchargement' };
      }
    },

    /**
     * Obtient l'URL publique d'un fichier
     */
    getPublicUrl: (filePath: string, bucket: string = DEFAULT_BUCKET) => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    },

    /**
     * Supprime un fichier du bucket de stockage
     */
    deleteFile: async (filePath: string, bucket: string = DEFAULT_BUCKET) => {
      try {
        const { error } = await supabase.storage
          .from(bucket)
          .remove([filePath]);

        if (error) {
          console.error('Erreur lors de la suppression du fichier:', error);
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (error: any) {
        console.error('Erreur inattendue lors de la suppression:', error);
        return { success: false, error: error.message || 'Erreur inattendue lors de la suppression' };
      }
    },

    /**
     * Liste les fichiers dans un dossier
     */
    listFiles: async (folder: string = '', bucket: string = DEFAULT_BUCKET) => {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .list(folder);

        if (error) {
          console.error('Erreur lors de la récupération des fichiers:', error);
          return { success: false, error: error.message };
        }

        return { success: true, data };
      } catch (error: any) {
        console.error('Erreur inattendue lors de la récupération des fichiers:', error);
        return { success: false, error: error.message || 'Erreur inattendue lors de la récupération des fichiers' };
      }
    }
  };
};
