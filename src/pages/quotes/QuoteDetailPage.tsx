import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Quote, QuoteStatus, QuoteItem } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuoteDetailPageProps {}

const QuoteDetailPage: React.FC<QuoteDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadQuote = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error("Missing quote ID");
        }

        const { data, error } = await supabase
          .from('quotes')
          .select(`
            *,
            contact: contacts(*),
            freelancer: users(*)
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Transform received data into the expected Quote format with proper type casting
          const transformedQuote = transformQuoteData(data);
          setQuote(transformedQuote);
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Devis non trouvé.",
          });
          navigate('/quotes');
        }
      } catch (error: any) {
        console.error("Erreur lors du chargement du devis:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le devis. Veuillez réessayer plus tard.",
        });
        navigate('/quotes');
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [id, navigate, toast]);

  // Transform received data into the expected Quote format with proper type casting
  const transformQuoteData = (data: any): Quote => {
    return {
      id: data.id,
      contactId: data.contactId,
      freelancerId: data.freelancerId,
      status: data.status as QuoteStatus,
      notes: data.notes,
      totalAmount: data.totalAmount,
      validUntil: new Date(data.validUntil),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      contact: data.contact,
      freelancer: data.freelancer,
      items: data.items || []
    };
  };

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setQuote((prevQuote) => {
        if (prevQuote) {
          return { ...prevQuote, status: newStatus };
        }
        return prevQuote;
      });

      toast({
        title: "Succès",
        description: `Devis mis à jour à l'état : ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du statut du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du devis. Veuillez réessayer plus tard.",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handleAcceptQuote = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setQuote((prevQuote) => {
        if (prevQuote) {
          return { ...prevQuote, status: 'accepted' as QuoteStatus };
        }
        return prevQuote;
      });

      toast({
        title: "Succès",
        description: "Devis accepté avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'acceptation du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accepter le devis. Veuillez réessayer plus tard.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectQuote = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setQuote((prevQuote) => {
        if (prevQuote) {
          return { ...prevQuote, status: 'rejected' as QuoteStatus };
        }
        return prevQuote;
      });

      toast({
        title: "Succès",
        description: "Devis rejeté avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors du rejet du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rejeter le devis. Veuillez réessayer plus tard.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Chargement du devis...</span>
      </div>
    );
  }

  if (!quote) {
    return <div className="p-4">Devis non trouvé.</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Devis #{quote.id}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Informations du contact</h3>
              <p>Nom: {quote.contact?.name}</p>
              <p>Email: {quote.contact?.email}</p>
              <p>Téléphone: {quote.contact?.phone}</p>
              <p>Entreprise: {quote.contact?.company}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Informations du freelance</h3>
              <p>Nom: {quote.freelancer?.name}</p>
              <p>Email: {quote.freelancer?.email}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Détails du devis</h3>
            <p>Date de création: {formatDate(quote.createdAt)}</p>
            <p>Valide jusqu'au: {formatDate(quote.validUntil)}</p>
            <p>Montant total: {formatCurrency(quote.totalAmount)}</p>
            <p>Notes: {quote.notes || "Aucune note"}</p>
            <div>
              Statut: <Badge>{quote.status}</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Items</h3>
            {quote.items.length > 0 ? (
              <ul>
                {quote.items.map((item: QuoteItem) => (
                  <li key={item.id}>
                    {item.description} - {formatCurrency(item.unitPrice * item.quantity)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun item.</p>
            )}
          </div>
          
          {quote.status === 'pending' && (
            <div className="flex space-x-4 mt-4">
              <Button 
                onClick={handleAcceptQuote}
                variant="outline"
                className="flex items-center"
                disabled={updating}
              >
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Accepter
              </Button>
              <Button
                onClick={handleRejectQuote}
                variant="outline" 
                className="flex items-center"
                disabled={updating}
              >
                <X className="mr-2 h-4 w-4 text-red-500" />
                Rejeter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteDetailPage;
