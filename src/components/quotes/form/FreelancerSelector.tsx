
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types";

interface FreelancerSelectorProps {
  selectedFreelancerId?: string;
  freelancers: User[];
  onSelect: (freelancerId: string) => void;
}

const FreelancerSelector: React.FC<FreelancerSelectorProps> = ({
  selectedFreelancerId,
  freelancers,
  onSelect
}) => {
  return (
    <div>
      <Label htmlFor="freelancer">Commercial</Label>
      <Select
        value={selectedFreelancerId}
        onValueChange={onSelect}
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

export default FreelancerSelector;
