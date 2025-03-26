
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlan } from "@/types";
import { formatCurrency } from "@/utils/format";
import { Check } from "lucide-react";
import SubscriptionToQuoteDialog from "./SubscriptionToQuoteDialog";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  popular?: boolean;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  onSelectPlan,
  popular = false
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateQuote = () => {
    setDialogOpen(true);
  };

  const features = plan.features?.features || [];

  return (
    <>
      <Card className={`w-full ${popular ? 'border-primary' : ''}`}>
        <CardHeader>
          {popular && (
            <Badge className="w-fit mb-2">Populaire</Badge>
          )}
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-2">
            <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
            <span className="text-muted-foreground">/{plan.interval}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => onSelectPlan(plan)}
          >
            Sélectionner
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleCreateQuote}
          >
            Créer un devis
          </Button>
        </CardFooter>
      </Card>

      <SubscriptionToQuoteDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        plan={plan} 
      />
    </>
  );
};

export default SubscriptionPlanCard;
