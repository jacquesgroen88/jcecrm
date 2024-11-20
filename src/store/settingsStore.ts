import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '../types';

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  dealRotting: {
    enabled: true,
    thresholds: {
      warning: 7,
      danger: 14,
    },
  },
  fireflies: {
    apiKey: '',
    enabled: false,
  },
  instantly: {
    apiKey: '',
    enabled: false,
  },
  display: {
    showCreatedDate: true,
    showCompany: true,
    showValue: true,
    showProbability: true,
    showExpectedCloseDate: true,
    showCustomFields: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...(newSettings.dealRotting && {
              dealRotting: {
                ...state.settings.dealRotting,
                ...newSettings.dealRotting,
              },
            }),
            ...(newSettings.fireflies && {
              fireflies: {
                ...state.settings.fireflies,
                ...newSettings.fireflies,
              },
            }),
            ...(newSettings.instantly && {
              instantly: {
                ...state.settings.instantly,
                ...newSettings.instantly,
              },
            }),
            ...(newSettings.display && {
              display: {
                ...state.settings.display,
                ...newSettings.display,
              },
            }),
          },
        })),
    }),
    {
      name: 'settings-store',
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Ensure all required settings exist after rehydration
        if (state) {
          state.settings = {
            ...defaultSettings,
            ...state.settings,
            display: {
              ...defaultSettings.display,
              ...state.settings?.display,
            },
            dealRotting: {
              ...defaultSettings.dealRotting,
              ...state.settings?.dealRotting,
            },
            fireflies: {
              ...defaultSettings.fireflies,
              ...state.settings?.fireflies,
            },
            instantly: {
              ...defaultSettings.instantly,
              ...state.settings?.instantly,
            },
          };
        }
      },
    }
  )
);