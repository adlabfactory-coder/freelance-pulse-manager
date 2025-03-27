
import { useState, useMemo } from "react";
import { Quote } from "@/types/quote";

export const useQuotesSorting = (quotes: Quote[]) => {
  const [sortColumn, setSortColumn] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Tri des devis
  const sortedQuotes = useMemo(() => {
    return [...quotes].sort((a, b) => {
      if (sortColumn === "totalAmount") {
        return sortDirection === "asc"
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      } else if (sortColumn === "validUntil") {
        return sortDirection === "asc"
          ? new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
          : new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime();
      } else if (sortColumn === "updatedAt") {
        return sortDirection === "asc"
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }, [quotes, sortColumn, sortDirection]);

  // Gestion du tri
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return {
    sortColumn,
    sortDirection,
    sortedQuotes,
    handleSort
  };
};
