
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Appointment } from "@/types/appointment";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAppointments } from "@/services/appointments";

interface AppointmentListProps {
  searchQuery?: string;
  statusFilter?: string;
  onAddAppointment: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  searchQuery = "", 
  statusFilter,
  onAddAppointment 
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<{[key: string]: string}>({});

  // Charger tous les rendez-vous
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const allAppointments = await fetchAppointments();
        setAppointments(allAppointments);
        
        // Récupérer les noms des contacts associés aux rendez-vous
        const contactIds = [...new Set(allAppointments.map(app => app.contactId))];
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
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
    
    // Ajouter un écouteur d'événement pour rafraîchir les données
    const handleAppointmentCreated = () => loadAppointments();
    window.addEventListener('appointment-created', handleAppointmentCreated);
    
    return () => {
      window.removeEventListener('appointment-created', handleAppointmentCreated);
    };
  }, []);

  // Filtrer les rendez-vous en fonction des critères
  useEffect(() => {
    if (appointments.length === 0) {
      setFilteredAppointments([]);
      return;
    }

    let result = [...appointments];

    // Filtrer par statut si nécessaire
    if (statusFilter) {
      result = result.filter(app => app.status === statusFilter);
    }

    // Filtrer par terme de recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(app => 
        app.title.toLowerCase().includes(query) || 
        contacts[app.contactId]?.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query)
      );
    }

    // Trier par date, du plus récent au plus ancien
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredAppointments(result);
  }, [appointments, searchQuery, statusFilter, contacts]);

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      no_show: "bg-gray-100 text-gray-800"
    };
    
    const labels: { [key: string]: string } = {
      scheduled: "Planifié",
      completed: "Terminé",
      cancelled: "Annulé",
      pending: "En attente",
      no_show: "Non présenté"
    };
    
    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Rendez-vous
          </CardTitle>
          <CardDescription>
            Liste de tous vos rendez-vous
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
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredAppointments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Rendez-vous
          </CardTitle>
          <CardDescription>
            {searchQuery || statusFilter 
              ? "Aucun rendez-vous ne correspond à vos critères de recherche" 
              : "Vous n'avez pas encore de rendez-vous"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Aucun rendez-vous trouvé</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6 max-w-sm">
              {searchQuery || statusFilter 
                ? "Essayez de modifier vos critères de recherche" 
                : "Commencez par planifier votre premier rendez-vous"}
            </p>
            <Button onClick={onAddAppointment}>
              Planifier un rendez-vous
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Rendez-vous ({filteredAppointments.length})
        </CardTitle>
        <CardDescription>
          {searchQuery || statusFilter 
            ? "Résultats filtrés" 
            : "Liste de tous vos rendez-vous"}
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
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
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
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Voir détails</span>
                        </DropdownMenuItem>
                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                          <>
                            <DropdownMenuItem className="cursor-pointer">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Reprogrammer</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 cursor-pointer">
                              <span>Annuler</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default AppointmentList;
