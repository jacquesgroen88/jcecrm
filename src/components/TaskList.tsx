import React from 'react';
import { format } from 'date-fns';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  X,
} from 'lucide-react';
import clsx from 'clsx';

interface TaskListProps {
  entityType?: string;
  entityId?: string;
}

export default function TaskList({ entityType, entityId }: TaskListProps) {
  const { tasks, completeTask, cancelTask } = useTaskStore();
  const { currentUser } = useUserStore();

  const filteredTasks = tasks.filter((task) => {
    if (entityType && entityId) {
      return (
        task.relatedTo.type === entityType && task.relatedTo.id === entityId
      );
    }
    return task.assignedTo === currentUser?.id;
  });

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      default:
        return <CheckSquare className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className={clsx(
            'bg-dark-700 rounded-lg p-4 border transition-colors',
            task.status === 'completed'
              ? 'border-green-500/20'
              : task.status === 'cancelled'
              ? 'border-red-500/20'
              : 'border-dark-600'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={clsx(
                  'p-2 rounded-lg',
                  task.status === 'completed'
                    ? 'bg-green-500/10'
                    : task.status === 'cancelled'
                    ? 'bg-red-500/10'
                    : 'bg-dark-600'
                )}
              >
                {getTaskIcon(task.type)}
              </div>
              <div>
                <h3 className="font-medium text-white">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-400 mt-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                  </div>
                  <div
                    className={clsx(
                      'flex items-center gap-1 text-sm',
                      getPriorityColor(task.priority)
                    )}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {task.priority}
                  </div>
                </div>
              </div>
            </div>

            {task.status === 'pending' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => completeTask(task.id)}
                  className="p-1 rounded-lg hover:bg-green-500/10 text-green-400"
                  title="Complete"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => cancelTask(task.id)}
                  className="p-1 rounded-lg hover:bg-red-500/10 text-red-400"
                  title="Cancel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {filteredTasks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No tasks found
        </div>
      )}
    </div>
  );
}