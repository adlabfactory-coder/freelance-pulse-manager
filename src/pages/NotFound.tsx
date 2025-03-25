
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <div className="max-w-md">
        <h2 className="mb-4 text-xl font-bold text-primary">
          Page non trouvée
        </h2>
        <p className="mb-8 text-muted-foreground">
          Désolé, nous n'avons pas pu trouver la page que vous recherchez. Il est possible que la page ait été déplacée ou supprimée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link to="/dashboard">
              <Home className="mr-2 h-4 w-4" /> Tableau de bord
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
