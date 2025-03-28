import React, { useState, useEffect } from 'react';
import { Subscription } from '@/types/subscription';
import { subscriptionService } from '@/services/subscriptions/subscriptions-service';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AddSubscriptionDialog from './AddSubscriptionDialog';
import EditSubscriptionDialog from './EditSubscriptionDialog';

const SubscriptionsList: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const subs = await subscriptionService.fetchAllSubscriptions();
      setSubscriptions(subs);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscriptions');
      toast.error(`Failed to load subscriptions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleEditClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await subscriptionService.deleteSubscription(id);
        setSubscriptions(subs => subs.filter(sub => sub.id !== id));
        toast.success('Subscription deleted successfully');
      } catch (err: any) {
        toast.error(`Failed to delete subscription: ${err.message}`);
      }
    }
  };

  const handleQuoteClick = (subscriptionId: string) => {
    navigate(`/subscriptions/to-quote/${subscriptionId}`);
  };

  const SubscriptionCard = ({ subscription, onEdit, onDelete, onClick }: SubscriptionCardProps) => {
    const formatDate = (date: string | Date) => {
      if (!date) return "-";
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy');
    };

    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>{subscription.name}</CardTitle>
          <CardDescription>{subscription.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Price: ${subscription.price} / {subscription.interval}</p>
          <p>Status: {subscription.status}</p>
          <p>Start Date: {formatDate(subscription.startDate)}</p>
          <p>End Date: {subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}</p>
          <p>Renewal Date: {subscription.renewalDate ? formatDate(subscription.renewalDate) : 'N/A'}</p>
        </CardContent>
        <div className="flex justify-between items-center p-4">
          <div>
            <Button size="sm" variant="secondary" onClick={onClick}>
              Create Quote
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  interface SubscriptionCardProps {
    subscription: Subscription;
    onEdit: () => void;
    onDelete: () => void;
    onClick: () => void;
  }

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Subscriptions</h2>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map(subscription => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onEdit={() => handleEditClick(subscription)}
            onDelete={() => handleDeleteClick(subscription.id)}
            onClick={() => handleQuoteClick(subscription.id)}
          />
        ))}
      </div>
      <AddSubscriptionDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubscriptionAdded={loadSubscriptions} />
      {selectedSubscription && (
        <EditSubscriptionDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          subscription={selectedSubscription}
          onSubscriptionUpdated={loadSubscriptions}
        />
      )}
    </div>
  );
};

export default SubscriptionsList;
