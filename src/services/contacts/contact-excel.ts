
import * as XLSX from 'xlsx';
import { contactService } from './index';
import { Contact } from './types';

/**
 * Exporte les contacts au format Excel
 * @returns Blob du fichier Excel généré
 */
export const exportContactsToExcel = async (): Promise<Blob> => {
  try {
    // Récupérer tous les contacts
    const contacts = await contactService.getAllContacts();
    
    if (!contacts || contacts.length === 0) {
      throw new Error("Aucun contact à exporter");
    }
    
    // Préparer les données pour Excel
    const data = contacts.map(contact => ({
      Nom: contact.name,
      Email: contact.email,
      Téléphone: contact.phone || '',
      Entreprise: contact.company || '',
      Poste: contact.position || '',
      Adresse: contact.address || '',
      Statut: contact.status,
      Notes: contact.notes || '',
      "Date de création": new Date(contact.createdAt).toLocaleDateString()
    }));
    
    // Créer le workbook Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    
    // Générer le fichier Excel et retourner le Blob
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  } catch (error) {
    console.error("Erreur lors de l'export des contacts:", error);
    throw error;
  }
};

/**
 * Importe des contacts depuis un fichier Excel
 * @param file Fichier Excel à importer
 * @returns {Promise<{success: boolean, count: number}>} Résultat de l'importation
 */
export const importContactsFromExcel = async (file: File): Promise<{success: boolean, count: number}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        if (!e.target || !e.target.result) {
          reject(new Error("Erreur lors de la lecture du fichier"));
          return;
        }
        
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Récupérer la première feuille
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir la feuille en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          reject(new Error("Aucune donnée trouvée dans le fichier"));
          return;
        }
        
        // Mapper les données vers le format de contact attendu
        const contacts: Partial<Contact>[] = jsonData.map((row: any) => {
          return {
            name: row.Nom || row.nom || row.Name || row.name || '',
            email: row.Email || row.email || '',
            phone: row.Téléphone || row.téléphone || row.telephone || row.Phone || row.phone || '',
            company: row.Entreprise || row.entreprise || row.Company || row.company || '',
            position: row.Poste || row.poste || row.Position || row.position || '',
            address: row.Adresse || row.adresse || row.Address || row.address || '',
            status: row.Statut || row.statut || row.Status || row.status || 'lead',
            notes: row.Notes || row.notes || ''
          };
        });
        
        // Filtrer les contacts sans nom ou email
        const validContacts = contacts.filter(c => c.name && c.email);
        
        if (validContacts.length === 0) {
          reject(new Error("Aucun contact valide trouvé dans le fichier"));
          return;
        }
        
        // Créer les contacts en batch
        let successCount = 0;
        for (const contact of validContacts) {
          try {
            await contactService.createContact(contact as Contact);
            successCount++;
          } catch (error) {
            console.warn("Erreur lors de l'import d'un contact:", error);
            // Continue avec le prochain contact
          }
        }
        
        resolve({
          success: true,
          count: successCount
        });
      } catch (error) {
        console.error("Erreur lors du traitement du fichier Excel:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};
