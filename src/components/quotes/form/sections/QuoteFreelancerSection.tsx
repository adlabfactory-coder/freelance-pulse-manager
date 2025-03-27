
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types";

interface QuoteFreelancerSectionProps {
  selectedFreelancerId: string;
  freelancers: User[];
  onFreelancerChange: (freelancerId: string) => void;
}

const QuoteFreelancerSection: React.FC<QuoteFreelancerSectionProps> = ({
  selectedFreelancerId,
  freelancers,
  onFreelancerChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="freelancer">Commercial</Label>
      <Select
        value={selectedFreelancerId}
        onValueChange={onFreelancerChange}
      >
        <SelectTrigger id="freelancer">
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
    </div>
  );
};

export default QuoteFreelancerSection;
