
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useAppointmentDetailsForm } from "../hooks/useAppointmentDetailsForm";
import ContactSelector from "../components/ContactSelector";

interface AppointmentDetailsFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const {
    titleOption,
    setTitleOption,
    customTitle,
    setCustomTitle,
    appointmentDescription,
    setAppointmentDescription,
    appointmentTime,
    setAppointmentTime,
    appointmentDuration,
    setAppointmentDuration,
    contactId,
    setContactId,
    APPOINTMENT_TITLE_OPTIONS
  } = useAppointmentDetailsForm();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact">Contact*</Label>
        <ContactSelector
          value={contactId}
          onChange={setContactId}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="titleOption">Type de rendez-vous*</Label>
        <Select
          value={titleOption}
          onValueChange={setTitleOption}
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
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Entrez un titre personnalisé"
              required={titleOption === "autre"}
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={appointmentDescription}
          onChange={(e) => setAppointmentDescription(e.target.value)}
          placeholder="Détails du rendez-vous..."
          className="resize-none h-20"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="time">Heure *</Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="time"
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Durée (minutes) *</Label>
          <Select 
            defaultValue={appointmentDuration}
            onValueChange={setAppointmentDuration}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="90">1h30</SelectItem>
              <SelectItem value="120">2 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Planification..." : "Planifier le rendez-vous"}
      </Button>
    </form>
  );
};

export default AppointmentDetailsForm;
