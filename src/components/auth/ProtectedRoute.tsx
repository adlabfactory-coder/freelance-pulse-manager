
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Vérification de l'authentification...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
