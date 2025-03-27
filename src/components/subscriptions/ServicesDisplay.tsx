
import React from "react";
import { Service } from "@/types/service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";

export interface ServicesDisplayProps {
  services: Service[];
  loading: boolean;
}

const ServicesDisplay: React.FC<ServicesDisplayProps> = ({ services, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/3 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun service disponible</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>
              {service.type === 'one_time' 
                ? 'Service ponctuel' 
                : service.type === 'subscription' 
                  ? 'Abonnement'
                  : service.type === 'recurring'
                    ? 'Service récurrent'
                    : 'Autre'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-3 mb-4">
              {service.description || "Aucune description disponible"}
            </p>
            <p className="text-xl font-bold">{formatCurrency(service.price)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServicesDisplay;
