
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Commission } from "@/types/commissions";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "@/utils/format";
import CommissionStatusBadge from "@/components/commissions/CommissionStatusBadge";

const FreelancerCommissionsList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommissions = async () => {
      setLoading(true);
      try {
        // Récupérer les commissions pour ce freelancer
        const { data, error } = await supabase
          .from('commissions')
          .select(`
            *,
            subscription:subscriptions(name, clientId, client:clientId(name))
          `)
          .eq('freelancerId', user?.id)
          .order('periodStart', { ascending: false });

        if (error) {
          throw error;
        }

        setCommissions(data as unknown as Commission[]);
      } catch (error) {
        console.error("Erreur lors du chargement des commissions:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos commissions. Veuillez réessayer plus tard.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadCommissions();
    }
  }, [user?.id, toast]);

  const handleViewCommission = (commissionId: string) => {
    navigate(`/commissions/${commissionId}`);
  };

  const getTotalCommissions = () => {
    return commissions.reduce((total, commission) => total + Number(commission.amount), 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Chargement des commissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Commissions totales</h3>
          <p className="text-2xl font-bold mt-1">{formatCurrency(getTotalCommissions())}</p>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">En attente</h3>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(
              commissions
                .filter(c => c.status === 'pending')
                .reduce((sum, c) => sum + Number(c.amount), 0)
            )}
          </p>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Niveau actuel</h3>
          <p className="text-2xl font-bold mt-1">
            {commissions.length > 0 ? commissions[0].tier : 'N/A'}
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Période</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Vous n'avez pas encore de commissions.
                </TableCell>
              </TableRow>
            ) : (
              commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>
                    {formatDate(commission.periodStart)} - {formatDate(commission.periodEnd)}
                  </TableCell>
                  <TableCell>
                    {commission.subscription?.client?.name || 'Client inconnu'}
                  </TableCell>
                  <TableCell>{formatCurrency(commission.amount)}</TableCell>
                  <TableCell>
                    <CommissionStatusBadge status={commission.status} />
                  </TableCell>
                  <TableCell>{commission.tier}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCommission(commission.id)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FreelancerCommissionsList;
