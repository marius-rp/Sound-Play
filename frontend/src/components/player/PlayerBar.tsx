import React, { useState, useEffect } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Music,
} from "lucide-react"
import { usePlayer } from "../../context/PlayerContext"
import { formatDuration } from "../../utils/date.helper"
import { IconButton } from "../../components/buttons/IconButton"

const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffle,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setVolume,
    seek,
    toggleShuffle,
  } = usePlayer()

  const [localVolume, setLocalVolume] = useState<number>(volume)

  useEffect(() => {
    setLocalVolume(volume)
  }, [volume])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setLocalVolume(newVolume)
    setVolume(newVolume)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value))
  }

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0)
    } else {
      setVolume(1)
    }
  }

  if (!currentTrack) return null

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const volumePercent = localVolume * 100

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#181818] border-t border-[#282828] flex items-center justify-between px-4 z-50 text-white select-none">
      {/* 1. SECTION GAUCHE : Infos de la piste */}
      <div className="flex items-center gap-4 w-1/3 min-w-[180px]">
        <div className="w-14 h-14 bg-[#282828] rounded shrink-0 overflow-hidden flex items-center justify-center">
          {currentTrack.image ? (
            <img
              src={currentTrack.image}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music size={20} className="text-[#b3b3b3]" />
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium hover:underline cursor-pointer truncate">
            {currentTrack.title}
          </span>
          <span className="text-xs text-[#b3b3b3] hover:underline hover:text-white cursor-pointer truncate transition-colors">
            {currentTrack.artist}
          </span>
        </div>
      </div>

      {/* 2. SECTION CENTRALE : Contrôles de lecture */}
      <div className="flex flex-col items-center max-w-[722px] w-full px-4">
        {/* Boutons */}
        <div className="flex items-center gap-4 mb-2">
          {/* 👇 CORRECTION : Bouton natif pour éviter les conflits Tailwind */}
          <button
            type="button"
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center hover:bg-white/10 ${
              isShuffle
                ? "text-[#1db954] hover:text-[#1ed760]" // Si actif : Vert
                : "text-[#a7a7a7] hover:text-white" // Si inactif : Gris
            }`}
          >
            <Shuffle size={20} />
          </button>

          <IconButton
            icon={<SkipBack size={24} fill="currentColor" />}
            onClick={prevTrack}
          />

          <button
            onClick={togglePlayPause}
            className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-1" />
            )}
          </button>

          <IconButton
            icon={<SkipForward size={24} fill="currentColor" />}
            onClick={nextTrack}
          />

          <div className="w-9"></div>
        </div>

        {/* Barre de progression (Seek) */}
        <div className="flex items-center gap-2 w-full max-w-[600px]">
          <span className="text-xs text-[#b3b3b3] min-w-[40px] text-right">
            {formatDuration(currentTime)}
          </span>

          <div className="relative flex-1 h-1 group cursor-pointer flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#1db954] transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div
              className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>

          <span className="text-xs text-[#b3b3b3] min-w-[40px]">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* 3. SECTION DROITE : Volume */}
      <div className="flex items-center justify-end gap-2 w-1/3 min-w-[180px]">
        <IconButton
          icon={volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          onClick={toggleMute}
        />

        <div className="relative w-24 h-1 group cursor-pointer flex items-center">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={localVolume}
            onChange={handleVolumeChange}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
            <div
              className="h-full bg-white group-hover:bg-[#1db954] transition-colors"
              style={{ width: `${volumePercent}%` }}
            />
          </div>
          <div
            className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
            style={{ left: `calc(${volumePercent}% - 6px)` }}
          />
        </div>
      </div>
    </div>
  )
}

export default PlayerBar
