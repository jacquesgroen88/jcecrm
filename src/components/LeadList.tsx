import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeadStore } from '../store/leadStore';
import { format } from 'date-fns';
import { Mail, Phone, Building2, ArrowRight, Trash2, Edit2, CheckSquare } from 'lucide-react';
import { LeadFilter, LeadSort } from '../types';
import BulkEditModal from './BulkEditModal';

interface LeadListProps {
  searchQuery: string;
  filters: LeadFilter;
  sort: LeadSort;
}

export default function LeadList({ searchQuery, filters, sort }: LeadListProps) {
  const navigate = useNavigate();
  const { leads, convertToOpportunity, deleteLeads, updateLeads } = useLeadStore();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

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
      if (filters.source?.length && !filters.source.includes(lead.source || '')) {
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
          return direction * ((a.name || '').localeCompare(b.name || ''));
        case 'company':
          return direction * ((a.company || '').localeCompare(b.company || ''));
        case 'createdAt':
          return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        default:
          return 0;
      }
    });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) {
      deleteLeads(selectedLeads);
      setSelectedLeads([]);
    }
  };

  return (
    <div>
      {selectedLeads.length > 0 && (
        <div className="mb-4 p-4 bg-dark-800 rounded-lg border border-dark-700 flex items-center justify-between">
          <div className="text-white">
            {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkEdit(true)}
              className="btn btn-secondary"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="btn btn-secondary text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-dark-600 bg-dark-600 text-accent-purple focus:ring-accent-purple"
                />
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Phone</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-dark-700 hover:bg-dark-700/50">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                    className="rounded border-dark-600 bg-dark-600 text-accent-purple focus:ring-accent-purple"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{lead.name || 'Unnamed Lead'}</div>
                  <div className="text-sm text-gray-400">{lead.position}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-gray-300">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    {lead.company || 'No Company'}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {lead.email && (
                    <a href={`mailto:${lead.email}`} className="flex items-center text-gray-300 hover:text-accent-purple">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {lead.email}
                    </a>
                  )}
                </td>
                <td className="py-3 px-4">
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="flex items-center text-gray-300 hover:text-accent-purple">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {lead.phone}
                    </a>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    (lead.status || 'new') === 'new' ? 'bg-blue-500/10 text-blue-400' :
                    (lead.status || 'new') === 'contacted' ? 'bg-yellow-500/10 text-yellow-400' :
                    (lead.status || 'new') === 'qualified' ? 'bg-green-500/10 text-green-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {(lead.status || 'new').charAt(0).toUpperCase() + (lead.status || 'new').slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => convertToOpportunity(lead.id)}
                      className="p-2 hover:bg-dark-600 rounded-lg transition-colors text-gray-400 hover:text-accent-purple"
                      title="Convert to Deal"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No leads found
          </div>
        )}
      </div>

      <BulkEditModal
        isOpen={showBulkEdit}
        onClose={() => setShowBulkEdit(false)}
        selectedLeads={selectedLeads}
        onUpdate={(updates) => {
          updateLeads(selectedLeads, updates);
          setShowBulkEdit(false);
          setSelectedLeads([]);
        }}
      />
    </div>
  );
}