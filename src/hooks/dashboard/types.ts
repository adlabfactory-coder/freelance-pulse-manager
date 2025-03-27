
import { DataSource } from "@/lib/supabase";

export interface DashboardStats {
  pendingContracts: number;
  commissions: number;
  scheduledAppointments: number;
  clients: number;
}

export interface DashboardActivity {
  title: string;
  date: string;
  type: string;
}

export interface DashboardTask {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface DataSource {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSynced?: Date;
}

export interface UseDashboardDataReturn {
  stats: DashboardStats;
  activities: DashboardActivity[];
  tasks: DashboardTask[];
  loading: boolean;
  refreshing: boolean;
  lastUpdated?: Date;
  isConnected: boolean;
  dataSources: DataSource[];
  fetchDashboardData: () => Promise<void>;
}
