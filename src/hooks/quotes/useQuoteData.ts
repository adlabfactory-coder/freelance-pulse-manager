
import { useState, useCallback } from "react";
import { Quote, QuoteStatus } from "@/types/quote";

export const useQuoteData = (initialData?: Partial<Quote>) => {
  const [contactId, setContactId] = useState<string>(initialData?.contactId || "");
  const [freelancerId, setFreelancerId] = useState<string>(initialData?.freelancerId || "");
  const [validUntil, setValidUntil] = useState<Date>(
    initialData?.validUntil 
      ? (typeof initialData.validUntil === 'string' 
          ? new Date(initialData.validUntil) 
          : initialData.validUntil)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState<QuoteStatus>(initialData?.status || QuoteStatus.DRAFT);
  const [notes, setNotes] = useState<string>(initialData?.notes || "");
  const [folder, setFolder] = useState<string>(initialData?.folder || "general");

  // Fonction sécurisée pour convertir les dates
  const convertToDate = useCallback((value: string | Date): Date => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  }, []);

  // Mise à jour de la date de validité avec conversion
  const setValidUntilSafe = useCallback((value: string | Date) => {
    setValidUntil(convertToDate(value));
  }, [convertToDate]);

  const getQuoteData = useCallback(() => {
    return {
      contactId,
      freelancerId,
      validUntil,
      status,
      notes,
      folder
    };
  }, [contactId, freelancerId, validUntil, status, notes, folder]);

  const setQuoteData = useCallback((data: Partial<Quote>) => {
    if (data.contactId) setContactId(data.contactId);
    if (data.freelancerId) setFreelancerId(data.freelancerId);
    if (data.validUntil) setValidUntil(convertToDate(data.validUntil));
    if (data.status) setStatus(data.status as QuoteStatus);
    if (data.notes !== undefined) setNotes(data.notes);
    if (data.folder) setFolder(data.folder);
  }, [convertToDate]);

  return {
    contactId,
    setContactId,
    freelancerId,
    setFreelancerId,
    validUntil,
    setValidUntil: setValidUntilSafe,
    status,
    setStatus,
    notes,
    setNotes,
    folder,
    setFolder,
    getQuoteData,
    setQuoteData,
    convertToDate
  };
};
