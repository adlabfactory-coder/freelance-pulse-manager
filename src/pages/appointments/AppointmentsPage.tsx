
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Loader2 } from "lucide-react";
import NewAppointmentDialog from "@/components/appointments/dialog/NewAppointmentDialog";
import { useAppointments } from "@/hooks/appointments/use-appointments";
import AppointmentList from "@/components/appointments/list/AppointmentList";
import { useFolderFilter } from "@/components/appointments/hooks/useFolderFilter";
import AppointmentFolderFilter from "@/components/appointments/components/AppointmentFolderFilter";
import { Appointment } from "@/types/appointment";

const AppointmentsPage: React.FC = () => {
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const { appointments, isLoading, refresh } = useAppointments();
  const { selectedFolder, setSelectedFolder, filterByFolder } = useFolderFilter();
  
  // Filtrer les rendez-vous par dossier
  const filteredAppointments = filterByFolder(appointments) as Appointment[];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <div className="flex space-x-2">
          <AppointmentFolderFilter
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
          />
          <Button onClick={() => setNewAppointmentOpen(true)}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {selectedFolder 
              ? `Rendez-vous dans le dossier "${selectedFolder}"` 
              : "Tous les rendez-vous"}
          </CardTitle>
        </CardHeader>
        
        {isLoading ? (
          <CardContent className="py-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Chargement des rendez-vous...</p>
          </CardContent>
        ) : (
          <AppointmentList appointments={filteredAppointments} onStatusChange={refresh} />
        )}
      </Card>

      <NewAppointmentDialog 
        open={newAppointmentOpen} 
        onOpenChange={setNewAppointmentOpen}
        onSuccess={refresh}
      />
    </div>
  );
};

export default AppointmentsPage;
