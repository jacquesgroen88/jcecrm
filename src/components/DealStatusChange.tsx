import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Trophy, XCircle, Undo } from 'lucide-react';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import { useDealStore } from '../store/dealStore';
import { useActivityStore } from '../store/activityStore';

interface DealStatusChangeProps {
  dealId: string;
  onClose: () => void;
}

export default function DealStatusChange({ dealId, onClose }: DealStatusChangeProps) {
  const [isWinDialogOpen, setIsWinDialogOpen] = useState(false);
  const [isLoseDialogOpen, setIsLoseDialogOpen] = useState(false);
  const [lostReason, setLostReason] = useState('');
  const [lostNotes, setLostNotes] = useState('');
  
  const { markAsWon, markAsLost, reopenDeal, deals } = useDealStore();
  const { addActivity } = useActivityStore();
  const deal = deals.find(d => d.id === dealId);

  const handleWin = () => {
    markAsWon(dealId);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsWinDialogOpen(false);
    onClose();

    addActivity({
      type: 'system',
      title: 'Deal Won',
      description: 'Deal was marked as won',
      performedBy: 'Current User',
      relatedTo: {
        type: 'deal',
        id: dealId
      }
    });
  };

  const handleLose = () => {
    if (!lostReason) return;

    markAsLost(dealId, {
      id: uuidv4(),
      dealId,
      reason: lostReason,
      notes: lostNotes,
      timestamp: new Date().toISOString()
    });
    setIsLoseDialogOpen(false);
    onClose();

    addActivity({
      type: 'system',
      title: 'Deal Lost',
      description: `Deal was marked as lost. Reason: ${lostReason}`,
      performedBy: 'Current User',
      relatedTo: {
        type: 'deal',
        id: dealId
      }
    });
  };

  const handleReopen = () => {
    reopenDeal(dealId);
    onClose();

    addActivity({
      type: 'system',
      title: 'Deal Reopened',
      description: 'Deal was reopened',
      performedBy: 'Current User',
      relatedTo: {
        type: 'deal',
        id: dealId
      }
    });
  };

  if (deal?.status === 'won' || deal?.status === 'lost') {
    return (
      <button
        onClick={handleReopen}
        className="btn btn-secondary"
      >
        <Undo className="w-4 h-4 mr-2" />
        Reopen Deal
      </button>
    );
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => setIsWinDialogOpen(true)}
        className="btn bg-green-500 hover:bg-green-600 text-white"
      >
        <Trophy className="w-4 h-4 mr-2" />
        Mark as Won
      </button>

      <button
        onClick={() => setIsLoseDialogOpen(true)}
        className="btn bg-red-500 hover:bg-red-600 text-white"
      >
        <XCircle className="w-4 h-4 mr-2" />
        Mark as Lost
      </button>

      {/* Win Confirmation Dialog */}
      <Dialog
        open={isWinDialogOpen}
        onClose={() => setIsWinDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-dark-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <Dialog.Title className="text-xl font-semibold text-white">
                Mark Deal as Won
              </Dialog.Title>
            </div>

            <p className="text-gray-400 mb-6">
              Are you sure you want to mark this deal as won? This will move the deal
              to your won deals section.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsWinDialogOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleWin}
                className="btn bg-green-500 hover:bg-green-600 text-white"
              >
                Confirm Win
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Lose Dialog */}
      <Dialog
        open={isLoseDialogOpen}
        onClose={() => setIsLoseDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-dark-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <Dialog.Title className="text-xl font-semibold text-white">
                Mark Deal as Lost
              </Dialog.Title>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Reason for Loss
                </label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="w-full input"
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="price">Price too high</option>
                  <option value="competition">Lost to competition</option>
                  <option value="timing">Bad timing</option>
                  <option value="needs">Product doesn't meet needs</option>
                  <option value="budget">No budget</option>
                  <option value="contact">Lost contact</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  className="w-full input min-h-[100px]"
                  placeholder="Add any additional context..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsLoseDialogOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleLose}
                className="btn bg-red-500 hover:bg-red-600 text-white"
                disabled={!lostReason}
              >
                Mark as Lost
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}