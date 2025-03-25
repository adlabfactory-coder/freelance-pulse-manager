
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SegmentItem {
  title: string;
  icon: LucideIcon;
  path: string;
}

interface SegmentButtonsProps {
  items: SegmentItem[];
  defaultValue?: string;
  className?: string;
}

export const SegmentButtons = ({
  items,
  defaultValue,
  className,
}: SegmentButtonsProps) => {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<string>(defaultValue || items[0].path);

  const handleValueChange = (value: string) => {
    if (value) {
      setSelected(value);
      navigate(value);
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={selected}
      onValueChange={handleValueChange}
      className={cn("w-full rounded-lg border", className)}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item.path}
          value={item.path}
          className="flex-1 py-2 flex flex-col items-center gap-1 text-xs"
          aria-label={item.title}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-center">{item.title}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
