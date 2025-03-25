
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">AdLab Hub</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {!loading && user ? (
            <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
          ) : (
            <Button onClick={() => navigate("/auth/login")}>Se connecter</Button>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    AdLab Hub - Interface Freelance
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Gérez vos contacts, rendez-vous, devis et suivez vos commissions en toute simplicité.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="px-8" onClick={handleGetStarted}>
                    {loading ? "Chargement..." : user ? "Accéder à votre espace" : "Se connecter"}
                  </Button>
                </div>
              </div>
              <div className="mx-auto grid max-w-sm items-start gap-6 sm:max-w-4xl sm:grid-cols-2 md:gap-8 lg:max-w-none">
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">Gestion des Contacts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Créez et gérez vos contacts prospects et clients.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">Planification</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Planifiez et gérez vos rendez-vous avec les clients.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">Devis</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Créez et suivez vos devis et contrats.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">Commissions</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Suivez vos commissions et demandez leur versement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} AdLab Hub. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default Index;
