
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Grid, List, Plus, Search } from "lucide-react";
import CalendlyIntegration from "@/components/appointments/CalendlyIntegration";

const Appointments: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"list" | "grid" | "calendar">("list");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground">
            Gérez vos rendez-vous et consultations
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex rounded-md border border-input overflow-hidden">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setView("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setView("calendar")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau rendez-vous
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des rendez-vous..."
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Passés</TabsTrigger>
          <TabsTrigger value="calendly">Calendly</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              {view === "list" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rendez-vous à venir</CardTitle>
                    <CardDescription>
                      Vos prochains rendez-vous programmés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      Aucun rendez-vous à venir
                    </div>
                  </CardContent>
                </Card>
              )}

              {view === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Consultation initiale</CardTitle>
                        <CardDescription>Avec Client {i + 1}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          <p className="font-medium">Date: {new Date().toLocaleDateString()}</p>
                          <p>Heure: 14:00 - 15:00</p>
                          <p>Statut: Confirmé</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {view === "calendar" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Calendrier des rendez-vous</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="mx-auto"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Détails du jour</CardTitle>
                  <CardDescription>
                    {date?.toLocaleDateString() || "Sélectionnez une date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4 text-muted-foreground">
                      Aucun rendez-vous pour cette date
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous passés</CardTitle>
              <CardDescription>
                Historique de vos rendez-vous passés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                Aucun rendez-vous passé
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendly">
          <CalendlyIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
