
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

    // Récupérer tous les utilisateurs de démo
    const demoEmails = [
      "admin@example.com",
      "commercial@example.com",
      "client@example.com",
      "freelance@example.com",
    ];

    const results = [];

    // Mettre à jour le mot de passe pour chaque utilisateur de démo
    for (const email of demoEmails) {
      try {
        // Rechercher l'utilisateur par email
        const { data: users, error: searchError } = await supabase
          .from("users")
          .select("email")
          .eq("email", email)
          .single();

        if (searchError) {
          results.push({ email, status: "error", message: `Utilisateur non trouvé: ${searchError.message}` });
          continue;
        }

        // Utiliser la fonction d'admin pour mettre à jour le mot de passe
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          users.id,
          { password: "123456" }
        );

        if (updateError) {
          results.push({ email, status: "error", message: updateError.message });
        } else {
          results.push({ email, status: "success", message: "Mot de passe mis à jour avec succès" });
        }
      } catch (error) {
        results.push({ email, status: "error", message: error.message });
      }
    }

    return new Response(JSON.stringify({ results }), {
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
