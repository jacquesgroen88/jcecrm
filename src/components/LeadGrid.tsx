import React from 'react';
import { useLeadStore } from '../store/leadStore';
import { useUserStore } from '../store/userStore';
import { format } from 'date-fns';
import { Mail, Phone, Building2, Calendar, ArrowRight, User } from 'lucide-react';
import { LeadFilter, LeadSort } from '../types';

interface LeadGridProps {
  searchQuery: string;
  filters: LeadFilter;
  sort: LeadSort;
}

const LeadGrid = ({ searchQuery, filters, sort }: LeadGridProps) => {
  const { leads, convertToOpportunity } = useLeadStore();
  const { users } = useUserStore();

  const filteredLeads = leads
    .filter(lead => {
      // Search filter
      if (searchQuery && !lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !lead.email?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status?.length && !filters.status.includes(lead.status || 'new')) {
        return false;
      }

      // Source filter
      if (filters.source?.length && !filters.source.includes(lead.source || 'direct')) {
        return false;
      }

      // Assigned To filter
      if (filters.assignedTo?.length && !filters.assignedTo.includes(lead.assignedTo || '')) {
        return false;
      }

      // Date range filter
      if (filters.dateRange?.start && new Date(lead.createdAt) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange?.end && new Date(lead.createdAt) > new Date(filters.dateRange.end)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      switch (sort.field) {
        case 'name':
          return direction * (a.name || '').localeCompare(b.name || '');
        case 'company':
          return direction * (a.company || '').localeCompare(b.company || '');
        case 'createdAt':
          return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        default:
          return 0;
      }
    });

  const getAssignedUserName = (userId: string | undefined) => {
    if (!userId) return null;
    const user = users.find(u => u.id === userId);
    return user ? user.name : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLeads.map((lead) => (
        <div key={lead.id} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{lead.name || 'Unnamed Lead'}</h3>
              <p className="text-sm text-gray-400">{lead.position || 'No Position'}</p>
            </div>
            <button
              onClick={() => convertToOpportunity(lead.id)}
              className="btn btn-primary"
              disabled={lead.status === 'converted'}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Convert
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center text-gray-300">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
              {lead.company || 'No Company'}
            </div>
            
            <div className="flex items-center text-gray-300">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <a href={`mailto:${lead.email}`} className="hover:text-accent-purple">
                {lead.email}
              </a>
            </div>
            
            {lead.phone && (
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <a href={`tel:${lead.phone}`} className="hover:text-accent-purple">
                  {lead.phone}
                </a>
              </div>
            )}

            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              Created: {format(new Date(lead.createdAt), 'MMM d, yyyy')}
            </div>

            {lead.assignedTo && (
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                {getAssignedUserName(lead.assignedTo) || 'Unassigned'}
              </div>
            )}
          </div>

          {lead.notes && (
            <div className="mt-4 pt-4 border-t border-dark-700">
              <p className="text-gray-400 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              (lead.status || 'new') === 'new' ? 'bg-blue-500/10 text-blue-400' :
              (lead.status || 'new') === 'contacted' ? 'bg-yellow-500/10 text-yellow-400' :
              (lead.status || 'new') === 'qualified' ? 'bg-green-500/10 text-green-400' :
              'bg-purple-500/10 text-purple-400'
            }`}>
              {((lead.status || 'new').charAt(0).toUpperCase() + (lead.status || 'new').slice(1))}
            </span>
            {lead.source && (
              <span className="px-2 py-1 text-xs rounded-full bg-dark-600 text-gray-300">
                {lead.source}
              </span>
            )}
          </div>
        </div>
      ))}

      {filteredLeads.length === 0 && (
        <div className="col-span-3 text-center py-12 text-gray-400">
          No leads found
        </div>
      )}
    </div>
  );
};

export default LeadGrid;