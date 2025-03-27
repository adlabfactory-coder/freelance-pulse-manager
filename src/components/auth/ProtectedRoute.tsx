
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
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
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles requis si spécifiés
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
