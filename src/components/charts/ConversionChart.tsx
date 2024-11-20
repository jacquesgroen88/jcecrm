import React from 'react';
import { useDealStore } from '../../store/dealStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts';

export default function ConversionChart() {
  const { deals, stages } = useDealStore();

  // Calculate conversion rates between stages
  const conversionData = stages.slice(0, -2).map((stage, index) => {
    const nextStage = stages[index + 1];
    const dealsInStage = deals.filter(d => d.stage === stage.id).length;
    const dealsInNextStage = deals.filter(d => d.stage === nextStage.id).length;
    const conversionRate = dealsInStage ? (dealsInNextStage / dealsInStage) * 100 : 0;

    return {
      name: `${stage.name} → ${nextStage.name}`,
      rate: Math.round(conversionRate),
      deals: dealsInStage
    };
  });

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={conversionData}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1C1B42" />
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          >
            <Label
              value="Conversion Rate (%)"
              position="insideLeft"
              angle={-90}
              style={{ fill: '#9CA3AF' }}
            />
          </YAxis>
          <Tooltip
            cursor={{ fill: '#1C1B42' }}
            contentStyle={{
              backgroundColor: '#151432',
              border: '1px solid #1C1B42',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
          />
          <Bar
            dataKey="rate"
            fill="#6E3AFA"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}