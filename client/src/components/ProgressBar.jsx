import React from 'react';

export default function ProgressBar({ current, total, label = 'Progress' }) {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 light:text-slate-600 mb-1.5">
        <span>{label}</span>
        <span>
          {current} of {total} ({percentage}%)
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 light:bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-700/50 light:border-slate-300">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
