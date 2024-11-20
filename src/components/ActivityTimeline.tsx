import React from 'react';
import { format } from 'date-fns';
import { useActivityStore } from '../store/activityStore';
import { Activity } from '../types';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

interface ActivityTimelineProps {
  entityId: string;
}

export default function ActivityTimeline({ entityId }: ActivityTimelineProps) {
  const { getActivities } = useActivityStore();
  const activities = getActivities(entityId);

  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'stage_change':
        return <ArrowRight className="w-4 h-4" />;
      case 'creation':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (activity: Activity) => {
    switch (activity.type) {
      case 'stage_change':
        return 'bg-blue-500/10 text-blue-400';
      case 'creation':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-6 w-px bg-dark-600" />
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-14">
            <div
              className={`absolute left-4 p-2 rounded-lg ${getActivityColor(activity)}`}
            >
              {getActivityIcon(activity)}
            </div>

            <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white">{activity.title}</h3>
                <span className="text-sm text-gray-400">
                  {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                </span>
              </div>

              <p className="text-gray-300">{activity.description}</p>

              {activity.metadata && (
                <div className="mt-2 pt-2 border-t border-dark-600">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key} className="text-sm text-gray-400">
                      <strong className="capitalize">{key.replace('_', ' ')}:</strong>{' '}
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No activity recorded yet
          </div>
        )}
      </div>
    </div>
  );
}