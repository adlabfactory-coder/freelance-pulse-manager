
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format";
import { fetchServices } from "@/services/services-service";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";

interface ServicesDisplayProps {
  onServiceSelected?: (service: Service) => void;
  filter?: string;
  limit?: number;
  showFilters?: boolean;
  cardClassName?: string;
  title?: string;
  description?: string;
}

const ServicesDisplay: React.FC<ServicesDisplayProps> = ({
  onServiceSelected,
  filter,
  limit,
  showFilters = true,
  cardClassName = "h-full",
  title = "Services",
  description = "Sélectionnez un service pour continuer"
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>(filter || "all");

  // Récupération des services
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Filtrage des services
  useEffect(() => {
    let filtered = [...services];
    
    if (activeFilter && activeFilter !== "all") {
      filtered = filtered.filter(service => service.type === activeFilter);
    }
    
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    
    // Filtrer pour n'afficher que les services actifs
    filtered = filtered.filter(service => service.is_active);
    
    setFilteredServices(filtered);
  }, [services, activeFilter, limit]);

  // Rendu des filtres
  const renderFilters = () => {
    if (!showFilters) return null;
    
    const filters = [
      { value: "all", label: "Tous" },
      { value: "subscription", label: "Abonnements" },
      { value: "one_time", label: "Paiement unique" },
      { value: "consulting", label: "Conseil" }
    ];
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map(filter => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
    );
  };

  // Rendu des services
  const renderServices = () => {
    if (loading) {
      return Array(3).fill(0).map((_, index) => (
        <Card key={index} className={`${cardClassName}`}>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ));
    }

    if (filteredServices.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          Aucun service disponible dans cette catégorie.
        </div>
      );
    }

    return filteredServices.map(service => (
      <Card key={service.id} className={`${cardClassName}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <Badge variant="outline" className="capitalize">
              {service.type}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {service.description || "Aucune description disponible"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-2xl font-bold mb-2">
            {formatCurrency(service.price)}
          </div>
          <div className="text-sm text-muted-foreground">
            {service.description || "Aucune description disponible"}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => onServiceSelected?.(service)}
            variant="outline"
          >
            Sélectionner
          </Button>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {renderFilters()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderServices()}
      </div>
    </div>
  );
};

export default ServicesDisplay;
