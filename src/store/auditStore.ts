import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuditLog } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AuditStore {
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getLogs: (filters: {
    entityType?: string;
    entityId?: string;
    action?: string;
    performedBy?: string;
    startDate?: string;
    endDate?: string;
  }) => AuditLog[];
  clearLogs: (beforeDate: string) => void;
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set, get) => ({
      logs: [],
      
      addLog: (log) =>
        set((state) => ({
          logs: [
            {
              ...log,
              id: uuidv4(),
              timestamp: new Date().toISOString(),
            },
            ...state.logs,
          ],
        })),
      
      getLogs: (filters) => {
        const logs = get().logs;
        return logs.filter((log) => {
          if (filters.entityType && log.entityType !== filters.entityType)
            return false;
          if (filters.entityId && log.entityId !== filters.entityId) return false;
          if (filters.action && log.action !== filters.action) return false;
          if (filters.performedBy && log.performedBy !== filters.performedBy)
            return false;
          if (
            filters.startDate &&
            new Date(log.timestamp) < new Date(filters.startDate)
          )
            return false;
          if (
            filters.endDate &&
            new Date(log.timestamp) > new Date(filters.endDate)
          )
            return false;
          return true;
        });
      },
      
      clearLogs: (beforeDate) =>
        set((state) => ({
          logs: state.logs.filter(
            (log) => new Date(log.timestamp) >= new Date(beforeDate)
          ),
        })),
    }),
    {
      name: 'audit-store',
      version: 1,
    }
  )
);