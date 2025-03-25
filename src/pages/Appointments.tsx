
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { SegmentButtons } from "@/components/ui/segment-buttons";
import { CalendarDays, Grid, List, Plus, Search, Clock } from "lucide-react";
import SchedulePlanner from "@/components/appointments/CalendlyIntegration";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isToday, isEqual } from "date-fns";
import { fr } from "date-fns/locale";

const Appointments: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"list" | "grid" | "calendar">("list");
  const [timeView, setTimeView] = useState<"day" | "week">("day");
  const [searchQuery, setSearchQuery] = useState("");

  // Generate the days for the week view
  const weekStart = date ? startOfWeek(date, { weekStartsOn: 1 }) : startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = date ? endOfWeek(date, { weekStartsOn: 1 }) : endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Generate time slots for the day
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start at 8 AM
    return {
      time: `${hour}:00`,
      formattedTime: `${hour}:00`,
    };
  });

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Passés</TabsTrigger>
          <TabsTrigger value="schedule">Planifier</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex justify-end mb-4">
            <SegmentButtons>
              <Button
                variant={timeView === "day" ? "default" : "outline"}
                onClick={() => setTimeView("day")}
              >
                Jour
              </Button>
              <Button
                variant={timeView === "week" ? "default" : "outline"}
                onClick={() => setTimeView("week")}
              >
                Semaine
              </Button>
            </SegmentButtons>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              {timeView === "day" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Agenda du jour</CardTitle>
                      <CardDescription>
                        {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "Aujourd'hui"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timeSlots.map((slot, index) => (
                        <div key={index} className="flex items-start border-b pb-2">
                          <div className="w-16 font-medium text-muted-foreground">{slot.formattedTime}</div>
                          <div className="flex-1 ml-4">
                            <div className="h-12 rounded-md border border-dashed border-muted hover:bg-accent/50 transition-colors cursor-pointer px-2 py-1">
                              <span className="text-xs text-muted-foreground">+ Ajouter</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {timeView === "week" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Planning hebdomadaire</CardTitle>
                      <CardDescription>
                        Semaine du {format(weekStart, "d MMMM", { locale: fr })} au {format(weekEnd, "d MMMM yyyy", { locale: fr })}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {weekDays.map((day, i) => (
                        <div key={i} className="text-center">
                          <div className={`
                            text-sm font-medium p-2 rounded-md
                            ${isToday(day) ? 'bg-primary text-primary-foreground' : ''}
                            ${isEqual(day, date || new Date()) && !isToday(day) ? 'bg-accent' : ''}
                          `}>
                            {format(day, "EEE", { locale: fr })}
                            <div>{format(day, "d")}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-4">
                      {timeSlots.slice(0, 6).map((slot, index) => (
                        <div key={index} className="flex items-start border-b pb-2">
                          <div className="w-16 font-medium text-muted-foreground">{slot.formattedTime}</div>
                          <div className="flex-1 grid grid-cols-7 gap-1">
                            {weekDays.map((day, dayIndex) => (
                              <div 
                                key={dayIndex} 
                                className="h-12 rounded-md border border-dashed border-muted hover:bg-accent/50 transition-colors cursor-pointer"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Calendrier</CardTitle>
                  <CardDescription>
                    {date?.toLocaleDateString() || "Sélectionnez une date"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="mx-auto"
                  />
                  <div className="mt-4 space-y-4">
                    <h4 className="text-sm font-medium">Prochains rendez-vous</h4>
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
        
        <TabsContent value="schedule">
          <SchedulePlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
