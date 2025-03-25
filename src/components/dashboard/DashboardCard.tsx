
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  className,
  children,
}) => {
  return (
    <Card className={cn("dashboard-card h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
