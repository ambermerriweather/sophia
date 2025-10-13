// components/TimedTask.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button } from './ui/Button.tsx';
import { Textarea } from './ui/Textarea.tsx';
import { Timer } from 'lucide-react';

type Props = {
  seconds: number;
  onDone?: () => void;
  showTextarea?: boolean;
  placeholder?: string;
};

export const TimedTask: React.FC<Props> = ({ seconds, onDone, showTextarea, placeholder }) => {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current!);
          setRunning(false);
          onDone?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, onDone]);

  const reset = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(seconds);
  };
  
  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 12, backgroundColor: 'white' }}>
       <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center gap-2"><Timer className="w-5 h-5"/> Timed Challenge</h4>
            <div className={`text-2xl font-mono font-bold ${remaining === 0 ? 'text-red-500' : 'text-slate-800'}`}>
                {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
        </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: 'center' }}>
        <Button onClick={() => setRunning(true)} disabled={running || remaining === 0}>Start</Button>
        <Button onClick={() => setRunning(false)} disabled={!running}>Stop</Button>
        <Button variant="outline" onClick={reset}>Reset</Button>
      </div>
      {remaining === 0 && <p className="text-center font-bold text-red-600 animate-pulse mt-2">Time's Up!</p>}
      {showTextarea && (
        <Textarea
          style={{ width: "100%", minHeight: 120, marginTop: 12 }}
          placeholder={placeholder ?? "Write here while the timer runs"}
          disabled={!running && remaining > 0}
        />
      )}
    </div>
  );
};