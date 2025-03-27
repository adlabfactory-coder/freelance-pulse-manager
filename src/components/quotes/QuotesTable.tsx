
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, FileText, ArrowUpDown, Clock, CheckCircle, XCircle } from "lucide-react";
import { Quote, QuoteStatus } from "@/types/quote";
import { formatCurrency } from "@/utils/format";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import EditQuoteDialog from "./form/EditQuoteDialog";
import { deleteQuote, updateQuoteStatus } from "@/services/quote-service";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { fetchUserById } from "@/services/user-service";
import { contactService } from "@/services/contact-service";
import { User } from "@/types";
import { Contact } from "@/types/contact";

interface QuotesTableProps {
  quotes: Quote[];
  loading: boolean;
  onStatusChange: () => void;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quotes, loading, onStatusChange }) => {
  const { toast } = useToast();
  const { user, isAdminOrSuperAdmin } = useAuth();
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [contactsMap, setContactsMap] = useState<Record<string, Contact>>({});
  const [freelancersMap, setFreelancersMap] = useState<Record<string, User>>({});

  // Charger les informations des contacts et des commerciaux
  useEffect(() => {
    // Collecte des IDs uniques
    const contactIds = Array.from(new Set(quotes.map(quote => quote.contactId)));
    const freelancerIds = Array.from(new Set(quotes.map(quote => quote.freelancerId)));
    
    // Charger les contacts
    const loadContacts = async () => {
      const contactsData: Record<string, Contact> = {};
      for (const contactId of contactIds) {
        try {
          const contact = await contactService.getContactById(contactId);
          if (contact) {
            contactsData[contactId] = contact;
          }
        } catch (error) {
          console.error(`Erreur lors du chargement du contact ${contactId}:`, error);
        }
      }
      setContactsMap(contactsData);
    };
    
    // Charger les commerciaux
    const loadFreelancers = async () => {
      const freelancersData: Record<string, User> = {};
      for (const freelancerId of freelancerIds) {
        try {
          const freelancer = await fetchUserById(freelancerId);
          if (freelancer) {
            freelancersData[freelancerId] = freelancer;
          }
        } catch (error) {
          console.error(`Erreur lors du chargement du commercial ${freelancerId}:`, error);
        }
      }
      setFreelancersMap(freelancersData);
    };
    
    if (quotes.length > 0) {
      loadContacts();
      loadFreelancers();
    }
  }, [quotes]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
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

  const handleDelete = async (id: string) => {
    try {
      await deleteQuote(id);
      toast({
        title: "Succès",
        description: "Le devis a été supprimé avec succès",
      });
      onStatusChange();
    } catch (error) {
      console.error("Erreur lors de la suppression du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du devis",
      });
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const quoteStatus = status as QuoteStatus;
      await updateQuoteStatus(id, quoteStatus);
      toast({
        title: "Succès",
        description: `Le statut du devis a été mis à jour: ${getStatusLabel(quoteStatus)}`,
      });
      onStatusChange();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
      });
    }
  };

  const canEdit = (quote: Quote) => {
    return isAdminOrSuperAdmin || quote.freelancerId === user?.id;
  };

  const getStatusLabel = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return "Brouillon";
      case QuoteStatus.PENDING:
        return "En attente";
      case QuoteStatus.ACCEPTED:
        return "Accepté";
      case QuoteStatus.REJECTED:
        return "Rejeté";
      case QuoteStatus.EXPIRED:
        return "Expiré";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return "outline";
      case QuoteStatus.PENDING:
        return "secondary";
      case QuoteStatus.ACCEPTED:
        return "success";
      case QuoteStatus.REJECTED:
        return "destructive";
      case QuoteStatus.EXPIRED:
        return "destructive";
      default:
        return "default";
    }
  };

  // Obtenir le nom du contact à partir de l'ID
  const getContactName = (contactId: string) => {
    return contactsMap[contactId]?.name || 'Contact inconnu';
  };

  // Obtenir le nom du commercial à partir de l'ID
  const getFreelancerName = (freelancerId: string) => {
    return freelancersMap[freelancerId]?.name || 'Commercial inconnu';
  };

  // Formater la référence du devis
  const formatReference = (id: string) => {
    return `DEV-${id.substring(0, 8).toUpperCase()}`;
  };

  if (loading) {
    return (
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Commercial</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date limite</TableHead>
              <TableHead>Dernière MAJ</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (sortedQuotes.length === 0) {
    return (
      <div className="bg-muted/20 p-8 text-center rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucun devis</h3>
        <p className="text-muted-foreground mt-2">
          Vous n'avez pas encore créé de devis ou aucun devis ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Commercial</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary"
                onClick={() => handleSort("totalAmount")}
              >
                <div className="flex items-center">
                  Montant
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Statut</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary"
                onClick={() => handleSort("validUntil")}
              >
                <div className="flex items-center">
                  Date limite
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center">
                  Dernière MAJ
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{formatReference(quote.id)}</TableCell>
                <TableCell>{getContactName(quote.contactId)}</TableCell>
                <TableCell>{getFreelancerName(quote.freelancerId)}</TableCell>
                <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(quote.status)}>
                    {getStatusLabel(quote.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(quote.validUntil) > new Date() ? (
                    <span>
                      {formatDistance(new Date(quote.validUntil), new Date(), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </span>
                  ) : (
                    <span className="text-destructive">Expiré</span>
                  )}
                </TableCell>
                <TableCell>
                  {formatDistance(new Date(quote.updatedAt), new Date(), {
                    addSuffix: true,
                    locale: fr
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {confirmDelete === quote.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setConfirmDelete(null)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(quote.id)}
                      >
                        Confirmer
                      </Button>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEdit(quote) && (
                          <DropdownMenuItem onClick={() => setEditingQuoteId(quote.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        )}
                        
                        {canEdit(quote) && quote.status === QuoteStatus.DRAFT && (
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id, QuoteStatus.PENDING)}>
                            <Clock className="mr-2 h-4 w-4" />
                            Marquer comme En attente
                          </DropdownMenuItem>
                        )}

                        {canEdit(quote) && (quote.status === QuoteStatus.DRAFT || quote.status === QuoteStatus.PENDING) && (
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id, QuoteStatus.ACCEPTED)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Marquer comme Accepté
                          </DropdownMenuItem>
                        )}

                        {canEdit(quote) && (quote.status === QuoteStatus.DRAFT || quote.status === QuoteStatus.PENDING) && (
                          <DropdownMenuItem onClick={() => handleStatusChange(quote.id, QuoteStatus.REJECTED)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Marquer comme Rejeté
                          </DropdownMenuItem>
                        )}

                        {canEdit(quote) && (
                          <DropdownMenuItem onClick={() => setConfirmDelete(quote.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingQuoteId && (
        <EditQuoteDialog
          open={!!editingQuoteId}
          onOpenChange={(open) => {
            if (!open) setEditingQuoteId(null);
          }}
          onQuoteUpdated={onStatusChange}
          quoteId={editingQuoteId}
        />
      )}
    </>
  );
};

export default QuotesTable;
