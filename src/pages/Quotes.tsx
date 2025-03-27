
import React, { useState, useEffect } from "react";
import { Quote } from "@/types";
import { fetchQuotes } from "@/services/quote-service";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import QuotesHeader from "@/components/quotes/QuotesHeader";
import QuotesToolbar from "@/components/quotes/QuotesToolbar";
import QuotesTable from "@/components/quotes/QuotesTable";
import FreelancerQuotesList from "@/components/quotes/FreelancerQuotesList";
import { useAuth } from "@/hooks/use-auth";
import AppointmentsListSection from "@/components/quotes/AppointmentsListSection";

const Quotes: React.FC = () => {
  const { toast } = useToast();
  const { isAdminOrSuperAdmin, isFreelancer } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  
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
    if (loadAttempt === 0) {
      console.log("Chargement initial des devis");
      loadQuotes();
      setLoadAttempt(1);
    }
  }, [loadAttempt]);
  
  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (quote.contactId?.toLowerCase().includes(searchTermLower)) ||
      (quote.freelancerId?.toLowerCase().includes(searchTermLower)) ||
      (quote.status.toLowerCase().includes(searchTermLower))
    );
  });

  const handleAddClick = () => setAddDialogOpen(true);

  // Si c'est un freelancer qui n'est pas admin, afficher la vue freelancer
  if (isFreelancer && !isAdminOrSuperAdmin) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <QuotesHeader onAddClick={handleAddClick} />
          <FreelancerQuotesList />
          <AppointmentsListSection />
          <AddQuoteDialog 
            open={addDialogOpen} 
            onOpenChange={setAddDialogOpen} 
            onQuoteCreated={() => {}} 
          />
        </div>
      </TooltipProvider>
    );
  }

  // Sinon, afficher la vue admin/standard
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
        
        <AppointmentsListSection />
        
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
