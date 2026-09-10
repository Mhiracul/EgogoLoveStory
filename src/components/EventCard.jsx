export default function EventCard({
  number,
  title,
  date,
  time,
  location,
  description,
}) {
  return (
    <article className="group border border-ivory/10 p-8 transition duration-300 hover:border-champagne/60 hover:bg-white/3">
      <span className="font-display text-4xl text-champagne">{number}</span>

      <h3 className="mt-8 font-display text-3xl">{title}</h3>

      <div className="mt-6 space-y-2 text-sm text-ivory/60">
        <p>{date}</p>
        <p>{time}</p>
        <p>{location}</p>
      </div>

      <p className="mt-6 text-sm leading-6 text-ivory/50">{description}</p>

      <button className="mt-8 text-xs uppercase tracking-[0.2em] text-champagne transition group-hover:translate-x-1">
        View Details →
      </button>
    </article>
  );
}
