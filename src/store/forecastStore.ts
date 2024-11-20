import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Forecast } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ForecastStore {
  forecasts: Forecast[];
  addForecast: (forecast: Omit<Forecast, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateForecast: (id: string, updates: Partial<Forecast>) => void;
  deleteForecast: (id: string) => void;
  generateForecast: (period: string) => Promise<Forecast>;
}

export const useForecastStore = create<ForecastStore>()(
  persist(
    (set, get) => ({
      forecasts: [],
      
      addForecast: (forecast) =>
        set((state) => ({
          forecasts: [
            ...state.forecasts,
            {
              ...forecast,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      
      updateForecast: (id, updates) =>
        set((state) => ({
          forecasts: state.forecasts.map((forecast) =>
            forecast.id === id
              ? {
                  ...forecast,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : forecast
          ),
        })),
      
      deleteForecast: (id) =>
        set((state) => ({
          forecasts: state.forecasts.filter((forecast) => forecast.id !== id),
        })),
      
      generateForecast: async (period) => {
        // This is a simplified forecast generation
        // In a real application, you would use more sophisticated algorithms
        const now = new Date();
        const forecast: Forecast = {
          id: uuidv4(),
          period,
          predictedValue: Math.random() * 1000000,
          confidence: Math.random() * 100,
          factors: [
            {
              name: 'Historical Performance',
              impact: Math.random() * 0.5,
            },
            {
              name: 'Seasonal Trends',
              impact: Math.random() * 0.3,
            },
            {
              name: 'Pipeline Quality',
              impact: Math.random() * 0.2,
            },
          ],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };
        
        set((state) => ({
          forecasts: [...state.forecasts, forecast],
        }));
        
        return forecast;
      },
    }),
    {
      name: 'forecast-store',
      version: 1,
    }
  )
);