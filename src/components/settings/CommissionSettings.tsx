
import React from "react";
import CommissionSettingsForm from "./commission/CommissionSettingsForm";
import LoadingIndicator from "./database/LoadingIndicator";
import { useCommissionTiers } from "./commission/useCommissionTiers";

const CommissionSettings: React.FC = () => {
  const { loading } = useCommissionTiers();

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6">
      <CommissionSettingsForm />
    </div>
  );
};

export default CommissionSettings;
