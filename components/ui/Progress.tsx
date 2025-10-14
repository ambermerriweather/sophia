import React from 'react';

interface ProgressProps {
  value: number;
}

export const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <div className="relative h-4 w-full overflow-hidden rounded-full bg-rose-100">
      <div
        className="h-full w-full flex-1 bg-rose-500 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};