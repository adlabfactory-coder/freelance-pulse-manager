import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuoteById, updateQuoteStatus, deleteQuote } from '@/services/quote-service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Quote, QuoteItem, QuoteStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowLeft,
  Trash2,
  Edit,
  AlertTriangle,
  Folder
} from 'lucide-react';
import EditQuoteDialog from '@/components/quotes/form/EditQuoteDialog';
import { formatCurrency } from '@/utils/format';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdminOrSuperAdmin } = useAuth();
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await fetchQuoteById(id);
      setQuote(data);
    } catch (err) {
      console.error('Erreur lors du chargement du devis:', err);
      setError('Impossible de charger les détails du devis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangeStatus = async (status: QuoteStatus) => {
    if (!quote || !id) return;
    
    try {
      await updateQuoteStatus(id, status);
      toast({
        title: 'Statut mis à jour',
        description: `Le devis est maintenant ${getStatusLabel(status).toLowerCase()}.`
      });
      
      // Mettre à jour localement
      setQuote({ ...quote, status });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible de mettre à jour le statut du devis."
      });
    }
  };

  const handleDelete = async () => {
    if (!quote || !id) return;
    
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    
    try {
      await deleteQuote(id);
      toast({
        title: 'Devis supprimé',
        description: 'Le devis a été supprimé avec succès.'
      });
      
      navigate('/quotes');
    } catch (err) {
      console.error('Erreur lors de la suppression du devis:', err);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible de supprimer le devis."
      });
      setIsDeleting(false);
    }
  };

  const canEdit = () => {
    if (!quote) return false;
    return isAdminOrSuperAdmin || quote.freelancerId === user?.id;
  };

  const getStatusLabel = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return "Brouillon";
      case QuoteStatus.PENDING:
        return "En attente";
      case QuoteStatus.ACCEPTED:
        return "Accepté";
      case QuoteStatus.REJECTED:
        return "Rejeté";
      case QuoteStatus.EXPIRED:
        return "Expiré";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return "outline";
      case QuoteStatus.PENDING:
        return "secondary";
      case QuoteStatus.ACCEPTED:
        return "success";
      case QuoteStatus.REJECTED:
        return "destructive";
      case QuoteStatus.EXPIRED:
        return "destructive";
      default:
        return "default";
    }
  };

  const calculateItemTotal = (item: QuoteItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * ((item.discount || 0) / 100);
    const taxAmount = (subtotal - discountAmount) * ((item.tax || 0) / 100);
    
    return subtotal - discountAmount + taxAmount;
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="container max-w-5xl mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error || "Devis introuvable."}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleBack}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux devis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={handleBack} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Détails du devis</h1>
        </div>
        
        <div className="flex gap-2">
          {canEdit() && (
            <>
              {isDeleting ? (
                <>
                  <Button variant="outline" onClick={() => setIsDeleting(false)}>
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Confirmer la suppression
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">ID:</span>
              <p>{quote.id}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Statut:</span>
              <div className="mt-1">
                <Badge variant={getStatusVariant(quote.status)}>{getStatusLabel(quote.status)}</Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Dossier:</span>
              <div className="flex items-center mt-1">
                <Folder className="h-4 w-4 mr-1" />
                <span className="capitalize">{quote.folder || 'Général'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">ID:</span>
              <p>{quote.contactId}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Commercial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">ID:</span>
              <p>{quote.freelancerId}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Détails du devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">Date de création:</span>
              <p>{format(new Date(quote.createdAt), 'PP', { locale: fr })}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Dernière mise à jour:</span>
              <p>{format(new Date(quote.updatedAt), 'PP', { locale: fr })}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Valide jusqu'au:</span>
              <p>
                {new Date(quote.validUntil) > new Date() 
                  ? format(new Date(quote.validUntil), 'PP', { locale: fr })
                  : <span className="text-red-500">Expiré ({format(new Date(quote.validUntil), 'PP', { locale: fr })})</span>
                }
              </p>
            </div>
          </div>
          
          {quote.notes && (
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Notes:</span>
              <p className="mt-1 p-3 bg-muted/20 rounded-md">{quote.notes}</p>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="font-medium mb-2">Articles du devis</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Quantité</th>
                    <th className="p-2 text-right">Prix unitaire</th>
                    <th className="p-2 text-right">Remise</th>
                    <th className="p-2 text-right">TVA</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{item.description}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-2 text-right">{item.discount ? `${item.discount}%` : '-'}</td>
                      <td className="p-2 text-right">{item.tax ? `${item.tax}%` : '-'}</td>
                      <td className="p-2 text-right font-medium">{formatCurrency(calculateItemTotal(item))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/20">
                  <tr>
                    <td colSpan={5} className="p-2 text-right font-bold">
                      Total:
                    </td>
                    <td className="p-2 text-right font-bold">
                      {formatCurrency(quote.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
        
        {canEdit() && (
          <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
            {quote.status === QuoteStatus.DRAFT && (
              <Button onClick={() => handleChangeStatus(QuoteStatus.PENDING)}>
                <Clock className="mr-2 h-4 w-4" />
                Marquer comme En attente
              </Button>
            )}
            
            {(quote.status === QuoteStatus.DRAFT || quote.status === QuoteStatus.PENDING) && (
              <Button variant="default" onClick={() => handleChangeStatus(QuoteStatus.ACCEPTED)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marquer comme Accepté
              </Button>
            )}
            
            {(quote.status === QuoteStatus.DRAFT || quote.status === QuoteStatus.PENDING) && (
              <Button variant="destructive" onClick={() => handleChangeStatus(QuoteStatus.REJECTED)}>
                <XCircle className="mr-2 h-4 w-4" />
                Marquer comme Rejeté
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
      
      {isEditing && (
        <EditQuoteDialog
          open={isEditing}
          onOpenChange={setIsEditing}
          onQuoteUpdated={fetchData}
          quoteId={quote.id}
          initialQuote={quote}
        />
      )}
    </div>
  );
};

export default QuoteDetailPage;
