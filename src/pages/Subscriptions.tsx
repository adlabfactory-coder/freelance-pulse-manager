
import React from "react";
import SubscriptionHeader from "@/components/subscriptions/SubscriptionHeader";
import SubscriptionFilters from "@/components/subscriptions/SubscriptionFilters";
import SubscriptionList from "@/components/subscriptions/SubscriptionList";
import mockSubscriptionData from "@/components/subscriptions/SubscriptionData";

const Subscriptions: React.FC = () => {
  return (
    <div className="space-y-6">
      <SubscriptionHeader />
      <SubscriptionFilters />
      <SubscriptionList subscriptions={mockSubscriptionData} />
    </div>
  );
};

export default Subscriptions;
