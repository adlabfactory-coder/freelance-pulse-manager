
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Quote } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FileText, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/format";

interface FreelancerQuotesListProps {
  folderFilter?: string;
}

const FreelancerQuotesList: React.FC<FreelancerQuotesListProps> = ({ folderFilter = 'all' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuotes = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        let query = supabase
          .from('quotes')
          .select('*')
          .eq('freelancerId', user.id)
          .is('deleted_at', null);
        
        // Appliquer le filtre par dossier si ce n'est pas 'all'
        if (folderFilter && folderFilter !== 'all') {
          query = query.eq('folder', folderFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Erreur lors du chargement des devis:', error);
          return;
        }
        
        setQuotes(data as Quote[]);
      } catch (error) {
        console.error('Erreur lors du chargement des devis:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuotes();
  }, [user, folderFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepté</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Aucun devis trouvé</h3>
            <p className="text-muted-foreground mt-1">
              {folderFilter !== 'all' 
                ? `Vous n'avez pas de devis dans le dossier "${folderFilter}".` 
                : "Vous n'avez pas encore créé de devis."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes devis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Devis #{quote.id.substring(0, 8)}</span>
                    {getStatusBadge(quote.status)}
                    {quote.folder && quote.folder !== 'general' && (
                      <Badge variant="outline" className="ml-2">
                        {quote.folder}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Montant: {formatCurrency(quote.totalAmount)}
                  </p>
                  {new Date(quote.validUntil) < new Date() && (
                    <div className="flex items-center text-xs text-amber-600 mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Expiré le {new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewQuote(quote.id)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Voir</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerQuotesList;
