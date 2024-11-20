import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Deal } from '../types';
import DealCard from './DealCard';

interface SortableDealCardProps {
  deal: Deal;
  disabled?: boolean;
  showDropIndicator?: boolean;
  dropPosition?: 'top' | 'bottom';
}

const SortableDealCard = ({ deal, disabled = false, showDropIndicator = false, dropPosition = 'bottom' }: SortableDealCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: deal.id,
    data: {
      type: 'deal',
      deal
    },
    disabled
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {showDropIndicator && dropPosition === 'top' && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-accent-purple rounded-full" />
      )}
      <div
        {...attributes}
        {...listeners}
        className={`touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        data-stage={deal.stage}
      >
        <DealCard deal={deal} isDragging={isDragging} />
      </div>
      {showDropIndicator && dropPosition === 'bottom' && (
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-accent-purple rounded-full" />
      )}
    </div>
  );
};

export default SortableDealCard;