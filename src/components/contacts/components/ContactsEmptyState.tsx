
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ContactsEmptyState: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="text-center text-muted-foreground mb-4">
          Vous n'avez pas encore de contacts assignés.
        </p>
      </CardContent>
    </Card>
  );
};

export default ContactsEmptyState;
