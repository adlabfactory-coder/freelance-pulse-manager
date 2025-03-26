
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SubscriptionStatus } from '@/types';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
}

const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = ({ status }) => {
  // Configuration des badges en fonction du statut
  const getBadgeVariant = () => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return 'bg-green-500';
      case SubscriptionStatus.EXPIRED:
        return 'bg-red-500';
      case SubscriptionStatus.PENDING:
        return 'bg-yellow-500';
      case SubscriptionStatus.CANCELLED:
        return 'bg-gray-500';
      case SubscriptionStatus.INACTIVE:
        return 'bg-red-700';
      case SubscriptionStatus.TRIAL:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={getBadgeVariant()}>
      {status}
    </Badge>
  );
};

export default SubscriptionStatusBadge;
