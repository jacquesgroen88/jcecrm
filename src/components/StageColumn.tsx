import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Stage, Deal } from '../types';
import SortableDealCard from './SortableDealCard';

interface StageColumnProps {
  stage: Stage;
  deals: Deal[];
  isOver: boolean;
  dragState: {
    dealId: string | null;
    stageId: string | null;
    overId: string | null;
    offsetY: number | null;
  };
}

const StageColumn = ({ stage, deals, isOver, dragState }: StageColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const winProbability = deals.reduce((sum, deal) => sum + deal.probability, 0) / (deals.length || 1);

  return (
    <div className="flex-shrink-0 w-80">
      <div
        ref={setNodeRef}
        className={`bg-dark-800 rounded-xl p-4 border transition-all duration-200 ${
          isOver
            ? 'border-accent-purple ring-2 ring-accent-purple/30 bg-dark-700/50' 
            : 'border-dark-700 hover:border-dark-600'
        }`}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-white">{stage.name}</h2>
            <span className="text-sm px-2 py-1 rounded-full bg-dark-700 text-gray-300">
              {deals.length}
            </span>
          </div>
          
          <div className="text-sm text-gray-400">
            <div>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(totalValue)}
            </div>
            <div className="text-xs">
              Win Rate: {Math.round(winProbability)}%
            </div>
          </div>
        </div>

        <div className="min-h-[200px]">
          <SortableContext
            items={deals.map(deal => deal.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {deals.map((deal) => (
                <SortableDealCard 
                  key={deal.id} 
                  deal={deal}
                  showDropIndicator={dragState.overId === deal.id}
                  dropPosition={dragState.offsetY !== null && dragState.offsetY < 50 ? 'top' : 'bottom'}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default StageColumn;