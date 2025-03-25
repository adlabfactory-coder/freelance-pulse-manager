import { supabase } from '@/lib/supabase-client';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/types/database';
import { ContactStatus } from '@/types';
import * as XLSX from 'xlsx';

// Define contact types using ContactsTable from database types
export type Contact = Database['public']['Tables']['contacts']['Row'];
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
export type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

export const contactService = {
  async getContacts() {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les contacts",
      });
      return [];
    }
  },
  
  async getContactById(id: string) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contact ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer le contact",
      });
      return null;
    }
  },
  
  async createContact(contact: ContactInsert) {
    try {
      const now = new Date().toISOString();
      const newContact = {
        ...contact,
        status: contact.status || 'lead', // Par défaut, le statut est "lead"
        createdAt: now,
        updatedAt: now,
      };
      
      const { data, error } = await supabase
        .from('contacts')
        .insert(newContact)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Contact créé",
        description: "Le contact a été créé avec succès",
      });
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du contact:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le contact",
      });
      return null;
    }
  },
  
  async updateContact(id: string, contact: ContactUpdate) {
    try {
      const updatedContact = {
        ...contact,
        updatedAt: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('contacts')
        .update(updatedContact)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Contact mis à jour",
        description: "Le contact a été mis à jour avec succès",
      });
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du contact ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le contact",
      });
      return null;
    }
  },
  
  async updateContactStatus(id: string, status: ContactStatus) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          status,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: `Le contact est maintenant en statut "${status}"`,
      });
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut du contact ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du contact",
      });
      return null;
    }
  },
  
  async linkSubscriptionPlan(contactId: string, subscriptionPlanId: string) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          subscription_plan_id: subscriptionPlanId,
          updatedAt: new Date().toISOString()
        })
        .eq('id', contactId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Plan d'abonnement lié",
        description: "Le plan d'abonnement a été associé au contact",
      });
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la liaison du plan d'abonnement au contact ${contactId}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de lier le plan d'abonnement",
      });
      return null;
    }
  },
  
  async deleteContact(id: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès",
      });
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du contact ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le contact",
      });
      return false;
    }
  },
  
  async exportContactsToExcel() {
    try {
      const contacts = await this.getContacts();
      
      if (contacts.length === 0) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Aucun contact à exporter",
        });
        return null;
      }
      
      // Transform contacts to a format suitable for Excel
      const exportData = contacts.map(contact => ({
        Nom: contact.name,
        Email: contact.email,
        Téléphone: contact.phone || '',
        Entreprise: contact.company || '',
        Position: contact.position || '',
        Adresse: contact.address || '',
        Notes: contact.notes || '',
        Statut: contact.status,
        'Date de création': new Date(contact.createdAt).toLocaleDateString(),
      }));
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths for better readability
      const colWidths = [
        { wch: 20 }, // Nom
        { wch: 25 }, // Email
        { wch: 15 }, // Téléphone
        { wch: 20 }, // Entreprise
        { wch: 15 }, // Position
        { wch: 25 }, // Adresse
        { wch: 30 }, // Notes
        { wch: 15 }, // Statut
        { wch: 15 }, // Date de création
      ];
      
      worksheet['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create Blob and download
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      toast({
        title: "Export réussi",
        description: "Les contacts ont été exportés avec succès",
      });
      
      return blob;
    } catch (error) {
      console.error('Erreur lors de l\'export des contacts:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'exporter les contacts",
      });
      return null;
    }
  },
  
  async importContactsFromExcel(file: File) {
    try {
      // Read the Excel file
      const reader = new FileReader();
      
      return new Promise<{success: boolean, count: number}>((resolve) => {
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get the first worksheet
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Aucune donnée trouvée dans le fichier",
              });
              resolve({success: false, count: 0});
              return;
            }
            
            // Process each row and create contacts
            let successCount = 0;
            
            for (const row of jsonData) {
              // Handle different possible column names from Excel
              const contact: ContactInsert = {
                name: row['Nom'] || row['Name'] || row['name'] || '',
                email: row['Email'] || row['email'] || '',
                phone: row['Téléphone'] || row['Phone'] || row['phone'] || null,
                company: row['Entreprise'] || row['Company'] || row['company'] || null,
                position: row['Position'] || row['position'] || null,
                address: row['Adresse'] || row['Address'] || row['address'] || null,
                notes: row['Notes'] || row['notes'] || null,
                status: (row['Statut'] || row['Status'] || row['status'] || 'lead') as ContactStatus,
              };
              
              // Validate required fields
              if (!contact.name || !contact.email) {
                continue;
              }
              
              // Create the contact
              const result = await this.createContact(contact);
              if (result) {
                successCount++;
              }
            }
            
            if (successCount > 0) {
              toast({
                title: "Import réussi",
                description: `${successCount} contact(s) importé(s) avec succès`,
              });
              resolve({success: true, count: successCount});
            } else {
              toast({
                variant: "destructive",
                title: "Avertissement",
                description: "Aucun contact valide à importer",
              });
              resolve({success: false, count: 0});
            }
          } catch (error) {
            console.error('Erreur lors du traitement du fichier:', error);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de traiter le fichier Excel",
            });
            resolve({success: false, count: 0});
          }
        };
        
        reader.onerror = () => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de lire le fichier",
          });
          resolve({success: false, count: 0});
        };
        
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Erreur lors de l\'import des contacts:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'importer les contacts",
      });
      return {success: false, count: 0};
    }
  }
};
