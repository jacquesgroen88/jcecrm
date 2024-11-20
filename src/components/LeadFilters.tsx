import React from 'react';
import { useUserStore } from '../store/userStore';
import { LeadFilter, LeadSort } from '../types';

interface LeadFiltersProps {
  filters: LeadFilter;
  onFilterChange: (filters: LeadFilter) => void;
  sort: LeadSort;
  onSortChange: (sort: LeadSort) => void;
}

export default function LeadFilters({
  filters,
  onFilterChange,
  sort,
  onSortChange
}: LeadFiltersProps) {
  const { users } = useUserStore();

  const handleStatusChange = (status: string) => {
    const newStatuses = filters.status?.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...(filters.status || []), status];
    onFilterChange({ ...filters, status: newStatuses });
  };

  const handleSourceChange = (source: string) => {
    const newSources = filters.source?.includes(source)
      ? filters.source.filter(s => s !== source)
      : [...(filters.source || []), source];
    onFilterChange({ ...filters, source: newSources });
  };

  const handleAssigneeChange = (userId: string) => {
    const newAssignees = filters.assignedTo?.includes(userId)
      ? filters.assignedTo.filter(id => id !== userId)
      : [...(filters.assignedTo || []), userId];
    onFilterChange({ ...filters, assignedTo: newAssignees });
  };

  return (
    <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Status</h3>
          <div className="space-y-2">
            {['new', 'contacted', 'qualified', 'converted'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="form-checkbox h-4 w-4 rounded border-dark-600 bg-dark-600 text-accent-purple focus:ring-accent-purple"
                />
                <span className="ml-2 text-sm text-gray-300 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Source</h3>
          <div className="space-y-2">
            {['website', 'referral', 'linkedin', 'cold-outreach', 'event', 'other'].map((source) => (
              <label key={source} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.source?.includes(source)}
                  onChange={() => handleSourceChange(source)}
                  className="form-checkbox h-4 w-4 rounded border-dark-600 bg-dark-600 text-accent-purple focus:ring-accent-purple"
                />
                <span className="ml-2 text-sm text-gray-300 capitalize">{source}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Assigned To</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <label key={user.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.assignedTo?.includes(user.id)}
                  onChange={() => handleAssigneeChange(user.id)}
                  className="form-checkbox h-4 w-4 rounded border-dark-600 bg-dark-600 text-accent-purple focus:ring-accent-purple"
                />
                <span className="ml-2 text-sm text-gray-300">{user.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Sort By</h3>
          <select
            value={`${sort.field}-${sort.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              onSortChange({ field, direction: direction as 'asc' | 'desc' });
            }}
            className="w-full input"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="company-asc">Company (A-Z)</option>
            <option value="company-desc">Company (Z-A)</option>
          </select>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Date Range</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="input text-sm"
              />
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="input text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}