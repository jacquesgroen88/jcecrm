import React, { useState } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import { Dialog } from '@headlessui/react';
import { 
  Plus, ThumbsUp, Calendar, ArrowUp, ArrowDown, 
  CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';
import clsx from 'clsx';

export default function RoadmapPage() {
  const { items, addItem, voteItem } = useRoadmapStore();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'feature',
    priority: 'medium',
    status: 'planned'
  });

  const handleAddItem = () => {
    addItem(newItem);
    setNewItem({
      title: '',
      description: '',
      category: 'feature',
      priority: 'medium',
      status: 'planned'
    });
    setIsAddingItem(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <ArrowDown className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="p-6 bg-dark-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Product Roadmap</h1>
            <p className="text-gray-400">Vote on features and track our progress</p>
          </div>
          <button
            onClick={() => setIsAddingItem(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Suggest Feature
          </button>
        </div>

        <div className="space-y-4">
          {items
            .sort((a, b) => b.votes - a.votes)
            .map((item) => (
              <div
                key={item.id}
                className="card p-6 hover:border-accent-purple/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <span
                        className={clsx(
                          "px-2 py-1 text-xs rounded-full font-medium",
                          {
                            'bg-purple-500/10 text-purple-400': item.category === 'feature',
                            'bg-blue-500/10 text-blue-400': item.category === 'enhancement',
                            'bg-red-500/10 text-red-400': item.category === 'bug'
                          }
                        )}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-400">{item.description}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        {getPriorityIcon(item.priority)}
                        <span className="capitalize">{item.priority} priority</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => voteItem(item.id)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-accent-purple" />
                    <span className="text-sm font-medium text-white">
                      {item.votes}
                    </span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Dialog
        open={isAddingItem}
        onClose={() => setIsAddingItem(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
            <div className="p-6">
              <Dialog.Title className="text-xl font-semibold text-white mb-6">
                Suggest a Feature
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full input"
                    placeholder="Feature name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full input min-h-[100px]"
                    placeholder="Describe the feature..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full input"
                  >
                    <option value="feature">Feature</option>
                    <option value="enhancement">Enhancement</option>
                    <option value="bug">Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                    className="w-full input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsAddingItem(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="btn btn-primary"
                  disabled={!newItem.title || !newItem.description}
                >
                  Submit
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}