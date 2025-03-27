
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan } from '@/types/subscription';
import { QuoteStatus } from '@/types/quote';
import { createQuotesService } from '@/services/supabase/quotes';
import { supabase } from '@/lib/supabase-client';

interface SubscriptionToQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan;
  onQuoteCreated?: (quoteId: string) => void;
}

const SubscriptionToQuoteDialog: React.FC<SubscriptionToQuoteDialogProps> = ({ 
  open, 
  onOpenChange,
  plan,
  onQuoteCreated
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validUntil, setValidUntil] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const handleCreateQuote = async () => {
    if (!plan) return;
    
    setIsSubmitting(true);
    
    try {
      const quotesService = createQuotesService(supabase);
      
      // Create quote data - using mock data since we don't have real client/freelancer IDs
      // In a real implementation, you would select a client and freelancer
      const quoteData = {
        contactId: "00000000-0000-0000-0000-000000000000", // This would be a real contact ID
        freelancerId: "00000000-0000-0000-0000-000000000001", // This would be the current user ID
        totalAmount: plan.price,
        validUntil: new Date(validUntil),
        status: QuoteStatus.DRAFT,
        notes: `Devis généré à partir du plan d'abonnement: ${plan.name}`,
        folder: 'subscriptions'
      };
      
      // Create quote items
      const quoteItems = [
        {
          description: `${plan.name} - Abonnement ${plan.interval}`,
          quantity: 1,
          unitPrice: plan.price,
          tax: 0,
          discount: 0
        }
      ];
      
      const newQuote = await quotesService.createQuote(quoteData, quoteItems);
      
      if (newQuote) {
        toast({
          title: "Devis créé avec succès",
          description: "Le devis a été créé à partir du plan d'abonnement",
        });
        
        if (onQuoteCreated) {
          onQuoteCreated(newQuote.id);
        }
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erreur lors de la création du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du devis",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un devis</DialogTitle>
          <DialogDescription>
            Créer un devis à partir du plan d'abonnement {plan?.name}
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="subscription-name">Plan d'abonnement</Label>
              <Input id="subscription-name" value={plan?.name} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subscription-price">Prix</Label>
              <Input id="subscription-price" value={`${plan?.price} €`} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valid-until">Valide jusqu'au</Label>
              <Input
                id="valid-until"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={handleCreateQuote} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Création...' : 'Créer le devis'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionToQuoteDialog;
