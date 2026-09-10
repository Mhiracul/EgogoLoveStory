export default function Footer() {
  return (
    <footer className="bg-brown px-6 pb-28 pt-16 text-center text-ivory lg:pb-16">
      {" "}
      <p className="font-display text-5xl">
        Miracle <span className="text-champagne">&</span> Steve
      </p>
      <p className="mt-4 font-display text-xl italic text-ivory/60">
        Our forever begins here.
      </p>
      <p className="mt-5 text-sm tracking-[0.25em] text-champagne">
        #TheEgogoLoveStory
      </p>
      <div className="mx-auto mt-10 h-px max-w-xs bg-ivory/10" />
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-ivory/40">
        <a href="#home">Home</a>
        <a href="#wedding">Wedding</a>
        <a href="#gifts">Gifts</a>
        <a href="#rsvp">RSVP</a>
      </div>
      <p className="mt-10 text-xs text-ivory/25">
        With love, Miracle & Steve • 2026
      </p>
    </footer>
  );
}
