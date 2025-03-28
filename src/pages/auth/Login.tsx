
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import LoginForm, { LoginFormData } from "@/components/auth/LoginForm";
import DemoLoginOptions, { mockData } from "@/components/auth/DemoLoginOptions";

const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // État pour stocker la page d'origine
  const from = location.state?.from?.pathname || "/dashboard";

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

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
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Identifiants invalides");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
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
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <DemoLoginOptions onSelectRole={autofillForm} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
