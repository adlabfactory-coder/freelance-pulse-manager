
// Navigation item type definition
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  badge?: string | number;
  roles?: string[];
}

export interface SidebarSection {
  title?: string;
  items: NavItem[];
}
