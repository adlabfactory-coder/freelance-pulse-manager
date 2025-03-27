import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteStatus } from "@/types/quote";
import { getStatusLabel } from "../components/QuoteStatusBadge";
import { CalendarIcon, Filter, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/utils/format";

export interface QuoteFilters {
  search: string;
  status: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  freelancerId: string | null;
  contactId: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  folder: string | null;
}

interface QuoteFilterBarProps {
  filters: QuoteFilters;
  onFilterChange: (filters: QuoteFilters) => void;
  onSearchChange: (search: string) => void;
  onResetFilters: () => void;
  freelancerOptions: Array<{ id: string, name: string }>;
  contactOptions: Array<{ id: string, name: string }>;
}

const QuoteFilterBar: React.FC<QuoteFilterBarProps> = ({
  filters,
  onFilterChange,
  onSearchChange,
  onResetFilters,
  freelancerOptions,
  contactOptions
}) => {
  const updateFilter = (key: keyof QuoteFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const statusOptions = [
    { value: "", label: "Tous les statuts" },
    { value: QuoteStatus.DRAFT, label: getStatusLabel(QuoteStatus.DRAFT) },
    { value: QuoteStatus.PENDING, label: getStatusLabel(QuoteStatus.PENDING) },
    { value: QuoteStatus.SENT, label: getStatusLabel(QuoteStatus.SENT) },
    { value: QuoteStatus.ACCEPTED, label: getStatusLabel(QuoteStatus.ACCEPTED) },
    { value: QuoteStatus.REJECTED, label: getStatusLabel(QuoteStatus.REJECTED) },
    { value: QuoteStatus.EXPIRED, label: getStatusLabel(QuoteStatus.EXPIRED) },
    { value: QuoteStatus.PAID, label: getStatusLabel(QuoteStatus.PAID) },
    { value: QuoteStatus.CANCELLED, label: getStatusLabel(QuoteStatus.CANCELLED) }
  ];

  const hasActiveFilters = 
    filters.status || filters.dateFrom || filters.dateTo || 
    filters.freelancerId || filters.contactId ||
    filters.minAmount || filters.maxAmount;

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtres</span>
              {hasActiveFilters && <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">!</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Filtres avancés</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select
                  value={filters.status || ""}
                  onValueChange={(value) => updateFilter("status", value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Commercial</label>
                <Select
                  value={filters.freelancerId || ""}
                  onValueChange={(value) => updateFilter("freelancerId", value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les commerciaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les commerciaux</SelectItem>
                    {freelancerOptions.map((freelancer) => (
                      <SelectItem key={freelancer.id} value={freelancer.id}>
                        {freelancer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact</label>
                <Select
                  value={filters.contactId || ""}
                  onValueChange={(value) => updateFilter("contactId", value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les contacts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les contacts</SelectItem>
                    {contactOptions.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de début</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? (
                          formatDate(filters.dateFrom)
                        ) : (
                          <span>Choisir</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom || undefined}
                        onSelect={(date) => updateFilter("dateFrom", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de fin</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? (
                          formatDate(filters.dateTo)
                        ) : (
                          <span>Choisir</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo || undefined}
                        onSelect={(date) => updateFilter("dateTo", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Montant min (€)</label>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount || ""}
                    onChange={(e) => updateFilter("minAmount", e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Montant max (€)</label>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount || ""}
                    onChange={(e) => updateFilter("maxAmount", e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={onResetFilters}>
                <X className="mr-2 h-4 w-4" />
                Réinitialiser les filtres
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center bg-muted/50 p-2 rounded-md">
          <span className="text-sm font-medium">Filtres actifs:</span>
          
          {filters.status && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => updateFilter("status", null)}>
              Statut: {getStatusLabel(filters.status as QuoteStatus)}
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {filters.freelancerId && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => updateFilter("freelancerId", null)}>
              Commercial: {freelancerOptions.find(f => f.id === filters.freelancerId)?.name || "Inconnu"}
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {filters.contactId && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => updateFilter("contactId", null)}>
              Contact: {contactOptions.find(c => c.id === filters.contactId)?.name || "Inconnu"}
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {filters.dateFrom && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => updateFilter("dateFrom", null)}>
              Depuis: {formatDate(filters.dateFrom)}
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {filters.dateTo && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => updateFilter("dateTo", null)}>
              Jusqu'à: {formatDate(filters.dateTo)}
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {filters.minAmount && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => updateFilter("minAmount", null)}>
              Min: {filters.minAmount}€
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {filters.maxAmount && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => updateFilter("maxAmount", null)}>
              Max: {filters.maxAmount}€
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto" onClick={onResetFilters}>
            Tout effacer
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuoteFilterBar;
