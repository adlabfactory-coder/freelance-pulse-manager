
import { useState, useCallback, useMemo } from "react";
import { AuditLog } from "@/types/audit";
import { useToast } from "@/hooks/use-toast";

// Mock data pour les tests
const getMockAuditLogs = (): AuditLog[] => {
  return [
    {
      id: "1",
      timestamp: "2023-05-15T09:30:00Z",
      user: "Admin Démo",
      role: "Administrateur",
      avatar: null,
      module: "users",
      action: "create",
      details: "Création de l'utilisateur John Doe (john.doe@example.com)"
    },
    {
      id: "2",
      timestamp: "2023-05-15T10:15:00Z",
      user: "Commercial Démo",
      role: "Freelance",
      avatar: null,
      module: "contacts",
      action: "update",
      details: "Mise à jour des informations du contact #123: Entreprise XYZ"
    },
    {
      id: "3",
      timestamp: "2023-05-15T11:00:00Z",
      user: "Admin Démo",
      role: "Administrateur",
      avatar: null,
      module: "auth",
      action: "login",
      details: "Connexion réussie à l'application"
    },
    {
      id: "4",
      timestamp: "2023-05-16T09:00:00Z",
      user: "Super Admin Démo",
      role: "Super Administrateur",
      avatar: null,
      module: "quotes",
      action: "delete",
      details: "Suppression du devis #456 pour le client Société ABC"
    },
    {
      id: "5",
      timestamp: "2023-05-16T14:30:00Z",
      user: "Commercial Démo",
      role: "Freelance",
      avatar: null,
      module: "auth",
      action: "logout",
      details: "Déconnexion de l'application"
    },
    {
      id: "6",
      timestamp: "2023-05-17T10:00:00Z",
      user: "Admin Démo",
      role: "Administrateur",
      avatar: null,
      module: "users",
      action: "update",
      details: "Modification des droits d'accès pour l'utilisateur Jane Smith"
    },
    {
      id: "7",
      timestamp: "2023-05-17T11:45:00Z",
      user: "Super Admin Démo",
      role: "Super Administrateur",
      avatar: null,
      module: "contacts",
      action: "create",
      details: "Ajout d'un nouveau contact: Entreprise DEF"
    },
    {
      id: "8",
      timestamp: "2023-05-18T09:15:00Z",
      user: "Chargé de Compte Démo",
      role: "Chargé de compte",
      avatar: null,
      module: "quotes",
      action: "update",
      details: "Mise à jour du statut du devis #789 de 'Brouillon' à 'Envoyé'"
    },
    {
      id: "9",
      timestamp: "2023-05-18T16:00:00Z",
      user: "Admin Démo",
      role: "Administrateur",
      avatar: null,
      module: "auth",
      action: "login",
      details: "Connexion réussie depuis une nouvelle adresse IP"
    },
    {
      id: "10",
      timestamp: new Date().toISOString(),
      user: "Commercial Démo",
      role: "Freelance",
      avatar: null,
      module: "contacts",
      action: "delete",
      details: "Suppression du contact #321: Contact inactif"
    }
  ];
};

export const useAuditLogs = () => {
  const [auditLogs] = useState<AuditLog[]>(getMockAuditLogs());
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const filteredLogs = useMemo(() => {
    return auditLogs
      .filter(log => {
        const dateInRange = new Date(log.timestamp) >= startDate && new Date(log.timestamp) <= endDate;
        const moduleMatch = selectedModule === 'all' || log.module === selectedModule;
        const actionMatch = selectedAction === 'all' || log.action === selectedAction;
        const searchMatch = searchTerm === '' || 
          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase());
        
        return dateInRange && moduleMatch && actionMatch && searchMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [auditLogs, startDate, endDate, selectedModule, selectedAction, searchTerm, sortDirection]);

  const exportToCSV = useCallback(() => {
    // Logique d'exportation CSV pour tous les journaux
    toast({
      title: "Export de journaux",
      description: `${filteredLogs.length} journaux exportés avec succès.`,
    });
  }, [filteredLogs, toast]);

  const exportSelectedToCSV = useCallback(() => {
    // Logique d'exportation CSV pour les journaux sélectionnés
    toast({
      title: "Export de journaux",
      description: `${selectedLogs.length} journaux sélectionnés exportés avec succès.`,
    });
  }, [selectedLogs, toast]);

  const uniqueModules = useMemo(() => {
    const modules = ['all', ...new Set(auditLogs.map(log => log.module))];
    return modules;
  }, [auditLogs]);

  const uniqueActions = useMemo(() => {
    const actions = ['all', ...new Set(auditLogs.map(log => log.action))];
    return actions;
  }, [auditLogs]);

  return {
    filteredLogs,
    startDate,
    endDate,
    selectedModule,
    selectedAction,
    searchTerm,
    sortDirection,
    selectedLogs,
    uniqueModules,
    uniqueActions,
    setStartDate,
    setEndDate,
    setSelectedModule,
    setSelectedAction,
    setSelectedLogs,
    handleSearch,
    toggleSortDirection,
    exportToCSV,
    exportSelectedToCSV
  };
};
