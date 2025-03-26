
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Download, Send, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/utils/format";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";

type QuoteStatus = "draft" | "pending" | "accepted" | "rejected" | "expired";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

interface Quote {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  freelancerId: string;
  freelancerName: string;
  totalAmount: number;
  status: QuoteStatus;
  validUntil: Date;
  notes?: string;
  items: QuoteItem[];
  createdAt: Date;
}

// Helper function to get the badge variant based on status
const getStatusBadgeVariant = (status: QuoteStatus) => {
  switch (status) {
    case "draft":
      return "secondary";
    case "pending":
      return "outline";
    case "accepted":
      return "default";
    case "rejected":
      return "destructive";
    case "expired":
      return "outline";
    default:
      return "default";
  }
};

// Helper function to get the status label
const getStatusLabel = (status: QuoteStatus) => {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "pending":
      return "En attente";
    case "accepted":
      return "Accepté";
    case "rejected":
      return "Rejeté";
    case "expired":
      return "Expiré";
    default:
      return status;
  }
};

// Helper function to get the status icon
const StatusIcon = ({ status }: { status: QuoteStatus }) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "accepted":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />;
    case "expired":
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
};

// Mock data for the specific quote
const getMockQuote = (id: string): Quote => {
  return {
    id,
    contactId: "1",
    contactName: "Client Démo",
    contactEmail: "client@example.com",
    freelancerId: "2",
    freelancerName: "Commercial Démo",
    totalAmount: 12500,
    status: "pending",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    notes: "Ce devis inclut tous les services discutés lors de notre dernière réunion.",
    items: [
      {
        id: "1",
        description: "Développement de site web",
        quantity: 1,
        unitPrice: 8000,
      },
      {
        id: "2",
        description: "Optimisation SEO",
        quantity: 1,
        unitPrice: 2500,
      },
      {
        id: "3",
        description: "Maintenance mensuelle",
        quantity: 1,
        unitPrice: 2000,
      }
    ],
    createdAt: new Date()
  };
};

const QuoteDetailPage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const [quote, setQuote] = useState<Quote | null>(quoteId ? getMockQuote(quoteId) : null);
  
  if (!quoteId || !quote) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Devis non trouvé</h2>
            <p className="mt-2">Le devis que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button asChild className="mt-4">
              <Link to="/quotes">Retour aux devis</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate subtotal
  const subtotal = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  // Handle quote actions
  const handleSendQuote = () => {
    // In a real app, this would send the quote via email
    toast({
      title: "Devis envoyé",
      description: `Le devis a été envoyé à ${quote.contactEmail}.`
    });
  };

  const handleDownloadQuote = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "Téléchargement du devis",
      description: "Le devis a été téléchargé en format PDF."
    });
  };

  const handleAcceptQuote = () => {
    // In a real app, this would update the quote status in the database
    setQuote({
      ...quote,
      status: "accepted"
    });
    
    toast({
      title: "Devis accepté",
      description: "Le devis a été marqué comme accepté."
    });
  };

  const handleRejectQuote = () => {
    // In a real app, this would update the quote status in the database
    setQuote({
      ...quote,
      status: "rejected"
    });
    
    toast({
      title: "Devis rejeté",
      description: "Le devis a été marqué comme rejeté."
    });
  };

  // Badge class based on status
  const getStatusBadgeClass = (status: QuoteStatus) => {
    switch (status) {
      case "draft":
        return "";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "rejected":
        return "";
      case "expired":
        return "text-muted-foreground";
      default:
        return "";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="mb-2 sm:mb-0">
              <Link to="/quotes">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour
              </Link>
            </Button>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <h1 className="text-xl font-semibold ml-2">Détails du devis #{quoteId}</h1>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadQuote}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
            {quote.status === "pending" && (
              <Button 
                size="sm" 
                onClick={handleSendQuote}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            )}
          </div>
        </div>
        
        {/* Quote Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Devis #{quoteId}</CardTitle>
                <CardDescription>
                  Créé le {quote.createdAt.toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge 
                variant={getStatusBadgeVariant(quote.status)}
                className={getStatusBadgeClass(quote.status)}
              >
                {quote.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                {getStatusLabel(quote.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Client</h3>
                <p className="font-medium">{quote.contactName}</p>
                <p className="text-sm">{quote.contactEmail}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Commercial</h3>
                <p className="font-medium">{quote.freelancerName}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Montant total</h3>
                <p className="font-bold text-xl">{formatCurrency(quote.totalAmount)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Valide jusqu'au</h3>
                <p className="font-medium">{quote.validUntil.toLocaleDateString()}</p>
              </div>
            </div>
            
            {quote.status === "pending" && (
              <div className="mt-6 flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Rejeter</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela marquera le devis comme rejeté.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRejectQuote}>Continuer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700" 
                  onClick={handleAcceptQuote}
                >
                  Accepter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quote Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Détails du devis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-right py-3 px-4">Quantité</th>
                    <th className="text-right py-3 px-4">Prix unitaire</th>
                    <th className="text-right py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="text-right py-3 px-4">{item.quantity}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right py-4 px-4 font-medium">Sous-total</td>
                    <td className="text-right py-4 px-4 font-medium">{formatCurrency(subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right py-4 px-4 font-bold">Total</td>
                    <td className="text-right py-4 px-4 font-bold text-lg">{formatCurrency(quote.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Notes */}
        {quote.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{quote.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default QuoteDetailPage;
