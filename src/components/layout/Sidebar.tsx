
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart,
  Calendar,
  FileText,
  Home,
  Settings,
  Users,
  FileSpreadsheet,
  PieChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: NavItem[] = [
  { title: "Tableau de bord", href: "/", icon: Home },
  { title: "Contacts", href: "/contacts", icon: Users },
  { title: "Rendez-vous", href: "/appointments", icon: Calendar },
  { title: "Devis", href: "/quotes", icon: FileText },
  { title: "Abonnements", href: "/subscriptions", icon: FileSpreadsheet },
  { title: "Commissions", href: "/commissions", icon: BarChart },
  { title: "Rapports", href: "/reports", icon: PieChart },
  { title: "Paramètres", href: "/settings", icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar sticky top-0 border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-2 transition-opacity",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}
        >
          <div className="h-8 w-8 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold text-lg">
            A
          </div>
          <h1 className="font-semibold text-sidebar-foreground">
            AdLab Hub
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "sidebar-nav-item",
                  isActive ? "active" : "",
                  item.disabled && "opacity-50 pointer-events-none"
                )
              }
            >
              {item.icon && (
                <span className="flex-shrink-0">
                  {React.createElement(item.icon, { className: "h-5 w-5" })}
                </span>
              )}
              <span
                className={cn(
                  "transition-opacity",
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                {item.title}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div
          className={cn(
            "flex items-center gap-3 text-sm text-sidebar-foreground/70",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            {React.createElement(Users, { className: "h-4 w-4" })}
          </div>
          <div
            className={cn(
              "transition-opacity",
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}
          >
            <div className="font-medium text-sidebar-foreground">Admin</div>
            <div className="text-xs">admin@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
