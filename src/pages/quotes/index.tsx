
import React from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import QuoteViewer from "@/components/quotes/viewer/QuoteViewer";
import { useAuth } from "@/hooks/use-auth";
import FreelancerQuotesList from "@/components/quotes/FreelancerQuotesList";
import AppointmentsListSection from "@/components/quotes/AppointmentsListSection";
import useFolderFilter from "@/components/quotes/hooks/useFolderFilter";

const Quotes: React.FC = () => {
  const { isAdminOrSuperAdmin, isFreelancer } = useAuth();
  const { selectedFolder } = useFolderFilter();

  // Si c'est un freelancer qui n'est pas admin, afficher la vue freelancer
  if (isFreelancer && !isAdminOrSuperAdmin) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Mes devis</h2>
          <FreelancerQuotesList folderFilter={selectedFolder} />
          <AppointmentsListSection />
        </div>
      </TooltipProvider>
    );
  }

  // Sinon, afficher la vue admin/standard avec le nouveau composant
  return (
    <TooltipProvider>
      <QuoteViewer
        title="Gestion des devis"
        initialFilters={{
          status: null,
          folder: selectedFolder === 'all' ? null : selectedFolder
        }}
      />
      <div className="mt-8">
        <AppointmentsListSection />
      </div>
    </TooltipProvider>
  );
};

export default Quotes;
