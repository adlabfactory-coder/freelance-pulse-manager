
import React from 'react';
import { SubscriptionInterval } from '@/types/subscription';

interface SubscriptionIntervalLabelProps {
  interval: string;
  capitalize?: boolean;
}

const SubscriptionIntervalLabel: React.FC<SubscriptionIntervalLabelProps> = ({ 
  interval, 
  capitalize = false 
}) => {
  const getIntervalLabel = () => {
    switch (interval) {
      case SubscriptionInterval.MONTHLY:
        return capitalize ? 'Mensuel' : 'mois';
      case SubscriptionInterval.QUARTERLY:
        return capitalize ? 'Trimestriel' : 'trimestre';
      case SubscriptionInterval.BIANNUAL:
        return capitalize ? 'Semestriel' : 'semestre';
      case SubscriptionInterval.ANNUAL:
      case SubscriptionInterval.YEARLY:
        return capitalize ? 'Annuel' : 'an';
      case SubscriptionInterval.CUSTOM:
        return capitalize ? 'Personnalisé' : 'personnalisé';
      default:
        return capitalize ? 'Période' : 'période';
    }
  };

  return <>{getIntervalLabel()}</>;
};

export default SubscriptionIntervalLabel;
