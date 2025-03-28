
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

const AuditSettings: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  
  // Dans une vraie application, vous récupéreriez les données d'audit à partir de votre API
  const mockAuditLogs = [
    { id: 1, user: "admin@example.com", action: "Utilisateur créé", entityType: "user", entityId: "123", timestamp: new Date().toISOString() },
    { id: 2, user: "admin@example.com", action: "Devis modifié", entityType: "quote", entityId: "456", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, user: "freelance@example.com", action: "Rendez-vous créé", entityType: "appointment", entityId: "789", timestamp: new Date(Date.now() - 172800000).toISOString() },
  ];

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Accès restreint</CardTitle>
          </div>
          <CardDescription>
            Seuls les super administrateurs peuvent accéder à l'audit du système.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit du système</CardTitle>
        <CardDescription>
          Journal des activités et des modifications importantes dans le système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Journal d'audit des dernières activités</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Type d'entité</TableHead>
              <TableHead>ID Entité</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.entityType}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{log.entityId}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AuditSettings;
