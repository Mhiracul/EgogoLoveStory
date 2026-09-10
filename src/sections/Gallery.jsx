import SectionHeading from "../components/SectionHeading";

const photos = [
  {
    number: "01",
    size: "md:col-span-2 md:row-span-2",
  },
  {
    number: "02",
    size: "",
  },
  {
    number: "03",
    size: "",
  },
  {
    number: "04",
    size: "",
  },
  {
    number: "05",
    size: "md:col-span-2",
  },
  {
    number: "06",
    size: "",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-ivory py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="A glimpse into our journey"
          title="Our Gallery"
          description="A collection of moments, memories and beautiful chapters from our journey to forever."
        />

        {/* Gallery Grid */}
        <div className="mt-16 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4 md:auto-rows-[230px]">
          {photos.map((photo) => (
            <button
              key={photo.number}
              type="button"
              className={`group relative overflow-hidden bg-cream text-left ${photo.size}`}
            >
              {/* Placeholder */}
              <div className="absolute inset-0 bg-linear-to-br from-champagne/10 via-blush/10 to-coral/10 transition duration-500 group-hover:scale-105" />

              <div className="relative flex h-full flex-col items-center justify-center">
                <span className="font-display text-6xl text-brown/10 transition duration-500 group-hover:text-burgundy/20">
                  {photo.number}
                </span>

                <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-brown/25">
                  Photo coming soon
                </p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-end bg-burgundy/0 p-5 transition duration-300 group-hover:bg-burgundy/70">
                <div className="translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-champagne">
                    Miracle & Steve
                  </p>

                  <p className="mt-1 font-display text-xl text-white">
                    Our Story
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Gallery note */}
        <div className="mx-auto mt-14 max-w-2xl text-center">
          <p className="font-display text-2xl italic text-brown/55 sm:text-3xl">
            Every picture holds a memory. Every memory tells our story.
          </p>
        </div>

        {/* Share photos */}
        <div className="mt-12 text-center">
          <button
            type="button"
            className="rounded-full border border-brown/15 px-8 py-4 text-xs uppercase tracking-[0.2em] text-brown transition hover:border-burgundy hover:bg-burgundy hover:text-white"
          >
            Share Your Photos →
          </button>
        </div>
      </div>
    </section>
  );
}
