
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Contact } from "@/services/contacts/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ArchiveRestore, 
  Trash2, 
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { contactService } from "@/services/contact-service";
import { toast } from "sonner";

interface ArchivedContactsTableProps {
  contacts: Contact[];
  loading: boolean;
  onContactsChange: () => void;
}

const ArchivedContactsTable: React.FC<ArchivedContactsTableProps> = ({
  contacts,
  loading,
  onContactsChange
}) => {
  const archivedContacts = contacts.filter(contact => contact.folder === 'trash');
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const handleRestoreContact = async (contactId: string) => {
    setIsRestoring(contactId);
    try {
      const success = await contactService.restoreContact(contactId);
      if (success) {
        onContactsChange();
      }
    } catch (error) {
      console.error("Erreur lors de la restauration du contact:", error);
      toast.error("Erreur lors de la restauration");
    } finally {
      setIsRestoring(null);
    }
  };

  const handlePermanentlyDeleteContact = async () => {
    if (!contactToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await contactService.permanentlyDeleteContact(contactToDelete);
      if (success) {
        onContactsChange();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression définitive du contact:", error);
      toast.error("Erreur lors de la suppression définitive");
    } finally {
      setContactToDelete(null);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[250px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[120px] ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (archivedContacts.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">Aucun contact archivé trouvé.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archivedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {contact.status === "lead" && "Prospect"}
                    {contact.status === "prospect" && "Client"}
                    {contact.status === "lost" && "Perdu"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestoreContact(contact.id)}
                      disabled={isRestoring === contact.id}
                    >
                      <ArchiveRestore className="h-4 w-4 mr-2" />
                      {isRestoring === contact.id ? "Restauration..." : "Restaurer"}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer définitivement ce contact</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Le contact sera définitivement supprimé
                            de la base de données, ainsi que toutes ses données associées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => setContactToDelete(contact.id)}
                          >
                            Supprimer définitivement
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogue de confirmation de suppression définitive */}
      <AlertDialog open={!!contactToDelete} onOpenChange={(open) => !open && setContactToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirmer la suppression définitive
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous vraiment sûr de vouloir supprimer définitivement ce contact ?
              Cette action est irréversible et toutes les données associées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={handlePermanentlyDeleteContact}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer définitivement"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ArchivedContactsTable;
