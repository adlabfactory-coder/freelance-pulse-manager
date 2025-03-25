
import React from "react";
import UserProfile from "./UserProfile";
import SidebarActions from "./SidebarActions";

interface SidebarFooterProps {
  collapsed: boolean;
  renderIcon: (Icon: React.ElementType) => React.ReactNode;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, renderIcon }) => {
  return (
    <div className="border-t border-sidebar-border p-4">
      <UserProfile collapsed={collapsed} renderIcon={renderIcon} />
      <SidebarActions collapsed={collapsed} />
    </div>
  );
};

export default SidebarFooter;
