
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/format";

interface ServicesDisplayProps {
  services: Service[];
  loading: boolean;
}

const ServicesDisplay: React.FC<ServicesDisplayProps> = ({ 
  services, 
  loading 
}) => {
  // Séparer les services et les packs
  const serviceItems = services.filter(service => service.type === 'service');
  const packItems = services.filter(service => service.type === 'pack');

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Services et Packs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="space-y-2">
                  {[1, 2].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Aucun service ou pack disponible.</p>
      </div>
    );
  }

  const renderServicesList = (items: Service[], title: string) => {
    if (items.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{service.name}</CardTitle>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <CardDescription>
                  {service.type === 'service' ? 'Service' : 'Pack'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">{formatCurrency(service.price)}</div>
                <div className="text-sm text-muted-foreground">
                  {service.description || "Aucune description disponible"}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Sélectionner
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Services et Packs</h2>
      {renderServicesList(serviceItems, "Services")}
      {renderServicesList(packItems, "Packs")}
    </div>
  );
};

export default ServicesDisplay;
