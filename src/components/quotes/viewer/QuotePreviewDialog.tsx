
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, Printer, X } from "lucide-react";
import { Quote, QuoteItem, QuoteStatus } from "@/types/quote";
import { formatDate } from "@/utils/format";
import { getStatusLabel } from "../components/QuoteStatusBadge";
import { toast } from "sonner";

interface QuotePreviewDialogProps {
  quote: Quote | null;
  contactName: string;
  freelancerName: string;
  items: QuoteItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuotePreviewDialog: React.FC<QuotePreviewDialogProps> = ({
  quote,
  contactName,
  freelancerName,
  items,
  open,
  onOpenChange,
}) => {
  if (!quote) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
      return;
    }

    const content = document.getElementById('quote-preview-content');
    if (!content) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Devis ${quote.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .quote-id { font-size: 24px; font-weight: bold; }
            .info-section { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f8f8; }
            .total { font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { margin-top: 50px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="footer">
            <p>Document généré le ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownloadPDF = () => {
    // Simulation du téléchargement PDF
    toast.success("Le PDF va être téléchargé...");
    setTimeout(() => {
      toast.info("Fonctionnalité de téléchargement PDF à implémenter");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Aperçu du devis</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div id="quote-preview-content" className="p-6">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">DEVIS</h1>
              <p className="text-muted-foreground">
                Référence: {quote.id.substring(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Date: {formatDate(new Date(quote.createdAt || ""))}</p>
              <p className="font-semibold">
                Valide jusqu'au: {formatDate(new Date(quote.validUntil))}
              </p>
              <p className="bg-primary/10 px-2 py-1 rounded text-primary mt-2">
                {getStatusLabel(quote.status as QuoteStatus)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Client</h3>
              <p>{contactName}</p>
              <p className="text-muted-foreground">Dossier: {quote.folder || "Général"}</p>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">Commercial</h3>
              <p>{freelancerName}</p>
            </div>
          </div>

          {quote.notes && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-muted-foreground whitespace-pre-line">{quote.notes}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left border">Description</th>
                  <th className="p-2 text-right border w-24">Quantité</th>
                  <th className="p-2 text-right border w-32">Prix unitaire</th>
                  <th className="p-2 text-right border w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || index} className="border-b">
                    <td className="p-2 border">{item.description}</td>
                    <td className="p-2 text-right border">{item.quantity}</td>
                    <td className="p-2 text-right border">{item.unitPrice} €</td>
                    <td className="p-2 text-right border">
                      {(item.quantity * item.unitPrice).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td colSpan={3} className="p-2 text-right font-semibold border">
                    Total
                  </td>
                  <td className="p-2 text-right font-bold border">
                    {quote.totalAmount.toFixed(2)} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>Ce devis est valable jusqu'au {formatDate(new Date(quote.validUntil))}.</p>
            <p>Pour toute question, veuillez contacter votre commercial.</p>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuotePreviewDialog;
