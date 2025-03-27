
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from '@/types/quote';
import QuoteStatusBadge from './QuoteStatusBadge';
import QuoteItemsTable from './QuoteItemsTable';
import { formatCurrency } from '@/utils/format';

interface QuoteDetailsProps {
  quote: Quote;
  contactName?: string;
  freelancerName?: string;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ 
  quote, 
  contactName, 
  freelancerName 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Devis #{quote.id.substring(0, 8)}</CardTitle>
              <CardDescription>
                Créé le {quote.createdAt 
                  ? format(new Date(quote.createdAt), 'dd MMMM yyyy', { locale: fr })
                  : 'N/A'}
              </CardDescription>
            </div>
            <QuoteStatusBadge status={quote.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
              <p className="font-medium">{contactName || 'Client non spécifié'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Commercial</h3>
              <p className="font-medium">{freelancerName || 'Commercial non spécifié'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Valide jusqu'au</h3>
              <p className="font-medium">
                {format(new Date(quote.validUntil), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Montant total</h3>
              <p className="font-medium text-xl">{formatCurrency(quote.totalAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Éléments du devis</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteItemsTable 
            items={quote.items} 
            totalAmount={quote.totalAmount}
          />
        </CardContent>
      </Card>

      {quote.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{quote.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuoteDetails;
