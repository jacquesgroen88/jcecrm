import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, DollarSign, Calendar, Clock, MoreVertical, User } from 'lucide-react';
import { format } from 'date-fns';
import { Deal } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import { useDealStore } from '../store/dealStore';
import { useUserStore } from '../store/userStore';
import QuickActions from './QuickActions';
import clsx from 'clsx';

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export default function DealCard({ deal, isDragging = false }: DealCardProps) {
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const { users } = useUserStore();
  const [showQuickActions, setShowQuickActions] = useState(false);

  const assignedUser = users.find(u => u.id === deal.assignedTo);

  const handleQuickActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuickActions(!showQuickActions);
  };

  return (
    <div
      onClick={() => navigate(`/deals/${deal.id}`)}
      className={clsx(
        'bg-dark-800 rounded-lg p-4 border cursor-pointer select-none relative',
        isDragging
          ? 'border-accent-purple shadow-lg shadow-accent-purple/20 rotate-3 scale-105'
          : 'border-dark-700 hover:border-dark-600 hover:shadow-md'
      )}
      style={{
        transform: isDragging ? 'rotate(3deg)' : undefined,
        transition: 'transform 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)'
      }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-white">{deal.title}</h3>
        <button
          onClick={handleQuickActions}
          className="p-1 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2 mt-3">
        {settings.display.showCompany && (
          <div className="flex items-center text-sm text-gray-400">
            <Building2 className="w-4 h-4 mr-2 text-gray-500" />
            <span>{deal.company}</span>
          </div>
        )}
        
        {settings.display.showValue && (
          <div className="flex items-center text-sm text-gray-400">
            <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
            <span>{new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(deal.value)}</span>
          </div>
        )}
        
        {settings.display.showExpectedCloseDate && (
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>{format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}</span>
          </div>
        )}

        {settings.display.showCreatedDate && (
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>Created {format(new Date(deal.createdAt), 'MMM d, yyyy')}</span>
          </div>
        )}

        {assignedUser && (
          <div className="flex items-center text-sm text-gray-400">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span>{assignedUser.name}</span>
          </div>
        )}
      </div>

      {settings.display.showProbability && deal.stage !== 'closed-lost' && deal.stage !== 'closed-won' && (
        <div className="mt-3 pt-3 border-t border-dark-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Probability: {deal.probability}%
            </div>
            <div className="progress-bar w-16">
              <div
                className="progress-value"
                style={{ width: `${deal.probability}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {settings.display.showCustomFields && deal.customFields && deal.customFields.length > 0 && (
        <div className="mt-3 pt-3 border-t border-dark-700">
          <div className="space-y-2">
            {deal.customFields.map((field) => (
              <div key={field.id} className="flex justify-between text-sm">
                <span className="text-gray-400">{field.label}:</span>
                <span className="text-gray-300">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showQuickActions && (
        <QuickActions
          dealId={deal.id}
          onClose={() => setShowQuickActions(false)}
        />
      )}
    </div>
  );
}