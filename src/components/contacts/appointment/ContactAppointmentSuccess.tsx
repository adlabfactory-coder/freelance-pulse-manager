
import React from "react";
import { CalendarClock } from "lucide-react";

interface ContactAppointmentSuccessProps {
  contactName: string;
}

const ContactAppointmentSuccess: React.FC<ContactAppointmentSuccessProps> = ({ contactName }) => {
  return (
    <div className="py-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-green-100 p-3 rounded-full">
          <CalendarClock className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium">Rendez-vous planifié</h3>
        <p className="text-sm text-muted-foreground">
          Un rendez-vous a été planifié avec {contactName}.
        </p>
      </div>
    </div>
  );
};

export default ContactAppointmentSuccess;
