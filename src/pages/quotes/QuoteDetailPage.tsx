
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, CheckCircle, XCircle, Calendar, AlertTriangle, Download, Send, Check, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/utils/format";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";

type QuoteStatus = "draft" | "pending" | "accepted" | "rejected" | "expired";

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
}

interface Quote {
  id: string;
  status: QuoteStatus;
  createdAt: Date;
  validUntil: Date;
  client: {
    name: string;
    company: string;
    email: string;
  };
  items: QuoteItem[];
  totalAmount: number;
  notes?: string;
}

// Mock quote data
const mockQuote: Quote = {
  id: "QUOTE-2023-001",
  status: "pending",
  createdAt: new Date("2023-03-15"),
  validUntil: new Date("2023-04-15"),
  client: {
    name: "Jean Dupont",
    company: "Entreprise XYZ",
    email: "jean@entreprisexyz.fr"
  },
  items: [
    {
      description: "Pack Premium",
      quantity: 1,
      unitPrice: 3000,
      discount: 10,
      tax: 20
    },
    {
      description: "Support technique (heures)",
      quantity: 10,
      unitPrice: 75,
      discount: 0,
      tax: 20
    }
  ],
  totalAmount: 3870,
  notes: "Ce devis inclut l'accès à tous les services premium pendant 12 mois ainsi que 10 heures de support technique."
};

// Helper functions for quote status
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
      return "secondary";
  }
};

const getStatusLabel = (status: QuoteStatus) => {
  switch (status) {
    case "draft": return "Brouillon";
    case "pending": return "En attente";
    case "accepted": return "Accepté";
    case "rejected": return "Rejeté";
    case "expired": return "Expiré";
    default: return status;
  }
};

const StatusIcon = ({ status }: { status: QuoteStatus }) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "accepted":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />;
    case "expired":
      return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const QuoteDetailPage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote>(mockQuote);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const calculateSubtotal = (item: QuoteItem) => {
    return item.quantity * item.unitPrice;
  };

  const calculateDiscount = (item: QuoteItem) => {
    return calculateSubtotal(item) * (item.discount / 100);
  };

  const calculateTax = (item: QuoteItem) => {
    return (calculateSubtotal(item) - calculateDiscount(item)) * (item.tax / 100);
  };

  const calculateTotal = (item: QuoteItem) => {
    return calculateSubtotal(item) - calculateDiscount(item) + calculateTax(item);
  };

  const handleBack = () => {
    navigate('/quotes');
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Téléchargement PDF",
      description: "Le devis est en cours de téléchargement au format PDF."
    });
  };

  const handleSendQuote = () => {
    setQuote(prev => ({ ...prev, status: "pending" }));
    toast({
      title: "Devis envoyé",
      description: "Le devis a été envoyé au client par email."
    });
  };

  const handleAcceptQuote = () => {
    setQuote(prev => ({ ...prev, status: "accepted" }));
    toast({
      title: "Devis accepté",
      description: "Le devis a été marqué comme accepté."
    });
  };

  const handleRejectQuote = () => {
    setRejectDialogOpen(false);
    setQuote(prev => ({ ...prev, status: "rejected" }));
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" /> PDF
          </Button>
          {quote.status === "draft" && (
            <Button onClick={handleSendQuote} className="gap-2">
              <Send className="h-4 w-4" /> Envoyer
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Devis #{quote.id}</CardTitle>
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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Client</h3>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{quote.client.name}</p>
                    <p>{quote.client.company}</p>
                    <p>{quote.client.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Validité</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Valable jusqu'au {quote.validUntil.toLocaleDateString()}
                  </div>
                </div>

                {quote.status === "pending" && (
                  <div className="flex space-x-3 pt-4">
                    <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                          <X className="h-4 w-4 mr-2" /> Rejeter
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer le rejet</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir rejeter ce devis ? Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRejectQuote} className="bg-destructive text-destructive-foreground">
                            Rejeter
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={handleAcceptQuote}
                    >
                      <Check className="h-4 w-4 mr-2" /> Accepter
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md divide-y">
                {quote.items.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{item.description}</div>
                      <div className="text-right">{formatCurrency(calculateTotal(item))}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.unitPrice)}
                      {item.discount > 0 && ` (-${item.discount}%)`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <div className="text-right space-y-1">
                <div className="text-sm text-muted-foreground">Sous-total: {formatCurrency(quote.totalAmount / 1.2)}</div>
                <div className="text-sm text-muted-foreground">TVA (20%): {formatCurrency(quote.totalAmount - (quote.totalAmount / 1.2))}</div>
                <div className="text-lg font-bold">Total: {formatCurrency(quote.totalAmount)}</div>
              </div>
            </CardFooter>
          </Card>

          {quote.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{quote.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Devis créé</p>
                    <p className="text-xs text-muted-foreground">{quote.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                
                {quote.status !== "draft" && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Send className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Devis envoyé</p>
                      <p className="text-xs text-muted-foreground">{new Date(quote.createdAt.getTime() + 1000*60*60*24).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                
                {quote.status === "accepted" && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Devis accepté</p>
                      <p className="text-xs text-muted-foreground">{new Date(quote.createdAt.getTime() + 1000*60*60*24*7).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                
                {quote.status === "rejected" && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Devis rejeté</p>
                      <p className="text-xs text-muted-foreground">{new Date(quote.createdAt.getTime() + 1000*60*60*24*3).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailPage;
