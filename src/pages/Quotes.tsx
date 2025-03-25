
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Plus, FileDown, FileUp, Eye, Check, X } from "lucide-react";
import { Quote, QuoteStatus } from "@/types";
import { formatCurrency } from "@/utils/format";
import { fetchQuotes, updateQuoteStatus } from "@/services/quote-service";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Quotes: React.FC = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await fetchQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les devis. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadQuotes();
  }, []);
  
  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
            Brouillon
          </span>
        );
      case QuoteStatus.SENT:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Envoyé
          </span>
        );
      case QuoteStatus.ACCEPTED:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Accepté
          </span>
        );
      case QuoteStatus.REJECTED:
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
            Refusé
          </span>
        );
      case QuoteStatus.EXPIRED:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
            Expiré
          </span>
        );
      default:
        return null;
    }
  };
  
  const handleStatusChange = async (id: string, newStatus: QuoteStatus) => {
    const success = await updateQuoteStatus(id, newStatus);
    if (success) {
      loadQuotes(); // Recharger les devis après la mise à jour
    }
  };
  
  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (quote.contact?.name?.toLowerCase().includes(searchTermLower)) ||
      (quote.freelancer?.name?.toLowerCase().includes(searchTermLower)) ||
      (quote.status.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos devis et propositions
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Créer un devis
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button variant="outline" size="sm">
            <FileUp className="mr-2 h-4 w-4" /> Importer
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Commercial</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">
                Date de création
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Valide jusqu'au
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Chargement des devis...
                </TableCell>
              </TableRow>
            ) : filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Aucun devis trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id?.substring(0, 8)}</TableCell>
                  <TableCell>{quote.contact?.name || "Client inconnu"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quote.freelancer?.name || "Commercial inconnu"}
                  </TableCell>
                  <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quote.createdAt?.toLocaleDateString() || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quote.validUntil?.toLocaleDateString() || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {quote.status === QuoteStatus.SENT && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(quote.id!, QuoteStatus.ACCEPTED)}>
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              Marquer comme accepté
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(quote.id!, QuoteStatus.REJECTED)}>
                              <X className="mr-2 h-4 w-4 text-red-500" />
                              Marquer comme refusé
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AddQuoteDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onQuoteCreated={loadQuotes}
      />
    </div>
  );
};

export default Quotes;
