
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { format as dateFormat } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { Subscription } from '@/types/subscription';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';
import SubscriptionIntervalLabel from './SubscriptionIntervalLabel';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onRenew?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ 
  subscriptions, 
  onRenew, 
  onCancel, 
  onDelete 
}) => {
  const navigate = useNavigate();
  
  const formatDate = (date: string | Date): string => {
    if (!date) return 'N/A';
    return dateFormat(new Date(date), 'dd/MM/yyyy', { locale: fr });
  };

  const handleViewDetails = (id: string) => {
    navigate(`/subscriptions/${id}`);
  };

  if (subscriptions.length === 0) {
    return <div className="text-center py-8">Aucun abonnement trouvé</div>;
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <div key={subscription.id} className="border rounded-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{subscription.name}</h3>
                <SubscriptionStatusBadge status={subscription.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {subscription.price} € / <SubscriptionIntervalLabel interval={subscription.interval} />
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(subscription.id)}
              >
                <Eye className="mr-2 h-4 w-4" /> Détails
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {subscription.status === 'active' && onRenew && (
                    <DropdownMenuItem onClick={() => onRenew(subscription.id)}>
                      Renouveler
                    </DropdownMenuItem>
                  )}
                  {subscription.status === 'active' && onCancel && (
                    <DropdownMenuItem onClick={() => onCancel(subscription.id)}>
                      Annuler
                    </DropdownMenuItem>
                  )}
                  {subscription.status !== 'active' && onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(subscription.id)}>
                      Supprimer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Client</p>
              <p>{subscription.clientName || subscription.clientId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date de début</p>
              <p>{formatDate(subscription.startDate)}</p>
            </div>
            {subscription.status === 'active' && subscription.renewalDate && (
              <div>
                <p className="text-muted-foreground">Prochain renouvellement</p>
                <p>{formatDate(subscription.renewalDate)}</p>
              </div>
            )}
            {subscription.endDate && (
              <div>
                <p className="text-muted-foreground">Date de fin</p>
                <p>{formatDate(subscription.endDate)}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionList;
