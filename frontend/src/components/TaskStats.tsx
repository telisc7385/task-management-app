'use client';

import { TaskStats as TaskStatsType } from '@/types';

interface TaskStatsProps {
  stats: TaskStatsType | null;
  loading: boolean;
}

export default function TaskStats({ stats, loading }: TaskStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { label: 'Total Tasks', value: stats.total, color: 'text-gray-900' },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
    { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600' },
    { label: 'Completed', value: stats.completed, color: 'text-green-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-lg shadow-sm border p-4"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className={`text-2xl font-bold mt-1 ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
