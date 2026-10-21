import { useEffect, useState } from "react";

import SectionHeading from "../components/SectionHeading";

import GiftCard from "../components/GiftCard";

const gifts = [
  {
    id: "pressure-cooker",

    title: "Silver Crest 10-in-1 Electric Pressure Cooker",

    category: "Kitchen & Dining",

    description:
      "A versatile electric pressure cooker designed to make everyday cooking faster and easier.",

    amount: 143180,

    image: "/images/registry/pressure-cooker.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "microwave",

    title: "Digital Countertop Microwave Oven",

    category: "Kitchen & Dining",

    description:
      "A convenient countertop microwave for quick reheating, defrosting, and everyday meal preparation.",

    amount: 75535,

    image: "/images/registry/microwave.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "refrigerator",

    title: "Double Door Home Refrigerator",

    category: "Kitchen & Dining",

    description:
      "A spacious double-door refrigerator to keep our groceries fresh and our kitchen well stocked.",

    amount: 1200000,

    image: "/images/registry/refrigerator.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "television",

    title: "Hisense 4K Smart UHD Television",

    category: "Living & Comfort",

    description:
      "A 4K smart television for enjoying movies, entertainment, and relaxing evenings at home.",

    amount: 730000,

    image: "/images/registry/television.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "air-fryer",

    title: "Digital XL Rapid Air Fryer",

    category: "Kitchen & Dining",

    description:
      "An extra-large digital air fryer for convenient cooking with less oil.",

    amount: 64973,

    image: "/images/registry/air-fryer.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "juice-extractor",

    title: "Electric Cold-Press Juice Extractor",

    category: "Kitchen & Dining",

    description:
      "A cold-press juice extractor for preparing fresh fruit and vegetable drinks at home.",

    amount: 33516,

    image: "/images/registry/juice-extractor.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "bedsheet",

    title: "Luxury Egyptian Cotton Bed Sheet Set",

    category: "Home & Bedding",

    description:
      "A soft, luxurious cotton bed sheet set for a comfortable and inviting bedroom.",

    amount: 14950,

    image: "/images/registry/bedsheet.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "washing-machine",

    title: "Automatic Front-Load Washing Machine",

    category: "Home & Comfort",

    description:
      "An automatic washing machine to make laundry days easier in our new home.",

    amount: 481525,

    image: "/images/registry/washing-machine.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "chest-freezer",

    title: "Deep Chest Freezer",

    category: "Kitchen & Dining",

    description:
      "Extra freezer space for preserving food and keeping household essentials stocked.",

    amount: 555320,

    image: "/images/registry/chest-freezer.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "air-conditioner",

    title: "Hisense 1.5HP GenCool Dual Inverter Air Conditioner",

    category: "Living & Comfort",

    description:
      "An energy-saving dual inverter air conditioner for comfortable indoor living.",

    amount: 470600,

    image: "/images/registry/air-conditioner.jpeg",

    quantityNeeded: 2,
  },

  {
    id: "air-fryer-oven",

    title:
      "Sedar 24L All Stainless Steel French Door Multifunction Air Fryer Oven + 1 Enamel Bake Tray",

    category: "Kitchen & Dining",

    description:
      "A multifunction stainless steel oven for air frying, baking, and preparing a variety of meals.",

    amount: 320000,

    image: "/images/registry/air-fryer-oven.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "glass-bowls",

    title: "12 Piece Set of High Borosilicate Glass Bowls",

    category: "Kitchen & Dining",

    description:
      "A versatile set of glass bowls for food preparation, serving, and storage.",

    amount: 60000,

    image: "/images/registry/glass-bowls.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "adjustable-desk",

    title: "Adjustable Desk",

    category: "Living & Comfort",

    description:
      "An adjustable desk for comfortable working, studying, and managing projects from home.",

    amount: 400000,

    image: "/images/registry/adjustable-desk.jpeg",

    quantityNeeded: 2,
  },

  {
    id: "solar-system",

    title: "Complete Home Solar Power System",

    category: "Home & Comfort",

    description:
      "A home solar power solution to support reliable electricity and everyday comfort.",

    amount: 5100000,

    image: "/images/registry/solar-system.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "starlink",

    title: "Starlink High-Speed Internet Setup",

    category: "Home & Comfort",

    description:
      "A high-speed internet setup to keep our home connected for work and entertainment.",

    amount: 650000,

    image: "/images/registry/starlink.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "mug-set",

    title: "Ceramic Mug Set",

    category: "Kitchen & Dining",

    description:
      "A matching set of ceramic mugs for our morning coffee, tea, and cozy evenings.",

    amount: 12500,

    image: "/images/registry/mug-set.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "toaster",

    title: "2-Slice Electric Toaster",

    category: "Kitchen & Dining",

    description:
      "A compact electric toaster for quick breakfasts and everyday convenience.",

    amount: 14000,

    image: "/images/registry/toaster.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "food-processor",

    title: "16-in-1 Food Processor",

    category: "Kitchen & Dining",

    description:
      "A versatile food processor for chopping, slicing, blending, and other kitchen tasks.",

    amount: 155000,

    image: "/images/registry/food-processor.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "blanket",

    title: "Cozy Fleece Blanket",

    category: "Home & Bedding",

    description:
      "A soft fleece blanket for warmth, comfort, and relaxing together at home.",

    amount: 25000,

    image: "/images/registry/blanket.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "throw-pillows",

    title: "Decorative Throw Pillows",

    category: "Home & Bedding",

    description:
      "Decorative pillows to add warmth, texture, and personality to our living space.",

    amount: 20000,

    image: "/images/registry/throw-pillows.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "microphone",

    title: "Hollyland Lark M2 Microphone Combo",

    category: "Living & Comfort",

    description:
      "A compact wireless microphone combo for recording clear audio and creating content.",

    amount: 160000,

    image: "/images/registry/microphone.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "honeymoon-fund",

    title: "Honeymoon Travel & Experience Fund",

    category: "Milestone Gift",

    description:
      "Help us create unforgettable memories as we begin our marriage together.",

    amount: 5000000,

    image: "/images/registry/honeymoon.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "cookware",

    title: "High-End Non-Stick Cookware Set (12-Piece)",

    category: "Kitchen & Dining",

    description:
      "A coordinated cookware set for preparing everyday meals and hosting loved ones.",

    amount: 115500,

    image: "/images/registry/cookware.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "power-station",

    title: "Portable Solar Power Station / Powerbox",

    category: "Home & Comfort",

    description:
      "A portable power station to support essential devices during power interruptions.",

    amount: 345000,

    image: "/images/registry/power-station.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "standing-fan",

    title: "18-Inch Rechargeable Standing Fan",

    category: "Living & Comfort",

    description:
      "A rechargeable standing fan to keep our home comfortable when electricity is unavailable.",

    amount: 88500,

    image: "/images/registry/standing-fan.jpeg",

    quantityNeeded: 2,
  },

  {
    id: "gas-cooker",

    title: "Qasa 4 Burners Table Top Glass Gas Cooker",

    category: "Kitchen & Dining",

    description:
      "A four-burner glass-top gas cooker for preparing multiple dishes with ease.",

    amount: 105000,

    image: "/images/registry/gas-cooker.jpeg",

    quantityNeeded: 1,
  },

  {
    id: "ergonomic-chair",

    title: "Generic Moq Ergonomic Swivel Mesh High Back Chair With Headrest",

    category: "Living & Comfort",

    description:
      "An ergonomic high-back mesh chair with headrest for a more comfortable workspace.",

    amount: 116800,

    image: "/images/registry/ergonomic-chair.jpeg",

    quantityNeeded: 2,
  },

  {
    id: "our-home",

    title: "Our Home",

    category: "Milestone Gift",

    description:
      "Help us create a beautiful home together with a contribution of your choice.",

    amount: null,

    image: "/images/registry/cash-gift.jpeg",

    quantityNeeded: 0,
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

  const [registryStatus, setRegistryStatus] = useState({});

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

    if (
      !contributionAmount ||
      (selectedGift?.amount == null && contributionAmount < 50000)
    ) {
      setError("Our Home contributions must be at least ₦50,000.");

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
            registryItemId: selectedGift.id,
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

            // Refresh paid registry items after payment verification.
            await refreshRegistryStatus();

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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gifts/registry-status`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load registry status.");
        }

        return response.json();
      })

      .then((result) => {
        if (result.success) {
          setRegistryStatus(result.data);
        }
      })

      .catch((error) => {
        console.error("Registry status error:", error);
      });
  }, []);

  const refreshRegistryStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gifts/registry-status`,
      );

      if (!response.ok) {
        throw new Error("Unable to refresh registry status.");
      }

      const result = await response.json();

      if (result.success) {
        setRegistryStatus(result.data);
      }
    } catch (error) {
      console.error("Registry status refresh error:", error);
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
            {gifts.map((gift) => {
              const status = registryStatus[gift.id] || {
                quantityGifted: 0,

                donors: [],
              };

              const donors = status.donors || [];

              const quantityGifted = status.quantityGifted || 0;

              const gifted =
                gift.quantityNeeded > 0 &&
                quantityGifted >= gift.quantityNeeded;

              return (
                <GiftCard
                  key={gift.id}
                  {...gift}
                  gifted={gifted}
                  donors={donors}
                  quantityGifted={quantityGifted}
                  onContribute={() => openContribution(gift)}
                />
              );
            })}
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
