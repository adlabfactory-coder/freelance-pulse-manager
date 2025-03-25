
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Contact } from "@/services/contacts/types";

interface ContactEditFormProps {
  formData: Partial<Contact>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactEditForm: React.FC<ContactEditFormProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input
            id="company"
            name="company"
            value={formData.company || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Poste</Label>
          <Input
            id="position"
            name="position"
            value={formData.position || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes || ""}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ContactEditForm;
