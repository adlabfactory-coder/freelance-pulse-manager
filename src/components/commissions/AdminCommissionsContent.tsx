
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Commission, CommissionRule } from "@/types/commissions";
import CommissionTiers from "@/components/commissions/CommissionTiers";
import CommissionContent from "@/components/commissions/CommissionContent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/utils/commission";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AdminCommissionsContentProps {
  commissions: Commission[];
  commissionRules: CommissionRule[];
  loading: boolean;
  requestingPayment: boolean;
  error?: string | null;
  approvePayment: (commissionId: string) => void;
  generateMonthlyCommissions: (month: Date) => void;
  requestPayment: (commissionId: string) => void; // Added this prop
}

const AdminCommissionsContent: React.FC<AdminCommissionsContentProps> = ({
  commissions,
  commissionRules,
  loading,
  requestingPayment,
  error,
  approvePayment,
  generateMonthlyCommissions,
  requestPayment // Added this prop
}) => {
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCommissions = () => {
    if (!selectedMonth) return;
    
    setIsGenerating(true);
    generateMonthlyCommissions(selectedMonth);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de connexion</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
    
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 border rounded-md bg-muted/20">
        <div>
          <h2 className="text-lg font-medium mb-2">Générer les commissions mensuelles</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Sélectionnez un mois et générez les commissions pour tous les freelances.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedMonth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedMonth ? (
                  new Date(selectedMonth).toLocaleDateString('fr', { month: 'long', year: 'numeric' })
                ) : (
                  <span>Sélectionner un mois</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={setSelectedMonth}
                initialFocus
                disabled={(date) => {
                  // Désactiver les dates futures
                  return date > new Date() || date < new Date(new Date().getFullYear() - 1, 0, 1);
                }}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleGenerateCommissions} 
            disabled={!selectedMonth || isGenerating}
          >
            {isGenerating ? "Génération en cours..." : "Générer les commissions"}
          </Button>
        </div>
      </div>
      
      <CommissionContent
        commissions={commissions}
        commissionRules={commissionRules}
        loading={loading}
        requestingPayment={requestingPayment}
        requestPayment={requestPayment}
        approvePayment={approvePayment}
        isAdmin={true}
      />
    </div>
  );
};

export default AdminCommissionsContent;
