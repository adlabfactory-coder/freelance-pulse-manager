
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { AuditAction } from "@/services/audit-service";
import { UserRole, USER_ROLE_LABELS } from "@/types/roles";
import { Navigate } from "react-router-dom";
import { AlertCircle, Download, Filter, RefreshCw, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Données factices pour l'exemple
const mockAuditEntries = [
  {
    id: "1",
    userId: "1",
    userName: "Admin Démo",
    userRole: UserRole.ADMIN,
    action: AuditAction.LOGIN,
    resource: "auth",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: { ip: "192.168.1.1", browser: "Chrome" }
  },
  {
    id: "2",
    userId: "2",
    userName: "Freelance Démo",
    userRole: UserRole.FREELANCER,
    action: AuditAction.CREATE,
    resource: "contacts",
    resourceId: "123",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: { contactName: "Nouveau Contact", company: "Société XYZ" }
  },
  {
    id: "3",
    userId: "1",
    userName: "Admin Démo",
    userRole: UserRole.ADMIN,
    action: AuditAction.UPDATE,
    resource: "users",
    resourceId: "2",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    details: { field: "role", old: "client", new: "freelancer" }
  },
  {
    id: "4",
    userId: "3",
    userName: "Super Admin Démo",
    userRole: UserRole.SUPER_ADMIN,
    action: AuditAction.PERMISSIONS_CHANGE,
    resource: "user_permissions",
    resourceId: "1",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    details: { permission: "admin_access", granted: true }
  }
];

const AuditPage: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [auditEntries, setAuditEntries] = useState(mockAuditEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterResource, setFilterResource] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Rediriger si l'utilisateur n'est pas un super admin
  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleRefresh = async () => {
    setIsLoading(true);
    // Simule un chargement de données
    setTimeout(() => {
      setAuditEntries(mockAuditEntries);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleExport = () => {
    // Implémentation fictive pour l'exportation
    alert("Export des données d'audit en CSV");
  };
  
  const handleFilter = () => {
    setIsLoading(true);
    // Simule un filtrage de données
    setTimeout(() => {
      // Ici nous utiliserions les critères de filtre pour obtenir les données filtrées
      setAuditEntries(mockAuditEntries);
      setIsLoading(false);
    }, 800);
  };
  
  const getActionLabel = (action: string): string => {
    const actionMap: Record<string, string> = {
      [AuditAction.CREATE]: 'Création',
      [AuditAction.UPDATE]: 'Modification',
      [AuditAction.DELETE]: 'Suppression',
      [AuditAction.LOGIN]: 'Connexion',
      [AuditAction.LOGOUT]: 'Déconnexion',
      [AuditAction.PERMISSIONS_CHANGE]: 'Modification des permissions',
      [AuditAction.SETTINGS_CHANGE]: 'Modification des paramètres',
      [AuditAction.OTHER]: 'Autre'
    };
    return actionMap[action] || action;
  };
  
  const getActionColor = (action: string): string => {
    const colorMap: Record<string, string> = {
      [AuditAction.CREATE]: 'bg-green-100 text-green-800',
      [AuditAction.UPDATE]: 'bg-blue-100 text-blue-800',
      [AuditAction.DELETE]: 'bg-red-100 text-red-800',
      [AuditAction.LOGIN]: 'bg-purple-100 text-purple-800',
      [AuditAction.LOGOUT]: 'bg-purple-100 text-purple-800',
      [AuditAction.PERMISSIONS_CHANGE]: 'bg-yellow-100 text-yellow-800',
      [AuditAction.SETTINGS_CHANGE]: 'bg-orange-100 text-orange-800',
      [AuditAction.OTHER]: 'bg-gray-100 text-gray-800'
    };
    return colorMap[action] || 'bg-gray-100 text-gray-800';
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Journal d'Audit</h1>
          <p className="text-muted-foreground">
            Historique des activités et actions des utilisateurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Actualiser
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Toutes les Actions</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="data">Modification de Données</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
        </TabsList>
        
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Affinez les résultats du journal d'audit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Action</label>
                <Select 
                  value={filterAction} 
                  onValueChange={setFilterAction}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les actions</SelectItem>
                    <SelectItem value={AuditAction.CREATE}>Création</SelectItem>
                    <SelectItem value={AuditAction.UPDATE}>Modification</SelectItem>
                    <SelectItem value={AuditAction.DELETE}>Suppression</SelectItem>
                    <SelectItem value={AuditAction.LOGIN}>Connexion</SelectItem>
                    <SelectItem value={AuditAction.PERMISSIONS_CHANGE}>Permissions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Ressource</label>
                <Select 
                  value={filterResource} 
                  onValueChange={setFilterResource}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les ressources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les ressources</SelectItem>
                    <SelectItem value="users">Utilisateurs</SelectItem>
                    <SelectItem value="contacts">Contacts</SelectItem>
                    <SelectItem value="quotes">Devis</SelectItem>
                    <SelectItem value="auth">Authentification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Utilisateur</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleFilter} className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">Date de début</label>
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date de fin</label>
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {auditEntries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Ressource</TableHead>
                      <TableHead>Détails</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {formatDate(entry.timestamp)}
                        </TableCell>
                        <TableCell>{entry.userName}</TableCell>
                        <TableCell>
                          {USER_ROLE_LABELS[entry.userRole as UserRole] || entry.userRole}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(entry.action)}`}>
                            {getActionLabel(entry.action)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {entry.resource}
                          {entry.resourceId && <span className="text-muted-foreground ml-1">#{entry.resourceId}</span>}
                        </TableCell>
                        <TableCell>
                          <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-w-xs">
                            {JSON.stringify(entry.details, null, 2)}
                          </pre>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Aucune donnée</AlertTitle>
                  <AlertDescription>
                    Aucune entrée d'audit ne correspond aux critères sélectionnés.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Les autres onglets utiliseraient des filtres prédéfinis */}
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Filtres appliqués</AlertTitle>
                <AlertDescription>
                  Affichage des événements de sécurité uniquement (connexion, permissions, etc.)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Filtres appliqués</AlertTitle>
                <AlertDescription>
                  Affichage des modifications de données uniquement (création, modification, suppression)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Filtres appliqués</AlertTitle>
                <AlertDescription>
                  Affichage des événements système uniquement (configurations, paramètres)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditPage;
