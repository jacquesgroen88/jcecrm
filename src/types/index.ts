// ... existing types ...

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  position?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  source?: string;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}