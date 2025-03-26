
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, WifiOff } from "lucide-react";

interface DatabaseStatusBadgeProps {
  status: "ok" | "partial" | "not_configured" | "connection_error" | "unknown" | "loading";
}

const DatabaseStatusBadge: React.FC<DatabaseStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "ok":
      return (
        <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Base de données configurée</Badge>
      );
    case "partial":
      return (
        <Badge variant="outline" className="border-orange-400 text-orange-500">Configuration partielle</Badge>
      );
    case "not_configured":
      return (
        <Badge variant="destructive">Non configurée</Badge>
      );
    case "connection_error":
      return (
        <Badge variant="destructive"><WifiOff className="h-3 w-3 mr-1" /> Connexion impossible</Badge>
      );
    case "unknown":
      return (
        <Badge variant="outline">Statut inconnu</Badge>
      );
    case "loading":
      return (
        <Badge variant="outline" className="animate-pulse">Chargement...</Badge>
      );
    default:
      return (
        <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" /> Statut indéfini</Badge>
      );
  }
};

export default DatabaseStatusBadge;
