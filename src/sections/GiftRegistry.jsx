import SectionHeading from "../components/SectionHeading";
import GiftCard from "../components/GiftCard";

const gifts = [
  {
    icon: "01",
    title: "Dinner Set",
    description:
      "Help us fill our new home with beautiful pieces we'll enjoy together for years to come.",
    amount: "₦150,000",
  },
  {
    icon: "02",
    title: "Kitchen",
    description:
      "Contribute towards creating a warm and beautiful kitchen for our new home.",
    amount: "₦200,000",
  },
  {
    icon: "03",
    title: "Bedroom",
    description:
      "Help us create a comfortable and beautiful space as we begin our life together.",
    amount: "₦250,000",
  },
  {
    icon: "04",
    title: "Our Home",
    description:
      "Prefer to contribute towards something else for our home? Every contribution means so much to us.",
    amount: "Any Amount",
  },
];

export default function GiftRegistry() {
  return (
    <section id="gift-registry" className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Help us build our home"
          title="Gift Registry"
          description="If you'd rather bless us with something special for our new home, choose from our registry below."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {gifts.map((gift) => (
            <article
              key={gift.title}
              className="group relative overflow-hidden border border-brown/10 bg-ivory/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-champagne/50"
            >
              {/* Number */}
              <span className="font-display text-5xl text-champagne/30">
                {gift.icon}
              </span>

              {/* Image placeholder */}
              <div className="mt-6 flex aspect-square items-center justify-center bg-cream">
                <span className="font-display text-5xl italic text-brown/15">
                  {gift.title}
                </span>
              </div>

              <h3 className="mt-7 font-display text-3xl">{gift.title}</h3>

              <p className="mt-3 text-sm leading-6 text-brown/50">
                {gift.description}
              </p>

              <div className="mt-6 border-t border-brown/10 pt-5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-brown/35">
                  Suggested Contribution
                </p>

                <p className="mt-1 font-display text-2xl text-burgundy">
                  {gift.amount}
                </p>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-full border border-brown/15 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-brown transition hover:border-burgundy hover:bg-burgundy hover:text-white"
              >
                Contribute →
              </button>
            </article>
          ))}
        </div>

        {/* Bottom message */}
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <div className="mx-auto h-px w-12 bg-champagne" />

          <p className="mt-7 font-display text-2xl italic text-brown/60 sm:text-3xl">
            "The greatest gift is having you celebrate this new chapter with
            us."
          </p>

          <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-champagne">
            With love, Miracle & Steve
          </p>
        </div>
      </div>
    </section>
  );
}
