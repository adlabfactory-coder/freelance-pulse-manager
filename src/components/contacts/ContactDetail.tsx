import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Mail, Phone, Building, MapPin, User, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Contact, ContactStatus } from "@/types";
import { contactService } from "@/services/contact-service";
import ContactStatusSelector from "./ContactStatusSelector";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactDetailProps {
  contactId: string;
  onUpdate?: () => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contactId, onUpdate }) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Contact>>({});
  
  const { plans, isLoading: plansLoading } = useSubscriptionPlans();

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      const data = await contactService.getContactById(contactId);
      if (data) {
        setContact(data);
        setFormData(data);
      }
      setLoading(false);
    };
    
    fetchContact();
  }, [contactId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (newStatus: ContactStatus) => {
    if (contact) {
      setContact({ ...contact, status: newStatus });
      if (onUpdate) onUpdate();
    }
  };

  const handleSubscriptionPlanChange = async (planId: string) => {
    if (contact) {
      const result = await contactService.linkSubscriptionPlan(contact.id, planId);
      if (result) {
        setContact({ ...contact, subscriptionPlanId: planId });
        if (onUpdate) onUpdate();
      }
    }
  };

  const handleSave = async () => {
    if (contact && formData) {
      const result = await contactService.updateContact(contact.id, formData as any);
      if (result) {
        setContact({ ...contact, ...formData });
        setEditing(false);
        if (onUpdate) onUpdate();
      }
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <p>Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contact) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <p>Contact non trouvé</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedPlan = plans.find(p => p.id === contact.subscriptionPlanId);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{contact.name}</CardTitle>
            <CardDescription>{contact.position} {contact.company ? `chez ${contact.company}` : ""}</CardDescription>
          </div>
          <ContactStatusSelector 
            contactId={contact.id} 
            value={contact.status as ContactStatus}
            onChange={handleStatusChange} 
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
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
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.company}</span>
                </div>
              )}
              {contact.position && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.position}</span>
                </div>
              )}
              {contact.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Ajouté le {new Date(contact.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {contact.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Notes</h3>
                <p className="text-sm text-muted-foreground">{contact.notes}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Plan d'abonnement</h3>
          {plansLoading ? (
            <p>Chargement des plans...</p>
          ) : (
            <Select
              value={contact.subscriptionPlanId}
              onValueChange={handleSubscriptionPlanChange}
            >
              <SelectTrigger className="w-full md:w-72">
                <SelectValue placeholder="Sélectionner un plan d'abonnement" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - {plan.price}€ / {plan.interval}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedPlan && (
            <div className="mt-2">
              <Badge className="bg-primary text-primary-foreground">
                {selectedPlan.name} - {selectedPlan.price}€
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {editing ? (
          <>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => setEditing(true)}>
            Modifier
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContactDetail;
