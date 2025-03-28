
// Ce fichier re-exporte le hook toast depuis le hook principal
// pour maintenir la compatibilité avec les imports existants
import { toast } from "sonner";
import { useToast as useInternalToast } from "@/hooks/use-toast";

export { toast };
export const useToast = useInternalToast;
