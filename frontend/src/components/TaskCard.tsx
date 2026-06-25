'use client';

import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[task.status]
              }`}
            >
              {task.status}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2 sm:flex-col">
          <button
            onClick={() => onEdit(task.id)}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
