
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Récupérer les variables d'environnement pour Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Les clés d'API Supabase ne sont pas configurées");
    }

    // Créer un client Supabase avec la clé de service pour avoir des droits d'admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Option pour traiter tous les utilisateurs ou seulement les démos
    const requestBody = await req.json().catch(() => ({}));
    const allUsers = requestBody.allUsers === true;

    // Récupérer les utilisateurs
    let userQuery;
    
    if (allUsers) {
      console.log("Réinitialisation des mots de passe pour TOUS les utilisateurs");
      // Récupérer tous les utilisateurs de la table users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email");

      if (usersError) {
        throw new Error(`Erreur lors de la récupération des utilisateurs: ${usersError.message}`);
      }
      
      userQuery = usersData;
    } else {
      console.log("Réinitialisation des mots de passe pour les utilisateurs de DÉMO uniquement");
      // Récupérer uniquement les utilisateurs de démo
      const demoEmails = [
        "admin@example.com",
        "commercial@example.com",
        "client@example.com",
        "freelance@example.com",
      ];
      
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email")
        .in("email", demoEmails);
        
      if (usersError) {
        throw new Error(`Erreur lors de la récupération des utilisateurs de démo: ${usersError.message}`);
      }
      
      userQuery = usersData;
    }

    const results = [];

    // Mettre à jour le mot de passe pour chaque utilisateur
    for (const user of userQuery) {
      try {
        console.log(`Mise à jour du mot de passe pour l'utilisateur: ${user.email}`);
        
        // Vérifier si l'utilisateur existe dans auth.users
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user.id);
        
        if (authError) {
          results.push({ 
            email: user.email, 
            status: "error", 
            message: `Utilisateur non trouvé dans auth: ${authError.message}` 
          });
          continue;
        }
        
        // Mettre à jour le mot de passe
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          { password: "123456" }
        );

        if (updateError) {
          results.push({ 
            email: user.email, 
            status: "error", 
            message: `Erreur de mise à jour: ${updateError.message}` 
          });
        } else {
          // Mettre à jour le champ password dans la table users (si non défini)
          const { error: updateUserError } = await supabase
            .from("users")
            .update({ password: "123456" })
            .eq("id", user.id);
          
          if (updateUserError) {
            console.warn(`Erreur lors de la mise à jour du champ password dans users: ${updateUserError.message}`);
          }
          
          results.push({ 
            email: user.email, 
            status: "success", 
            message: "Mot de passe mis à jour avec succès à '123456'" 
          });
        }
      } catch (error) {
        results.push({ 
          email: user.email, 
          status: "error", 
          message: error.message 
        });
      }
    }

    const successCount = results.filter(r => r.status === "success").length;
    const totalCount = results.length;

    return new Response(JSON.stringify({ 
      results,
      summary: `${successCount}/${totalCount} mots de passe réinitialisés avec succès` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
