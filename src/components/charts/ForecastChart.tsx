import React from 'react';
import { useForecastStore } from '../../store/forecastStore';
import { useDealStore } from '../../store/dealStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { format, addMonths, startOfMonth } from 'date-fns';

export default function ForecastChart() {
  const { forecasts, generateForecast } = useForecastStore();
  const { deals } = useDealStore();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const generateForecasts = async () => {
      if (forecasts.length === 0) {
        setIsLoading(true);
        const now = new Date();
        for (let i = 1; i <= 6; i++) {
          const period = format(addMonths(now, i), 'yyyy-MM');
          await generateForecast(period);
        }
        setIsLoading(false);
      }
    };

    generateForecasts();
  }, [forecasts.length, generateForecast]);

  const chartData = forecasts.map((forecast) => {
    const date = startOfMonth(new Date(forecast.period));
    const historicalValue = deals
      .filter(
        (deal) =>
          format(new Date(deal.expectedCloseDate), 'yyyy-MM') ===
          forecast.period
      )
      .reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);

    return {
      date: format(date, 'MMM yyyy'),
      forecast: forecast.predictedValue,
      confidence: forecast.confidence,
      historical: historicalValue,
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
      </div>
    );
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="rgba(110, 58, 250, 0.1)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="rgba(110, 58, 250, 0.1)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1C1B42" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
              }).format(value)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#151432',
              border: '1px solid #1C1B42',
              borderRadius: '8px',
            }}
            formatter={(value: number) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(value)
            }
          />
          <Area
            type="monotone"
            dataKey="historical"
            stroke="#3B82F6"
            fill="url(#colorConfidence)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#6E3AFA"
            strokeWidth={2}
            dot={{ fill: '#6E3AFA' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}