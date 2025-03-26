import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Appointment } from "@/types/appointment";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAppointments } from "@/services/appointments";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const PendingAppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<{[key: string]: string}>({});
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const allAppointments = await fetchAppointments();
        
        // Filtrer les rendez-vous en attente
        const pendingApps = allAppointments
          .filter(app => app.status === 'pending')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setAppointments(pendingApps);
        
        // Récupérer les noms des contacts associés
        if (pendingApps.length > 0) {
          const contactIds = [...new Set(pendingApps.map(app => app.contactId))];
          const { supabase } = await import('@/lib/supabase');
          
          const { data: contactsData } = await supabase
            .from('contacts')
            .select('id, name')
            .in('id', contactIds);
            
          if (contactsData) {
            const contactMap = contactsData.reduce((acc, contact) => {
              acc[contact.id] = contact.name;
              return acc;
            }, {} as {[key: string]: string});
            setContacts(contactMap);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous en attente:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleAcceptAppointment = async (appointmentId: string, contactId: string) => {
    setProcessingIds(prev => [...prev, appointmentId]);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      if (!user?.id) {
        toast.error("Vous devez être connecté pour accepter un rendez-vous");
        return;
      }
      
      const userId = user.id;
      
      // Utiliser la procédure stockée pour accepter le rendez-vous et mettre à jour le contact
      const { error } = await supabase
        .rpc('accept_appointment', {
          appointment_id: appointmentId,
          freelancer_id: userId
        });
      
      if (error) {
        throw new Error(`Erreur lors de l'acceptation du rendez-vous: ${error.message}`);
      }
      
      toast.success("Rendez-vous accepté avec succès");
      
      // Mettre à jour la liste
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      
    } catch (error) {
      console.error("Erreur lors de l'acceptation du rendez-vous:", error);
      toast.error("Impossible d'accepter le rendez-vous. Veuillez réessayer.");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const handleDeclineAppointment = async (appointmentId: string) => {
    setProcessingIds(prev => [...prev, appointmentId]);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      // Utiliser la procédure stockée pour refuser le rendez-vous
      const { error } = await supabase
        .rpc('decline_appointment', {
          appointment_id: appointmentId
        });
      
      if (error) {
        throw new Error(`Erreur lors du refus du rendez-vous: ${error.message}`);
      }
      
      toast.success("Rendez-vous refusé");
      
      // Mettre à jour la liste
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      
    } catch (error) {
      console.error("Erreur lors du refus du rendez-vous:", error);
      toast.error("Impossible de refuser le rendez-vous. Veuillez réessayer.");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== appointmentId));
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Rendez-vous en attente d'attribution
          </CardTitle>
          <CardDescription>
            Ces rendez-vous sont en attente d'attribution à un chargé de compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Date et heure</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 2 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return null; // Ne pas afficher le composant s'il n'y a pas de rendez-vous en attente
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Rendez-vous en attente d'attribution
        </CardTitle>
        <CardDescription>
          Ces rendez-vous sont en attente d'attribution à un chargé de compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Date et heure</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{format(new Date(appointment.date), "dd MMM yyyy", { locale: fr })}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(appointment.date), "HH:mm", { locale: fr })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.title}</TableCell>
                  <TableCell>{contacts[appointment.contactId] || 'Contact inconnu'}</TableCell>
                  <TableCell>{appointment.duration} min</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeclineAppointment(appointment.id)}
                        disabled={processingIds.includes(appointment.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Refuser
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleAcceptAppointment(appointment.id, appointment.contactId)}
                        disabled={processingIds.includes(appointment.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accepter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingAppointmentsList;
