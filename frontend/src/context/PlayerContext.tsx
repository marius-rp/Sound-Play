import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react"
import { API_URL } from "../constant"

export interface IPlayerTrack {
  id: string | number
  title: string
  artist: string
  image: string
  duration?: number
}

interface PlayerContextType {
  currentTrack: IPlayerTrack | null
  queue: IPlayerTrack[]
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  isShuffle: boolean
  playTrack: (
    track: IPlayerTrack,
    newQueue?: IPlayerTrack[],
    forceShuffle?: boolean,
  ) => void
  togglePlayPause: () => void
  nextTrack: () => void
  prevTrack: () => void
  setVolume: (level: number) => void
  seek: (time: number) => void
  toggleShuffle: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context)
    throw new Error("usePlayer doit être utilisé dans un PlayerProvider")
  return context
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [currentTrack, setCurrentTrack] = useState<IPlayerTrack | null>(null)
  const [queue, setQueue] = useState<IPlayerTrack[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolumeState] = useState<number>(1)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  const [isShuffle, setIsShuffle] = useState<boolean>(false)
  const [unplayedIndices, setUnplayedIndices] = useState<number[]>([])

  const nextTrackRef = useRef<() => void>(() => {})

  const playTrack = (
    track: IPlayerTrack,
    newQueue?: IPlayerTrack[],
    forceShuffle?: boolean,
  ) => {
    setCurrentTrack(track)

    const actualQueue = newQueue || queue
    if (newQueue) setQueue(newQueue)

    const idx = actualQueue.findIndex((t) => String(t.id) === String(track.id))
    setCurrentIndex(idx)

    const shouldShuffle = forceShuffle !== undefined ? forceShuffle : isShuffle
    if (forceShuffle !== undefined) setIsShuffle(forceShuffle)

    if (shouldShuffle) {
      const initialUnplayed = actualQueue
        .map((_, i) => i)
        .filter((i) => i !== idx)
      setUnplayedIndices(initialUnplayed)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const nextTrack = () => {
    if (queue.length === 0) return

    let nextIndex = currentIndex + 1

    if (isShuffle) {
      // Si le sac est vide, on a joué toute la playlist.
      // La lecture en boucle est OBLIGATOIRE, donc on remplit le sac et on pioche !
      if (unplayedIndices.length === 0) {
        const allIndices = queue.map((_, i) => i)
        const randomPos = Math.floor(Math.random() * allIndices.length)
        nextIndex = allIndices[randomPos]
        setUnplayedIndices(allIndices.filter((i) => i !== nextIndex))
      } else {
        const randomPos = Math.floor(Math.random() * unplayedIndices.length)
        nextIndex = unplayedIndices[randomPos]
        setUnplayedIndices((prev) => prev.filter((i) => i !== nextIndex))
      }
    } else {
      // Lecture normale
      if (nextIndex >= queue.length) {
        nextIndex = 0 // 👈 La boucle est maintenant automatique et obligatoire !
      }
    }

    setCurrentIndex(nextIndex)
    setCurrentTrack(queue[nextIndex])
  }

  const prevTrack = () => {
    if (queue.length === 0) return
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0
      return
    }
    let prevIndex = currentIndex - 1
    if (prevIndex < 0) prevIndex = queue.length - 1
    setCurrentIndex(prevIndex)
    setCurrentTrack(queue[prevIndex])
  }

  const setVolume = (level: number) => {
    if (audioRef.current) audioRef.current.volume = level
    setVolumeState(level)
  }

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const newShuffle = !prev
      if (newShuffle) {
        const allIndices = queue
          .map((_, i) => i)
          .filter((i) => i !== currentIndex)
        setUnplayedIndices(allIndices)
      }
      return newShuffle
    })
  }

  useEffect(() => {
    nextTrackRef.current = nextTrack
  }, [nextTrack])

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    const audio = audioRef.current

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => nextTrackRef.current()

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = `${API_URL}/api/playMusic/${currentTrack.id}`
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error(err)
          }
        })
    }
  }, [currentTrack])

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        volume,
        currentTime,
        duration,
        isShuffle,
        playTrack,
        togglePlayPause,
        nextTrack,
        prevTrack,
        setVolume,
        seek,
        toggleShuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
