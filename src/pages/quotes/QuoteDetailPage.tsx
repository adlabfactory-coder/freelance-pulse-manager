
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Quote, QuoteStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2, Check, X, Send, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/format';

const QuoteDetailPage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            *,
            contact:contacts(*),
            freelancer:users(*),
            items:quote_items(*)
          `)
          .eq('id', quoteId)
          .single();

        if (error) {
          throw error;
        }

        // Transform the data to the required format
        const quoteData: Quote = {
          id: data.id,
          contactId: data.contactId,
          freelancerId: data.freelancerId,
          status: data.status as QuoteStatus,
          notes: data.notes,
          validUntil: new Date(data.validUntil),
          totalAmount: data.totalAmount,
          items: data.items,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          contact: {
            id: data.contact.id,
            name: data.contact.name,
            email: data.contact.email,
            phone: data.contact.phone,
            company: data.contact.company,
            status: data.contact.status,
            createdAt: new Date(data.contact.createdAt),
            updatedAt: new Date(data.contact.updatedAt)
          },
          freelancer: {
            id: data.freelancer.id,
            email: data.freelancer.email,
            name: data.freelancer.name || data.freelancer.email.split('@')[0],
            role: data.freelancer.role
          }
        };

        setQuote(quoteData);
      } catch (error) {
        console.error("Error fetching quote:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load quote details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId, toast]);

  const handleUpdateStatus = async (newStatus: QuoteStatus) => {
    if (!quote) return;
    
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus })
        .eq('id', quote.id);
      
      if (error) throw error;
      
      setQuote({...quote, status: newStatus});
      
      toast({
        variant: "default",
        title: "Success",
        description: `Quote marked as ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating quote status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quote status",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-medium">Quote not found</h2>
        <Button variant="link" onClick={() => navigate('/quotes')}>
          Back to Quotes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/quotes')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to quotes
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => {/* Implement print functionality */}}
          >
            <FileText className="mr-2 h-4 w-4" /> Print
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => {/* Implement send to client functionality */}}
          >
            <Send className="mr-2 h-4 w-4" /> Send to client
          </Button>
          
          {quote.status === 'pending' && (
            <>
              <Button
                variant="outline"
                className="flex items-center text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleUpdateStatus('accepted')}
              >
                <Check className="mr-2 h-4 w-4" /> Accept
              </Button>
              <Button
                variant="outline"
                className="flex items-center text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleUpdateStatus('rejected')}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Quote #{quote.id.substring(0, 8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Created: {formatDate(quote.createdAt)}
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {quote.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Client Information</h3>
              <div className="space-y-1">
                <p><strong>Name:</strong> {quote.contact.name}</p>
                <p><strong>Email:</strong> {quote.contact.email}</p>
                <p><strong>Phone:</strong> {quote.contact.phone}</p>
                <p><strong>Company:</strong> {quote.contact.company}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Quote Details</h3>
              <div className="space-y-1">
                <p><strong>Valid Until:</strong> {formatDate(quote.validUntil)}</p>
                <p><strong>Freelancer:</strong> {quote.freelancer.name}</p>
                <p><strong>Total Amount:</strong> {formatCurrency(quote.totalAmount)}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Quote Items</h3>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {quote.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-medium">
                    <td colSpan={3} className="px-4 py-3 text-right">Total</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(quote.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {quote.notes && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{quote.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteDetailPage;
