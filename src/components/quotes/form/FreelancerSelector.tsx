
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types";

interface FreelancerSelectorProps {
  freelancerId?: string;
  freelancers: User[];
  onSelect: (freelancerId: string) => void;
  disabled?: boolean;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
}

const FreelancerSelector: React.FC<FreelancerSelectorProps> = ({
  freelancerId,
  freelancers,
  onSelect,
  disabled = false,
  onChange
}) => {
  // Si onChange est fourni, l'utiliser, sinon utiliser onSelect
  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value);
    } else {
      onSelect(value);
    }
  };

  return (
    <div>
      <Label htmlFor="freelancer">Commercial</Label>
      <Select
        value={freelancerId}
        onValueChange={handleChange}
        disabled={disabled}
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
