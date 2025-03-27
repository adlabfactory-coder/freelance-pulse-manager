
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ContactsLoadingState: React.FC = () => {
  return (
    <div className="grid gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-5 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactsLoadingState;
