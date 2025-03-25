
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { ContactImport, ImportResult, ContactInsert } from './types';
import { contactCrudService } from './contact-crud';
import { ContactStatus } from '@/types/database/enums';

export const contactExcelService = {
  async importFromExcel(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonData = XLSX.utils.sheet_to_json<ContactImport>(worksheet);
          
          const result: ImportResult = {
            success: 0,
            errors: 0,
            total: jsonData.length,
            errorDetails: []
          };
          
          for (const row of jsonData) {
            if (!row.name || !row.email) {
              result.errors++;
              result.errorDetails?.push(`Ligne ignorée: nom ou email manquant (${row.name || 'N/A'}, ${row.email || 'N/A'})`);
              continue;
            }
            
            try {
              const contact: ContactInsert = {
                name: row.name,
                email: row.email,
                phone: row.phone,
                company: row.company,
                position: row.position,
                address: row.address,
                notes: row.notes,
                status: (row.status as ContactStatus) || 'lead'
              };
              
              await contactCrudService.addContact(contact);
              result.success++;
            } catch (error: any) {
              result.errors++;
              result.errorDetails?.push(`Erreur pour ${row.name}: ${error.message}`);
            }
          }
          
          resolve(result);
        } catch (error: any) {
          toast.error("Erreur lors de l'importation", {
            description: error.message,
          });
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        toast.error("Erreur lors de la lecture du fichier");
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  },
  
  exportToExcel(contacts: any[]): void {
    try {
      const worksheet = XLSX.utils.json_to_sheet(contacts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      
      XLSX.writeFile(workbook, "contacts_export.xlsx");
      
      toast.success("Exportation réussie", {
        description: `${contacts.length} contacts exportés`
      });
    } catch (error: any) {
      toast.error("Erreur lors de l'exportation", {
        description: error.message,
      });
    }
  },

  // Add these methods to make the ImportExport component work
  exportContactsToExcel: async function() {
    try {
      const contacts = await contactCrudService.getContacts();
      this.exportToExcel(contacts);
      
      // Return a blob for download in case it's needed
      const worksheet = XLSX.utils.json_to_sheet(contacts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } catch (error) {
      console.error("Erreur lors de l'exportation", error);
      toast.error("Erreur lors de l'exportation");
      return null;
    }
  },
  
  importContactsFromExcel: async function(file: File) {
    try {
      const result = await this.importFromExcel(file);
      
      if (result.success > 0) {
        toast.success("Import réussi", {
          description: `${result.success} contacts importés, ${result.errors} erreurs`
        });
      } else {
        toast.error("Import échoué", {
          description: `Aucun contact importé, ${result.errors} erreurs`
        });
      }
      
      return {
        success: result.success > 0,
        ...result
      };
    } catch (error) {
      console.error("Erreur lors de l'importation", error);
      toast.error("Erreur lors de l'importation");
      return { success: false, total: 0, errors: 1, success: 0 };
    }
  }
};
