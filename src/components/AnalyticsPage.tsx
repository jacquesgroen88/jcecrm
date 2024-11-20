import React, { useState } from 'react';
import { useDealStore } from '../store/dealStore';
import { useUserStore } from '../store/userStore';
import { format, subDays, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import ForecastChart from './charts/ForecastChart';
import ConversionChart from './charts/ConversionChart';

export default function AnalyticsPage() {
  const { deals } = useDealStore();
  const { users } = useUserStore();
  const [timeframe, setTimeframe] = useState('30d');

  // Calculate key metrics
  const totalDeals = deals.length;
  const activeDeals = deals.filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage)).length;
  const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealValue = totalValue / (totalDeals || 1);
  const winRate = (wonDeals / totalDeals) * 100 || 0;

  // Calculate pipeline value over time
  const getTimeframeData = () => {
    const now = new Date();
    let startDate;
    let interval;

    switch (timeframe) {
      case '7d':
        startDate = subDays(now, 7);
        interval = 'day';
        break;
      case '30d':
        startDate = subDays(now, 30);
        interval = 'day';
        break;
      case '90d':
        startDate = subDays(now, 90);
        interval = 'month';
        break;
      default:
        startDate = subDays(now, 30);
        interval = 'day';
    }

    const pipelineData = deals
      .filter(deal => new Date(deal.createdAt) >= startDate)
      .reduce((acc, deal) => {
        const date = format(new Date(deal.createdAt), interval === 'day' ? 'MMM d' : 'MMM yyyy');
        acc[date] = (acc[date] || 0) + deal.value;
        return acc;
      }, {});

    return Object.entries(pipelineData).map(([x, y]) => ({ x, y }));
  };

  // Calculate sales rep performance
  const salesRepPerformance = users.map(user => {
    const userDeals = deals.filter(deal => deal.stage === 'closed-won');
    const value = userDeals.reduce((sum, deal) => sum + deal.value, 0);
    return {
      name: user.name,
      value
    };
  }).sort((a, b) => b.value - a.value);

  // Calculate monthly revenue
  const monthlyRevenue = () => {
    const last12Months = eachMonthOfInterval({
      start: startOfMonth(subDays(new Date(), 365)),
      end: endOfMonth(new Date())
    });

    return last12Months.map(date => {
      const monthDeals = deals.filter(deal => 
        deal.stage === 'closed-won' &&
        new Date(deal.updatedAt) >= startOfMonth(date) &&
        new Date(deal.updatedAt) <= endOfMonth(date)
      );
      
      return {
        name: format(date, 'MMM yyyy'),
        value: monthDeals.reduce((sum, deal) => sum + deal.value, 0)
      };
    });
  };

  return (
    <div className="p-6 bg-dark-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Track your sales performance and metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm text-gray-400">Total Pipeline</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(totalValue)}
            </div>
            <div className="text-sm text-gray-400">
              {activeDeals} active deals
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm text-gray-400">Win Rate</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {winRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">
              {wonDeals} won deals
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm text-gray-400">Avg. Deal Size</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(avgDealValue)}
            </div>
            <div className="text-sm text-gray-400">
              {totalDeals} total deals
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Users className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-sm text-gray-400">Sales Reps</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {users.length}
            </div>
            <div className="text-sm text-gray-400">
              Active team members
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Pipeline Value</h2>
              <div className="flex bg-dark-700 rounded-lg p-1">
                {['7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1.5 text-sm font-medium rounded ${
                      timeframe === period
                        ? 'bg-dark-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <LineChart data={getTimeframeData()} />
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Sales Rep Performance</h2>
            <BarChart data={salesRepPerformance} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Revenue Forecast</h2>
            <ForecastChart />
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Stage Conversion</h2>
            <ConversionChart />
          </div>
        </div>
      </div>
    </div>
  );
}