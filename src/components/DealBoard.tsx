import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverEvent,
  defaultDropAnimation,
  DropAnimation,
  KeyboardSensor,
  UniqueIdentifier,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDealStore } from '../store/dealStore';
import { useUserStore } from '../store/userStore';
import StageColumn from './StageColumn';
import NewDealButton from './NewDealButton';
import ViewToggle from './shared/ViewToggle';
import DealList from './DealList';
import DealCard from './DealCard';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Deal } from '../types';

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

interface DragState {
  dealId: UniqueIdentifier | null;
  stageId: string | null;
  overId: UniqueIdentifier | null;
  offsetY: number | null;
}

export default function DealBoard() {
  const { deals, stages, moveDeal, viewMode, setViewMode, showArchived, setShowArchived } = useDealStore();
  const { currentUser } = useUserStore();
  const isAdmin = currentUser?.role === 'admin';
  const [activeFilter, setActiveFilter] = useState<'active' | 'won' | 'lost'>('active');
  const [dragState, setDragState] = useState<DragState>({
    dealId: null,
    stageId: null,
    overId: null,
    offsetY: null
  });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find(d => d.id === active.id);
    if (deal) {
      setDragState({
        dealId: active.id,
        stageId: deal.stage,
        overId: null,
        offsetY: null
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id;
    const overData = over.data.current;
    const activeData = active.data.current;

    // Get the relative Y position of the cursor in the over element
    const overRect = over.rect;
    const offsetY = event.activatorEvent instanceof MouseEvent 
      ? event.activatorEvent.clientY - overRect.top
      : null;

    setDragState(prev => ({
      ...prev,
      overId: overId as UniqueIdentifier,
      offsetY
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setDragState({
        dealId: null,
        stageId: null,
        overId: null,
        offsetY: null
      });
      return;
    }

    const dealId = active.id as string;
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    const overId = over.id;
    const overDeal = deals.find(d => d.id === overId);
    const overStage = stages.find(s => s.id === overId);

    // If dropping over a stage
    if (overStage) {
      if (deal.stage !== overStage.id) {
        moveDeal(dealId, deal.stage, overStage.id);
      }
    }
    // If dropping over another deal
    else if (overDeal) {
      const targetStage = overDeal.stage;
      const isAbove = dragState.offsetY !== null && dragState.offsetY < over.rect.height / 2;
      
      if (deal.stage !== targetStage) {
        moveDeal(dealId, deal.stage, targetStage, overDeal.id, isAbove);
      }
    }

    setDragState({
      dealId: null,
      stageId: null,
      overId: null,
      offsetY: null
    });
  };

  const handleDragCancel = () => {
    setDragState({
      dealId: null,
      stageId: null,
      overId: null,
      offsetY: null
    });
  };

  const filteredDeals = deals.filter(deal => {
    if (!showArchived && deal.isArchived) return false;
    switch (activeFilter) {
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

  const activeStages = stages.filter(stage => 
    !['closed-won', 'closed-lost'].includes(stage.id)
  );

  const stageDeals = activeStages.map(stage => ({
    ...stage,
    deals: filteredDeals.filter(deal => deal.stage === stage.id)
  }));

  const activeDeal = dragState.dealId ? deals.find(d => d.id === dragState.dealId) : null;

  return (
    <div className="p-6 bg-dark-900 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Deals</h1>
            <p className="text-gray-400">Manage and track your deals</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              {isAdmin && (
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={showArchived}
                    onChange={(e) => setShowArchived(e.target.checked)}
                    className="form-checkbox h-4 w-4 rounded border-dark-600 bg-dark-600 text-accent-purple focus:ring-accent-purple"
                  />
                  Show Archived
                </label>
              )}
              <button
                onClick={() => setActiveFilter('active')}
                className={`btn ${
                  activeFilter === 'active' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter('won')}
                className={`btn ${
                  activeFilter === 'won' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Won
              </button>
              <button
                onClick={() => setActiveFilter('lost')}
                className={`btn ${
                  activeFilter === 'lost' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Lost
              </button>
            </div>
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {viewMode === 'kanban' && activeFilter === 'active' ? (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={[restrictToWindowEdges]}
            collisionDetection={rectIntersection}
          >
            <div className="flex gap-6 overflow-x-auto pb-6">
              {stageDeals.map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  deals={stage.deals}
                  isOver={dragState.overId === stage.id}
                  dragState={dragState}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
              {activeDeal ? (
                <div style={{ width: '320px' }}>
                  <DealCard deal={activeDeal} isDragging={true} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <DealList filter={activeFilter} />
        )}
      </div>

      <NewDealButton />
    </div>
  );
}