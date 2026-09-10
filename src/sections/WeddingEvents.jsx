import SectionHeading from "../components/SectionHeading";

const events = [
  {
    number: "01",
    type: "Traditional",
    title: "Traditional Marriage",
    date: "April 2027",
    time: "10:00 AM",
    venue: "Venue to be announced",
    location: "Lagos, Nigeria",
    description:
      "Join our families as we celebrate our union in the richness, beauty and joy of our traditional heritage.",
    dressCode: "Traditional Elegance",
  },
  {
    number: "02",
    type: "Church",
    title: "Church Wedding",
    date: "April 2027",
    time: "10:00 AM",
    venue: "Venue to be announced",
    location: "Lagos, Nigeria",
    description:
      "Come celebrate with us as we make our covenant before God, surrounded by our family and loved ones.",
    dressCode: "Formal / Church Elegance",
  },
  {
    number: "03",
    type: "Reception",
    title: "Wedding Reception",
    date: "April 2027",
    time: "2:00 PM",
    venue: "Venue to be announced",
    location: "Lagos, Nigeria",
    description:
      "An afternoon and evening of food, music, dancing, laughter and beautiful memories with the people we love.",
    dressCode: "Elegant Celebration",
  },
];

function EventItem({ event }) {
  return (
    <article className="group relative overflow-hidden border border-ivory/10 bg-white/2 transition duration-500 hover:border-champagne/50">
      {/* Number */}
      <div className="absolute right-7 top-6 font-display text-6xl leading-none text-ivory/5 transition duration-500 group-hover:text-champagne/10">
        {event.number}
      </div>

      <div className="relative p-7 sm:p-9">
        {/* Event type */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-champagne" />

          <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
            {event.type}
          </p>
        </div>

        {/* Title */}
        <h3 className="mt-7 max-w-xs font-display text-4xl leading-[0.95] sm:text-5xl">
          {event.title}
        </h3>

        {/* Details */}
        <div className="mt-9 space-y-5 border-y border-ivory/10 py-7">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-ivory/35">
              Date
            </p>

            <p className="mt-1 font-display text-xl text-ivory/85">
              {event.date}
            </p>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-ivory/35">
              Time
            </p>

            <p className="mt-1 font-display text-xl text-ivory/85">
              {event.time}
            </p>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-ivory/35">
              Venue
            </p>

            <p className="mt-1 text-sm text-ivory/70">{event.venue}</p>

            <p className="mt-1 text-xs text-ivory/40">{event.location}</p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-7 text-sm leading-7 text-ivory/50">
          {event.description}
        </p>

        {/* Dress code */}
        <div className="mt-7 flex items-center justify-between border-t border-ivory/10 pt-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-ivory/30">
              Dress Code
            </p>

            <p className="mt-1 text-xs text-champagne">{event.dressCode}</p>
          </div>

          {/* This will become a real Google Maps link once the venue is confirmed */}
          <button
            type="button"
            className="text-[10px] uppercase tracking-[0.2em] text-ivory/50 transition hover:text-champagne"
          >
            Directions →
          </button>
        </div>
      </div>
    </article>
  );
}

export default function WeddingEvents() {
  return (
    <section
      id="wedding"
      className="relative overflow-hidden bg-brown py-28 text-ivory"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-champagne/5 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-burgundy/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          light
          eyebrow="Save the date"
          title="The Wedding"
          description="Three beautiful moments. One unforgettable celebration. We cannot wait to share these moments with you."
        />

        {/* Events */}
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {events.map((event) => (
            <EventItem key={event.number} event={event} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-ivory/10 pt-10 sm:flex-row">
          <div>
            <p className="font-display text-2xl italic text-ivory/70">
              We saved you a seat.
            </p>

            <p className="mt-1 text-xs text-ivory/35">
              Let us know you'll be joining us.
            </p>
          </div>

          <a
            href="#rsvp"
            className="rounded-full bg-champagne px-8 py-4 text-xs uppercase tracking-[0.2em] text-brown transition hover:bg-ivory"
          >
            RSVP Now
          </a>
        </div>
      </div>
    </section>
  );
}
