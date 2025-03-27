
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStatsSection from "@/components/dashboard/DashboardStats";
import DashboardActivities from "@/components/dashboard/DashboardActivities";
import DashboardTasks from "@/components/dashboard/DashboardTasks";
import { useDashboardData } from "@/hooks/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, LayoutDashboard, FileText, PieChart, Clock } from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    stats,
    activities,
    tasks,
    loading,
    refreshing,
    lastUpdated,
    isConnected,
    dataSources,
    fetchDashboardData
  } = useDashboardData();
  
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(true);
  const [isTasksOpen, setIsTasksOpen] = useState(true);

  const handleStatsCardClick = (cardType: string) => {
    switch (cardType) {
      case 'contracts':
        navigate('/quotes');
        break;
      case 'commissions':
        navigate('/commissions');
        break;
      case 'appointments':
        navigate('/appointments');
        break;
      case 'clients':
        navigate('/contacts');
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <DashboardHeader
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        isRefreshing={refreshing}
        onManualRefresh={fetchDashboardData}
        dataSources={dataSources}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Contrats</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <DashboardStatsSection
            stats={stats}
            dataSources={dataSources}
            onCardClick={handleStatsCardClick}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Collapsible 
              open={isActivitiesOpen} 
              onOpenChange={setIsActivitiesOpen}
              className="border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent/20 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Activités récentes</h3>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isActivitiesOpen ? "transform rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-0">
                <DashboardActivities activities={activities} loading={loading} />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible 
              open={isTasksOpen} 
              onOpenChange={setIsTasksOpen}
              className="border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent/20 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Tâches à faire</h3>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isTasksOpen ? "transform rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-0">
                <DashboardTasks loading={loading} tasks={tasks} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-6">
          <div className="bg-muted/50 p-8 rounded-lg flex items-center justify-center h-64 cursor-pointer"
               onClick={() => navigate('/quotes')}>
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Section des contrats</h3>
              <p className="text-muted-foreground">
                Consultez l'état de vos contrats, devis et signatures en attente.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <div className="bg-muted/50 p-8 rounded-lg flex items-center justify-center h-64 cursor-pointer"
               onClick={() => navigate('/reports')}>
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Analyse de performance</h3>
              <p className="text-muted-foreground">
                Visualisez vos statistiques et indicateurs de performance.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
