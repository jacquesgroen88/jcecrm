import React from 'react';
import { Dialog } from '@headlessui/react';
import { Phone, Mail, Calendar, MessageSquare, Plus, X } from 'lucide-react';
import { useActivityStore } from '../store/activityStore';
import { v4 as uuidv4 } from 'uuid';

interface QuickActionsProps {
  dealId: string;
  onClose: () => void;
}

export default function QuickActions({ dealId, onClose }: QuickActionsProps) {
  const { addActivity } = useActivityStore();
  const [note, setNote] = React.useState('');
  const [showNoteInput, setShowNoteInput] = React.useState(false);

  const handleLogCall = () => {
    addActivity({
      type: 'update',
      title: 'Call Logged',
      description: 'Phone call was made',
      entityId: dealId,
      entityType: 'deal'
    });
    onClose();
  };

  const handleLogEmail = () => {
    addActivity({
      type: 'update',
      title: 'Email Sent',
      description: 'Email was sent',
      entityId: dealId,
      entityType: 'deal'
    });
    onClose();
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    
    addActivity({
      type: 'update',
      title: 'Note Added',
      description: note,
      entityId: dealId,
      entityType: 'deal'
    });
    setNote('');
    setShowNoteInput(false);
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-dark-800 rounded-lg shadow-lg border border-dark-700 p-2 z-50">
      <div className="space-y-1">
        <button
          onClick={handleLogCall}
          className="w-full flex items-center gap-2 p-2 text-left text-gray-300 hover:bg-dark-700 rounded-lg"
        >
          <Phone className="w-4 h-4" />
          Log Call
        </button>
        
        <button
          onClick={handleLogEmail}
          className="w-full flex items-center gap-2 p-2 text-left text-gray-300 hover:bg-dark-700 rounded-lg"
        >
          <Mail className="w-4 h-4" />
          Log Email
        </button>
        
        <button
          onClick={() => setShowNoteInput(true)}
          className="w-full flex items-center gap-2 p-2 text-left text-gray-300 hover:bg-dark-700 rounded-lg"
        >
          <MessageSquare className="w-4 h-4" />
          Add Note
        </button>
        
        <button
          className="w-full flex items-center gap-2 p-2 text-left text-gray-300 hover:bg-dark-700 rounded-lg"
        >
          <Calendar className="w-4 h-4" />
          Schedule Meeting
        </button>
      </div>

      {showNoteInput && (
        <Dialog
          open={showNoteInput}
          onClose={() => setShowNoteInput(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Add Note</h3>
                  <button
                    onClick={() => setShowNoteInput(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-32 input resize-none"
                  placeholder="Enter your note..."
                />

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowNoteInput(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="btn btn-primary"
                    disabled={!note.trim()}
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}