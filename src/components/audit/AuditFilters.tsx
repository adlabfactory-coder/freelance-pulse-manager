
import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

interface AuditFiltersProps {
  startDate: Date;
  endDate: Date;
  selectedModule: string;
  selectedAction: string;
  searchTerm: string;
  uniqueModules: string[];
  uniqueActions: string[];
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setSelectedModule: (module: string) => void;
  setSelectedAction: (action: string) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuditFilters: React.FC<AuditFiltersProps> = ({
  startDate,
  endDate,
  selectedModule,
  selectedAction,
  searchTerm,
  uniqueModules,
  uniqueActions,
  setStartDate,
  setEndDate,
  setSelectedModule,
  setSelectedAction,
  handleSearch,
}) => {
  const location = useLocation();
  const isInSettings = location.pathname.includes("/settings/audit");
  
  return (
    <Card className={isInSettings ? "border-0 shadow-none bg-transparent" : ""}>
      <CardHeader className={isInSettings ? "px-0" : ""}>
        <CardTitle>Filtres</CardTitle>
        <CardDescription>Filtrer les journaux d'audit par date, module ou action</CardDescription>
      </CardHeader>
      <CardContent className={isInSettings ? "px-0" : ""}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Date de début</label>
            <DatePicker 
              date={startDate} 
              onSelect={setStartDate} 
              className="w-full" 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Date de fin</label>
            <DatePicker 
              date={endDate} 
              onSelect={setEndDate} 
              className="w-full" 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Module</label>
            <Select
              value={selectedModule}
              onValueChange={setSelectedModule}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les modules" />
              </SelectTrigger>
              <SelectContent>
                {uniqueModules.map(module => (
                  <SelectItem key={module} value={module}>
                    {module === 'all' ? 'Tous les modules' : module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Action</label>
            <Select
              value={selectedAction}
              onValueChange={setSelectedAction}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les actions" />
              </SelectTrigger>
              <SelectContent>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {action === 'all' ? 'Toutes les actions' : action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Recherche</label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditFilters;
