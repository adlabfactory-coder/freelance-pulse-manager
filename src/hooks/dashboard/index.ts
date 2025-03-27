
export * from './types';
export * from './useDashboard';
export * from './useDashboardStats';
export * from './useDashboardActivities';
export * from './useDashboardTasks';
export * from './useRealtimeSubscriptions';

// Pour assurer la compatibilité avec le code existant
export { useDashboard as useDashboardData } from './useDashboard';
