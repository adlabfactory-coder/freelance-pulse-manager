
import * as XLSX from 'xlsx';
import { contactService } from './contact-crud';
import { Tables } from '@/types/database';

export const contactExcelService = {
  exportContactsToExcel: async (): Promise<Blob> => {
    try {
      // Obtenir tous les contacts
      const contacts = await contactService.getContacts();
      
      // Créer un classeur Excel
      const worksheet = XLSX.utils.json_to_sheet(contacts);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      
      // Générer le binaire Excel
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      return blob;
    } catch (error) {
      console.error("Erreur lors de l'exportation des contacts vers Excel", error);
      throw error;
    }
  },
  
  importContactsFromExcel: async (file: File): Promise<{ success: boolean; count: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Tables['contacts'][];
          
          let importCount = 0;
          
          // Parcourir les contacts et les importer
          for (const contact of jsonData) {
            try {
              await contactService.createContact(contact);
              importCount++;
            } catch (importError) {
              console.error("Erreur lors de l'importation d'un contact", importError);
            }
          }
          
          resolve({ success: true, count: importCount });
        } catch (error) {
          console.error("Erreur lors de la lecture du fichier Excel", error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
};
