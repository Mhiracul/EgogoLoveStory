import SectionHeading from "../components/SectionHeading";

const colours = [
  {
    name: "Ivory",
    className: "bg-ivory",
    border: true,
  },
  {
    name: "Nude",
    className: "bg-nude",
  },
  {
    name: "Champagne",
    className: "bg-champagne",
  },
  {
    name: "Blush",
    className: "bg-blush",
  },
  {
    name: "Soft Coral",
    className: "bg-coral",
  },
];

const events = [
  {
    number: "01",
    title: "Traditional Marriage",
    description:
      "Come dressed in elegant traditional attire and celebrate with us in the richness of our culture.",
  },
  {
    number: "02",
    title: "Church Wedding",
    description:
      "Formal and elegant church attire is encouraged as we celebrate this beautiful covenant together.",
  },
];

export default function DressCode() {
  return (
    <section id="dress-code" className="bg-cream/40 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Come dressed for the celebration"
          title="The Dress Code"
          description="We've chosen a soft, warm and romantic palette for our celebration. We'd love to see you interpret it in your own beautiful way."
        />

        {/* Colour Palette */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-champagne">
              Our Wedding Palette
            </p>

            <h3 className="mt-3 font-display text-3xl sm:text-4xl">
              Soft. Warm. Elegant.
            </h3>
          </div>

          <div className="grid grid-cols-5 overflow-hidden border border-brown/10">
            {colours.map((colour) => (
              <div key={colour.name} className="group">
                <div
                  className={`h-28 transition duration-500 group-hover:h-32 sm:h-40 sm:group-hover:h-44 ${colour.className} ${
                    colour.border ? "border-r border-brown/10" : ""
                  }`}
                />
                <div className="bg-white px-2 py-4 text-center sm:px-4">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-brown/60 sm:text-[10px] sm:tracking-[0.2em]">
                    {colour.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Guidance */}
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <p className="font-display text-2xl leading-8 text-brown/75 sm:text-3xl">
            Think soft, romantic and effortlessly elegant.
          </p>

          <p className="mt-5 text-sm leading-7 text-brown/50">
            Ivory, nude, champagne, blush and soft coral are all welcome. Feel
            free to mix shades, textures and styles while keeping your look
            elegant and celebration-ready.
          </p>
        </div>

        {/* Event Dress Codes */}
        <div className="mt-20 grid gap-5 md:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.number}
              className="group relative overflow-hidden border border-brown/10 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-champagne/50 sm:p-10"
            >
              <span className="absolute right-6 top-2 font-display text-8xl leading-none text-champagne/10 transition group-hover:text-champagne/20">
                {event.number}
              </span>

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-champagne" />

                  <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
                    Dress Code
                  </p>
                </div>

                <h3 className="mt-7 max-w-sm font-display text-4xl leading-tight sm:text-5xl">
                  {event.title}
                </h3>

                <p className="mt-5 max-w-lg text-sm leading-7 text-brown/55">
                  {event.description}
                </p>

                <div className="mt-7 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-champagne" />
                  <span className="h-2 w-2 rounded-full bg-blush" />
                  <span className="h-2 w-2 rounded-full bg-coral" />

                  <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-brown/40">
                    Wedding Palette
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Burgundy Note */}
        <div className="mx-auto mt-12 max-w-3xl border border-burgundy/15 bg-burgundy/3 px-6 py-7 text-center sm:px-10">
          <p className="text-xs uppercase tracking-[0.25em] text-burgundy">
            A little note
          </p>

          <p className="mt-3 font-display text-xl italic text-brown/65 sm:text-2xl">
            Burgundy is reserved primarily for the couple and bridal party, so
            we'd love for our guests to explore the softer shades in our palette
            instead.
          </p>
        </div>
      </div>
    </section>
  );
}
