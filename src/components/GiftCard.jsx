export default function GiftCard({
  icon,
  title,
  description,
  amount,
  action = "Contribute",
}) {
  return (
    <article className="group border border-brown/10 bg-white/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-champagne/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-champagne/30 bg-champagne/5 text-2xl">
        {icon}
      </div>

      <h3 className="mt-6 font-display text-3xl">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-brown/55">{description}</p>

      {amount && (
        <p className="mt-5 font-display text-2xl text-burgundy">{amount}</p>
      )}

      <button className="mt-6 text-xs uppercase tracking-[0.2em] text-burgundy">
        {action} →
      </button>
    </article>
  );
}
