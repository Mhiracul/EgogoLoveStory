import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";

const presetAmounts = [50000, 100000, 250000, 500000, 1000000, 2000000];
const initialForm = {
  name: "",
  email: "",
  message: "",
  displayOnGiftWall: true,
};
const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

export default function Gifts() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState(initialForm);

  const [gifts, setGifts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingGifts, setLoadingGifts] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const totalAmount = selectedAmount || Number(customAmount) || 0;

  // Fetch confirmed gifts for the Gift Wall
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/gifts`,
        );

        const data = await response.json();

        if (data.success) {
          setGifts(data.data);
        }
      } catch (error) {
        console.error("Unable to fetch gifts:", error);
      } finally {
        setLoadingGifts(false);
      }
    };

    fetchGifts();
  }, []);

  const handlePresetAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setError("");
  };

  const handleCustomAmount = (event) => {
    const value = event.target.value;

    setCustomAmount(value);
    setSelectedAmount(null);
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

  const handleGiveGift = async () => {
    setError("");
    setSuccess(false);

    if (!totalAmount || totalAmount < 50000) {
      setError("Please select or enter an amount of at least ₦50,000.");
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

      // 1. Create the pending gift
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
            amount: totalAmount,
            message: form.message.trim(),
            displayOnGiftWall: form.displayOnGiftWall,
          }),
        },
      );

      const giftData = await createResponse.json();

      if (!createResponse.ok || !giftData.success) {
        throw new Error(giftData.message || "Unable to create your gift.");
      }

      const giftId = giftData.data._id;

      // 2. Initialize Paystack payment
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
        key: import.meta.env.PAYSTACK_PUBLIC_KEY,
        email: form.email.trim(),
        amount: totalAmount * 100,
        currency: "NGN",
        reference: paymentData.data.reference,

        onSuccess: async (transaction) => {
          try {
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

            setGifts((prev) => [verifyData.data.gift, ...prev]);

            setSelectedAmount(null);
            setCustomAmount("");
            setForm(initialForm);
          } catch (error) {
            console.error("Payment verification error:", error);
            setError(
              error.message ||
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

        onError: (error) => {
          console.error("Paystack error:", error);

          setError("Something went wrong with the payment. Please try again.");

          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Gift payment error:", error);

      setError(error.message || "Something went wrong. Please try again.");

      setLoading(false);
    }
  };

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
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {" "}
            {presetAmounts.map((amount) => {
              const selected = selectedAmount === amount;

              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handlePresetAmount(amount)}
                  className={`border px-4 py-6 font-display text-2xl transition ${
                    selected
                      ? "border-burgundy bg-burgundy text-white"
                      : "border-brown/10 bg-ivory hover:border-champagne hover:text-burgundy"
                  }`}
                >
                  {formatNaira(amount)}
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
                min="50000"
                value={customAmount}
                placeholder="Enter amount"
                onChange={handleCustomAmount}
                className="w-full bg-transparent px-2 py-4 text-sm outline-none placeholder:text-brown/30"
              />
            </div>

            <p className="mt-2 text-[10px] text-brown/30">
              Minimum gift amount: ₦50,000{" "}
            </p>
          </div>

          {/* Donor details */}
          {totalAmount > 0 && (
            <div className="mt-8 border-t border-brown/10 pt-8">
              <div className="mb-6 text-center">
                <p className="font-display text-3xl text-burgundy">
                  {formatNaira(totalAmount)}
                </p>

                <p className="mt-1 text-xs text-brown/40">
                  Thank you for blessing us ❤️
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

              <div className="mt-4">
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
                  className="w-full resize-none border border-brown/10 bg-ivory px-4 py-4 text-sm outline-none transition focus:border-champagne"
                />
              </div>
              <div className="mt-5">
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
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 border border-burgundy/10 bg-burgundy/5 px-4 py-3 text-center text-xs leading-5 text-burgundy">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 border border-champagne/30 bg-champagne/10 px-5 py-6 text-center">
              <span className="font-display text-4xl text-champagne">♥</span>

              <h4 className="mt-3 font-display text-2xl text-burgundy">
                Thank You So Much!
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brown/50">
                Your gift has been received successfully. Your love and
                generosity mean so much to us.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 text-center">
            <button
              type="button"
              disabled={!totalAmount || loading}
              onClick={handleGiveGift}
              className="w-full rounded-full bg-burgundy px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-65"
            >
              {loading
                ? "Processing..."
                : totalAmount
                  ? `Give ${formatNaira(totalAmount)} ❤️`
                  : "Choose an Amount"}
            </button>

            <p className="mt-4 text-[10px] text-brown/30">
              Secure payment powered by Paystack.
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

          {loadingGifts ? (
            <div className="mx-auto mt-10 max-w-3xl border border-brown/10 bg-white/50 px-6 py-14 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-brown/30">
                Loading gifts...
              </p>
            </div>
          ) : gifts.length === 0 ? (
            <div className="mx-auto mt-10 max-w-3xl border border-dashed border-brown/15 bg-white/50 px-6 py-14 text-center">
              <span className="font-display text-5xl text-champagne/40">♥</span>

              <p className="mt-5 font-display text-2xl text-brown/60">
                Your messages will live here
              </p>

              <p className="mt-2 text-sm text-brown/35">
                Once gifts begin coming in, beautiful messages from our loved
                ones will appear here.
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {gifts.map((gift) => (
                <div
                  key={gift._id}
                  className="border border-brown/10 bg-white p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl text-burgundy">
                        {gift.donorName}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-brown/30">
                        With love
                      </p>
                    </div>

                    <p className="font-display text-xl text-champagne">
                      {formatNaira(gift.amount)}
                    </p>
                  </div>

                  {gift.message && (
                    <div className="mt-5 border-t border-brown/10 pt-5">
                      <p className="text-sm leading-7 text-brown/55">
                        “{gift.message}”
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
