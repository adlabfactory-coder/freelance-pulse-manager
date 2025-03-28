
import React from "react";
import { useAuditLogs } from "@/hooks/audit/useAuditLogs";
import AuditHeader from "@/components/audit/AuditHeader";
import AuditFilters from "@/components/audit/AuditFilters";
import AuditResults from "@/components/audit/AuditResults";
import { useLocation } from "react-router-dom";

const AuditPage: React.FC = () => {
  const location = useLocation();
  const isInSettings = location.pathname.includes("/settings/audit");

  const {
    filteredLogs,
    startDate,
    endDate,
    selectedModule,
    selectedAction,
    searchTerm,
    sortDirection,
    selectedLogs,
    uniqueModules,
    uniqueActions,
    setStartDate,
    setEndDate,
    setSelectedModule,
    setSelectedAction,
    setSelectedLogs,
    handleSearch,
    toggleSortDirection,
    exportToCSV,
    exportSelectedToCSV
  } = useAuditLogs();

  return (
    <div className={isInSettings ? "" : "container mx-auto py-6 space-y-6"}>
      {!isInSettings && <AuditHeader exportToCSV={exportToCSV} />}
      
      <AuditFilters
        startDate={startDate}
        endDate={endDate}
        selectedModule={selectedModule}
        selectedAction={selectedAction}
        searchTerm={searchTerm}
        uniqueModules={uniqueModules}
        uniqueActions={uniqueActions}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSelectedModule={setSelectedModule}
        setSelectedAction={setSelectedAction}
        handleSearch={handleSearch}
      />

      <AuditResults
        logs={filteredLogs}
        sortDirection={sortDirection}
        toggleSortDirection={toggleSortDirection}
        selectedLogs={selectedLogs}
        setSelectedLogs={setSelectedLogs}
        exportSelectedToCSV={exportSelectedToCSV}
      />
    </div>
  );
};

export default AuditPage;
