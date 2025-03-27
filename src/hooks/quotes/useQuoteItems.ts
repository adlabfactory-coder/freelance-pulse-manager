
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { QuoteItem } from "@/types";
import { calculateTotalAmount } from "@/components/quotes/hooks/utils/quoteCalculations";

export const useQuoteItems = (initialItems: QuoteItem[] = []) => {
  // Stocker tous les items, y compris ceux marqués pour suppression
  const [items, setItems] = useState<(Partial<QuoteItem> & { isNew?: boolean; toDelete?: boolean })[]>(
    initialItems.map(item => ({ ...item, isNew: false, toDelete: false }))
  );
  
  // Item actuel pour le formulaire
  const [currentItem, setCurrentItem] = useState<Partial<QuoteItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    tax: 20, // Default tax rate
    discount: 0,
  });

  // Ajouter un nouvel item
  const addItem = useCallback(() => {
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
    
    // Réinitialiser l'item actuel
    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      tax: 20,
      discount: 0,
    });
  }, [currentItem]);
  
  // Supprimer un item (ou le marquer pour suppression s'il existe déjà en base)
  const removeItem = useCallback((index: number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      
      if (newItems[index].id) {
        // Marquer les items existants pour suppression au lieu de les retirer
        newItems[index] = { ...newItems[index], toDelete: true };
        return newItems;
      } else {
        // Retirer directement les nouveaux items
        return newItems.filter((_, i) => i !== index);
      }
    });
  }, []);

  // Mettre à jour un item existant
  const updateItem = useCallback((index: number, updatedItem: Partial<QuoteItem>) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], ...updatedItem };
      return newItems;
    });
  }, []);
  
  // Récupérer uniquement les items actifs (non marqués pour suppression)
  const getActiveItems = useCallback(() => {
    return items.filter(item => !item.toDelete);
  }, [items]);
  
  // Calculer le montant total
  const getTotalAmount = useCallback(() => {
    return calculateTotalAmount(getActiveItems());
  }, [getActiveItems]);

  // Réinitialiser tous les items
  const resetItems = useCallback((newItems: QuoteItem[] = []) => {
    setItems(newItems.map(item => ({ ...item, isNew: false, toDelete: false })));
  }, []);

  return {
    items: getActiveItems(),
    allItems: items, // Incluant les items marqués pour suppression
    currentItem,
    setCurrentItem,
    addItem,
    removeItem,
    updateItem,
    totalAmount: getTotalAmount(),
    resetItems
  };
};
