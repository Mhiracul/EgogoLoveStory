import { useEffect, useState } from "react";
import { CheckCircle2, Heart, Loader2, Send, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const MAX_MESSAGE_LENGTH = 500;

export default function WeddingWishes() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ------------------------------------
  // FETCH APPROVED WISHES
  // ------------------------------------

  const fetchWishes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/wishes`);

      if (!response.ok) {
        throw new Error("Unable to load wishes.");
      }

      const data = await response.json();

      setWishes(data.data || []);
    } catch (error) {
      console.error("Wedding wishes error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  // ------------------------------------
  // OPEN MODAL
  // ------------------------------------

  const openModal = () => {
    setGuestName("");
    setMessage("");
    setError("");
    setSuccess(false);
    setShowModal(true);
  };

  // ------------------------------------
  // CLOSE MODAL
  // ------------------------------------

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
  };

  // ------------------------------------
  // SUBMIT WISH
  // ------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!guestName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!message.trim()) {
      setError("Please write a message for us.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/wishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: guestName.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit your wish.");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Wedding wish submission error:", error);

      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="wishes"
      className="relative overflow-hidden bg-cream py-24 md:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-champagne/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-burgundy">
            A Little Love From You
          </p>

          <h2 className="font-display text-4xl leading-tight text-brown md:text-5xl">
            Leave a Wish for
            <span className="block italic">Miracle & Steve</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-brown/60 md:text-base">
            Your prayers, blessings and beautiful words mean so much to us.
            Leave us a little note that we can cherish long after our wedding
            day.
          </p>

          <button
            type="button"
            onClick={openModal}
            className="mt-8 inline-flex items-center gap-3 bg-brown px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-ivory transition hover:bg-burgundy"
          >
            <Heart size={15} strokeWidth={1.7} />
            Leave a Wish
          </button>
        </div>

        {/* Wishes */}
        <div className="mt-16">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-champagne" />
            </div>
          ) : wishes.length === 0 ? (
            <div className="mx-auto max-w-xl border border-brown/10 bg-white/50 px-8 py-12 text-center">
              <Heart
                size={28}
                strokeWidth={1.2}
                className="mx-auto text-champagne"
              />

              <p className="mt-5 font-display text-2xl text-brown">
                Be the first to leave a wish
              </p>

              <p className="mt-2 text-sm text-brown/50">
                Your message could be the first beautiful memory in our
                guestbook.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {wishes.map((wish) => (
                <article
                  key={wish._id}
                  className="group relative border border-brown/10 bg-white/60 p-7 transition hover:-translate-y-1 hover:border-champagne/50 hover:shadow-lg hover:shadow-brown/5"
                >
                  {/* Quote mark */}
                  <div className="font-display text-5xl leading-none text-champagne/50">
                    “
                  </div>

                  <p className="mt-2 text-sm leading-7 text-brown/70">
                    {wish.message}
                  </p>

                  <div className="mt-7 flex items-center gap-3 border-t border-brown/10 pt-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne/15">
                      <Heart
                        size={14}
                        strokeWidth={1.5}
                        className="text-burgundy"
                      />
                    </div>

                    <div>
                      <p className="font-display text-base text-brown">
                        {wish.guestName}
                      </p>

                      <p className="text-[9px] uppercase tracking-[0.2em] text-brown/35">
                        With love
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------- */}
      {/* WISH MODAL */}
      {/* -------------------------------- */}

      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brown/60 px-5 py-8 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-ivory shadow-2xl">
            {/* Close */}
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center text-brown/50 transition hover:text-brown disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {!success ? (
              <div className="p-7 md:p-10">
                <div className="pr-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-burgundy">
                    Our Guestbook
                  </p>

                  <h3 className="mt-3 font-display text-3xl text-brown">
                    Leave us a little love
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-brown/55">
                    Share a prayer, blessing, memory or simply some love for our
                    new beginning.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-brown/55"
                    >
                      Your Name
                    </label>

                    <input
                      id="guest-name"
                      type="text"
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      placeholder="Enter your name"
                      maxLength={100}
                      disabled={submitting}
                      className="w-full border border-brown/15 bg-white px-4 py-3.5 text-sm text-brown outline-none transition placeholder:text-brown/30 focus:border-champagne disabled:opacity-60"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="wish-message"
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brown/55"
                      >
                        Your Message
                      </label>

                      <span className="text-[10px] text-brown/35">
                        {message.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>

                    <textarea
                      id="wish-message"
                      value={message}
                      onChange={(event) =>
                        setMessage(
                          event.target.value.slice(0, MAX_MESSAGE_LENGTH),
                        )
                      }
                      placeholder="Write your beautiful message..."
                      rows={6}
                      maxLength={MAX_MESSAGE_LENGTH}
                      disabled={submitting}
                      className="w-full resize-none border border-brown/15 bg-white px-4 py-3.5 text-sm leading-6 text-brown outline-none transition placeholder:text-brown/30 focus:border-champagne disabled:opacity-60"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-3 bg-brown px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-ivory transition hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} strokeWidth={1.7} />
                        Send Our Way
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] leading-5 text-brown/35">
                    Your message will be reviewed before appearing in our
                    guestbook.
                  </p>
                </form>
              </div>
            ) : (
              <div className="px-8 py-16 text-center md:px-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-champagne/15">
                  <CheckCircle2
                    size={30}
                    strokeWidth={1.4}
                    className="text-burgundy"
                  />
                </div>

                <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-burgundy">
                  Thank You
                </p>

                <h3 className="mt-3 font-display text-3xl text-brown">
                  Your love has been received
                </h3>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-brown/55">
                  Thank you for taking the time to leave Miracle & Steve such a
                  beautiful message. We truly appreciate it.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-8 border border-brown/15 px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-brown transition hover:border-brown hover:bg-brown hover:text-ivory"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
