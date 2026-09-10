import { useState } from "react";
import SectionHeading from "../components/SectionHeading";

const amounts = ["₦20,000", "₦50,000", "₦100,000", "₦200,000"];

export default function Gifts() {
  const [selectedAmount, setSelectedAmount] = useState(null);

  return (
    <section id="gifts" className="bg-cream/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Your love means everything"
          title="Give a Gift"
          description="Your presence is our greatest gift. If you'd like to bless us as we begin this beautiful new chapter, we'd be deeply grateful."
        />

        {/* Cash Gift */}
        <div className="mx-auto mt-16 max-w-4xl border border-brown/10 bg-white p-7 sm:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-champagne">
              Celebrate with us
            </p>

            <h3 className="mt-4 font-display text-4xl sm:text-5xl">
              Send a Cash Gift
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-brown/50">
              Whether you're celebrating with us in person or from afar, your
              generosity is a beautiful part of our story.
            </p>
          </div>

          {/* Preset amounts */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {amounts.map((amount) => {
              const selected = selectedAmount === amount;

              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setSelectedAmount(amount)}
                  className={`border px-4 py-6 font-display text-2xl transition ${
                    selected
                      ? "border-burgundy bg-burgundy text-white"
                      : "border-brown/10 bg-ivory hover:border-champagne hover:text-burgundy"
                  }`}
                >
                  {amount}
                </button>
              );
            })}
          </div>

          {/* Custom amount */}
          <div className="mt-4">
            <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
              Or enter your own amount
            </label>

            <div className="flex items-center border border-brown/10 bg-ivory">
              <span className="px-4 font-display text-2xl text-brown/50">
                ₦
              </span>

              <input
                type="number"
                placeholder="Enter amount"
                className="w-full bg-transparent px-2 py-4 text-sm outline-none placeholder:text-brown/30"
                onChange={(event) => {
                  const value = event.target.value;

                  setSelectedAmount(
                    value ? `₦${Number(value).toLocaleString()}` : null,
                  );
                }}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button
              type="button"
              disabled={!selectedAmount}
              className="w-full rounded-full bg-burgundy px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-65"
            >
              {selectedAmount
                ? `Give ${selectedAmount} ❤️`
                : "Choose an Amount"}
            </button>

            <p className="mt-4 text-[10px] text-brown/30">
              Secure online payment will be available here.
            </p>
          </div>
        </div>

        {/* Gift Wall */}
        <div className="mt-24">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-champagne">
              From our loved ones
            </p>

            <h3 className="mt-4 font-display text-5xl">Gift Wall</h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-brown/50">
              Every gift and beautiful message is a reminder of the love
              surrounding us as we begin this journey together.
            </p>
          </div>

          {/* Empty state for now */}
          <div className="mx-auto mt-10 max-w-3xl border border-dashed border-brown/15 bg-white/50 px-6 py-14 text-center">
            <span className="font-display text-5xl text-champagne/40">♥</span>

            <p className="mt-5 font-display text-2xl text-brown/60">
              Your messages will live here
            </p>

            <p className="mt-2 text-sm text-brown/35">
              Once gifts begin coming in, beautiful messages from our loved ones
              will appear here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
