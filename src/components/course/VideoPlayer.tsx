import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  duration?: number;
  onMarkComplete?: (watchTime?: number) => void;
}

export function VideoPlayer({
  videoUrl,
  title,
  onMarkComplete,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSettingsMenu(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-black overflow-hidden !mt-0">
      <div
        className="relative bg-black aspect-video group"
        onMouseMove={handleMouseMove}
      >
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={(e) => setCurrentTime(e.currentTime)}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            if (onMarkComplete) onMarkComplete(Math.floor(duration));
          }}
        >
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>

        {/* Placeholder if no video */}
        {!videoUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-10 h-10 text-white fill-white" />
            </div>
            <p className="text-white/60 text-sm">Video player ready</p>
          </div>
        )}

        {/* Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar */}
          <div className="absolute bottom-16 left-0 right-0 px-4">
            {(() => {
              const percentage =
                duration > 0 ? (currentTime / duration) * 100 : 0;
              return (
                <>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleTimeChange}
                    className="w-full h-1 bg-neutral-600 rounded-full cursor-pointer appearance-none"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${percentage}%, #4b5563 ${percentage}%, #4b5563 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-white mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white fill-white" />
                ) : (
                  <Play className="w-6 h-6 text-white fill-white" />
                )}
              </button>

              <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                <SkipBack className="w-5 h-5 text-white" />
              </button>

              <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                <SkipForward className="w-5 h-5 text-white" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-neutral-600 rounded-full cursor-pointer appearance-none"
                  style={{
                    background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
                      volume * 100
                    }%, #4b5563 ${volume * 100}%, #4b5563 100%)`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu((s) => !s)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
                {showSettingsMenu && (
                  <div className="absolute right-0 -top-36 w-40 bg-neutral-800 text-white rounded shadow-lg p-2 z-50">
                    <div className="text-xs text-neutral-300 px-2 py-1">
                      Playback speed
                    </div>
                    {[0.5, 1, 1.5, 2].map((r) => (
                      <button
                        key={r}
                        onClick={() => changePlaybackRate(r)}
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          playbackRate === r
                            ? "bg-neutral-700"
                            : "hover:bg-neutral-700"
                        }`}
                      >
                        {r}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                <Maximize className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
