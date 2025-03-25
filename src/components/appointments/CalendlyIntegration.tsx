
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types";

const CalendlyIntegration: React.FC = () => {
  const supabase = useSupabase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would get the current user ID from an auth context
        // For this demo, we'll get the first user from the database
        const users = await supabase.fetchUsers();
        if (users && users.length > 0) {
          setCurrentUser(users[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer vos informations utilisateur.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [supabase]);

  if (isLoading) {
    return <div className="text-center py-8">Chargement de l'intégration Calendly...</div>;
  }

  if (!currentUser) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Impossible de charger les informations utilisateur pour l'intégration Calendly.
        </AlertDescription>
      </Alert>
    );
  }

  if (!currentUser.calendly_enabled || !currentUser.calendly_url) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intégration Calendly</CardTitle>
          <CardDescription>
            L'intégration Calendly n'est pas configurée. Veuillez configurer vos paramètres Calendly dans votre profil.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Clean the Calendly URL to ensure it works correctly
  const calendlyUrl = currentUser.calendly_url.trim();
  const formattedUrl = calendlyUrl.endsWith('/') ? calendlyUrl : `${calendlyUrl}/`;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Planifier un rendez-vous</CardTitle>
        <CardDescription>
          Utilisez Calendly pour planifier des rendez-vous directement dans votre calendrier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[650px]">
          <iframe
            src={`${formattedUrl}?hide_gdpr_banner=1`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Calendly Scheduling"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendlyIntegration;
