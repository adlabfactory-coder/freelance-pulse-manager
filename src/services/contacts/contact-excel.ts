
import * as XLSX from 'xlsx';
import { toast } from '@/components/ui/use-toast';
import { Contact } from './types';
import { supabase } from '@/lib/supabase';

/**
 * Service pour l'importation et l'exportation des contacts au format Excel
 */
export const contactExcelService = {
  /**
   * Exporte les contacts au format Excel
   */
  exportContactsToExcel: async (): Promise<boolean> => {
    try {
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (!contacts || contacts.length === 0) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Aucun contact à exporter",
        });
        return false;
      }
      
      const worksheet = XLSX.utils.json_to_sheet(contacts.map(contact => ({
        Nom: contact.name,
        Email: contact.email,
        Téléphone: contact.phone || '',
        Société: contact.company || '',
        Poste: contact.position || '',
        Adresse: contact.address || '',
        Statut: contact.status,
        Notes: contact.notes || '',
        'Date de création': new Date(contact.createdAt).toLocaleDateString()
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
      
      XLSX.writeFile(workbook, 'contacts.xlsx');
      
      toast({
        title: "Export réussi",
        description: `${contacts.length} contacts exportés avec succès.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Erreur lors de l'exportation des contacts:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur d'exportation",
        description: error.message || "Une erreur est survenue lors de l'exportation des contacts.",
      });
      
      return false;
    }
  },
  
  /**
   * Importe les contacts depuis un fichier Excel
   */
  importContactsFromExcel: async (file: File): Promise<boolean> => {
    try {
      const reader = new FileReader();
      
      const importPromise = new Promise<boolean>((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Le fichier Excel ne contient aucune donnée",
              });
              resolve(false);
              return;
            }
            
            // Mappage des champs Excel vers les champs de la base de données
            const contacts = jsonData.map((row: any) => ({
              name: row.Nom || row.name || '',
              email: row.Email || row.email || '',
              phone: row.Téléphone || row.Phone || row.phone || '',
              company: row.Société || row.Company || row.company || '',
              position: row.Poste || row.Position || row.position || '',
              address: row.Adresse || row.Address || row.address || '',
              status: row.Statut || row.Status || row.status || 'lead',
              notes: row.Notes || row.notes || '',
            }));
            
            // Validation des données
            const invalidContacts = contacts.filter(c => !c.name || !c.email);
            if (invalidContacts.length > 0) {
              toast({
                variant: "destructive",
                title: "Données invalides",
                description: `${invalidContacts.length} contacts n'ont pas de nom ou d'email`,
              });
              resolve(false);
              return;
            }
            
            // Insertion des contacts dans la base de données
            for (const contact of contacts) {
              const { error } = await supabase
                .from('contacts')
                .insert([contact]);
              
              if (error) {
                console.error("Erreur lors de l'insertion d'un contact:", error);
              }
            }
            
            toast({
              title: "Import réussi",
              description: `${contacts.length} contacts importés avec succès.`,
            });
            
            resolve(true);
          } catch (error: any) {
            console.error("Erreur lors du traitement du fichier Excel:", error);
            
            toast({
              variant: "destructive",
              title: "Erreur d'importation",
              description: error.message || "Une erreur est survenue lors du traitement du fichier Excel.",
            });
            
            reject(error);
          }
        };
        
        reader.onerror = (error) => {
          console.error("Erreur lors de la lecture du fichier:", error);
          
          toast({
            variant: "destructive",
            title: "Erreur de lecture",
            description: "Une erreur est survenue lors de la lecture du fichier Excel.",
          });
          
          reject(error);
        };
      });
      
      reader.readAsArrayBuffer(file);
      return await importPromise;
    } catch (error: any) {
      console.error("Erreur lors de l'importation des contacts:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur d'importation",
        description: error.message || "Une erreur est survenue lors de l'importation des contacts.",
      });
      
      return false;
    }
  }
};

// Export des fonctions individuelles pour rétrocompatibilité
export const exportContactsToExcel = contactExcelService.exportContactsToExcel;
export const importContactsFromExcel = contactExcelService.importContactsFromExcel;
