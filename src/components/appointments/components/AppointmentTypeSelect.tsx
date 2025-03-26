
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APPOINTMENT_TITLE_OPTIONS, AppointmentTitleOption } from "../hooks/useAppointmentForm";

interface AppointmentTypeSelectProps {
  titleOption: string;
  onTitleOptionChange: (value: string) => void;
  customTitle: string;
  onCustomTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppointmentTypeSelect: React.FC<AppointmentTypeSelectProps> = ({
  titleOption,
  onTitleOptionChange,
  customTitle,
  onCustomTitleChange
}) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <Label htmlFor="titleOption">Type de rendez-vous*</Label>
      <Select
        value={titleOption}
        onValueChange={onTitleOptionChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un type de rendez-vous" />
        </SelectTrigger>
        <SelectContent>
          {APPOINTMENT_TITLE_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {titleOption === "autre" && (
        <div className="mt-2">
          <Label htmlFor="customTitle">Titre personnalisé*</Label>
          <Input
            id="customTitle"
            value={customTitle}
            onChange={onCustomTitleChange}
            placeholder="Entrez un titre personnalisé"
            required={titleOption === "autre"}
          />
        </div>
      )}
    </div>
  );
};

export default AppointmentTypeSelect;
