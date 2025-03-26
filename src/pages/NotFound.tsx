
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Si l'utilisateur essaie d'accéder à une page protégée mais n'est pas authentifié
  const isAttemptingProtectedRoute = location.pathname.startsWith('/dashboard') || 
                                    location.pathname.startsWith('/settings') ||
                                    location.pathname.startsWith('/contacts') ||
                                    location.pathname.startsWith('/appointments') ||
                                    location.pathname.startsWith('/quotes') ||
                                    location.pathname.startsWith('/subscriptions') ||
                                    location.pathname.startsWith('/commissions') ||
                                    location.pathname.startsWith('/reports') ||
                                    location.pathname.startsWith('/admin') ||
                                    location.pathname.startsWith('/audit');

  // Rediriger vers la page de login si l'utilisateur tente d'accéder à une route protégée
  React.useEffect(() => {
    if (isAttemptingProtectedRoute && !isAuthenticated) {
      navigate("/auth/login", { state: { from: location }, replace: true });
    }
  }, [isAttemptingProtectedRoute, isAuthenticated, navigate, location]);

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="relative w-32 h-32 mb-4">
        <div className="absolute inset-0 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
      </div>
      
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <div className="max-w-md">
        <h2 className="mb-4 text-xl font-bold text-primary">
          Page non trouvée
        </h2>
        <p className="mb-8 text-muted-foreground">
          Désolé, nous n'avons pas pu trouver la page que vous recherchez. Il est possible que la page ait été déplacée ou supprimée.
          {isAttemptingProtectedRoute && !isAuthenticated && " Vous devez être connecté pour accéder à cette page."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <Button asChild variant="default">
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              <Home className="mr-2 h-4 w-4" /> {isAuthenticated ? "Tableau de bord" : "Accueil"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
