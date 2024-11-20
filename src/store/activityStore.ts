import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ActivityStore {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  getActivities: (entityId: string) => Activity[];
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: [],
      
      addActivity: (activity) =>
        set((state) => ({
          activities: [
            {
              ...activity,
              id: uuidv4(),
              timestamp: new Date().toISOString(),
            },
            ...state.activities,
          ],
        })),
      
      getActivities: (entityId) => {
        return get().activities.filter(
          (activity) => activity.entityId === entityId
        ).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },
    }),
    {
      name: 'activity-store',
      version: 1,
    }
  )
);