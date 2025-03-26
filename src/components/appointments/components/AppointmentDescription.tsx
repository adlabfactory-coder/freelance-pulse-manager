
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentDescriptionProps {
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AppointmentDescription: React.FC<AppointmentDescriptionProps> = ({
  description,
  onDescriptionChange
}) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={description}
        onChange={onDescriptionChange}
        placeholder="Détails du rendez-vous..."
        className="resize-none h-20"
      />
    </div>
  );
};

export default AppointmentDescription;
