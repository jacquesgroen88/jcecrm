import React, { useState } from 'react';
import { useLeadStore } from '../store/leadStore';
import { useUserStore } from '../store/userStore';
import { Plus, Upload, Download, Search, Grid, List, Filter } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import Papa from 'papaparse';
import ImportMappingModal from './ImportMappingModal';
import LeadList from './LeadList';
import LeadGrid from './LeadGrid';
import NewLeadModal from './NewLeadModal';
import SearchBar from './SearchBar';
import ViewToggle from './shared/ViewToggle';
import LeadFilters from './LeadFilters';

export default function LeadsPage() {
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Changed default to list
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    source: [],
    assignedTo: [],
    dateRange: { start: '', end: '' }
  });
  const [sort, setSort] = useState({ field: 'createdAt', direction: 'desc' });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        setImportData(results.data);
        setIsImporting(true);
      },
      header: true,
      skipEmptyLines: true
    });
  };

  return (
    <div className="p-6 bg-dark-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Leads</h1>
            <p className="text-gray-400">Manage and track your incoming leads</p>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search leads..."
            />
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-secondary ${showFilters ? 'bg-dark-600' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button
              onClick={() => setIsAddingLead(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6">
            <LeadFilters
              filters={filters}
              onFilterChange={setFilters}
              sort={sort}
              onSortChange={setSort}
            />
          </div>
        )}

        {viewMode === 'grid' ? (
          <LeadGrid
            searchQuery={searchQuery}
            filters={filters}
            sort={sort}
          />
        ) : (
          <LeadList
            searchQuery={searchQuery}
            filters={filters}
            sort={sort}
          />
        )}
      </div>

      <NewLeadModal
        isOpen={isAddingLead}
        onClose={() => setIsAddingLead(false)}
      />

      <ImportMappingModal
        isOpen={isImporting}
        onClose={() => setIsImporting(false)}
        data={importData}
      />
    </div>
  );
}