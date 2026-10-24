import { useEffect, useRef, useState } from "react";
import envelopeImage from "../assets/ms-envelope.png";
import openingVideo from "../assets/videos/ms.mp4";

export default function WeddingEntrance({ onOpen, onComplete }) {
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const finishOpening = () => {
    if (completedRef.current) return;

    completedRef.current = true;
    document.body.style.overflow = "";
    onComplete?.();
  };

  const handleOpen = async () => {
    if (playing || completedRef.current) return;

    // Reveal the video immediately after the seal is clicked.
    setPlaying(true);

    // Start the wedding background music separately.
    try {
      await onOpen?.();
    } catch (error) {
      console.error("Could not start wedding music:", error);
    }

    // Play the envelope animation with its sound muted.
    try {
      if (videoRef.current) {
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Could not play the opening animation:", error);
      setVideoError(true);
    }
  };

  return (
    <section
      className={`wedding-entrance ${
        playing ? "wedding-entrance--opening" : ""
      }`}
    >
      {!playing && (
        <div className="envelope-scene">
          <img
            src={envelopeImage}
            alt="Miracle and Steve's wedding envelope"
            className="envelope-image"
            draggable="false"
          />

          <button
            type="button"
            className="envelope-image-trigger"
            onClick={handleOpen}
            aria-label="Open the wedding invitation"
          />

          <div className="tap-to-open">
            <span>Tap to open</span>
            <i />
          </div>
        </div>
      )}

      {playing && !videoError && (
        <video
          ref={videoRef}
          className="envelope-opening-video"
          src={openingVideo}
          autoPlay
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          preload="auto"
          onEnded={finishOpening}
          onError={() => setVideoError(true)}
        />
      )}

      {videoError && (
        <div className="video-error">
          <p>We couldn't play the invitation animation.</p>
          <button type="button" onClick={finishOpening}>
            Enter wedding website
          </button>
        </div>
      )}
    </section>
  );
}
