
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types";
import { FormMessage } from "@/components/ui/form";

interface QuoteFreelancerSectionProps {
  selectedFreelancerId: string;
  freelancers: User[];
  onFreelancerChange: (freelancerId: string) => void;
  error?: string;
}

const QuoteFreelancerSection: React.FC<QuoteFreelancerSectionProps> = ({
  selectedFreelancerId,
  freelancers,
  onFreelancerChange,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="freelancer">Commercial*</Label>
      <Select
        value={selectedFreelancerId}
        onValueChange={onFreelancerChange}
      >
        <SelectTrigger id="freelancer" className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Sélectionner un commercial" />
        </SelectTrigger>
        <SelectContent>
          {freelancers.map(freelancer => (
            <SelectItem key={freelancer.id} value={freelancer.id}>
              {freelancer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <div className="text-sm font-medium text-red-500">{error}</div>
      )}
    </div>
  );
};

export default QuoteFreelancerSection;
