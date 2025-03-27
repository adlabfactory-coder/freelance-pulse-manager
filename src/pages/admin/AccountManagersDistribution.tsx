
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AccountManagerDistribution from '@/components/admin/AccountManagerDistribution';

const AccountManagersDistributionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Distribution des contacts</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AccountManagerDistribution />
      </div>
    </div>
  );
};

export default AccountManagersDistributionPage;
