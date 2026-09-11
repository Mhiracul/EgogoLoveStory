import { useEffect, useState } from "react";

export default function WeddingEntrance({ onOpen, onComplete }) {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOpen = async () => {
    if (opening) return;

    setOpening(true);

    // Start music from the user's tap
    await onOpen?.();

    // Give the full opening animation time to finish
    setTimeout(() => {
      document.body.style.overflow = "";
      onComplete?.();
    }, 7000);
  };

  return (
    <section
      className={`wedding-entrance ${
        opening ? "wedding-entrance--opening" : ""
      }`}
    >
      <div className="envelope-scene">
        {/* INVITATION CARD INSIDE ENVELOPE */}
        <div className="invitation-card">
          <div className="invitation-card__inner">
            <div className="invitation-top-line">WITH JOY IN OUR HEARTS</div>

            <p className="invitation-kicker">YOU ARE CORDIALLY INVITED</p>

            <h1 className="invitation-names">
              <span>Miracle</span>
              <small>&</small>
              <span>Steve</span>
            </h1>

            <div className="invitation-divider">
              <span />
              <b>✦</b>
              <span />
            </div>

            <p className="invitation-title">THE EGOGO LOVE STORY</p>

            <p className="invitation-date">APRIL 2027</p>

            <p className="invitation-message">
              Two hearts, one beautiful story, and a lifetime to begin.
            </p>
          </div>
        </div>

        {/* ENVELOPE BACK */}
        <div className="envelope-back" />

        {/* LOWER ENVELOPE POCKET */}
        <div className="envelope-front" />

        {/* TOP FLAP */}
        <div className="envelope-flap" />

        {/* GOLD INNER EDGE */}
        <div className="envelope-gold-edge" />

        {/* WAX SEAL */}
        <button
          className="wax-seal"
          onClick={handleOpen}
          aria-label="Open wedding invitation"
        >
          <span className="wax-seal__outer">
            <span className="wax-seal__inner">
              M <small>&</small> S
            </span>
          </span>
        </button>

        {/* TAP TEXT */}
        <div className="tap-to-open">
          <span>Tap to open</span>
          <i />
        </div>

        {/* OPENING OVERLAY */}
        <div className="opening-glow" />
      </div>
    </section>
  );
}
