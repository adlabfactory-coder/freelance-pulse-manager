
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, user, isAdminOrSuperAdmin } = useAuth();
  const location = useLocation();

  // Afficher un spinner pendant le chargement
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    console.log("Non authentifié, redirection vers la page de connexion");
    // Utiliser replace: true pour éviter les boucles de navigation
    // Conserver la location actuelle pour pouvoir y revenir après connexion
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Restreindre l'accès aux paramètres uniquement aux admins et super admins
  if (location.pathname.startsWith('/settings') && !isAdminOrSuperAdmin) {
    console.log("Accès aux paramètres restreint, redirection vers le tableau de bord");
    return <Navigate to="/dashboard" replace />;
  }

  // Vérifier les rôles requis si spécifiés
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      console.log("Rôle insuffisant, redirection vers le tableau de bord");
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
