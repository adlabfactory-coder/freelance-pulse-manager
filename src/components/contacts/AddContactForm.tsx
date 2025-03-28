
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ContactForm from "./ContactForm";
import { useAuth } from "@/hooks/use-auth";
import ContactAppointmentDialog from "./ContactAppointmentDialog";
import { useContactForm } from "@/hooks/useContactForm";
import { toast } from "sonner";

interface AddContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  useAutoAssign?: boolean;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ 
  onSuccess, 
  onCancel,
  useAutoAssign = false
}) => {
  const { user } = useAuth();
  const [createdContactId, setCreatedContactId] = useState<string | null>(null);
  const [createdContactName, setCreatedContactName] = useState<string>("");
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  
  const handleContactCreated = (contactData?: {id: string, name: string}) => {
    if (contactData && contactData.id) {
      console.log("Contact created successfully:", contactData);
      setCreatedContactId(contactData.id);
      setCreatedContactName(contactData.name);
      
      // Automatiquement ouvrir la boîte de dialogue de rendez-vous lors de la création
      setShowAppointmentDialog(true);
      
      toast.success(`Contact "${contactData.name}" ajouté avec succès`);
      
      if (onSuccess) {
        onSuccess();
      }
    }
  };
  
  const handleAppointmentClosed = () => {
    setShowAppointmentDialog(false);
    
    // Quand la planification de rendez-vous est terminée, on considère que tout le processus est terminé
    if (onSuccess) {
      onSuccess();
    }
  };
  
  const { form, isSubmitting, onSubmit } = useContactForm({
    onSuccess: handleContactCreated,
    isEditing: false,
    useAutoAssign,
    initialData: {
      assignedTo: user?.role === "freelancer" ? user?.id : ""
    }
  });

  return (
    <>
      {createdContactId ? (
        <div className="space-y-6">
          <div className="rounded-md bg-green-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Contact ajouté avec succès
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Le contact {createdContactName} a été ajouté avec succès.
                  </p>
                </div>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Une consultation initiale est en cours de planification...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ContactForm
          form={form}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          isEditing={false}
          submitLabel="Ajouter le contact"
          onCancel={onCancel}
        />
      )}
      
      {/* Boîte de dialogue pour planifier un rendez-vous */}
      {createdContactId && (
        <ContactAppointmentDialog
          open={showAppointmentDialog}
          onOpenChange={(open) => {
            setShowAppointmentDialog(open);
            if (!open) {
              handleAppointmentClosed();
            }
          }}
          contactId={createdContactId}
          contactName={createdContactName}
          initialType="consultation-initiale"
          autoAssign={true}
        />
      )}
    </>
  );
};

export default AddContactForm;
