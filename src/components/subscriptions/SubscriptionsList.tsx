
import React, { useState, useEffect } from 'react';
import {
  fetchSubscriptions
} from '@/services/subscriptions';
import SubscriptionList from './SubscriptionList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Subscription, SubscriptionStatus } from '@/types/subscription';

// Placeholder for dialogs that will be implemented later
const AddSubscriptionDialog = () => <div>Add Subscription Dialog Placeholder</div>;
const EditSubscriptionDialog = () => <div>Edit Subscription Dialog Placeholder</div>;

interface SubscriptionsListProps {
  filter?: "all" | "active" | "inactive";
}

const SubscriptionsList: React.FC<SubscriptionsListProps> = ({ filter = "all" }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">(filter);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await fetchSubscriptions();
      if (data) {
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les abonnements',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleRenew = async (id: string) => {
    // This would be implemented with a real service call
    toast({
      title: 'Information',
      description: 'Fonctionnalité de renouvellement en développement'
    });
  };

  const handleCancel = async (id: string) => {
    // This would be implemented with a real service call
    toast({
      title: 'Information',
      description: 'Fonctionnalité d\'annulation en développement'
    });
  };

  const handleDelete = async (id: string) => {
    // This would be implemented with a real service call
    toast({
      title: 'Information',
      description: 'Fonctionnalité de suppression en développement'
    });
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleEditClick = (id: string) => {
    setSelectedSubscriptionId(id);
    setEditDialogOpen(true);
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return sub.status === SubscriptionStatus.ACTIVE;
    if (activeTab === 'inactive') return sub.status !== SubscriptionStatus.ACTIVE;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="active">Actifs</TabsTrigger>
            <TabsTrigger value="inactive">Inactifs</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Nouvel abonnement
        </Button>
      </div>

      <TabsContent value={activeTab} className="mt-0">
        <SubscriptionList
          subscriptions={filteredSubscriptions}
          onRenew={handleRenew}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </TabsContent>

      {addDialogOpen && (
        <div>Add Subscription Dialog would be shown here</div>
      )}

      {editDialogOpen && selectedSubscriptionId && (
        <div>Edit Subscription Dialog would be shown here</div>
      )}
    </div>
  );
};

export default SubscriptionsList;
