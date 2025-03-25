
import React from "react";
import { SubscriptionInterval } from "@/types";

interface SubscriptionIntervalLabelProps {
  interval: SubscriptionInterval;
}

const SubscriptionIntervalLabel: React.FC<SubscriptionIntervalLabelProps> = ({ 
  interval 
}) => {
  switch (interval) {
    case SubscriptionInterval.MONTHLY:
      return <span>Mensuel</span>;
    case SubscriptionInterval.QUARTERLY:
      return <span>Trimestriel</span>;
    case SubscriptionInterval.YEARLY:
      return <span>Annuel</span>;
    default:
      return <span></span>;
  }
};

export default SubscriptionIntervalLabel;
