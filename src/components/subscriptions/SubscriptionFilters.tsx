
import React from 'react';
import { Button } from '@/components/ui/button';

export interface SubscriptionFiltersProps {
  filter: 'all' | 'active' | 'inactive';
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
}

const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={filter === 'all' ? 'default' : 'outline'} 
        onClick={() => onFilterChange('all')}
      >
        Tous
      </Button>
      <Button 
        variant={filter === 'active' ? 'default' : 'outline'} 
        onClick={() => onFilterChange('active')}
      >
        Actifs
      </Button>
      <Button 
        variant={filter === 'inactive' ? 'default' : 'outline'} 
        onClick={() => onFilterChange('inactive')}
      >
        Inactifs
      </Button>
    </div>
  );
};

export default SubscriptionFilters;
