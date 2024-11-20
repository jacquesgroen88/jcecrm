import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useCompanyStore } from '../store/companyStore';
import { useTaskStore } from '../store/taskStore';
import { 
  LayoutDashboard, Users, Building2, PieChart, 
  TrendingUp, ChevronRight, Calendar, Clock 
} from 'lucide-react';
import { format } from 'date-fns';
import GlobalSearch from './GlobalSearch';

const Dashboard = () => {
  const navigate = useNavigate();
  const deals = useDealStore((state) => state.deals);
  const contacts = useContactStore((state) => state.contacts);
  const companies = useCompanyStore((state) => state.companies);
  const tasks = useTaskStore((state) => state.tasks);

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealValue = totalValue / deals.length;
  
  const upcomingTasks = tasks
    .filter(task => task.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const pendingDeals = deals
    .filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="p-6 bg-dark-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <GlobalSearch />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/deals" className="card p-6 hover:border-accent-purple/30 transition-colors">
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
              Avg. {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(avgDealValue)}
            </div>
          </Link>

          <Link to="/deals" className="card p-6 hover:border-accent-purple/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <PieChart className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm text-gray-400">Active Deals</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {deals.length}
            </div>
            <div className="text-sm text-gray-400">
              {deals.filter(d => d.stage === 'closed-won').length} won
            </div>
          </Link>

          <Link to="/contacts" className="card p-6 hover:border-accent-purple/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm text-gray-400">Contacts</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {contacts.length}
            </div>
            <div className="text-sm text-gray-400">
              Across {companies.length} companies
            </div>
          </Link>

          <Link to="/companies" className="card p-6 hover:border-accent-purple/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Building2 className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-sm text-gray-400">Companies</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {companies.length}
            </div>
            <div className="text-sm text-gray-400">
              Active accounts
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Upcoming Tasks</h2>
              <Link to="/tasks" className="text-accent-purple hover:text-accent-purple/80 flex items-center">
                <span className="text-sm">View All</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-dark-700">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-dark-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{task.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
              {upcomingTasks.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  No upcoming tasks
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Top Deals</h2>
              <Link to="/deals" className="text-accent-purple hover:text-accent-purple/80 flex items-center">
                <span className="text-sm">View All</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-dark-700">
              {pendingDeals.map((deal) => (
                <button
                  key={deal.id}
                  onClick={() => navigate(`/deals/${deal.id}`)}
                  className="w-full p-4 hover:bg-dark-700 text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{deal.title}</h3>
                      <p className="text-sm text-gray-400">{deal.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(deal.value)}
                      </div>
                      <p className="text-sm text-gray-400">
                        Close: {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;