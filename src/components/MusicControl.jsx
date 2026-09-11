import { useEffect, useState } from "react";
import { Music, Pause, Play } from "lucide-react";

export default function MusicControl({ audioRef }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioRef]);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error("Unable to play music:", error);
      }
    } else {
      audio.pause();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className="music-control"
      aria-label={playing ? "Pause music" : "Play music"}
    >
      <span className="music-control__icon">
        {playing ? <Pause size={15} /> : <Play size={15} />}
      </span>

      <span className="music-control__text">
        {playing ? "Now playing" : "Play music"}
      </span>

      <Music size={15} />
    </button>
  );
}
