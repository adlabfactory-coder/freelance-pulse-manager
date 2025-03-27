
import { supabase } from '@/lib/supabase-client';
import { Contact, ImportResult } from './types';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { contactCreateUpdateService } from './contact-create-update';

export const contactExcelService = {
  async exportContactsToExcel(): Promise<Blob | null> {
    try {
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null);

      if (error) {
        throw error;
      }

      if (!contacts || contacts.length === 0) {
        toast.info("Aucun contact", { 
          description: "Il n'y a aucun contact à exporter." 
        });
        return null;
      }

      // Préparer les données pour l'export Excel
      const exportData = contacts.map(contact => ({
        Nom: contact.name,
        Email: contact.email,
        Téléphone: contact.phone || '',
        Entreprise: contact.company || '',
        Position: contact.position || '',
        Adresse: contact.address || '',
        Notes: contact.notes || '',
        Statut: contact.status,
        'Date de création': new Date(contact.createdAt).toLocaleDateString()
      }));

      // Créer le workbook et la worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

      // Générer le blob
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      toast.success("Export réussi", { 
        description: `${contacts.length} contacts exportés avec succès` 
      });
      
      return blob;
    } catch (error: any) {
      console.error("Erreur lors de l'export des contacts:", error);
      
      toast.error("Erreur d'export", {
        description: `Impossible d'exporter les contacts: ${error.message}`
      });
      
      return null;
    }
  },

  async importContactsFromExcel(file: File): Promise<{success: boolean, message?: string}> {
    try {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Prendre la première feuille
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convertir en JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
              toast.error("Fichier vide", {
                description: "Le fichier importé ne contient aucune donnée."
              });
              resolve({ success: false, message: "Le fichier est vide" });
              return;
            }
            
            let successCount = 0;
            let errorCount = 0;
            
            // Traiter chaque ligne de données
            for (const row of jsonData) {
              const contact = mapExcelRowToContact(row);
              
              if (contact.name && contact.email) {
                try {
                  await contactCreateUpdateService.createContact(contact);
                  successCount++;
                } catch (err) {
                  console.error("Erreur lors de l'ajout du contact:", err);
                  errorCount++;
                }
              } else {
                console.warn("Contact ignoré - nom ou email manquant:", row);
                errorCount++;
              }
            }
            
            const message = `Import terminé: ${successCount} contacts ajoutés, ${errorCount} erreurs`;
            
            if (successCount > 0) {
              toast.success("Import réussi", { description: message });
              resolve({ success: true, message });
            } else {
              toast.error("Import échoué", { description: message });
              resolve({ success: false, message });
            }
          } catch (error) {
            console.error("Erreur lors du traitement du fichier Excel:", error);
            toast.error("Erreur d'import", { 
              description: "Impossible de traiter le fichier Excel." 
            });
            reject(error);
          }
        };
        
        reader.onerror = (error) => {
          toast.error("Erreur de lecture", { 
            description: "Impossible de lire le fichier." 
          });
          reject(error);
        };
        
        reader.readAsArrayBuffer(file);
      });
    } catch (error: any) {
      console.error("Erreur lors de l'import des contacts:", error);
      toast.error("Erreur d'import", {
        description: `Impossible d'importer les contacts: ${error.message}`
      });
      return { success: false, message: error.message };
    }
  }
};

// Fonction helper pour mapper les données Excel à un contact
function mapExcelRowToContact(row: any): any {
  return {
    name: row.Nom || row.name || row.NAME || '',
    email: row.Email || row.email || row.EMAIL || '',
    phone: row.Téléphone || row.Phone || row.phone || row.PHONE || '',
    company: row.Entreprise || row.Company || row.company || row.COMPANY || '',
    position: row.Position || row.position || row.POSITION || '',
    address: row.Adresse || row.Address || row.address || row.ADDRESS || '',
    notes: row.Notes || row.notes || row.NOTES || '',
    status: row.Statut || row.status || row.STATUS || 'lead',
  };
}
