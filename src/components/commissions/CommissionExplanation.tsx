
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, AlertCircle, MessageCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CommissionExplanation: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Principe de Commissionnement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <p>
            Les commissions sont calculées sur la base du nombre de contrats validés par mois. 
            Chaque contrat validé donne droit à un montant fixe qui dépend du palier auquel vous 
            vous situez dans le mois.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3">
              <h4 className="font-semibold mb-2">Calcul des commissions</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Le nombre total de contrats validés dans le mois détermine votre palier</li>
                <li>Un montant fixe est attribué par contrat en fonction de ce palier</li>
                <li>Votre commission est calculée en multipliant ce montant par le nombre de contrats</li>
                <li>Les commissions sont générées automatiquement en fin de mois</li>
              </ol>
            </div>
            
            <div className="border rounded-md p-3">
              <h4 className="font-semibold mb-2">Processus de paiement</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Les commissions sont initialement en statut "En attente"</li>
                <li>Vous pouvez demander le versement d'une commission via le bouton dédié</li>
                <li>Un administrateur doit approuver et valider le paiement</li>
                <li>Une fois validé, le statut passe à "Payé" avec la date de versement</li>
              </ol>
            </div>
          </div>
          
          <Alert className="bg-blue-50 border-blue-100 mt-4">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Pour toute question concernant vos commissions, veuillez contacter l'administrateur en utilisant le bouton WhatsApp en haut à droite de l'écran.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionExplanation;
