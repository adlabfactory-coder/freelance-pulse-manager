
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, Plus, User } from "lucide-react";
import { AppointmentStatus } from "@/types";

const Appointments: React.FC = () => {
  const appointments = [
    {
      id: "1",
      title: "Présentation de projet",
      contactName: "Alice Martin",
      freelancerName: "John Doe",
      date: new Date(2023, 5, 10, 10, 0),
      duration: 60,
      status: AppointmentStatus.SCHEDULED,
      location: "Zoom",
    },
    {
      id: "2",
      title: "Suivi client",
      contactName: "Bob Johnson",
      freelancerName: "John Doe",
      date: new Date(2023, 5, 12, 14, 30),
      duration: 30,
      status: AppointmentStatus.COMPLETED,
      location: "En personne",
    },
    {
      id: "3",
      title: "Démonstration produit",
      contactName: "Charlie Brown",
      freelancerName: "Jane Smith",
      date: new Date(2023, 5, 15, 11, 0),
      duration: 45,
      status: AppointmentStatus.CANCELLED,
      location: "Teams",
    },
    {
      id: "4",
      title: "Négociation contrat",
      contactName: "Diana Prince",
      freelancerName: "Jane Smith",
      date: new Date(2023, 5, 20, 16, 0),
      duration: 90,
      status: AppointmentStatus.SCHEDULED,
      location: "En personne",
    },
    {
      id: "5",
      title: "Réunion stratégique",
      contactName: "Ethan Hunt",
      freelancerName: "John Doe",
      date: new Date(2023, 5, 25, 9, 0),
      duration: 120,
      status: AppointmentStatus.RESCHEDULED,
      location: "Google Meet",
    },
  ];

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Programmé
          </span>
        );
      case AppointmentStatus.COMPLETED:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            Terminé
          </span>
        );
      case AppointmentStatus.CANCELLED:
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
            Annulé
          </span>
        );
      case AppointmentStatus.RESCHEDULED:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
            Reporté
          </span>
        );
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const upcomingAppointments = appointments.filter(
    (a) =>
      a.status === AppointmentStatus.SCHEDULED ||
      a.status === AppointmentStatus.RESCHEDULED
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos rendez-vous avec les clients
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouveau rendez-vous
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative w-full md:w-64">
                <Input type="text" placeholder="Rechercher..." />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filtrer
              </Button>
            </div>
          </div>

          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Commercial
                  </TableHead>
                  <TableHead>Date et heure</TableHead>
                  <TableHead className="hidden md:table-cell">Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Lieu</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {appointment.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {appointment.contactName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {appointment.freelancerName}
                    </TableCell>
                    <TableCell>
                      <div>{appointment.date.toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(appointment.date)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {appointment.duration} min
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {appointment.location}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des rendez-vous</CardTitle>
              <CardDescription>
                Visualisez tous vos rendez-vous sur un calendrier mensuel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12 border rounded-md bg-muted/30">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  Calendrier à implémenter
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Le calendrier interactif sera disponible dans la prochaine
                  version.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{appointment.title}</CardTitle>
                  <CardDescription>
                    {getStatusBadge(appointment.status)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {appointment.date.toLocaleDateString()} -{" "}
                        {formatTime(appointment.date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.duration} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appointment.contactName}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button size="sm">Détails</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
