
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, Grid, List, Plus, Search } from "lucide-react";

interface AppointmentHeaderProps {
  view: "list" | "grid" | "calendar";
  setView: (view: "list" | "grid" | "calendar") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddAppointment: () => void;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  onAddAppointment
}) => {
  return (
    <>
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
          <Button onClick={onAddAppointment}>
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
    </>
  );
};

export default AppointmentHeader;
