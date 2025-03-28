
import { Quote } from "@/types/quote";
import { formatCurrency, formatDate } from "@/utils/format";
import { supabase } from "@/lib/supabase-client";

interface AgencyInfo {
  legal_name: string;
  registration_number: string;
  tax_id: string;
  capital: string;
  bank_account: string;
  bank_name: string;
}

/**
 * Récupère les informations de l'agence depuis la base de données
 */
const getAgencyInfo = async (): Promise<AgencyInfo | null> => {
  try {
    const { data, error } = await supabase
      .from("agency_info")
      .select("*")
      .maybeSingle();  // Utiliser maybeSingle au lieu de single pour éviter les erreurs
    
    if (error && error.code !== 'PGRST116') {
      console.error("Erreur lors de la récupération des informations de l'agence:", error);
      return null;
    }
    
    return data as AgencyInfo || {
      legal_name: "AdLab Factory",
      registration_number: "",
      tax_id: "",
      capital: "",
      bank_account: "",
      bank_name: ""
    };
  } catch (error) {
    console.error("Exception lors de la récupération des informations de l'agence:", error);
    return null;
  }
};

/**
 * Génère un PDF à partir d'un devis
 * Utilise l'API d'impression du navigateur pour créer un PDF
 */
export const generateQuotePDF = async (quote: Quote, contactName = "", freelancerName = ""): Promise<void> => {
  try {
    // Récupérer les informations de l'agence
    const agencyInfo = await getAgencyInfo();
    
    // Créer un élément de contenu temporaire pour le PDF
    const tempElement = document.createElement('div');
    tempElement.className = 'print-only';
    tempElement.style.padding = '40px';
    tempElement.style.fontFamily = 'Arial, sans-serif';
    
    // Créer la structure HTML du PDF
    const quoteRef = `DEV-${quote.id.substring(0, 8).toUpperCase()}`;
    
    tempElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; margin-bottom: 5px;">DEVIS ${quoteRef}</h1>
        <p>Date d'émission: ${formatDate(new Date())}</p>
        <p>Valide jusqu'au: ${formatDate(new Date(quote.validUntil))}</p>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3>Client:</h3>
          <p>${contactName}</p>
        </div>
        <div>
          <h3>Commercial:</h3>
          <p>${freelancerName}</p>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Description</th>
            <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Quantité</th>
            <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Prix unitaire (MAD)</th>
            <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Total (MAD)</th>
          </tr>
        </thead>
        <tbody>
          ${(quote.items || []).map(item => {
            const total = item.quantity * item.unitPrice;
            const discountAmount = total * ((item.discount || 0) / 100);
            const taxAmount = (total - discountAmount) * ((item.tax || 0) / 100);
            const itemTotal = total - discountAmount + taxAmount;
            
            return `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.description}</td>
                <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(item.unitPrice)}</td>
                <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(itemTotal)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: #f2f2f2;">
            <th colspan="3" style="text-align: right; padding: 10px; border: 1px solid #ddd;">Total (MAD):</th>
            <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">${formatCurrency(quote.totalAmount)}</th>
          </tr>
        </tfoot>
      </table>
      ${quote.notes ? `
        <div style="margin-top: 30px;">
          <h3>Notes:</h3>
          <p style="white-space: pre-line;">${quote.notes}</p>
        </div>
      ` : ''}
      ${agencyInfo ? `
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
          <p style="font-size: 12px; margin: 3px 0;">${agencyInfo.legal_name || 'AdLab Factory'}</p>
          ${agencyInfo.registration_number ? `<p style="font-size: 12px; margin: 3px 0;">RC: ${agencyInfo.registration_number}</p>` : ''}
          ${agencyInfo.tax_id ? `<p style="font-size: 12px; margin: 3px 0;">IF: ${agencyInfo.tax_id}</p>` : ''}
          ${agencyInfo.capital ? `<p style="font-size: 12px; margin: 3px 0;">Capital: ${agencyInfo.capital}</p>` : ''}
          ${agencyInfo.bank_name && agencyInfo.bank_account ? 
            `<p style="font-size: 12px; margin: 3px 0;">RIB: ${agencyInfo.bank_account} | ${agencyInfo.bank_name}</p>` : ''}
        </div>
      ` : ''}
    `;
    
    // Ajouter l'élément au corps de la page
    document.body.appendChild(tempElement);
    
    // Lancer l'impression
    window.print();
    
    // Supprimer l'élément après l'impression
    document.body.removeChild(tempElement);
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
  }
};

/**
 * Ajoute un style CSS pour l'impression
 */
export const addPrintStyles = (): void => {
  if (!document.getElementById('print-styles')) {
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-only, .print-only * {
          visibility: visible;
        }
        .print-only {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Ajouter les styles d'impression lors du chargement
if (typeof window !== 'undefined') {
  addPrintStyles();
}
