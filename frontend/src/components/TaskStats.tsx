'use client';

import { TaskStats as TaskStatsType } from '@/types';

interface TaskStatsProps {
  stats: TaskStatsType | null;
  loading: boolean;
}

const statIcons = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    ),
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
];

export default function TaskStats({ stats, loading }: TaskStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-16 mb-3"></div>
            <div className="h-8 bg-slate-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { label: 'Total Tasks', value: stats.total, color: 'text-slate-900' },
    { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
    { label: 'In Progress', value: stats.inProgress, color: 'text-sky-600' },
    { label: 'Completed', value: stats.completed, color: 'text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${statIcons[index].bg} flex items-center justify-center`}>
              <svg className={`w-5 h-5 ${statIcons[index].iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {statIcons[index].icon}
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${item.color}`}>{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
