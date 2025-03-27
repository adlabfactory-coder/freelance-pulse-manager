
import React, { useState } from "react";
import { useContactsData } from "./hooks/useContactsData";
import AdminContactsView from "./components/AdminContactsView";
import AccountManagerContactsView from "./components/AccountManagerContactsView";
import FreelancerContactsList from "@/components/contacts/FreelancerContactsList";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Archive } from "lucide-react";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import ArchivedContactsTable from "@/components/contacts/ArchivedContactsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContactsPage: React.FC = () => {
  const { 
    contacts, 
    filteredContacts, 
    loading, 
    error,
    searchTerm, 
    statusFilter, 
    includeTrash,
    fetchContacts, 
    handleSearch, 
    handleFilterByStatus,
    toggleTrashContacts
  } = useContactsData();
  
  const { role, isAdminOrSuperAdmin } = useAuth();
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("active");

  // Message de déboggage
  console.log("État actuel de la page contacts:", { 
    contactsCount: contacts.length, 
    filteredCount: filteredContacts.length, 
    loading, 
    error,
    role,
    isAdmin: isAdminOrSuperAdmin,
    includeTrash,
    activeTab
  });

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <Alert variant="destructive">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => fetchContacts(includeTrash)} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  const handleContactsChange = () => {
    fetchContacts(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => fetchContacts(true)} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button onClick={() => setAddContactDialogOpen(true)} variant="default" size="sm">
            Ajouter un contact
          </Button>
        </div>
      </div>
      
      {isAdminOrSuperAdmin ? (
        // Vue admin avec onglets pour contacts actifs et archivés
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Contacts actifs</TabsTrigger>
            <TabsTrigger value="archived">Archives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <AdminContactsView 
              contacts={filteredContacts.filter(contact => contact.folder !== 'trash')}
              loading={loading}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearch={handleSearch}
              onStatusFilterChange={handleFilterByStatus}
              onImportComplete={() => fetchContacts(includeTrash)}
            />
            
            {contacts.filter(contact => contact.folder !== 'trash').length === 0 && !loading && (
              <Alert>
                <AlertTitle>Aucun contact actif trouvé</AlertTitle>
                <AlertDescription>
                  Aucun contact actif n'a été trouvé dans la base de données. 
                  Utilisez le bouton d'importation ou ajoutez des contacts manuellement.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="archived">
            <ArchivedContactsTable 
              contacts={contacts}
              loading={loading}
              onContactsChange={handleContactsChange}
            />
          </TabsContent>
        </Tabs>
      ) : role === UserRole.ACCOUNT_MANAGER ? (
        // Vue account manager avec accès limité
        <AccountManagerContactsView 
          contacts={filteredContacts.filter(contact => contact.folder !== 'trash')}
          loading={loading}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearch={handleSearch}
          onStatusFilterChange={handleFilterByStatus}
        />
      ) : (
        // Vue freelancer avec accès limité
        <FreelancerContactsList 
          contacts={contacts.filter(contact => contact.folder !== 'trash')}
          loading={loading}
        />
      )}

      {contacts.filter(contact => contact.folder !== 'trash' && activeTab === 'active').length === 0 && 
        !loading && activeTab === 'active' && (
        <Alert>
          <AlertTitle>Aucun contact trouvé</AlertTitle>
          <AlertDescription>
            Aucun contact actif n'a été trouvé dans la base de données. 
            Utilisez le bouton d'importation ou ajoutez des contacts manuellement.
          </AlertDescription>
        </Alert>
      )}

      {/* Dialogue pour ajouter un contact */}
      <AddContactDialog 
        open={addContactDialogOpen} 
        onOpenChange={setAddContactDialogOpen} 
        onContactAdded={() => {
          fetchContacts(includeTrash);
          setAddContactDialogOpen(false);
        }} 
      />
    </div>
  );
};

export default ContactsPage;
