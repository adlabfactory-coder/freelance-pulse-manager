
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { QuoteItem } from "@/types";
import { calculateTotalAmount } from "./utils/quoteCalculations";

export const useQuoteItems = () => {
  const [items, setItems] = useState<(Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]>([]);
  
  const [currentItem, setCurrentItem] = useState<Partial<QuoteItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    tax: 20, // Default tax rate
    discount: 0,
  });

  const handleAddItem = useCallback(() => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      toast.error("Veuillez remplir tous les champs de l'article");
      return;
    }
    
    setItems(prevItems => [
      ...prevItems,
      {
        ...currentItem,
        isNew: true
      }
    ]);
    
    // Reset current item
    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      tax: 20,
      discount: 0,
    });
  }, [currentItem]);
  
  const handleRemoveItem = useCallback((index: number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      
      if (newItems[index].id) {
        // Mark existing items for deletion instead of removing them from the array
        newItems[index] = { ...newItems[index], toDelete: true };
        return newItems;
      } else {
        // Remove new items directly
        return newItems.filter((_, i) => i !== index);
      }
    });
  }, []);

  const updateItem = useCallback((index: number, updatedItem: Partial<QuoteItem>) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], ...updatedItem };
      return newItems;
    });
  }, []);
  
  const getActiveItems = useCallback(() => {
    return items.filter(item => !item.toDelete);
  }, [items]);
  
  const getTotalAmount = useCallback(() => {
    return calculateTotalAmount(getActiveItems());
  }, [getActiveItems]);

  const resetItems = useCallback((newItems: QuoteItem[] = []) => {
    setItems(newItems.map(item => ({ ...item, isNew: false, toDelete: false })));
  }, []);

  return {
    items: getActiveItems(),
    allItems: items,
    currentItem,
    setCurrentItem,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateItem,
    totalAmount: getTotalAmount(),
    resetItems
  };
};
