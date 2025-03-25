
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <div className="max-w-md">
        <h2 className="mb-4 text-xl font-bold text-primary">
          Page non trouvée
        </h2>
        <p className="mb-8 text-muted-foreground">
          Désolé, nous n'avons pas pu trouver la page que vous recherchez.
        </p>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
