
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SubscriptionStatus } from '@/types/subscription';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus | string;
}

const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return { label: 'Actif', variant: 'success' as const };
      case SubscriptionStatus.CANCELLED:
        return { label: 'Annulé', variant: 'destructive' as const };
      case SubscriptionStatus.PENDING:
        return { label: 'En attente', variant: 'warning' as const };
      case SubscriptionStatus.EXPIRED:
        return { label: 'Expiré', variant: 'outline' as const };
      case SubscriptionStatus.INACTIVE:
        return { label: 'Inactif', variant: 'secondary' as const };
      case SubscriptionStatus.TRIAL:
        return { label: 'Essai', variant: 'default' as const };
      default:
        return { label: status, variant: 'outline' as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return <Badge variant={variant}>{label}</Badge>;
};

export default SubscriptionStatusBadge;
