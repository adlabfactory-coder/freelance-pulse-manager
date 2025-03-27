
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AccountManagerDistribution from '../admin/AccountManagerDistribution';

const AccountManagersWidget = () => {
  return (
    <div className="col-span-1 lg:col-span-2">
      <AccountManagerDistribution />
    </div>
  );
};

export default AccountManagersWidget;
