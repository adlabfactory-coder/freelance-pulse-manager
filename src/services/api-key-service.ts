
import { supabase } from "@/integrations/supabase/client";
import { ApiKey, ApiKeyCreateParams } from "@/types/api-keys";
import { v4 as uuidv4 } from "uuid";

/**
 * Génère une clé API aléatoire sécurisée
 */
const generateApiKey = (): string => {
  const prefix = "adlabhub";
  const randomPart = uuidv4().replace(/-/g, "");
  return `${prefix}_${randomPart}`;
};

/**
 * Récupère toutes les clés API d'un utilisateur
 */
export const fetchApiKeysByUserId = async (userId: string): Promise<ApiKey[]> => {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des clés API:", error);
      return [];
    }

    return data.map((key) => ({
      id: key.id,
      userId: key.user_id,
      keyName: key.key_name,
      apiKey: key.api_key,
      createdAt: new Date(key.created_at),
      lastUsed: key.last_used ? new Date(key.last_used) : undefined,
      expiresAt: key.expires_at ? new Date(key.expires_at) : undefined,
      isActive: key.is_active,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des clés API:", error);
    return [];
  }
};

/**
 * Crée une nouvelle clé API pour un utilisateur
 */
export const createApiKey = async (params: ApiKeyCreateParams): Promise<ApiKey | null> => {
  try {
    const apiKey = generateApiKey();
    
    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: params.userId,
        key_name: params.keyName,
        api_key: apiKey,
        expires_at: params.expiresAt?.toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la clé API:", error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      keyName: data.key_name,
      apiKey: data.api_key,
      createdAt: new Date(data.created_at),
      lastUsed: data.last_used ? new Date(data.last_used) : undefined,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      isActive: data.is_active,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la clé API:", error);
    return null;
  }
};

/**
 * Supprime une clé API
 */
export const deleteApiKey = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Erreur lors de la suppression de la clé API ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la clé API ${id}:`, error);
    return false;
  }
};

/**
 * Vérifie la validité d'une clé API
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // Vérifier si la clé existe et est active
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, is_active, expires_at")
      .eq("api_key", apiKey)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return false;
    }

    // Vérifier si la clé n'est pas expirée
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false;
    }

    // Mettre à jour la date de dernière utilisation
    await supabase
      .from("api_keys")
      .update({ last_used: new Date().toISOString() })
      .eq("id", data.id);

    return true;
  } catch (error) {
    console.error("Erreur lors de la validation de la clé API:", error);
    return false;
  }
};
