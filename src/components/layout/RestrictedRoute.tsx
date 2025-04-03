
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import LoadingSpinner from '@/components/ui/loading-spinner';

const RestrictedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  // Amélioration de la vérification d'authentification avec délai
  useEffect(() => {
    let timeoutId: number;
    
    // Attendre un court délai avant de vérifier l'authentification
    // Ce délai permet de s'assurer que l'état d'authentification est stabilisé
    if (!isLoading) {
      timeoutId = setTimeout(() => {
        if (!isAuthenticated) {
          console.log(`Tentative d'accès non autorisé à ${location.pathname}`);
        }
        setIsChecking(false);
      }, 300);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, isAuthenticated, location.pathname]);
  
  // Journaliser les informations de débogage
  useEffect(() => {
    console.log("RestrictedRoute - État d'authentification:", { 
      isLoading, 
      isAuthenticated, 
      userId: user?.id, 
      path: location.pathname 
    });
  }, [isLoading, isAuthenticated, user, location.pathname]);

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    // Sauvegarder l'emplacement pour rediriger l'utilisateur après la connexion
    // Utiliser replace: true pour empêcher le retour arrière à des pages protégées
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Si authentifié, afficher le contenu
  return <Outlet />;
};

export default RestrictedRoute;
