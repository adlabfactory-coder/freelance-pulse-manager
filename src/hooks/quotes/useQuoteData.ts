
import { useState } from "react";
import { QuoteStatus } from "@/types/quote";

export const useQuoteData = () => {
  const [contactId, setContactId] = useState<string>('');
  const [freelancerId, setFreelancerId] = useState<string>('');
  const [validUntil, setValidUntil] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [status, setStatus] = useState<QuoteStatus>(QuoteStatus.DRAFT);
  const [notes, setNotes] = useState<string>('');
  const [folder, setFolder] = useState<string>('general');

  // Convertir une chaîne de date ou un objet Date en Date
  const convertToDate = (date: Date | string | undefined): Date => {
    if (!date) return new Date();
    return typeof date === 'string' ? new Date(date) : date;
  };

  const setQuoteData = (data: {
    contactId?: string;
    freelancerId?: string;
    validUntil?: Date | string;
    status?: QuoteStatus;
    notes?: string;
    folder?: string;
  }) => {
    if (data.contactId !== undefined) setContactId(data.contactId);
    if (data.freelancerId !== undefined) setFreelancerId(data.freelancerId);
    if (data.validUntil !== undefined) setValidUntil(convertToDate(data.validUntil));
    if (data.status !== undefined) setStatus(data.status);
    if (data.notes !== undefined) setNotes(data.notes);
    if (data.folder !== undefined) setFolder(data.folder);
  };

  const getQuoteData = () => ({
    contactId,
    freelancerId,
    validUntil,
    status,
    notes,
    folder
  });

  return {
    contactId,
    setContactId,
    freelancerId,
    setFreelancerId,
    validUntil,
    setValidUntil,
    status,
    setStatus,
    notes,
    setNotes,
    folder,
    setFolder,
    setQuoteData,
    getQuoteData,
    convertToDate
  };
};
