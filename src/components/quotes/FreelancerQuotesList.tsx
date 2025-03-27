
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { fetchQuotes } from "@/services/quote-service";
import { Loader2 } from "lucide-react";
import { Quote } from "@/types";
import { formatCurrency, formatDateToFrench } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const FreelancerQuotesList: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadQuotes = async () => {
      setLoading(true);
      try {
        const fetchedQuotes = await fetchQuotes();
        const freelancerQuotes = fetchedQuotes.filter(
          quote => quote.freelancerId === user?.id
        );
        
        // Trier par client
        const sortedQuotes = freelancerQuotes.sort((a, b) => {
          // D'abord trier par contactId
          if (a.contactId < b.contactId) return -1;
          if (a.contactId > b.contactId) return 1;
          
          // Ensuite par date de création (la plus récente d'abord)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setQuotes(sortedQuotes);
      } catch (error) {
        console.error("Error loading quotes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadQuotes();
    }
  }, [user]);
  
  // Grouper les devis par client
  const quotesByClient: Record<string, Quote[]> = {};
  quotes.forEach(quote => {
    if (!quotesByClient[quote.contactId]) {
      quotesByClient[quote.contactId] = [];
    }
    quotesByClient[quote.contactId].push(quote);
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de vos devis...</span>
      </div>
    );
  }
  
  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">📃</div>
        <h3 className="text-xl font-semibold mb-2">Aucun devis trouvé</h3>
        <p className="text-muted-foreground">
          Vous n'avez pas encore créé de devis pour vos clients.
        </p>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return "bg-gray-200 text-gray-700";
      case 'sent': return "bg-blue-100 text-blue-700";
      case 'accepted': return "bg-green-100 text-green-700";
      case 'rejected': return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  
  return (
    <div className="space-y-6">
      {Object.entries(quotesByClient).map(([contactId, clientQuotes]) => {
        // Obtenir le nom du client à partir du premier devis
        const contactName = clientQuotes[0]?.contactName || `Client ${contactId}`;
        
        return (
          <Card key={contactId} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg">{contactName}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Montant</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Statut</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Validité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientQuotes.map(quote => (
                      <tr 
                        key={quote.id} 
                        className="border-t cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => navigate(`/quotes/${quote.id}`)}
                      >
                        <td className="px-4 py-2 text-sm">
                          {formatDateToFrench(new Date(quote.createdAt))}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium">
                          {formatCurrency(quote.totalAmount)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Badge variant="outline" className={getStatusColor(quote.status)}>
                            {quote.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {formatDateToFrench(new Date(quote.validUntil))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FreelancerQuotesList;
