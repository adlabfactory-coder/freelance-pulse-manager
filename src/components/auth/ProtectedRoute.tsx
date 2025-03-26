
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Vérifier d'abord si un utilisateur de démo est stocké
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            // Ne pas modifier l'état si on est en mode démo
            if (!localStorage.getItem('demoUser')) {
              setIsAuthenticated(!!session);
              setIsLoading(false);
            }
          }
        );
        
        // THEN check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur lors de la vérification de l'authentification:", error);
          setIsAuthenticated(false);
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: "Une erreur est survenue lors de la vérification de votre session. Veuillez vous reconnecter."
          });
          setIsLoading(false);
          return;
        }
        
        setIsAuthenticated(!!data.session);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    return () => {
      // Aucun besoin de démonter l'écouteur car il est géré par Supabase
    };
  }, []);

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
