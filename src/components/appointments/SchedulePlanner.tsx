
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentDateSelector from "./scheduler/AppointmentDateSelector";
import AppointmentDetailsForm from "./scheduler/AppointmentDetailsForm";
import { useSchedulePlanner } from "./hooks/useSchedulePlanner";

const SchedulePlanner: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    handleSubmit,
    isSubmitting
  } = useSchedulePlanner();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Planifier un rendez-vous</CardTitle>
        <CardDescription>
          Créez et gérez vos rendez-vous directement dans l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <AppointmentDetailsForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
          
          <div className="flex justify-center">
            <AppointmentDateSelector 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulePlanner;
