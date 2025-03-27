
import React, { useState, useEffect } from 'react';
import { fetchSubscriptions } from '@/services/subscriptions';
import { Subscription, SubscriptionStatus } from '@/types/subscription';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import SubscriptionStatusBadge from './SubscriptionStatusBadge';
import SubscriptionIntervalLabel from './SubscriptionIntervalLabel';

interface SubscriptionsListProps {
  filter: 'all' | 'active' | 'inactive';
}

const SubscriptionsList: React.FC<SubscriptionsListProps> = ({ filter }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscriptions() {
      setLoading(true);
      try {
        const subscriptionData = await fetchSubscriptions();
        setSubscriptions(subscriptionData);
      } catch (error) {
        console.error('Error loading subscriptions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptions();
  }, []);

  // Apply filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'all') return true;
    if (filter === 'active') return sub.status === SubscriptionStatus.ACTIVE;
    if (filter === 'inactive') return sub.status !== SubscriptionStatus.ACTIVE;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredSubscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Aucun abonnement trouvé
        </CardContent>
      </Card>
    );
  }

  // Format date to local string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Freelance</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Intervalle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Date de fin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">{subscription.name}</TableCell>
                <TableCell>{subscription.clientName || '-'}</TableCell>
                <TableCell>{subscription.freelancerName || '-'}</TableCell>
                <TableCell>{subscription.price.toLocaleString('fr-FR')} €</TableCell>
                <TableCell><SubscriptionIntervalLabel interval={subscription.interval} /></TableCell>
                <TableCell><SubscriptionStatusBadge status={subscription.status} /></TableCell>
                <TableCell>{formatDate(subscription.startDate)}</TableCell>
                <TableCell>{subscription.endDate ? formatDate(subscription.endDate) : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubscriptionsList;
