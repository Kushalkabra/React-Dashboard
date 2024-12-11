import { useState, useMemo } from 'react';
import { User } from '../types';
import { getDateFromRange } from '../utils/date';

interface FilterOptions {
  role: string;
  status: string;
  region: string;
  dateRange: string;
}

export const useFilter = (items: User[], searchTerm: string) => {
  const [filters, setFilters] = useState<FilterOptions>({
    role: 'all',
    status: 'all',
    region: 'all',
    dateRange: '30d'
  });

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filters.role === 'all' || item.role.toLowerCase() === filters.role;
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      const matchesRegion = filters.region === 'all' || item.region === filters.region;

      const dateRange = getDateFromRange(filters.dateRange);
      const matchesDate = !dateRange || (
        new Date(item.lastActive) >= dateRange.start &&
        new Date(item.lastActive) <= dateRange.end
      );

      return matchesSearch && matchesRole && matchesStatus && matchesRegion && matchesDate;
    });
  }, [items, searchTerm, filters]);

  return { filters, setFilters, filteredItems };
}; 