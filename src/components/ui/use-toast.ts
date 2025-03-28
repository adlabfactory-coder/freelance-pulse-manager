
// Ce fichier re-exporte le hook toast depuis le hook principal
// pour maintenir la compatibilité avec les imports existants
import { toast as sonnerToast } from "sonner";
import { useToast as useInternalToast, toast } from "@/hooks/use-toast";

export { toast, sonnerToast };
export const useToast = useInternalToast;
