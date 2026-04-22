import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyber Runner",
    artist: "SynthAI",
    cover: "https://picsum.photos/seed/cyber/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-cyan"
  },
  {
    id: 2,
    title: "Neon Dreams",
    artist: "LoFi Soul",
    cover: "https://picsum.photos/seed/neon/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-magenta"
  },
  {
    id: 3,
    title: "Glitch Core",
    artist: "Digital Ghost",
    cover: "https://picsum.photos/seed/glitch/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-lime"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', nextTrack);
    };
  }, []);

  return (
    <div className="flex flex-col w-80 glass-morphism rounded-3xl p-6 neon-border-magenta relative overflow-hidden">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Album Art Section */}
      <div className="relative mb-6 aspect-square w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotate: 3 }}
            className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent`} />
          </motion.div>
        </AnimatePresence>
        
        {/* Animated Disc if playing */}
        {isPlaying && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-4 -right-4 w-16 h-16 bg-black rounded-full border-2 border-white/20 flex items-center justify-center shadow-lg"
          >
            <Disc className={`w-8 h-8 text-${currentTrack.color}`} />
          </motion.div>
        )}
      </div>

      {/* Info Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold truncate leading-tight tracking-tight">{currentTrack.title}</h3>
        <p className={`text-sm opacity-60 font-mono uppercase tracking-widest text-neon-magenta`}>{currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-neon-magenta shadow-[0_0_8px_#ff00ff]`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30 uppercase tracking-tighter">
           <span>0:00</span>
           <span>Demo Track</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={prevTrack}
          className="text-white/50 hover:text-neon-magenta transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying ? 'bg-neon-magenta text-white shadow-[0_0_20px_#ff00ff]' : 'bg-white/10 text-white'
          } hover:scale-110 active:scale-95`}
        >
          {isPlaying ? <Pause className="fill-current w-7 h-7" /> : <Play className="fill-current w-7 h-7 ml-1" />}
        </button>

        <button 
          onClick={nextTrack}
          className="text-white/50 hover:text-neon-magenta transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Track List Hint */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 text-xs text-white/40 font-mono mb-4">
          <Music2 className="w-3 h-3" />
          <span className="uppercase tracking-widest">Next Up</span>
        </div>
        <div className="space-y-3">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id} 
              className={`flex items-center gap-3 transition-opacity duration-300 cursor-pointer hover:opacity-100 ${idx === currentTrackIndex ? 'opacity-100 neon-text-magenta' : 'opacity-30'}`}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
            >
              <div className={`w-8 h-8 rounded bg-white/10 overflow-hidden flex-shrink-0`}>
                <img src={track.cover} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate uppercase">{track.title}</p>
                <p className="text-[8px] opacity-70 truncate font-mono">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-magenta/10 blur-3xl -z-10" />
    </div>
  );
}
