
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Contact } from "@/services/contacts/types";
import { ContactStatus } from "@/types/database/enums";
import { contactService } from "@/services/contacts";
import ContactStatusSelector from "./ContactStatusSelector";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import ContactInfoDisplay from "./ContactInfoDisplay";
import ContactEditForm from "./ContactEditForm";
import ContactSubscriptionSelector from "./ContactSubscriptionSelector";

interface ContactDetailProps {
  contactId: string;
  onUpdate?: () => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contactId, onUpdate }) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const { plans, isLoading: plansLoading } = useSubscriptionPlans();

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      const data = await contactService.getContactById(contactId);
      if (data) {
        setContact(data);
      }
      setLoading(false);
    };
    
    fetchContact();
  }, [contactId]);

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

  const handleUpdateSuccess = () => {
    // Refetch contact data after successful update
    const refreshContact = async () => {
      const updatedContact = await contactService.getContactById(contactId);
      if (updatedContact) {
        setContact(updatedContact);
      }
      setEditing(false);
      if (onUpdate) onUpdate();
    };
    
    refreshContact();
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
          <ContactEditForm 
            contact={contact}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <ContactInfoDisplay contact={contact} />
        )}

        <ContactSubscriptionSelector 
          contactId={contact.id}
          subscriptionPlanId={contact.subscriptionPlanId}
          plans={plans}
          isLoading={plansLoading}
          onSubscriptionPlanChange={handleSubscriptionPlanChange}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        {!editing && (
          <Button variant="outline" onClick={() => setEditing(true)}>
            Modifier
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContactDetail;
