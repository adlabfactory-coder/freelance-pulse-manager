import React, { useState, useEffect } from "react";
import { Quote, QuoteStatus } from "@/types/quote";
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
import QuoteFolderFilter from "@/components/quotes/QuoteFolderFilter";
import useFolderFilter from "@/components/quotes/hooks/useFolderFilter";

const Quotes: React.FC = () => {
  const { toast } = useToast();
  const { isAdminOrSuperAdmin, isFreelancer } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const { selectedFolder, setSelectedFolder } = useFolderFilter();
  
  const loadQuotes = async () => {
    setLoading(true);
    try {
      console.log("Chargement des devis");
      const data = await fetchQuotes();
      console.log("Devis chargés:", data);
      const typedData: Quote[] = data.map(quote => ({
        ...quote,
        status: quote.status as QuoteStatus
      }));
      setQuotes(typedData);
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
    // Filtrer par terme de recherche
    const matchesSearch = !searchTerm || 
      (quote.contactId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quote.freelancerId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (quote.status.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtrer par dossier
    const matchesFolder = selectedFolder === 'all' || quote.folder === selectedFolder;
    
    return matchesSearch && matchesFolder;
  });

  const handleAddClick = () => {
    console.log("Ouverture du dialogue d'ajout de devis");
    setAddDialogOpen(true);
  };
  
  const handleQuoteCreated = () => {
    console.log("Devis créé, rechargement de la liste des devis");
    loadQuotes();
    toast({
      title: "Succès",
      description: "Le devis a été créé avec succès.",
    });
  };

  // Si c'est un freelancer qui n'est pas admin, afficher la vue freelancer
  if (isFreelancer && !isAdminOrSuperAdmin) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <QuotesHeader onAddClick={handleAddClick} />
          
          <div className="bg-white rounded-md shadow p-4">
            <h3 className="text-lg font-medium mb-3">Filtrer par dossier</h3>
            <QuoteFolderFilter 
              selectedFolder={selectedFolder}
              onFolderChange={setSelectedFolder}
            />
          </div>
          
          <FreelancerQuotesList folderFilter={selectedFolder} />
          <AppointmentsListSection />
          <AddQuoteDialog 
            open={addDialogOpen} 
            onOpenChange={setAddDialogOpen} 
            onQuoteCreated={handleQuoteCreated} 
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
        
        <div className="bg-white rounded-md shadow p-4">
          <h3 className="text-lg font-medium mb-3">Filtrer par dossier</h3>
          <QuoteFolderFilter 
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
          />
        </div>
        
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
          onQuoteCreated={handleQuoteCreated}
        />
      </div>
    </TooltipProvider>
  );
};

export default Quotes;
