
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

    // Récupérer tous les utilisateurs de la table users
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, email, name, role");

    if (usersError) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${usersError.message}`);
    }

    if (!usersData || usersData.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: "Aucun utilisateur trouvé dans la table users" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    console.log(`${usersData.length} utilisateurs trouvés dans la table users`);

    const results = [];
    
    // Pour chaque utilisateur dans la table users, créer un utilisateur dans auth.users s'il n'existe pas déjà
    for (const user of usersData) {
      try {
        console.log(`Traitement de l'utilisateur: ${user.email}`);
        
        // Vérifier si l'utilisateur existe déjà dans auth.users
        const { data: existingAuthUser } = await supabase.auth.admin.getUserById(user.id);
        
        if (existingAuthUser?.user) {
          console.log(`L'utilisateur ${user.email} existe déjà dans auth.users`);
          
          // Mettre à jour le mot de passe de l'utilisateur
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: "123456" }
          );
          
          if (updateError) {
            results.push({
              email: user.email,
              status: "error",
              operation: "update",
              message: updateError.message
            });
          } else {
            results.push({
              email: user.email,
              status: "success",
              operation: "update",
              message: "Mot de passe mis à jour avec succès"
            });
          }
        } else {
          console.log(`Création d'un nouvel utilisateur dans auth.users: ${user.email}`);
          
          // Créer un nouvel utilisateur dans auth.users
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: "123456",
            email_confirm: true,
            user_metadata: {
              name: user.name,
              role: user.role
            },
            app_metadata: {
              provider: "email"
            }
          });
          
          if (createError) {
            results.push({
              email: user.email,
              status: "error",
              operation: "create",
              message: createError.message
            });
          } else {
            results.push({
              email: user.email,
              status: "success",
              operation: "create",
              message: "Utilisateur créé avec succès"
            });
          }
        }
      } catch (error) {
        results.push({
          email: user.email,
          status: "error",
          operation: "process",
          message: error.message
        });
      }
    }

    // Statistiques
    const successCount = results.filter(r => r.status === "success").length;
    const totalCount = results.length;

    return new Response(
      JSON.stringify({
        results,
        summary: `${successCount}/${totalCount} utilisateurs synchronisés avec succès`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
