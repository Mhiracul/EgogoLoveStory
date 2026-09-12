import { useState } from "react";
import { X, CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const ASOEBI_PRICE = 50000;

const initialForm = {
  customerName: "",
  phone: "",
  email: "",
  address: "",
  packageName: "Coral Asoebi",
  quantity: 1,
  size: "",
  notes: "",
};

const formatMoney = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

export default function Asoebi() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const totalAmount = ASOEBI_PRICE * Number(form.quantity || 1);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const openModal = () => {
    setShowModal(true);
    setSuccess(false);
    setError("");
  };

  const closeModal = () => {
    if (loading) return;

    setShowModal(false);
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email) {
      setError(
        "Please enter your email address so we can process your payment.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create the Asoebi order
      const orderResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/asoebi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: form.customerName,
            phone: form.phone,
            email: form.email,
            address: form.address,
            packageName: form.packageName,
            quantity: Number(form.quantity),
            size: form.size,
            notes: form.notes,
          }),
        },
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Unable to create your order.");
      }

      const orderId = orderData.data._id;

      // 2. Initialize Paystack payment
      const paymentResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/asoebi/initialize-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
          }),
        },
      );

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.message || "Unable to initialize payment.");
      }

      // 3. Load Paystack
      const { default: Paystack } = await import("@paystack/inline-js");

      const paystack = new Paystack();

      setLoading(false);

      // 4. Open Paystack checkout
      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: totalAmount * 100,
        currency: "NGN",
        reference: paymentData.data.reference,

        onSuccess: async (transaction) => {
          try {
            setLoading(true);

            // 5. Verify payment on our backend
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/asoebi/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  reference: transaction.reference,
                  orderId,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed.",
              );
            }

            // 6. Only show success AFTER backend verification
            setSuccess(true);
            setForm(initialForm);
          } catch (error) {
            console.error(error);
            setError(
              error.message ||
                "Payment was received but could not be verified. Please contact us.",
            );
          } finally {
            setLoading(false);
          }
        },

        onCancel: () => {
          setError(
            "Payment was cancelled. Your order has been saved, but it has not been marked as paid.",
          );
          setLoading(false);
        },

        onError: (error) => {
          console.error("Paystack error:", error);

          setError("We couldn't complete the payment. Please try again.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error(error);

      setError(error.message || "Something went wrong. Please try again.");

      setLoading(false);
    }
  };

  return (
    <>
      <section id="asoebi" className="bg-cream px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Asoebi"
            title={
              <>
                Celebrate with us in
                <span className="block italic text-burgundy">Coral.</span>
              </>
            }
          />

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Visual */}
            <div className="aspect-4/3 overflow-hidden bg-brown/5">
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-coral/20">
                  <span className="font-display text-5xl text-coral">A</span>
                </div>

                <p className="mt-5 text-xs uppercase tracking-[0.3em] text-brown/40">
                  Coral Asoebi
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="lg:pl-8">
              <p className="text-xs uppercase tracking-[0.3em] text-coral">
                Our Asoebi
              </p>

              <h3 className="mt-4 font-display text-4xl text-brown sm:text-5xl">
                Wear a little piece of our day.
              </h3>

              <p className="mt-6 max-w-lg leading-7 text-brown/60">
                We'd love for you to celebrate with us in our chosen Coral
                Asoebi. Order yours through the website and make your payment
                securely online.
              </p>

              <div className="mt-8 rounded-2xl border border-brown/10 bg-white/60 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-brown/40">
                      Asoebi Package
                    </p>

                    <p className="mt-2 font-display text-3xl text-brown">
                      {formatMoney(ASOEBI_PRICE)}
                    </p>

                    <p className="mt-1 text-xs text-brown/40">per package</p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/10">
                    <ShoppingBag size={21} className="text-coral" />
                  </div>
                </div>

                <div className="mt-6 border-t border-brown/10 pt-5">
                  <p className="text-sm font-medium text-brown">
                    Package includes
                  </p>

                  <ul className="mt-3 space-y-2 text-sm text-brown/60">
                    <li>• Coral Asoebi fabric</li>
                    <li>• Matching accessories</li>
                    <li>• Wedding packaging</li>
                    <li>• Delivery / collection</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="rounded-full bg-brown px-7 py-3.5 text-sm font-medium text-white transition hover:bg-brown/90"
                >
                  Get Asoebi
                </button>

                <button
                  type="button"
                  onClick={openModal}
                  className="rounded-full border border-brown/20 px-7 py-3.5 text-sm font-medium text-brown transition hover:bg-white"
                >
                  View Details
                </button>
              </div>

              <p className="mt-5 text-xs text-brown/40">
                Secure payment is processed through Paystack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brown/50 px-4 py-6 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-ivory shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brown/10 bg-ivory px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-coral">
                  Coral Asoebi
                </p>

                <h3 className="mt-1 font-display text-3xl text-brown">
                  Get Your Asoebi
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brown/5 text-brown/60 transition hover:bg-brown/10 hover:text-brown disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {success ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral/10">
                  <CheckCircle2 size={32} className="text-coral" />
                </div>

                <h3 className="mt-6 font-display text-3xl text-brown">
                  Order Confirmed! 🎉
                </h3>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-brown/60">
                  Thank you for ordering our Coral Asoebi. Your payment has been
                  successfully received and your order is now confirmed.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-8 rounded-full bg-brown px-7 py-3 text-sm font-medium text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-brown/60">
                    Full Name *
                  </label>

                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-brown/60">
                    Phone Number *
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="080..."
                    className="w-full rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-brown/60">
                    Email Address *
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                  />
                </div>

                {/* Quantity + Size */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-brown/60">
                      Quantity *
                    </label>

                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-brown/60">
                      Size
                    </label>

                    <select
                      name="size"
                      value={form.size}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                    >
                      <option value="">Select size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                </div>

                {/* Total */}
                <div className="rounded-xl border border-coral/20 bg-coral/5 px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-brown/50">
                        Total Amount
                      </p>

                      <p className="mt-1 font-display text-3xl text-brown">
                        {formatMoney(totalAmount)}
                      </p>
                    </div>

                    <p className="text-xs text-brown/40">
                      {form.quantity}{" "}
                      {Number(form.quantity) === 1 ? "package" : "packages"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-brown/60">
                    Delivery / Collection Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter your delivery address or collection details"
                    className="w-full resize-none rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-brown/60">
                    Additional Notes
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Anything else we should know?"
                    className="w-full resize-none rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brown px-5 py-3.5 text-sm font-medium text-white transition hover:bg-brown/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Preparing Payment...
                    </>
                  ) : (
                    `Pay ${formatMoney(totalAmount)}`
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-brown/40">
                  You will be redirected to Paystack's secure checkout to
                  complete your payment.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
