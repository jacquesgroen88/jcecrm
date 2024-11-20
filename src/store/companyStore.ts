import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company } from '../types';

const sampleCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corp',
    industry: 'Technology',
    size: '1000+',
    website: 'https://acme.example.com',
    contacts: ['1'],
    deals: ['1']
  },
  {
    id: '2',
    name: 'TechStart Inc',
    industry: 'Software',
    size: '50-200',
    website: 'https://techstart.example.com',
    contacts: ['2'],
    deals: ['2']
  },
  {
    id: '3',
    name: 'Global Systems Ltd',
    industry: 'IT Services',
    size: '500-1000',
    website: 'https://globalsys.example.com',
    contacts: ['3'],
    deals: ['3']
  },
  {
    id: '4',
    name: 'SecureNet',
    industry: 'Cybersecurity',
    size: '200-500',
    website: 'https://securenet.example.com',
    contacts: ['4'],
    deals: ['4']
  },
  {
    id: '5',
    name: 'InnoApp Solutions',
    industry: 'Mobile Development',
    size: '20-50',
    website: 'https://innoapp.example.com',
    contacts: ['5'],
    deals: ['5']
  },
  {
    id: '6',
    name: 'Future Tech Corp',
    industry: 'Artificial Intelligence',
    size: '100-200',
    website: 'https://futuretech.example.com',
    contacts: ['6'],
    deals: ['6']
  },
  {
    id: '7',
    name: 'DataViz Pro',
    industry: 'Data Analytics',
    size: '50-100',
    website: 'https://dataviz.example.com',
    contacts: ['7'],
    deals: ['7']
  },
  {
    id: '8',
    name: 'SecureEd Solutions',
    industry: 'Education Technology',
    size: '10-50',
    website: 'https://secured.example.com',
    contacts: ['8'],
    deals: ['8']
  }
];

interface CompanyStore {
  companies: Company[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      companies: sampleCompanies,
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      addCompany: (company) =>
        set((state) => ({
          companies: [...state.companies, company],
        })),
      updateCompany: (id, updatedCompany) =>
        set((state) => ({
          companies: state.companies.map((company) =>
            company.id === id ? { ...company, ...updatedCompany } : company
          ),
        })),
      deleteCompany: (id) =>
        set((state) => ({
          companies: state.companies.filter((company) => company.id !== id),
        })),
    }),
    {
      name: 'company-store',
      version: 1,
    }
  )
);