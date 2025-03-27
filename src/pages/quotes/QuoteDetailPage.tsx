
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuoteDetails } from '@/hooks/useQuoteDetails';
import QuoteDetails from '@/components/quotes/QuoteDetails';
import QuoteActionButtons from '@/components/quotes/actions/QuoteActionButtons';
import EditQuoteDialog from '@/components/quotes/form/EditQuoteDialog';
import { QuoteStatus } from '@/types/quote';

const QuoteDetailPage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const {
    quote,
    loading,
    error,
    contactName,
    freelancerName,
    loadQuote,
    updateQuoteStatus
  } = useQuoteDetails(quoteId as string);

  const handleBack = () => {
    navigate('/quotes');
  };

  const handleDelete = () => {
    navigate('/quotes');
  };

  const handleEditComplete = () => {
    loadQuote();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement du devis...</p>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <div className="bg-destructive/10 rounded-md p-6 text-center text-destructive">
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p>{error || "Devis introuvable"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        
        <QuoteActionButtons
          quote={quote}
          onDelete={handleDelete}
          onEdit={() => setEditDialogOpen(true)}
          onStatusChange={updateQuoteStatus}
        />
      </div>

      <QuoteDetails
        quote={quote}
        contactName={contactName}
        freelancerName={freelancerName}
      />
      
      <EditQuoteDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onQuoteUpdated={handleEditComplete}
        quoteId={quote.id}
        initialQuote={quote}
      />
    </div>
  );
};

export default QuoteDetailPage;
