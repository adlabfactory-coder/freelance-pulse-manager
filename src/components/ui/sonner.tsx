
import { Toaster as Sonner } from "sonner";
import { type ToasterProps } from "sonner";

const Toaster = ({
  position = "bottom-right",
  richColors = true,
  closeButton = true,
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
