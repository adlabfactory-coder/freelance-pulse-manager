import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Calendar,
  ClipboardList,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  User
} from "lucide-react";
import { UserRole } from "@/types";

const AuditPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getMockAuditLogs());
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredLogs = auditLogs
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

  const exportToCSV = () => {
    // Logique d'exportation CSV
    alert("Fonctionnalité d'exportation CSV à implémenter");
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500';
      case 'update':
        return 'bg-blue-500';
      case 'delete':
        return 'bg-red-500';
      case 'login':
        return 'bg-purple-500';
      case 'logout':
        return 'bg-gray-500';
      default:
        return 'bg-secondary';
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'users':
        return <User className="h-4 w-4" />;
      case 'contacts':
        return <ClipboardList className="h-4 w-4" />;
      case 'quotes':
        return <ClipboardList className="h-4 w-4" />;
      case 'auth':
        return <User className="h-4 w-4" />;
      default:
        return <MoreHorizontal className="h-4 w-4" />;
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getUniqueModules = () => {
    const modules = ['all', ...new Set(auditLogs.map(log => log.module))];
    return modules;
  };

  const getUniqueActions = () => {
    const actions = ['all', ...new Set(auditLogs.map(log => log.action))];
    return actions;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Journaux d'audit</h1>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrer les journaux d'audit par date, module ou action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date de début</label>
              <DatePicker 
                date={startDate} 
                onSelect={setStartDate} 
                className="w-full" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Date de fin</label>
              <DatePicker 
                date={endDate} 
                onSelect={setEndDate} 
                className="w-full" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Module</label>
              <Select
                value={selectedModule}
                onValueChange={setSelectedModule}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les modules" />
                </SelectTrigger>
                <SelectContent>
                  {getUniqueModules().map(module => (
                    <SelectItem key={module} value={module}>
                      {module === 'all' ? 'Tous les modules' : module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Action</label>
              <Select
                value={selectedAction}
                onValueChange={setSelectedAction}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les actions" />
                </SelectTrigger>
                <SelectContent>
                  {getUniqueActions().map(action => (
                    <SelectItem key={action} value={action}>
                      {action === 'all' ? 'Toutes les actions' : action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Résultats ({filteredLogs.length})</CardTitle>
            <Button variant="ghost" size="sm" onClick={toggleSortDirection}>
              {sortDirection === 'desc' ? (
                <ArrowDownWideNarrow className="h-4 w-4 mr-1" />
              ) : (
                <ArrowUpWideNarrow className="h-4 w-4 mr-1" />
              )}
              Date
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date & Heure</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="w-[300px]">Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucun journal d'audit ne correspond à vos critères de filtrage
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDateTime(log.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-7 w-7 mr-2">
                            <AvatarImage src={log.avatar} />
                            <AvatarFallback>{log.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{log.user}</div>
                            <div className="text-xs text-muted-foreground">{log.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getModuleIcon(log.module)}
                          <span className="ml-2">{log.module}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  avatar: string | null;
  module: string;
  action: string;
  details: string;
}

function getMockAuditLogs(): AuditLog[] {
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
}

export default AuditPage;
