
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  const { user, isLoading, signOut } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-4 py-12 md:py-24 md:px-6 lg:py-32 lg:px-8">
        <div className="container grid grid-cols-1 gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl/tight text-primary">
              AdLab Hub - Votre Plateforme de Gestion Interne
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              Suivez vos prospects, gérez vos commissions et optimisez la collaboration entre freelances et chargés d'affaires.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-6 shadow-sm space-y-2">
                  <p className="text-muted-foreground">Connecté en tant que</p>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="default" size="lg" className="w-full">
                    <Link to="/dashboard">Accéder au Tableau de Bord</Link>
                  </Button>
                  <Button variant="outline" size="lg" onClick={signOut}>
                    Se Déconnecter
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="default" size="lg" className="w-full">
                      <Link to="/login">Se Connecter</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link to="/register">Créer un Compte</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
