
import React, { useState, useEffect } from "react";
import { Quote } from "@/types";
import { fetchQuotes } from "@/services/quote-service";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import { useToast } from "@/components/ui/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import QuotesHeader from "@/components/quotes/QuotesHeader";
import QuotesToolbar from "@/components/quotes/QuotesToolbar";
import QuotesTable from "@/components/quotes/QuotesTable";

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
  
  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (quote.contact?.name?.toLowerCase().includes(searchTermLower)) ||
      (quote.freelancer?.name?.toLowerCase().includes(searchTermLower)) ||
      (quote.status.toLowerCase().includes(searchTermLower))
    );
  });

  const handleAddClick = () => setAddDialogOpen(true);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <QuotesHeader onAddClick={handleAddClick} />
        
        <QuotesToolbar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={handleAddClick}
        />

        <QuotesTable 
          quotes={filteredQuotes}
          loading={loading}
          onStatusChange={loadQuotes}
        />
        
        <AddQuoteDialog 
          open={addDialogOpen} 
          onOpenChange={setAddDialogOpen} 
          onQuoteCreated={loadQuotes}
        />
      </div>
    </TooltipProvider>
  );
};

export default Quotes;
