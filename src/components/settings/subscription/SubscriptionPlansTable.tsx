
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';
import { formatCurrency } from '@/utils/format';
import SubscriptionIntervalLabel from '@/components/subscriptions/SubscriptionIntervalLabel';
import { toast } from 'sonner';
import { deleteSubscriptionPlan } from '@/services/subscriptions';

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlan[];
  onEdit: (plan: SubscriptionPlan) => void;
  onRefresh: () => Promise<void>;
}

const SubscriptionPlansTable: React.FC<SubscriptionPlansTableProps> = ({ plans, onEdit, onRefresh }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const success = await deleteSubscriptionPlan(id);
      if (success) {
        toast.success('Plan d\'abonnement supprimé avec succès');
        onRefresh();
      } else {
        toast.error('Échec de la suppression du plan');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Une erreur est survenue lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success('Liste des plans actualisée');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">Aucun plan d'abonnement disponible.</p>
        <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Intervalle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{plan.code}</TableCell>
              <TableCell>{formatCurrency(plan.price)}</TableCell>
              <TableCell>
                <SubscriptionIntervalLabel interval={plan.interval} />
              </TableCell>
              <TableCell>
                <Badge variant={plan.isActive ? "success" : "secondary"}>
                  {plan.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(plan)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le plan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer le plan "{plan.name}" ? 
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(plan.id);
                          }}
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscriptionPlansTable;
