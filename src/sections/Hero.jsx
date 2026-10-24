export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-burgundy text-white"
    >
      {/* Full-screen background video */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/videos/preweddin.mp4" type="video/mp4" />
      </video>

      {/* Transparent burgundy tint — video remains visible */}
      <div className="absolute inset-0 z-1 bg-[#5B1025]/80" />

      {/* Extra gradient for cinematic depth */}
      <div className="absolute inset-0 z-2 bg-linear-to-b from-black/10 via-transparent to-black/30" />

      {/* Subtle vignette */}

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-28 text-center sm:px-8">
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-champagne/80 sm:w-16" />

          <p className="text-[10px] uppercase tracking-[0.4em] text-champagne sm:text-xs">
            Together with our families
          </p>

          <span className="h-px w-10 bg-champagne/80 sm:w-16" />
        </div>

        <p className="mb-5 text-[10px] uppercase tracking-[0.45em] text-white/75 sm:text-xs">
          Joyfully invite you to celebrate
        </p>

        <h1 className="font-display text-6xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-8xl md:text-9xl">
          Miracle
          <span className="my-2 block font-display text-5xl italic text-champagne sm:text-7xl md:text-8xl">
            &
          </span>
          Steve
        </h1>

        <div className="mx-auto my-8 h-px w-16 bg-champagne/70" />

        <p className="font-display text-xl italic text-white/90 sm:text-3xl">
          Our forever begins here.
        </p>

        <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-champagne sm:text-xs">
          #TheEgogoLoveStory
        </p>

        {/* Wedding date */}
        <div className="mx-auto mt-9 flex w-fit items-center justify-center gap-5 border-y border-white/25 py-4 sm:gap-8">
          <div>
            <p className="font-display text-xl sm:text-2xl">3rd April</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/60">
              2027
            </p>
          </div>

          <span className="h-10 w-px bg-champagne/60" />

          <div>
            <p className="font-display text-xl sm:text-2xl">Lagos</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/60">
              Nigeria
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#rsvp"
            className="border border-champagne bg-champagne px-8 py-4 text-[10px] uppercase tracking-[0.25em] text-burgundy transition hover:border-white hover:bg-white"
          >
            RSVP
          </a>

          <a
            href="#wedding"
            className="border border-white/50 bg-burgundy/20 px-8 py-4 text-[10px] uppercase tracking-[0.25em] text-white backdrop-blur-sm transition hover:border-champagne hover:text-champagne"
          >
            Explore Wedding
          </a>
        </div>

        <p className="mt-12 text-[9px] uppercase tracking-[0.3em] text-white/55">
          A love story written by grace
        </p>
      </div>

      {/* Scroll indicator */}
      <a
        href="#our-story"
        aria-label="Scroll to our story"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white/65 sm:flex"
      >
        <span>Scroll to explore</span>
        <span className="h-9 w-px bg-champagne/70" />
      </a>
    </section>
  );
}
