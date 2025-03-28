
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import { ServiceTypeLabels } from '@/types/service';
import { useServices } from '@/hooks/useServices';

const AgencyServicesList: React.FC = () => {
  const { services, loading, loadServices } = useServices();

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services proposés</CardTitle>
        <CardDescription>
          Liste des services disponibles pour vos clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-muted-foreground mb-4">
              Aucun service n'a été ajouté pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {services.filter(service => service.is_active).map(service => (
              <Card key={service.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <Badge className="mt-1" variant="outline">
                        {ServiceTypeLabels[service.type] || service.type}
                      </Badge>
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {formatCurrency(service.price)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                    {service.description || "Aucune description disponible"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgencyServicesList;
