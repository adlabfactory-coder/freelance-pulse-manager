
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { QuoteItem } from "@/types";
import { formatCurrency } from "@/utils/format";

interface QuoteItemsListProps {
  items?: QuoteItem[];
  totalAmount?: number;
  onRemoveItem: (index: number) => void;
}

const QuoteItemsList: React.FC<QuoteItemsListProps> = ({
  items = [],
  totalAmount = 0,
  onRemoveItem
}) => {
  const calculateItemTotal = (item: Partial<QuoteItem>) => {
    const quantity = item.quantity || 0;
    const unitPrice = item.unitPrice || 0;
    const discount = item.discount || 0;
    const tax = item.tax || 0;
    
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const taxAmount = (subtotal - discountAmount) * (tax / 100);
    
    return subtotal - discountAmount + taxAmount;
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Articles du devis</h3>
      {items.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left text-xs">Description</th>
                <th className="p-2 text-right text-xs">Qté</th>
                <th className="p-2 text-right text-xs">Prix</th>
                <th className="p-2 text-right text-xs">Total</th>
                <th className="p-2 text-center text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 text-sm">{item.description}</td>
                  <td className="p-2 text-right text-sm">{item.quantity}</td>
                  <td className="p-2 text-right text-sm">
                    {formatCurrency(item.unitPrice)}
                    {item.discount ? 
                      <span className="text-xs text-green-600 block">
                        -{item.discount}%
                      </span> 
                    : null}
                  </td>
                  <td className="p-2 text-right font-medium text-sm">
                    {formatCurrency(calculateItemTotal(item))}
                  </td>
                  <td className="p-2 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/50">
              <tr>
                <td colSpan={3} className="p-2 text-right font-bold">
                  Total:
                </td>
                <td className="p-2 text-right font-bold">
                  {formatCurrency(totalAmount)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          Aucun article ajouté
        </div>
      )}
    </div>
  );
};

export default QuoteItemsList;
