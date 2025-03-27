
import React from 'react';
import { SubscriptionInterval } from '@/types/subscription';

interface SubscriptionIntervalLabelProps {
  interval: SubscriptionInterval;
}

const SubscriptionIntervalLabel: React.FC<SubscriptionIntervalLabelProps> = ({ interval }) => {
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
      default:
        return interval;
    }
  };

  return <span>{getIntervalLabel()}</span>;
};

export default SubscriptionIntervalLabel;
