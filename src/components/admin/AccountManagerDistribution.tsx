
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { accountManagerService } from '@/services/account-manager/account-manager-service';
import { User } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface DistributionStat {
  manager: User;
  contactCount: number;
}

const AccountManagerDistribution = () => {
  const [stats, setStats] = useState<DistributionStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContacts, setTotalContacts] = useState(0);
  const [maxContacts, setMaxContacts] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const distributionStats = await accountManagerService.getDistributionStats();
        setStats(distributionStats);
        
        // Calculer le total des contacts
        const total = distributionStats.reduce((sum, stat) => sum + stat.contactCount, 0);
        setTotalContacts(total);
        
        // Trouver le nombre maximum de contacts par chargé de compte
        const max = distributionStats.length > 0 
          ? Math.max(...distributionStats.map(stat => stat.contactCount))
          : 0;
        setMaxContacts(max);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
    
    // Rafraîchir les statistiques toutes les 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribution des contacts</CardTitle>
          <CardDescription>Chargement des statistiques...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution des contacts</CardTitle>
        <CardDescription>
          {totalContacts} contacts répartis entre {stats.length} chargés de compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stats.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucun chargé de compte avec des contacts
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map(stat => (
              <div key={stat.manager.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{stat.manager.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {stat.contactCount} contact{stat.contactCount > 1 ? 's' : ''}
                    {totalContacts > 0 && (
                      <span className="ml-1">
                        ({Math.round((stat.contactCount / totalContacts) * 100)}%)
                      </span>
                    )}
                  </span>
                </div>
                <Progress 
                  value={maxContacts > 0 ? (stat.contactCount / maxContacts) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountManagerDistribution;
