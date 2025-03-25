
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { ContactInsert, ContactUpdate, ContactFormInput } from './types';
import { ContactStatus } from '@/types/database/enums';
import * as XLSX from 'xlsx';
import { contactCrudService } from './contact-crud';

export const contactExcelService = {
  async exportContactsToExcel() {
    try {
      const contacts = await contactCrudService.getContacts();
      
      if (contacts.length === 0) {
        toast.error("Erreur", {
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
      
      toast.success("Export réussi", {
        description: "Les contacts ont été exportés avec succès",
      });
      
      return blob;
    } catch (error) {
      console.error('Erreur lors de l\'export des contacts:', error);
      toast.error("Erreur", {
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
              toast.error("Erreur", {
                description: "Aucune donnée trouvée dans le fichier",
              });
              resolve({success: false, count: 0});
              return;
            }
            
            // Process each row and create contacts
            let successCount = 0;
            
            for (const row of jsonData) {
              // Handle different possible column names from Excel
              const contactStatusValue = (row['Statut'] || row['Status'] || row['status'] || 'lead') as string;
              
              // Make sure we convert the string status to a valid ContactStatus
              const validStatus = 
                ['lead', 'prospect', 'negotiation', 'signed', 'lost'].includes(contactStatusValue) 
                  ? contactStatusValue as ContactStatus 
                  : 'lead' as ContactStatus;
              
              const contact: ContactFormInput = {
                name: row['Nom'] || row['Name'] || row['name'] || '',
                email: row['Email'] || row['email'] || '',
                phone: row['Téléphone'] || row['Phone'] || row['phone'] || undefined,
                company: row['Entreprise'] || row['Company'] || row['company'] || undefined,
                position: row['Position'] || row['position'] || undefined,
                address: row['Adresse'] || row['Address'] || row['address'] || undefined,
                notes: row['Notes'] || row['notes'] || undefined,
                status: validStatus,
              };
              
              // Validate required fields
              if (!contact.name || !contact.email) {
                continue;
              }
              
              // Create the contact
              const result = await contactCrudService.createContact(contact);
              if (result) {
                successCount++;
              }
            }
            
            if (successCount > 0) {
              toast.success("Import réussi", {
                description: `${successCount} contact(s) importé(s) avec succès`,
              });
              resolve({success: true, count: successCount});
            } else {
              toast.error("Avertissement", {
                description: "Aucun contact valide à importer",
              });
              resolve({success: false, count: 0});
            }
          } catch (error) {
            console.error('Erreur lors du traitement du fichier:', error);
            toast.error("Erreur", {
              description: "Impossible de traiter le fichier Excel",
            });
            resolve({success: false, count: 0});
          }
        };
        
        reader.onerror = () => {
          toast.error("Erreur", {
            description: "Impossible de lire le fichier",
          });
          resolve({success: false, count: 0});
        };
        
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Erreur lors de l\'import des contacts:', error);
      toast.error("Erreur", {
        description: "Impossible d'importer les contacts",
      });
      return {success: false, count: 0};
    }
  }
};
