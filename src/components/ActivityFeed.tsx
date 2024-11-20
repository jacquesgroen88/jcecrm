import React from 'react';
import { format } from 'date-fns';
import { useActivityStore } from '../store/activityStore';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

interface ActivityFeedProps {
  entityType: string;
  entityId: string;
}

export default function ActivityFeed({ entityType, entityId }: ActivityFeedProps) {
  const { activities } = useActivityStore();
  const entityActivities = activities.filter(
    (activity) =>
      activity.relatedTo.type === entityType &&
      activity.relatedTo.id === entityId
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'note':
        return <MessageSquare className="w-4 h-4" />;
      case 'task':
        return <CheckSquare className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-6 w-px bg-dark-600" />
      
      <div className="space-y-6">
        {entityActivities.map((activity) => (
          <div key={activity.id} className="relative pl-14">
            <div
              className={clsx(
                'absolute left-4 p-2 rounded-lg',
                activity.type === 'call'
                  ? 'bg-blue-500/10'
                  : activity.type === 'email'
                  ? 'bg-purple-500/10'
                  : activity.type === 'meeting'
                  ? 'bg-green-500/10'
                  : activity.type === 'note'
                  ? 'bg-yellow-500/10'
                  : 'bg-gray-500/10'
              )}
            >
              {getActivityIcon(activity.type)}
            </div>

            <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white">{activity.title}</h3>
                <span className="text-sm text-gray-400">
                  {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>

              <p className="text-gray-300 whitespace-pre-wrap">
                {activity.description}
              </p>

              {activity.outcome && (
                <div className="mt-2 pt-2 border-t border-dark-600">
                  <p className="text-sm text-gray-400">
                    <strong>Outcome:</strong> {activity.outcome}
                  </p>
                </div>
              )}

              {activity.duration && (
                <div className="mt-2 text-sm text-gray-400">
                  Duration: {activity.duration} minutes
                </div>
              )}
            </div>
          </div>
        ))}

        {entityActivities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No activities found
          </div>
        )}
      </div>
    </div>
  );
}