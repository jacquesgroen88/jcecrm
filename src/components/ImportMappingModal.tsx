import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useLeadStore } from '../store/leadStore';

interface ImportMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
}

const FIELD_MAPPINGS = {
  name: ['name', 'full name', 'contact name'],
  email: ['email', 'email address'],
  phone: ['phone', 'phone number', 'telephone'],
  company: ['company', 'company name', 'organization'],
  source: ['source', 'lead source', 'origin'],
  status: ['status', 'lead status'],
};

export default function ImportMappingModal({ isOpen, onClose, data }: ImportMappingModalProps) {
  const { importLeads } = useLeadStore();
  const [mappings, setMappings] = useState<Record<string, string>>({});

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  // Auto-detect mappings only when data changes
  useEffect(() => {
    if (data.length === 0) return;

    const autoMappings: Record<string, string> = {};
    const availableHeaders = Object.keys(data[0]).map(h => h.toLowerCase());
    
    Object.entries(FIELD_MAPPINGS).forEach(([field, possibilities]) => {
      // Find the first matching header that hasn't been used yet
      const matchingHeader = possibilities.find(p => 
        availableHeaders.includes(p) && 
        !Object.values(autoMappings).includes(p)
      );
      
      if (matchingHeader) {
        // Use the original case from headers
        const originalHeader = headers.find(h => h.toLowerCase() === matchingHeader);
        if (originalHeader) {
          autoMappings[field] = originalHeader;
        }
      }
    });

    setMappings(autoMappings);
  }, [data]); // Only depend on data changes

  const handleImport = () => {
    const mappedData = data.map(row => {
      const mappedRow: Record<string, any> = {};
      Object.entries(mappings).forEach(([field, header]) => {
        mappedRow[field] = row[header];
      });
      return mappedRow;
    });

    importLeads(mappedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <Dialog.Title className="text-lg font-semibold text-white">
              Map Import Fields
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(FIELD_MAPPINGS).map(([field, _]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                    {field}
                  </label>
                  <select
                    value={mappings[field] || ''}
                    onChange={(e) => setMappings({
                      ...mappings,
                      [field]: e.target.value
                    })}
                    className="w-full input"
                  >
                    <option value="">Select column...</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Preview</h3>
              <div className="bg-dark-700 rounded-lg p-4 overflow-auto max-h-48">
                <pre className="text-sm text-gray-400">
                  {JSON.stringify(data.slice(0, 3), null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="btn btn-primary"
                disabled={Object.keys(mappings).length === 0}
              >
                Import Leads
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}