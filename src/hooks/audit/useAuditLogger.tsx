
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase-client";
import { useCallback } from "react";

type LogAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'error' | string;
type LogModule = 'auth' | 'users' | 'contacts' | 'quotes' | 'appointments' | 'commissions' | 'settings' | 'system' | string;

interface LogOptions {
  details?: string;
  metadata?: Record<string, any>;
}

export const useAuditLogger = () => {
  const { user } = useAuth();

  const logEvent = useCallback(
    async (
      action: LogAction,
      module: LogModule,
      options: LogOptions = {}
    ) => {
      try {
        const { details = "", metadata = {} } = options;

        const logData = {
          user_id: user?.id,
          user_email: user?.email,
          user_role: user?.role,
          action,
          module,
          details,
          metadata,
          ip_address: "client-side", // Dans une implémentation réelle, ceci serait capturé côté serveur
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        };

        // Dans une implémentation réelle, un edge function collecterait l'IP
        const { error } = await supabase.from("audit_logs").insert([logData]);

        if (error) {
          console.error("Erreur lors de l'enregistrement de l'audit log:", error);
        }
      } catch (error) {
        console.error("Erreur lors de la journalisation:", error);
      }
    },
    [user]
  );

  return {
    logLogin: (details?: string, metadata?: Record<string, any>) =>
      logEvent("login", "auth", { details, metadata }),
    logLogout: (details?: string, metadata?: Record<string, any>) =>
      logEvent("logout", "auth", { details, metadata }),
    logCreate: (
      module: LogModule,
      details?: string,
      metadata?: Record<string, any>
    ) => logEvent("create", module, { details, metadata }),
    logRead: (
      module: LogModule,
      details?: string,
      metadata?: Record<string, any>
    ) => logEvent("read", module, { details, metadata }),
    logUpdate: (
      module: LogModule,
      details?: string,
      metadata?: Record<string, any>
    ) => logEvent("update", module, { details, metadata }),
    logDelete: (
      module: LogModule,
      details?: string,
      metadata?: Record<string, any>
    ) => logEvent("delete", module, { details, metadata }),
    logError: (
      module: LogModule,
      details?: string,
      metadata?: Record<string, any>
    ) => logEvent("error", module, { details, metadata }),
    logEvent,
  };
};

export default useAuditLogger;
