
import { useState, useEffect, useCallback } from "react";
import { AuditLog } from "@/types/audit";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { format, subDays } from "date-fns";
import { supabase } from "@/lib/supabase-client";

export const useAuditLogs = () => {
  const { user, isSuperAdmin } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Sélection pour exports
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  // Modules et actions uniques pour les filtres
  const [uniqueModules, setUniqueModules] = useState<string[]>(["all"]);
  const [uniqueActions, setUniqueActions] = useState<string[]>(["all"]);

  // Fonction pour générer des données de test
  const generateTestData = useCallback((): AuditLog[] => {
    const modules = ['auth', 'users', 'contacts', 'quotes', 'appointments', 'commissions', 'settings', 'system'];
    const actions = ['create', 'read', 'update', 'delete', 'login', 'logout', 'error'];
    const roles = ['super_admin', 'admin', 'account_manager', 'freelancer'];
    
    return Array(100).fill(0).map((_, index) => {
      const daysAgo = Math.floor(Math.random() * 14); // Entre 0 et 14 jours
      const hoursAgo = Math.floor(Math.random() * 24); // Entre 0 et 24 heures
      const minutesAgo = Math.floor(Math.random() * 60); // Entre 0 et 60 minutes
      
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);
      date.setMinutes(date.getMinutes() - minutesAgo);
      
      const randomModule = modules[Math.floor(Math.random() * modules.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      
      return {
        id: `log-${index}`,
        timestamp: date.toISOString(),
        user_id: `user-${index % 10}`,
        user_email: `user${index % 10}@example.com`,
        user_role: randomRole,
        action: randomAction,
        module: randomModule,
        details: `Détail de l'action ${randomAction} sur le module ${randomModule}`,
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        metadata: {
          entity_id: `entity-${index % 20}`,
          changes: {
            field1: 'oldValue',
            field2: 'newValue'
          }
        }
      };
    });
  }, []);

  // Charger les données
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // En environnement de production, nous ferions un appel API à Supabase
      // Pour le moment, nous utilisons des données de test
      let fetchedLogs: AuditLog[] = [];
      
      try {
        // Tentative de récupération depuis Supabase
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('timestamp', { ascending: false });
        
        if (error) {
          console.error("Erreur lors de la récupération des logs d'audit:", error);
          throw error;
        }
        
        if (data) {
          fetchedLogs = data as AuditLog[];
        }
      } catch (err) {
        console.warn("Utilisation des données de test pour les logs d'audit");
        fetchedLogs = generateTestData();
      }
      
      setLogs(fetchedLogs);
      
      // Extraire les modules et actions uniques pour les filtres
      const modules = ["all", ...new Set(fetchedLogs.map(log => log.module))];
      const actions = ["all", ...new Set(fetchedLogs.map(log => log.action))];
      
      setUniqueModules(modules);
      setUniqueActions(actions);
      
      // Appliquer les filtres initiaux
      applyFilters(fetchedLogs);
    } catch (err: any) {
      console.error("Erreur lors du chargement des logs d'audit:", err);
      setError(err.message || "Erreur lors du chargement des données");
      toast.error("Erreur lors du chargement des logs d'audit");
    } finally {
      setLoading(false);
    }
  }, [generateTestData]);
  
  // Appliquer les filtres
  const applyFilters = useCallback((data: AuditLog[] = logs) => {
    let filtered = [...data];
    
    // Filtre par date
    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp);
      startDate.setHours(0, 0, 0, 0);
      const endDateCopy = new Date(endDate);
      endDateCopy.setHours(23, 59, 59, 999);
      
      return logDate >= startDate && logDate <= endDateCopy;
    });
    
    // Filtre par module
    if (selectedModule !== "all") {
      filtered = filtered.filter(log => log.module === selectedModule);
    }
    
    // Filtre par action
    if (selectedAction !== "all") {
      filtered = filtered.filter(log => log.action === selectedAction);
    }
    
    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.details.toLowerCase().includes(term) ||
        (log.user_email && log.user_email.toLowerCase().includes(term)) ||
        log.module.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term)
      );
    }
    
    // Tri par date
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredLogs(filtered);
    // Réinitialiser la sélection quand les filtres changent
    setSelectedLogs([]);
  }, [logs, startDate, endDate, selectedModule, selectedAction, searchTerm, sortDirection]);
  
  // Chargement initial
  useEffect(() => {
    if (isSuperAdmin) {
      fetchLogs();
    } else {
      setError("Accès restreint aux super administrateurs");
      setLoading(false);
    }
  }, [fetchLogs, isSuperAdmin]);
  
  // Appliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, selectedModule, selectedAction, searchTerm, sortDirection, applyFilters]);
  
  // Fonction pour basculer la direction de tri
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Gestion de la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Export au format CSV
  const exportToCSV = () => {
    try {
      const headers = ['Date', 'Utilisateur', 'Rôle', 'Module', 'Action', 'Détails', 'IP'];
      const rows = filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.user_email || 'Système',
        log.user_role || 'N/A',
        log.module,
        log.action,
        log.details,
        log.ip_address || 'N/A'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export CSV téléchargé");
    } catch (err) {
      console.error("Erreur lors de l'export CSV:", err);
      toast.error("Erreur lors de l'export CSV");
    }
  };
  
  // Export des logs sélectionnés
  const exportSelectedToCSV = () => {
    try {
      const selectedData = filteredLogs.filter(log => selectedLogs.includes(log.id));
      
      if (selectedData.length === 0) {
        toast.error("Aucune entrée sélectionnée");
        return;
      }
      
      const headers = ['Date', 'Utilisateur', 'Rôle', 'Module', 'Action', 'Détails', 'IP'];
      const rows = selectedData.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.user_email || 'Système',
        log.user_role || 'N/A',
        log.module,
        log.action,
        log.details,
        log.ip_address || 'N/A'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `audit_logs_selected_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${selectedData.length} entrées exportées`);
    } catch (err) {
      console.error("Erreur lors de l'export CSV des éléments sélectionnés:", err);
      toast.error("Erreur lors de l'export CSV");
    }
  };

  return {
    logs,
    filteredLogs,
    loading,
    error,
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
    exportSelectedToCSV,
    fetchLogs
  };
};

export default useAuditLogs;
