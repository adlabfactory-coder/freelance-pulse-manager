
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Quote, QuoteStatus } from "@/types";
import { fetchQuotes } from "@/services/quote-service";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "@/utils/format";

const FreelancerQuotesList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuotes = async () => {
      setLoading(true);
      try {
        const allQuotes = await fetchQuotes();
        // Filtrer les devis pour ce freelancer uniquement
        const filteredQuotes = allQuotes.filter(quote => 
          quote.freelancerId === user?.id
        );
        setQuotes(filteredQuotes);
      } catch (error) {
        console.error("Erreur lors du chargement des devis:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos devis. Veuillez réessayer plus tard.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, [user?.id, toast]);

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

  const handleViewQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Chargement des devis...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Validité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Vous n'avez pas encore de devis. Créez votre premier devis.
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">
                    {quote.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{quote.contact?.name}</TableCell>
                  <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                  <TableCell>{formatDate(quote.createdAt)}</TableCell>
                  <TableCell>{formatDate(quote.validUntil)}</TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewQuote(quote.id)}
                    >
                      Voir
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

export default FreelancerQuotesList;
