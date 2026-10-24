import { useState } from "react";
import envelopeImage from "../assets/ms-envelope.png";
import "./WeddingIntro.css";

export default function WeddingIntro({ onOpen }) {
  const [stage, setStage] = useState("closed");

  const startOpening = () => {
    if (stage === "closed") setStage("opening");
  };

  const handleAnimationEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      event.animationName === "envelope-flap-open"
    ) {
      setStage("revealed");
    }
  };

  return (
    <div
      className={`wedding-intro ${
        stage === "opening" ? "is-opening" : ""
      } ${stage === "revealed" ? "is-revealed" : ""}`}
    >
      <div className="intro-glow" />

      <div className="envelope-scene">
        {/* Your actual M & S envelope artwork */}
        <img
          src={envelopeImage}
          alt="Ivory wedding envelope with an M and S burgundy wax seal"
          className="envelope-art"
        />

        {stage !== "revealed" && (
          <>
            {/* Separate flap that rotates open */}
            <div
              className="envelope-flap"
              onAnimationEnd={handleAnimationEnd}
            />

            {/* Clickable wax seal */}
            {stage === "closed" && (
              <button
                className="seal-trigger"
                onClick={startOpening}
                aria-label="Open the M and S wedding invitation"
              >
                <span className="seal-hint">TAP TO OPEN</span>
              </button>
            )}
          </>
        )}

        {/* Invitation revealed inside the envelope */}
        {stage === "revealed" && (
          <div className="revealed-invitation">
            <span className="invitation-monogram">
              M <i>&</i> S
            </span>

            <span className="invitation-rule">✦</span>

            <p className="invitation-eyebrow">TOGETHER WITH OUR FAMILIES</p>

            <h1>Our Forever Begins</h1>

            <p className="invitation-copy">
              With hearts full of love and gratitude, we invite you to celebrate
              our union.
            </p>

            <button className="enter-wedding" onClick={onOpen}>
              ENTER OUR WEDDING
              <span aria-hidden="true"> →</span>
            </button>
          </div>
        )}
      </div>

      {stage !== "revealed" && (
        <p className="intro-footer">A NEW CHAPTER · A FOREVER LOVE</p>
      )}
    </div>
  );
}
