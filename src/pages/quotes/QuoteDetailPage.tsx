
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Quote, QuoteStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2, Check, X, Send, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/format';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { updateQuoteStatus } from '@/services/quote-service';

const QuoteDetailPage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isFreelancer } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            *,
            contact:contacts(name, email, phone, company),
            freelancer:users(name, email),
            items:quote_items(*)
          `)
          .eq('id', quoteId)
          .single();

        if (error) {
          throw error;
        }

        // Conversion des dates
        const quote: Quote = {
          ...data,
          validUntil: new Date(data.validUntil),
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        };

        setQuote(quote);
      } catch (error) {
        console.error('Erreur lors de la récupération du devis:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les détails du devis'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId, toast]);

  const handleChangeStatus = async (status: QuoteStatus) => {
    if (!quote) return;
    
    try {
      setUpdating(true);
      const success = await updateQuoteStatus(quote.id, status);
      
      if (success) {
        setQuote(prev => prev ? { ...prev, status } : null);
        toast({
          title: 'Statut mis à jour',
          description: `Le devis est maintenant ${status === QuoteStatus.ACCEPTED ? 'accepté' : status === QuoteStatus.REJECTED ? 'rejeté' : status}`
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut du devis'
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return <Badge variant="outline">Brouillon</Badge>;
      case QuoteStatus.SENT:
        return <Badge variant="secondary">Envoyé</Badge>;
      case QuoteStatus.ACCEPTED:
        return <Badge variant="success">Accepté</Badge>;
      case QuoteStatus.REJECTED:
        return <Badge variant="destructive">Rejeté</Badge>;
      case QuoteStatus.EXPIRED:
        return <Badge variant="outline" className="text-muted-foreground">Expiré</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des détails du devis...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Devis non trouvé</h2>
        <p className="text-muted-foreground mb-4">Ce devis n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/quotes')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux devis
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Détails du devis</h1>
          {getStatusBadge(quote.status)}
        </div>
        
        <div className="flex items-center space-x-2">
          {quote.status === QuoteStatus.DRAFT && (
            <Button 
              onClick={() => handleChangeStatus(QuoteStatus.SENT)}
              disabled={updating}
            >
              {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Envoyer
            </Button>
          )}
          {quote.status === QuoteStatus.SENT && isAdmin && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleChangeStatus(QuoteStatus.REJECTED)}
                disabled={updating}
              >
                {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                Rejeter
              </Button>
              <Button 
                variant="default" 
                onClick={() => handleChangeStatus(QuoteStatus.ACCEPTED)}
                disabled={updating}
              >
                {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Accepter
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">{quote.contact?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{quote.contact?.email}</p>
              </div>
              {quote.contact?.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{quote.contact.phone}</p>
                </div>
              )}
              {quote.contact?.company && (
                <div>
                  <p className="text-sm text-muted-foreground">Entreprise</p>
                  <p className="font-medium">{quote.contact.company}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Détails du devis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Référence</p>
                <p className="font-medium">{quote.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDate(quote.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valide jusqu'au</p>
                <p className="font-medium">{formatDate(quote.validUntil)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commercial</p>
                <p className="font-medium">{quote.freelancer?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Montant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Total HT</p>
                <p className="text-2xl font-bold">{formatCurrency(quote.totalAmount)}</p>
              </div>
              {quote.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{quote.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détail des prestations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Description</th>
                  <th className="py-3 text-right font-medium">Quantité</th>
                  <th className="py-3 text-right font-medium">Prix unitaire</th>
                  <th className="py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items && quote.items.length > 0 ? (
                  quote.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-muted-foreground">
                      Aucun élément dans ce devis
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-3 text-right font-medium">Total HT</td>
                  <td className="py-3 text-right font-bold">{formatCurrency(quote.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteDetailPage;
