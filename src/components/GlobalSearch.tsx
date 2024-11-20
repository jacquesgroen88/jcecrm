import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Users, DollarSign } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useCompanyStore } from '../store/companyStore';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const deals = useDealStore((state) => state.deals);
  const contacts = useContactStore((state) => state.contacts);
  const companies = useCompanyStore((state) => state.companies);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(query.toLowerCase()) ||
    deal.company.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(query.toLowerCase()) ||
    contact.company.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search deals, contacts, companies..."
          className="w-96 pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 rounded-lg border border-dark-700 shadow-xl z-50">
          {filteredDeals.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-sm font-medium text-gray-400">Deals</div>
              {filteredDeals.map(deal => (
                <button
                  key={deal.id}
                  onClick={() => handleNavigate(`/deals/${deal.id}`)}
                  className="w-full px-3 py-2 flex items-center space-x-3 hover:bg-dark-700 rounded-lg"
                >
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 text-left">
                    <div className="text-white">{deal.title}</div>
                    <div className="text-sm text-gray-400">{deal.company}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {filteredCompanies.length > 0 && (
            <div className="p-2 border-t border-dark-700">
              <div className="px-3 py-2 text-sm font-medium text-gray-400">Companies</div>
              {filteredCompanies.map(company => (
                <button
                  key={company.id}
                  onClick={() => handleNavigate(`/companies/${company.id}`)}
                  className="w-full px-3 py-2 flex items-center space-x-3 hover:bg-dark-700 rounded-lg"
                >
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 text-left">
                    <div className="text-white">{company.name}</div>
                    <div className="text-sm text-gray-400">{company.industry}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {filteredContacts.length > 0 && (
            <div className="p-2 border-t border-dark-700">
              <div className="px-3 py-2 text-sm font-medium text-gray-400">Contacts</div>
              {filteredContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => handleNavigate(`/contacts/${contact.id}`)}
                  className="w-full px-3 py-2 flex items-center space-x-3 hover:bg-dark-700 rounded-lg"
                >
                  <Users className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 text-left">
                    <div className="text-white">{contact.name}</div>
                    <div className="text-sm text-gray-400">{contact.company}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}