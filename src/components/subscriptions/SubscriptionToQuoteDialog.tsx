
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Subscription } from '@/types/subscription';
import { Quote, QuoteStatus } from '@/types/quote';
import { createQuotesService } from '@/services/supabase/quotes';
import { supabase } from '@/lib/supabase-client';

interface SubscriptionToQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription;
  onQuoteCreated?: (quoteId: string) => void;
}

const SubscriptionToQuoteDialog: React.FC<SubscriptionToQuoteDialogProps> = ({ 
  open, 
  onOpenChange,
  subscription,
  onQuoteCreated
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validUntil, setValidUntil] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const handleCreateQuote = async () => {
    if (!subscription) return;
    
    setIsSubmitting(true);
    
    try {
      const quotesService = createQuotesService(supabase);
      
      // Create quote data
      const quoteData = {
        contactId: subscription.clientId,
        freelancerId: subscription.freelancerId,
        totalAmount: subscription.price,
        validUntil: new Date(validUntil),
        status: QuoteStatus.DRAFT,
        notes: `Devis généré à partir de l'abonnement: ${subscription.name}`,
        folder: 'subscriptions'
      };
      
      // Create quote items
      const quoteItems = [
        {
          description: `${subscription.name} - Abonnement ${subscription.interval}`,
          quantity: 1,
          unitPrice: subscription.price,
          tax: 0,
          discount: 0
        }
      ];
      
      const newQuote = await quotesService.createQuote(quoteData, quoteItems);
      
      if (newQuote) {
        toast({
          title: "Devis créé avec succès",
          description: "Le devis a été créé à partir de l'abonnement",
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
            Créer un devis à partir de l'abonnement {subscription?.name}
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="subscription-name">Abonnement</Label>
              <Input id="subscription-name" value={subscription?.name} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subscription-price">Prix</Label>
              <Input id="subscription-price" value={`${subscription?.price} €`} disabled />
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
