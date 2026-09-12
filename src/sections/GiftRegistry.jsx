import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";

import SectionHeading from "../components/SectionHeading";

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

const MIN_CONTRIBUTION = 50000;

const initialForm = {
  name: "",
  email: "",
  message: "",
  displayOnGiftWall: true,
};

const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

export default function GiftRegistry() {
  const [selectedGift, setSelectedGift] = useState(null);
  const [amount, setAmount] = useState("");
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const openContribution = (gift) => {
    setSelectedGift(gift);
    setAmount("");
    setForm(initialForm);
    setSuccess(false);
    setError("");
  };

  const closeContribution = () => {
    if (loading) return;

    setSelectedGift(null);
    setAmount("");
    setForm(initialForm);
    setSuccess(false);
    setError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    setError("");
  };

  const handleContribute = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount < MIN_CONTRIBUTION) {
      setError(
        `The minimum registry contribution is ${formatNaira(
          MIN_CONTRIBUTION,
        )}.`,
      );
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create pending gift
      const createResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gifts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donorName: form.name.trim(),
            email: form.email.trim(),
            amount: numericAmount,
            message: form.message.trim(),
            displayOnGiftWall: form.displayOnGiftWall,
            registryItem: selectedGift.title,
          }),
        },
      );

      const giftData = await createResponse.json();

      if (!createResponse.ok || !giftData.success) {
        throw new Error(
          giftData.message || "Unable to create your contribution.",
        );
      }

      const giftId = giftData.data._id;

      // 2. Initialize Paystack
      const initializeResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gifts/initialize-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            giftId,
          }),
        },
      );

      const paymentData = await initializeResponse.json();

      if (!initializeResponse.ok || !paymentData.success) {
        throw new Error(paymentData.message || "Unable to initialize payment.");
      }

      // 3. Open Paystack
      const { default: Paystack } = await import("@paystack/inline-js");

      const paystack = new Paystack();

      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email.trim(),
        amount: numericAmount * 100,
        currency: "NGN",
        reference: paymentData.data.reference,

        onSuccess: async (transaction) => {
          try {
            // 4. Verify payment
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/gifts/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  reference: transaction.reference,
                  giftId,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message || "Payment verification failed.",
              );
            }

            setSuccess(true);
            setLoading(false);

            setAmount("");
            setForm(initialForm);
          } catch (error) {
            console.error("Registry payment verification error:", error);

            setError(
              error.message ||
                "Your payment could not be verified. Please contact us.",
            );

            setLoading(false);
          }
        },

        onCancel: () => {
          setError(
            "Payment was cancelled. You can try again whenever you're ready.",
          );

          setLoading(false);
        },

        onError: (paystackError) => {
          console.error("Paystack error:", paystackError);

          setError("Something went wrong with the payment. Please try again.");

          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Registry contribution error:", error);

      setError(error.message || "Something went wrong. Please try again.");

      setLoading(false);
    }
  };

  return (
    <>
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
                  onClick={() => openContribution(gift)}
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

      {/* Contribution Modal */}
      {selectedGift && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brown/50 px-4 py-6 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-ivory shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brown/10 bg-ivory px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-coral">
                  Gift Registry
                </p>

                <h3 className="mt-1 font-display text-3xl text-brown">
                  {selectedGift.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeContribution}
                disabled={loading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brown/5 text-brown/60 transition hover:bg-brown/10 hover:text-brown disabled:opacity-50"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {success ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-champagne/10">
                  <CheckCircle2 size={32} className="text-champagne" />
                </div>

                <h3 className="mt-6 font-display text-3xl text-brown">
                  Thank You So Much!
                </h3>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-brown/60">
                  Your contribution towards our {selectedGift.title} has been
                  received successfully. Your generosity means so much to us.
                </p>

                <button
                  type="button"
                  onClick={closeContribution}
                  className="mt-8 rounded-full bg-brown px-7 py-3 text-sm font-medium text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleContribute} className="space-y-5 p-6">
                {/* Selected registry item */}
                <div className="border border-champagne/20 bg-champagne/5 px-5 py-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-brown/35">
                    You're contributing towards
                  </p>

                  <p className="mt-1 font-display text-2xl text-burgundy">
                    {selectedGift.title}
                  </p>

                  <p className="mt-1 text-xs text-brown/40">
                    Suggested: {selectedGift.amount}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
                    Contribution Amount *
                  </label>

                  <div className="flex items-center border border-brown/10 bg-white">
                    <span className="px-4 font-display text-2xl text-brown/50">
                      ₦
                    </span>

                    <input
                      type="number"
                      min={MIN_CONTRIBUTION}
                      step="1000"
                      value={amount}
                      onChange={handleAmountChange}
                      required
                      placeholder="Enter amount"
                      className="w-full bg-transparent px-2 py-4 text-sm outline-none placeholder:text-brown/30"
                    />
                  </div>

                  <p className="mt-2 text-[10px] text-brown/30">
                    Minimum contribution: {formatNaira(MIN_CONTRIBUTION)}
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
                    Your Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                    className="w-full border border-brown/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-champagne"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="w-full border border-brown/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-champagne"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
                    A Message <span className="normal-case">(optional)</span>
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    rows="4"
                    maxLength="500"
                    placeholder="Leave a beautiful message for Miracle & Steve..."
                    className="w-full resize-none border border-brown/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-champagne"
                  />
                </div>

                {/* Gift Wall */}
                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.displayOnGiftWall}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          displayOnGiftWall: event.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 accent-burgundy"
                    />

                    <span className="text-xs leading-5 text-brown/50">
                      I'd like my name and message to appear on the Gift Wall.
                    </span>
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <div className="border border-burgundy/10 bg-burgundy/5 px-4 py-3 text-center text-xs leading-5 text-burgundy">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-burgundy px-5 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Contribute ${amount ? formatNaira(amount) : ""} ❤️`
                  )}
                </button>

                <p className="text-center text-[10px] leading-5 text-brown/30">
                  Secure payment powered by Paystack.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
