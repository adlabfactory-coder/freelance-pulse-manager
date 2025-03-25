
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  FileText, 
  FileSpreadsheet, 
  BarChart, 
  Settings,
  ArrowRight,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SegmentButtons } from "@/components/ui/segment-buttons";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const features = [
    {
      title: "Tableau de bord",
      description: "Visualisez vos données et suivez votre activité",
      icon: Home,
      path: "/dashboard",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Contacts",
      description: "Gérez vos clients et prospects en un seul endroit",
      icon: Users,
      path: "/contacts",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Rendez-vous",
      description: "Organisez et suivez vos rendez-vous client",
      icon: Calendar,
      path: "/appointments",
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Devis",
      description: "Créez et suivez vos devis commerciaux",
      icon: FileText,
      path: "/quotes",
      color: "bg-amber-100 text-amber-700"
    },
    {
      title: "Abonnements",
      description: "Gérez les abonnements de vos clients",
      icon: FileSpreadsheet,
      path: "/subscriptions",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Commissions",
      description: "Suivez vos commissions et revenus",
      icon: BarChart,
      path: "/commissions",
      color: "bg-pink-100 text-pink-700"
    },
    {
      title: "Paramètres",
      description: "Configurez votre application selon vos besoins",
      icon: Settings,
      path: "/settings",
      color: "bg-gray-100 text-gray-700"
    }
  ];

  // Sélectionner uniquement les 4 fonctionnalités principales pour les boutons segmentés
  const mainFeatures = features.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 animate-fade-in">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Bienvenue sur AdLab Hub
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Votre plateforme complète pour gérer vos clients, devis, commissions et plus encore.
          </p>
          
          {isMobile ? (
            <div className="mt-6">
              <SegmentButtons 
                items={mainFeatures} 
                className="bg-card shadow-sm"
              />
            </div>
          ) : (
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/dashboard")}>
                Accéder au tableau de bord
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/contacts")}>
                Gérer les contacts
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 md:p-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">{feature.description}</p>
                <Button 
                  variant="ghost" 
                  className="group"
                  onClick={() => navigate(feature.path)}
                >
                  Accéder
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {!isMobile && (
          <div className="mt-16 bg-card rounded-lg border p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Besoin d'aide pour démarrer ?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Découvrez notre guide complet pour tirer le meilleur parti d'AdLab Hub et optimiser votre gestion commerciale.
            </p>
            <Button variant="outline">Consulter le guide</Button>
          </div>
        )}
        
        {isMobile && (
          <div className="fixed bottom-4 left-4 right-4 bg-card rounded-lg border shadow-lg animate-fade-in z-10">
            <div className="p-4">
              <SegmentButtons 
                items={features} 
                className="bg-background"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
