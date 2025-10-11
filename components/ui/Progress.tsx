
import React from 'react';

interface ProgressProps {
  value: number;
}

export const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full w-full flex-1 bg-slate-900 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};
