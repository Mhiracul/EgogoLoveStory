export default function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}) {
  return (
    <div className={`text-center ${light ? "text-ivory" : "text-brown"}`}>
      <p className="text-xs uppercase tracking-[0.3em] text-champagne">
        {eyebrow}
      </p>

      <h2 className="mt-4 font-display text-6xl leading-none sm:text-7xl">
        {title}
      </h2>

      {description && (
        <p
          className={`mx-auto mt-6 max-w-2xl leading-7 ${
            light ? "text-ivory/60" : "text-brown/60"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
