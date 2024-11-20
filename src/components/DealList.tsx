import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Building2, Calendar, DollarSign, ChevronRight, Clock, RefreshCw } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { Deal } from '../types';

interface DealListProps {
  filter: 'active' | 'won' | 'lost';
}

export default function DealList({ filter }: DealListProps) {
  const navigate = useNavigate();
  const { deals, stages, reopenDeal } = useDealStore();
  const filteredDeals = deals.filter(deal => {
    switch (filter) {
      case 'active':
        return !['closed-won', 'closed-lost'].includes(deal.stage);
      case 'won':
        return deal.stage === 'closed-won';
      case 'lost':
        return deal.stage === 'closed-lost';
      default:
        return true;
    }
  });

  const getStageName = (stageId: string) => {
    return stages.find(s => s.id === stageId)?.name || 'Unknown Stage';
  };

  const handleReopen = (e: React.MouseEvent, deal: Deal) => {
    e.stopPropagation();
    reopenDeal(deal.id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-700">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Deal</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Stage</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Value</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Expected Close</th>
            <th className="text-center py-3 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeals.map((deal) => (
            <tr
              key={deal.id}
              onClick={() => navigate(`/deals/${deal.id}`)}
              className="border-b border-dark-700 hover:bg-dark-700/50 cursor-pointer"
            >
              <td className="py-3 px-4">
                <div className="font-medium text-white">{deal.title}</div>
                <div className="text-sm text-gray-400">{deal.contact}</div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    deal.stage === 'closed-won' ? 'bg-green-500/10 text-green-400' :
                    deal.stage === 'closed-lost' ? 'bg-red-500/10 text-red-400' :
                    'bg-dark-600 text-white'
                  }`}>
                    {getStageName(deal.stage)}
                  </span>
                  {(deal.stage === 'closed-won' || deal.stage === 'closed-lost') && (
                    <button
                      onClick={(e) => handleReopen(e, deal)}
                      className="p-1 hover:bg-dark-600 rounded-full transition-colors"
                      title="Reopen Deal"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-400 hover:text-accent-purple" />
                    </button>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-white">{deal.company}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-white">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(deal.value)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-white">
                    {format(new Date(deal.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-white">
                    {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-center">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </td>
            </tr>
          ))}
          {filteredDeals.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-400">
                No deals found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}