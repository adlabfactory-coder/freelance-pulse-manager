
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "group toast group flex w-full items-center rounded-md border p-4 pr-6 shadow-lg",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          actionButton: "group-[.destructive]:bg-destructive group-[.destructive]:text-destructive-foreground",
          cancelButton: "group-[.destructive]:bg-destructive group-[.destructive]:text-destructive-foreground",
          error: "destructive border-destructive bg-destructive text-destructive-foreground",
          success: "bg-background text-foreground",
          warning: "border-orange-600 bg-orange-50 text-orange-900",
          info: "bg-blue-50 border-blue-600 text-blue-900",
        },
      }}
    />
  );
}
