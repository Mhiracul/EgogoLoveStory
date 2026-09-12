import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import GiftCard from "../components/GiftCard";

const gifts = [
  {
    icon: "01",
    title: "Dinner Set",
    description:
      "Help us fill our new home with beautiful pieces we'll enjoy together for years to come.",
    amount: 150000,
  },
  {
    icon: "02",
    title: "Kitchen",
    description:
      "Contribute towards creating a warm and beautiful kitchen for our new home.",
    amount: 200000,
  },
  {
    icon: "03",
    title: "Bedroom",
    description:
      "Help us create a comfortable and beautiful space as we begin our life together.",
    amount: 250000,
  },
  {
    icon: "04",
    title: "Our Home",
    description:
      "Prefer to contribute towards something else for our home? Every contribution means so much to us.",
    amount: null,
  },
];

const initialForm = {
  name: "",
  email: "",
  message: "",
};

const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

export default function GiftRegistry() {
  const [selectedGift, setSelectedGift] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const contributionAmount = selectedGift?.amount || Number(customAmount) || 0;
  const openContribution = (gift) => {
    setSelectedGift(gift);
    setCustomAmount("");
    setForm(initialForm);
    setError("");
    setSuccess(false);
  };

  const closeContribution = () => {
    if (loading) return;

    setSelectedGift(null);
    setCustomAmount("");
    setForm(initialForm);
    setError("");
    setSuccess(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleCustomAmount = (event) => {
    setCustomAmount(event.target.value);
    setError("");
  };

  const handleContribute = async () => {
    setError("");
    setSuccess(false);

    if (!contributionAmount || contributionAmount < 50000) {
      setError("Please enter a contribution of at least ₦50,000.");
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
            amount: contributionAmount,
            message: form.message.trim()
              ? `${selectedGift.title}: ${form.message.trim()}`
              : `Registry contribution: ${selectedGift.title}`,
            displayOnGiftWall: true,
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
        amount: contributionAmount * 100,
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

            setTimeout(() => {
              closeContribution();
            }, 2500);
          } catch (verificationError) {
            console.error(
              "Registry payment verification error:",
              verificationError,
            );

            setError(
              verificationError.message ||
                "Your payment could not be verified. Please contact us.",
            );
          } finally {
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
    } catch (paymentError) {
      console.error("Registry payment error:", paymentError);

      setError(
        paymentError.message || "Something went wrong. Please try again.",
      );

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
              <GiftCard
                key={gift.title}
                icon={gift.icon}
                title={gift.title}
                description={gift.description}
                amount={gift.amount ? formatNaira(gift.amount) : "Any Amount"}
                onContribute={() => openContribution(gift)}
              />
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
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-brown/60 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeContribution();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-7 shadow-2xl sm:p-10">
            {/* Header */}
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
                Gift Registry
              </p>

              <h3 className="mt-3 font-display text-4xl text-brown">
                {selectedGift.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-brown/50">
                Thank you for helping us build our home together.
              </p>
            </div>

            {/* Selected amount */}
            {selectedGift.amount ? (
              <div className="mt-7 border border-champagne/30 bg-champagne/5 px-5 py-5 text-center">
                <p className="text-[9px] uppercase tracking-[0.25em] text-brown/35">
                  Suggested Contribution
                </p>

                <p className="mt-2 font-display text-4xl text-burgundy">
                  {formatNaira(selectedGift.amount)}
                </p>
              </div>
            ) : (
              <div className="mt-7">
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
                  Contribution Amount
                </label>

                <div className="flex items-center border border-brown/10 bg-ivory">
                  <span className="px-4 font-display text-2xl text-brown/50">
                    ₦
                  </span>

                  <input
                    type="number"
                    min="50000"
                    value={customAmount}
                    onChange={handleCustomAmount}
                    placeholder="Enter amount"
                    className="w-full bg-transparent px-2 py-4 text-sm outline-none placeholder:text-brown/30"
                  />
                </div>

                <p className="mt-2 text-[10px] text-brown/30">
                  Minimum contribution: ₦50,000
                </p>
              </div>
            )}

            {/* Donor details */}
            <div className="mt-7 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full border border-brown/10 bg-ivory px-4 py-4 text-sm outline-none transition focus:border-champagne"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full border border-brown/10 bg-ivory px-4 py-4 text-sm outline-none transition focus:border-champagne"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brown/40">
                  A Message <span className="normal-case">(optional)</span>
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength="500"
                  placeholder="Leave a beautiful message for Miracle & Steve..."
                  className="w-full resize-none border border-brown/10 bg-ivory px-4 py-4 text-sm outline-none transition focus:border-champagne"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 border border-burgundy/10 bg-burgundy/5 px-4 py-3 text-center text-xs leading-5 text-burgundy">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-5 border border-champagne/30 bg-champagne/10 px-5 py-5 text-center">
                <span className="font-display text-4xl text-champagne">♥</span>

                <h4 className="mt-2 font-display text-2xl text-burgundy">
                  Thank You So Much!
                </h4>

                <p className="mt-2 text-sm leading-6 text-brown/50">
                  Your contribution has been received successfully.
                </p>
              </div>
            )}

            {/* Buttons */}
            {!success && (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closeContribution}
                  disabled={loading}
                  className="rounded-full border border-brown/15 px-6 py-4 text-xs uppercase tracking-[0.2em] text-brown transition hover:border-brown/30 disabled:opacity-40 sm:flex-1"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleContribute}
                  disabled={!contributionAmount || loading}
                  className="rounded-full bg-burgundy px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-40 sm:flex-1"
                >
                  {loading
                    ? "Processing..."
                    : contributionAmount
                      ? `Give ${formatNaira(contributionAmount)} ❤️`
                      : "Enter Amount"}
                </button>
              </div>
            )}

            <p className="mt-5 text-center text-[9px] uppercase tracking-[0.15em] text-brown/25">
              Secure payment powered by Paystack
            </p>
          </div>
        </div>
      )}
    </>
  );
}
