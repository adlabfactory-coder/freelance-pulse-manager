
import React from 'react';
import { SubscriptionInterval } from '@/types/subscription';

interface SubscriptionIntervalLabelProps {
  interval: SubscriptionInterval;
  className?: string;
}

const SubscriptionIntervalLabel: React.FC<SubscriptionIntervalLabelProps> = ({ interval, className = '' }) => {
  const getIntervalLabel = () => {
    switch (interval) {
      case SubscriptionInterval.MONTHLY:
        return 'Mensuel';
      case SubscriptionInterval.QUARTERLY:
        return 'Trimestriel';
      case SubscriptionInterval.BIANNUAL:
        return 'Semestriel';
      case SubscriptionInterval.ANNUAL:
      case SubscriptionInterval.YEARLY:
        return 'Annuel';
      case SubscriptionInterval.CUSTOM:
        return 'Personnalisé';
      default:
        return interval;
    }
  };

  return <span className={className}>{getIntervalLabel()}</span>;
};

export default SubscriptionIntervalLabel;
