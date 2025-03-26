
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Contact } from "@/services/contacts/types";
import { contactService } from "@/services/contacts";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserPlus, Mail, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import ContactStatusBadge from "@/components/contacts/ContactStatusBadge";

const FreelancerContactsList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      try {
        const allContacts = await contactService.getContacts();
        // Filtrer les contacts pour ce freelancer uniquement
        const filteredContacts = allContacts.filter(contact => 
          contact.assignedTo === user?.id
        );
        setContacts(filteredContacts);
      } catch (error) {
        console.error("Erreur lors du chargement des contacts:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos contacts. Veuillez réessayer plus tard.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [user?.id, toast]);

  const handleViewContact = (contactId: string) => {
    navigate(`/contacts/${contactId}`);
  };

  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchTermLower) ||
      (contact.email && contact.email.toLowerCase().includes(searchTermLower)) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchTermLower)) ||
      (contact.company && contact.company.toLowerCase().includes(searchTermLower))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Chargement des contacts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <Button onClick={() => navigate("/contacts/new")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau contact
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Vous n'avez pas encore de contacts. Ajoutez votre premier contact.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone || "—"}</TableCell>
                  <TableCell>{contact.company || "—"}</TableCell>
                  <TableCell>
                    <ContactStatusBadge status={contact.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewContact(contact.id)}
                    >
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FreelancerContactsList;
