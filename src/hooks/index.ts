
// Export des hooks génériques
export * from "./use-mobile";
export * from "./use-notifications";
export * from "./use-theme";
export * from "./use-supabase";
export * from "./use-subscription-plans";
export * from "./use-subscriptions";

// Export named hooks from auth directory to avoid conflicts
export { 
  AuthProvider, 
  useAuthContext 
} from "./auth";

// Export des hooks spécifiques
export * from "./commission";

// Export direct des hooks d'appointments depuis leur dossier
export * from "./appointments";

// Re-export the backward compatibility useAuth hook
export { useAuth } from "./use-auth";
