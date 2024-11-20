import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface LineChartProps {
  data: Array<{ x: string; y: number }>;
  height?: number;
}

export default function LineChart({ data, height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1C1B42" />
        <XAxis
          dataKey="x"
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
          tickLine={{ stroke: '#9CA3AF' }}
        />
        <YAxis
          stroke="#9CA3AF"
          tick={{ fill: '#9CA3AF' }}
          tickLine={{ stroke: '#9CA3AF' }}
          tickFormatter={(value) => 
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(value)
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#151432',
            border: '1px solid #1C1B42',
            borderRadius: '8px',
            color: '#fff'
          }}
          cursor={{ stroke: '#1C1B42' }}
          formatter={(value: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value)
          }
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#6E3AFA"
          strokeWidth={2}
          dot={{ fill: '#6E3AFA', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#6E3AFA' }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}