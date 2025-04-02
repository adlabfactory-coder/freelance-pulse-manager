import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import LoginForm, { LoginFormData } from "@/components/auth/LoginForm";
import DemoLoginOptions, { mockData } from "@/components/auth/DemoLoginOptions";
import { Button } from "@/components/ui/button";
import { Lock, UserCog, RefreshCw } from "lucide-react";

const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // État pour stocker la page d'origine
  const from = location.state?.from?.pathname || "/dashboard";

  // Nettoyer toute donnée temporaire lorsqu'on arrive sur la page de connexion
  useEffect(() => {
    // Nettoyer les données temporaires pour assurer une session propre
    sessionStorage.clear();
    // Ne pas supprimer le thème et d'autres préférences utilisateur non liées à l'authentification
  }, []);

  // Rediriger si déjà authentifié - avec une vérification supplémentaire pour s'assurer que le chargement est terminé
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("Utilisateur déjà authentifié, redirection vers:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, isLoading]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsFormLoading(true);

    try {
      // Configurer les options de persistance en fonction de "Se souvenir de moi"
      if (data.rememberMe) {
        localStorage.setItem('auth_persistence', 'true');
      } else {
        localStorage.removeItem('auth_persistence');
      }

      // Appeler la fonction signIn du contexte d'authentification
      const result = await signIn(data.email, data.password);
      
      if (result.success) {
        toast.success("Connexion réussie");
        console.log("Connexion réussie, redirection vers:", from);
        
        // Assurer un délai court avant la redirection pour permettre la mise à jour de l'état
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
      } else {
        setError(result.error || "Identifiants invalides");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setIsFormLoading(false);
    }
  };

  // Fonction pour préremplir le formulaire avec les données de démo
  const autofillForm = (role: string) => {
    const mockUser = mockData.find((u) => u.role === role);
    if (mockUser) {
      // Remplir automatiquement le formulaire et se connecter
      handleSubmit({
        email: mockUser.email,
        password: mockUser.password,
        rememberMe: false
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à AdLab Hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm 
            onSubmit={handleSubmit}
            error={error}
            isLoading={isFormLoading}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <DemoLoginOptions onSelectRole={autofillForm} />
          
          <div className="w-full border-t my-2"></div>
          
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline"
              size="sm"
              asChild
            >
              <Link to="/auth/reset-all-passwords">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réinitialiser mots de passe
              </Link>
            </Button>
            <Button 
              variant="outline"
              size="sm"
              asChild
            >
              <Link to="/auth/sync-users">
                <RefreshCw className="mr-2 h-4 w-4" />
                Synchroniser utilisateurs
              </Link>
            </Button>
            <Button 
              variant="outline"
              size="sm"
              asChild
              className="col-span-2"
            >
              <Link to="/auth/users-sync-status">
                <UserCog className="mr-2 h-4 w-4" />
                État de synchronisation
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
