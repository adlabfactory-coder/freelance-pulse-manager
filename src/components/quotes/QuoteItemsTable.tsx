
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuoteItem } from '@/types/quote';
import { formatCurrency } from '@/utils/format';

interface QuoteItemsTableProps {
  items: QuoteItem[];
  totalAmount: number;
}

const QuoteItemsTable: React.FC<QuoteItemsTableProps> = ({ items, totalAmount }) => {
  const calculateItemTotal = (item: QuoteItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = (item.discount || 0) / 100 * subtotal;
    const taxAmount = (item.tax || 0) / 100 * (subtotal - discountAmount);
    return subtotal - discountAmount + taxAmount;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Description</TableHead>
          <TableHead className="text-right">Quantité</TableHead>
          <TableHead className="text-right">Prix unitaire</TableHead>
          <TableHead className="text-right">Remise</TableHead>
          <TableHead className="text-right">TVA</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              Aucun élément dans ce devis
            </TableCell>
          </TableRow>
        ) : (
          items.map((item, index) => (
            <TableRow key={item.id || index}>
              <TableCell className="font-medium">{item.description}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
              <TableCell className="text-right">{item.discount ? `${item.discount}%` : '-'}</TableCell>
              <TableCell className="text-right">{item.tax ? `${item.tax}%` : '-'}</TableCell>
              <TableCell className="text-right">{formatCurrency(calculateItemTotal(item))}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="text-right font-medium">Total</TableCell>
          <TableCell className="text-right font-bold">{formatCurrency(totalAmount)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default QuoteItemsTable;
