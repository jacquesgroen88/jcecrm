import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDealStore } from '../store/dealStore';
import { useUserStore } from '../store/userStore';
import { useContactStore } from '../store/contactStore';
import { format } from 'date-fns';
import {
  Building2, DollarSign, Calendar, ArrowLeft,
  Archive, Trash2, RefreshCw, Clock, UserPlus,
  ExternalLink, Mail, Phone, Tag
} from 'lucide-react';
import DealStatusChange from './DealStatusChange';
import NotesSection from './NotesSection';
import TaskList from './TaskList';
import ActivityTimeline from './ActivityTimeline';
import DealAssignmentModal from './DealAssignmentModal';
import ContactAssignmentPanel from './ContactAssignmentPanel';

export default function DealDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deals, archiveDeal, unarchiveDeal, deleteDeal } = useDealStore();
  const { currentUser, users } = useUserStore();
  const { contacts } = useContactStore();
  const isAdmin = currentUser?.role === 'admin';
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'activity'>('notes');
  const [isAssigning, setIsAssigning] = useState(false);

  const deal = deals.find(d => d.id === id);
  const contact = deal?.contactId ? contacts.find(c => c.id === deal.contactId) : null;

  if (!deal) {
    return (
      <div className="min-h-screen bg-dark-900 pt-24 px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">Deal not found</h2>
          <button
            onClick={() => navigate('/deals')}
            className="mt-4 btn btn-primary inline-flex items-center"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/deals')}
          className="mb-6 btn btn-secondary inline-flex items-center"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Deals
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">{deal.title}</h1>
                  <p className="text-gray-400">{deal.stage}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAssigning(true)}
                    className="btn btn-secondary"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {deal.assignedTo ? 'Reassign' : 'Assign'}
                  </button>
                  <DealStatusChange dealId={deal.id} onClose={() => {}} />
                </div>
              </div>

              {deal.assignedTo && (
                <div className="mb-4 p-3 bg-dark-700 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {users.find(u => u.id === deal.assignedTo)?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Assigned to</p>
                      <p className="text-white">{users.find(u => u.id === deal.assignedTo)?.name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Company</label>
                    <div className="flex items-center mt-1">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-white">{deal.company}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Value</label>
                    <div className="flex items-center mt-1">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-white">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(deal.value)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Expected Close Date</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-white">
                        {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Created</label>
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-white">
                        {format(new Date(deal.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-dark-700">
                  {deal.isArchived ? (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to unarchive this deal?')) {
                          unarchiveDeal(deal.id);
                        }
                      }}
                      className="btn btn-secondary"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Unarchive
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to archive this deal?')) {
                          archiveDeal(deal.id);
                        }
                      }}
                      className="btn btn-secondary"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
                        deleteDeal(deal.id);
                        navigate('/deals');
                      }
                    }}
                    className="btn btn-secondary text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="card">
              <div className="border-b border-dark-700">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'notes'
                        ? 'text-white border-b-2 border-accent-purple'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'tasks'
                        ? 'text-white border-b-2 border-accent-purple'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'activity'
                        ? 'text-white border-b-2 border-accent-purple'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Activity
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'notes' && <NotesSection dealId={deal.id} />}
                {activeTab === 'tasks' && (
                  <TaskList entityType="deal" entityId={deal.id} />
                )}
                {activeTab === 'activity' && (
                  <ActivityTimeline entityId={deal.id} />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {contact ? (
              <div className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold text-white">Contact Details</h2>
                  <button
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                    className="text-accent-purple hover:text-accent-purple/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-white">{contact.name}</h3>
                    <p className="text-sm text-gray-400">{contact.position}</p>
                  </div>

                  <div className="space-y-3">
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center text-gray-300 hover:text-accent-purple"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {contact.email}
                    </a>
                    
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center text-gray-300 hover:text-accent-purple"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {contact.phone}
                    </a>
                  </div>

                  {contact.tags && contact.tags.length > 0 && (
                    <div className="pt-3 border-t border-dark-700">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                          {contact.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full bg-dark-600 text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <ContactAssignmentPanel dealId={deal.id} />
            )}
          </div>
        </div>
      </div>

      <DealAssignmentModal
        isOpen={isAssigning}
        onClose={() => setIsAssigning(false)}
        dealId={deal.id}
      />
    </div>
  );
}