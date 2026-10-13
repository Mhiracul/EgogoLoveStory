export default function GiftCard({
  title,
  description,
  amount,
  image,
  category,
  gifted = false,
  donors = [],
  quantityNeeded = 1,
  quantityGifted = 0,
  onContribute,
}) {
  const remaining = Math.max(0, quantityNeeded - quantityGifted);

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-brown/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-champagne/50">
      {/* Product image */}
      <div className="relative aspect-4/3 shrink-0 overflow-hidden bg-ivory">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            gifted ? "scale-100 blur-[3px]" : ""
          }`}
        />

        {gifted && (
          <div className="absolute inset-0 flex items-center justify-center bg-brown/15 p-4">
            <div className="w-full max-w-xs border border-champagne/70 bg-white/95 px-4 py-5 text-center shadow-lg">
              <span className="text-2xl text-burgundy">♥</span>

              <p className="mt-1 font-display text-2xl text-burgundy">
                Gifted with love
              </p>

              {donors.length > 0 && (
                <p className="mt-2 wrap-break-word text-xs leading-5 text-brown/70">
                  By{" "}
                  {donors
                    .map((donor) =>
                      typeof donor === "string" ? donor : donor.name,
                    )
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {category && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-champagne">
            {category}
          </p>
        )}

        <h3 className="mt-3 font-display text-2xl leading-tight text-brown">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-brown/55">{description}</p>

        <div className="mt-auto pt-5">
          <p className="font-display text-2xl text-burgundy">
            {amount == null
              ? "Any Amount"
              : `₦${Number(amount).toLocaleString("en-NG")}`}
          </p>

          {quantityNeeded > 1 && (
            <p className="mt-2 text-xs text-brown/50">
              Qty: {remaining} Needed
            </p>
          )}

          <button
            type="button"
            onClick={onContribute}
            className="mt-6 w-full rounded-full bg-burgundy px-5 py-3.5 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-brown"
          >
            {gifted ? "Gift Again" : "Pay for Item"} →
          </button>
        </div>
      </div>
    </article>
  );
}
