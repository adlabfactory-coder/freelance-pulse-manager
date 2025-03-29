
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

interface ContactSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ContactSelector: React.FC<ContactSelectorProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner un contact",
  disabled = false
}) => {
  const [contacts, setContacts] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contacts')
          .select('id, name')
          .is('deleted_at', null)
          .order('name');

        if (error) {
          console.error("Erreur lors du chargement des contacts:", error);
          toast.error("Erreur lors du chargement des contacts");
          throw error;
        }

        setContacts(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading || disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Chargement des contacts..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {contacts.length === 0 && !loading && (
          <SelectItem value="no-contacts" disabled>
            Aucun contact disponible
          </SelectItem>
        )}
        {contacts.map((contact) => (
          <SelectItem key={contact.id} value={contact.id}>
            {contact.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ContactSelector;
