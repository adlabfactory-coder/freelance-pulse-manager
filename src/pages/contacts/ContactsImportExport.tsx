
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp } from "lucide-react";
import { toast } from "sonner";
import { contactService } from "@/services/contacts";

interface ContactsImportExportProps {
  onImportComplete: () => void;
}

const ContactsImportExport: React.FC<ContactsImportExportProps> = ({ onImportComplete }) => {
  const [exporting, setExporting] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    if (exporting) return;
    
    setExporting(true);
    toast("Export de contacts", {
      description: "Préparation du fichier d'export..."
    });
    
    try {
      const blob = await contactService.exportContactsToExcel();
      
      if (blob) {
        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        
        link.href = url;
        link.setAttribute('download', `contacts_export_${date}.xlsx`);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'export"
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = () => {
    if (importing) return;
    
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Format invalide", {
        description: "Seuls les fichiers Excel (.xlsx, .xls) sont acceptés"
      });
      // Reset file input
      e.target.value = "";
      return;
    }
    
    setImporting(true);
    toast("Import de contacts", {
      description: "Traitement du fichier en cours..."
    });
    
    try {
      const result = await contactService.importContactsFromExcel(file);
      
      if (result.success) {
        // Refresh contacts list
        onImportComplete();
      }
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'import"
      });
    } finally {
      setImporting(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />
      <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
        <FileDown className="mr-2 h-4 w-4" /> {exporting ? "Exportation..." : "Exporter"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleImport} disabled={importing}>
        <FileUp className="mr-2 h-4 w-4" /> {importing ? "Importation..." : "Importer"}
      </Button>
    </div>
  );
};

export default ContactsImportExport;
