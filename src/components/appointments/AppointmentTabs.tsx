
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SegmentButtons } from "@/components/ui/segment-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentDayView from "./AppointmentDayView";
import AppointmentWeekView from "./AppointmentWeekView";
import AppointmentCalendar from "./AppointmentCalendar";
import SchedulePlanner from "./SchedulePlanner";

interface AppointmentTabsProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeView: "day" | "week";
  setTimeView: (view: "day" | "week") => void;
  onAddAppointment: () => void;
  activeTab: "upcoming" | "past" | "schedule";
  setActiveTab: (tab: "upcoming" | "past" | "schedule") => void;
}

const AppointmentTabs: React.FC<AppointmentTabsProps> = ({
  date, 
  setDate, 
  timeView, 
  setTimeView, 
  onAddAppointment,
  activeTab,
  setActiveTab
}) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value as "upcoming" | "past" | "schedule");
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="upcoming">À venir</TabsTrigger>
        <TabsTrigger value="past">Passés</TabsTrigger>
        <TabsTrigger value="schedule">Planifier</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="space-y-4">
        <div className="flex justify-end mb-4">
          <SegmentButtons className="w-auto">
            <Button
              variant={timeView === "day" ? "default" : "outline"}
              onClick={() => setTimeView("day")}
              className="rounded-l-md rounded-r-none"
            >
              Jour
            </Button>
            <Button
              variant={timeView === "week" ? "default" : "outline"}
              onClick={() => setTimeView("week")}
              className="rounded-l-none rounded-r-md"
            >
              Semaine
            </Button>
          </SegmentButtons>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            {timeView === "day" && (
              <AppointmentDayView date={date} onAddAppointment={onAddAppointment} />
            )}

            {timeView === "week" && (
              <AppointmentWeekView date={date} onAddAppointment={onAddAppointment} />
            )}
          </div>

          <div>
            <AppointmentCalendar date={date} setDate={setDate} />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="past">
        {/* Le contenu des rendez-vous passés est maintenant géré par AppointmentList */}
      </TabsContent>
      
      <TabsContent value="schedule">
        <SchedulePlanner />
      </TabsContent>
    </Tabs>
  );
};

export default AppointmentTabs;
