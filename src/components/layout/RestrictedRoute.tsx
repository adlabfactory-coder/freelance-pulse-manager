
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import LoadingSpinner from '@/components/ui/loading-spinner';

const RestrictedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log des tentatives d'accès non authentifiées
    if (!isLoading && !isAuthenticated) {
      console.log(`Tentative d'accès non autorisé à ${location.pathname}`);
    }
  }, [isLoading, isAuthenticated, location.pathname]);

  // Afficher un loader pendant la vérification de l'authentification
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

  // Si authentifié, afficher le contenu
  return <Outlet />;
};

export default RestrictedRoute;
