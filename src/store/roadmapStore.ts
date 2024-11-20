import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoadmapItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface RoadmapStore {
  items: RoadmapItem[];
  addItem: (item: Omit<RoadmapItem, 'id' | 'votes' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<RoadmapItem>) => void;
  deleteItem: (id: string) => void;
  voteItem: (id: string) => void;
  unvoteItem: (id: string) => void;
}

const initialItems: RoadmapItem[] = [
  {
    id: uuidv4(),
    title: 'Advanced Analytics Dashboard',
    description: 'Enhanced analytics with custom reporting and data visualization options',
    status: 'planned',
    priority: 'high',
    votes: 45,
    category: 'feature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Email Integration',
    description: 'Direct email integration with popular email providers',
    status: 'planned',
    priority: 'high',
    votes: 38,
    category: 'feature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Mobile App',
    description: 'Native mobile application for iOS and Android',
    status: 'planned',
    priority: 'medium',
    votes: 32,
    category: 'feature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'AI-Powered Deal Insights',
    description: 'Machine learning predictions for deal success probability',
    status: 'planned',
    priority: 'medium',
    votes: 28,
    category: 'feature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Calendar Integration',
    description: 'Sync with Google Calendar and Outlook',
    status: 'in-progress',
    priority: 'high',
    votes: 25,
    category: 'feature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set) => ({
      items: initialItems,
      
      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id: uuidv4(),
              votes: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
        })),
      
      updateItem: (id, updatedItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() }
              : item
          )
        })),
      
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        })),
      
      voteItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, votes: item.votes + 1, updatedAt: new Date().toISOString() }
              : item
          )
        })),
      
      unvoteItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.votes > 0
              ? { ...item, votes: item.votes - 1, updatedAt: new Date().toISOString() }
              : item
          )
        }))
    }),
    {
      name: 'roadmap-store',
      version: 1
    }
  )
);