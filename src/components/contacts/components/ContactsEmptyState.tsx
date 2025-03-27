
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, User } from "lucide-react";

const ContactsEmptyState: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <div className="rounded-full bg-muted p-3 mb-3">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Aucun contact</h3>
        <p className="text-center text-muted-foreground mb-4">
          Vous n'avez pas encore de contacts assignés.
        </p>
      </CardContent>
    </Card>
  );
};

export default ContactsEmptyState;
