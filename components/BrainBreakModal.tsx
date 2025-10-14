import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/Button';
import { getRandomJoke } from '../lib/jokes.ts';
import { X, Mic, Video, Download, RefreshCw } from 'lucide-react';
import { Mascot } from './Mascot.tsx';

interface BrainBreakModalProps {
  show: boolean;
  onClose: () => void;
  activityName: string;
}

const breakOptions = [
    { key: 'dance', title: 'Dance Party!', emoji: '💃', description: "Let's dance for 5 minutes!" },
    { key: 'video', title: 'Victory Video', emoji: '🤳', description: 'Record a message about your win!' },
    { key: 'joke', title: 'Joke Time', emoji: '😂', description: 'Hear a silly joke!' },
    { key: 'stretch', title: 'Stretching Star', emoji: '🧘‍♀️', description: 'Time for a quick body stretch.' },
    { key: 'drawing', title: 'Drawing Time', emoji: '✏️', description: 'Doodle for 5 minutes!' },
    { key: 'building', title: 'Building Blocks', emoji: '🧱', description: 'Build for 5 minutes!' },
];

export const BrainBreakModal: React.FC<BrainBreakModalProps> = ({ show, onClose, activityName }) => {
  const [activeBreak, setActiveBreak] = useState<string | null>(null);

  // Clean up state when modal is hidden/shown
  useEffect(() => {
    if (!show) {
      // Delay reset to allow for closing animation
      setTimeout(() => {
        setActiveBreak(null);
      }, 200);
    }
  }, [show]);

  const renderBreakContent = () => {
    switch (activeBreak) {
      case 'dance': return <DancePartyBreak />;
      case 'video': return <VictoryVideoBreak />;
      case 'joke': return <JokeBreak />;
      case 'stretch': return <StretchBreak />;
      case 'drawing': return <DrawingBreak />;
      case 'building': return <BuildingBreak />;
      default: return null;
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md text-center border-4 border-yellow-300 transform transition-all duration-300 scale-100">
        <div className="relative">
          <Button size="icon" variant="ghost" className="absolute -top-4 -right-4 rounded-full" onClick={onClose}><X /></Button>
          
          <div className="flex flex-col items-center">
            <Mascot className="w-24 h-24 -mt-16" />
            <h2 className="text-3xl font-bold text-slate-800 -mt-2">Woohoo!</h2>
          </div>
          <p className="mt-2 text-slate-600 text-lg">Awesome job finishing <span className="font-semibold">{activityName}</span>!</p>

          <div className="mt-6">
            {activeBreak ? (
              <div>
                {renderBreakContent()}
                <Button variant="outline" className="mt-6" onClick={() => setActiveBreak(null)}>Choose a Different Break</Button>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-slate-700">You earned a fun brain break! Pick one:</h3>
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {breakOptions.map(opt => (
                    <button key={opt.key} onClick={() => setActiveBreak(opt.key)} className="p-4 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-center">
                      <div className="text-5xl">{opt.emoji}</div>
                      <div className="font-semibold mt-2">{opt.title}</div>
                    </button>
                  ))}
                </div>
                <Button variant="secondary" className="mt-6" onClick={onClose}>I'm ready for the next challenge!</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Individual Break Components ---

const DancePartyBreak: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // FIX: Replaced 'any' with a specific timer type for improved type safety.
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (!isActive && timeLeft !== 0) {
            clearInterval(interval);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-bold text-emerald-600">Dance Party!</h3>
            <div className="my-4 text-6xl font-mono font-bold text-slate-800">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsActive(!isActive)}>{isActive ? 'Pause' : 'Start'}</Button>
                <Button variant="outline" onClick={() => { setTimeLeft(300); setIsActive(false); }}>Reset</Button>
            </div>
        </div>
    );
};

const JokeBreak: React.FC = () => {
    const [joke, setJoke] = useState(getRandomJoke());
    return (
        <div className="p-4 bg-slate-50 rounded-lg space-y-3">
             <h3 className="text-xl font-bold text-purple-600">Joke Time!</h3>
            <p className="text-lg">{joke.q}</p>
            <p className="font-bold text-lg text-slate-800">{joke.a}</p>
            <Button variant="outline" onClick={() => setJoke(getRandomJoke())}>Another!</Button>
        </div>
    );
};

const StretchBreak: React.FC = () => (
    <div className="p-4 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-bold text-sky-600">Stretching Star</h3>
        <p className="my-2">Reach for the sky, then touch your toes!</p>
        <div className="flex justify-center gap-4 text-5xl">
            <span>🙌</span>
            <span>🙆‍♀️</span>
            <span>🙇‍♀️</span>
        </div>
    </div>
);

const DrawingBreak: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(300);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // FIX: Replaced 'any' with a specific timer type for improved type safety.
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-bold text-blue-600">Drawing Time!</h3>
            <p className="text-sm text-slate-500">Grab some paper and draw anything you want!</p>
            <div className="my-4 text-6xl font-mono font-bold text-slate-800">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsActive(!isActive)}>{isActive ? 'Pause' : 'Start'}</Button>
                <Button variant="outline" onClick={() => { setTimeLeft(300); setIsActive(false); }}>Reset</Button>
            </div>
        </div>
    );
};

const BuildingBreak: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(300);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // FIX: Replaced 'any' with a specific timer type for improved type safety.
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-bold text-orange-600">Building Time!</h3>
            <p className="text-sm text-slate-500">Use your favorite blocks to build something amazing!</p>
            <div className="my-4 text-6xl font-mono font-bold text-slate-800">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsActive(!isActive)}>{isActive ? 'Pause' : 'Start'}</Button>
                <Button variant="outline" onClick={() => { setTimeLeft(300); setIsActive(false); }}>Reset</Button>
            </div>
        </div>
    );
};

const VictoryVideoBreak: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const cleanupStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);
    
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        cleanupStream();
    }, [cleanupStream]);

    useEffect(() => {
        // FIX: Replaced 'any' with a specific timer type for improved type safety.
        let timer: ReturnType<typeof setTimeout>;
        if (isRecording && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (isRecording && timeLeft === 0) {
            stopRecording();
        }
        return () => clearTimeout(timer);
    }, [isRecording, timeLeft, stopRecording]);


    const startRecording = async () => {
        reset();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                chunksRef.current = [];
                const url = URL.createObjectURL(blob);
                setVideoURL(url);
                cleanupStream();
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTimeLeft(60);
        } catch (err) {
            console.error(err);
            setError("Could not access camera/mic. Please check permissions.");
        }
    };

    const reset = () => {
        cleanupStream();
        setVideoURL(null);
        setError(null);
        setIsRecording(false);
    }
    
    useEffect(() => {
        return () => cleanupStream();
    }, [cleanupStream]);

    return (
        <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-rose-600">Victory Video</h3>
                {isRecording && <span className="font-mono text-lg font-semibold bg-rose-100 text-rose-700 px-2 py-1 rounded">0:{String(timeLeft).padStart(2, '0')}</span>}
            </div>
            <p className="text-xs text-slate-500 mt-1 mb-3">All videos are just for fun and are saved to your device. They are not sent anywhere.</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            <div className="my-4 bg-black rounded-lg aspect-video flex items-center justify-center">
                {videoURL ? (
                    <video src={videoURL} controls autoPlay className="w-full h-full rounded-lg" />
                ) : (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full rounded-lg" />
                )}
            </div>

            <div className="flex gap-2 justify-center">
            {!isRecording && !videoURL && <Button onClick={startRecording}><Video className="w-4 h-4 mr-2"/>Start Recording</Button>}
            {isRecording && <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700"><Mic className="w-4 h-4 mr-2"/>Stop Recording</Button>}

            {videoURL && (
                <>
                    <a href={videoURL} download={`victory-video-${Date.now()}.webm`}><Button variant="outline"><Download className="w-4 h-4 mr-2"/>Download</Button></a>
                    <Button variant="secondary" onClick={reset}><RefreshCw className="w-4 h-4 mr-2"/>Record Again</Button>
                </>
            )}
            </div>
        </div>
    );
};