import React, { useState } from 'react';
import { useCompanyStore } from '../store/companyStore';
import { useContactStore } from '../store/contactStore';
import { useDealStore } from '../store/dealStore';
import { Building2, Globe, Users, DollarSign, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViewToggle from './shared/ViewToggle';
import SearchBar from './SearchBar';
import NewCompanyModal from './NewCompanyModal';

export default function CompaniesPage() {
  const { companies, viewMode, setViewMode } = useCompanyStore();
  const contacts = useContactStore((state) => state.contacts);
  const deals = useDealStore((state) => state.deals);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const navigate = useNavigate();

  const getCompanyContacts = (contactIds: string[]) => {
    return contacts.filter((contact) => contactIds.includes(contact.id));
  };

  const getCompanyDeals = (dealIds: string[]) => {
    return deals.filter((deal) => dealIds.includes(deal.id));
  };

  const getTotalDealValue = (dealIds: string[]) => {
    return getCompanyDeals(dealIds).reduce((sum, deal) => sum + deal.value, 0);
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-dark-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Companies</h1>
            <p className="text-gray-400">Track and manage your business relationships</p>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search companies..."
            />
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            <button 
              onClick={() => setIsAddingCompany(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              onClick={() => navigate(`/companies/${company.id}`)}
              className="card p-6 cursor-pointer hover:border-accent-purple/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                  <p className="text-sm text-gray-400">{company.industry}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-dark-600 text-gray-300">
                  {company.size} employees
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Globe className="w-4 h-4 mr-2 text-gray-400" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-purple"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {company.website}
                  </a>
                </div>

                <div className="flex items-center text-gray-300">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  {getCompanyContacts(company.contacts).length} contacts
                </div>

                <div className="flex items-center text-gray-300">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(getTotalDealValue(company.deals))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Active Deals: {getCompanyDeals(company.deals).length}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredCompanies.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No companies found
            </div>
          )}
        </div>
      </div>

      <NewCompanyModal
        isOpen={isAddingCompany}
        onClose={() => setIsAddingCompany(false)}
      />
    </div>
  );
}