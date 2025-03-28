
import { toast as sonnerToast } from "sonner";
import { ToastActionElement } from "@/components/ui/toast";

type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  style?: React.CSSProperties;
};

// Liste pour stocker les toasts actifs
const toasts: { id: string; [key: string]: any }[] = [];

// Hook unifié pour gérer les toasts
export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, variant, action, style, ...rest } = props;
    
    // Si c'est une alerte destructive, utiliser une couleur rouge
    const toastStyle = variant === "destructive" 
      ? { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', ...style } 
      : style;
    
    // Créer un ID unique pour ce toast
    const id = Math.random().toString(36).substring(2, 9);
    
    // Ajouter ce toast à la liste des toasts actifs
    toasts.push({
      id,
      title,
      description,
      action,
      ...rest
    });
    
    // Appeler sonnerToast avec les arguments appropriés
    if (title && description) {
      return sonnerToast(title, {
        description,
        style: toastStyle,
        action,
        ...rest
      });
    }
    
    return sonnerToast(title || description || "", {
      style: toastStyle,
      action,
      ...rest
    });
  };
  
  return {
    toast,
    // Pour la compatibilité avec le composant Toaster existant
    toasts,
    dismiss: sonnerToast.dismiss,
    error: (message: string) => toast({ 
      title: "Erreur", 
      description: message, 
      variant: "destructive"
    }),
    success: (message: string) => toast({ 
      title: "Succès", 
      description: message
    })
  };
}

// Export direct de la fonction toast pour la compatibilité avec l'API existante
export const toast = (props: ToastProps) => {
  const { toast: toastFn } = useToast();
  return toastFn(props);
};
