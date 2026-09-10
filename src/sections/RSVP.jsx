import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  attendance: "",
  guests: "",
  event: "",
  message: "",
};

export default function RSVP() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.name ||
      !form.phone ||
      !form.attendance ||
      !form.guests ||
      !form.event
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          guests: Number(form.guests),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong. Please try again.",
        );
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (error) {
      setError(
        error.message || "Unable to submit your RSVP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="bg-burgundy py-28 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          light
          eyebrow="We would love to have you"
          title="Will you celebrate with us?"
          description="Your presence would mean so much to us. Please let us know if you'll be joining us for our special day."
        />

        <div className="mx-auto mt-16 max-w-3xl">
          {submitted ? (
            <div className="border border-white/10 bg-white/6 px-6 py-16 text-center sm:px-12">
              <CheckCircle2
                size={58}
                strokeWidth={1}
                className="mx-auto text-champagne"
              />

              <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-champagne">
                RSVP Received
              </p>

              <h3 className="mt-4 font-display text-4xl sm:text-5xl">
                Thank You ❤️
              </h3>

              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/55">
                We've received your RSVP and we're so happy to know whether
                you'll be celebrating this beautiful day with us.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 rounded-full border border-white/20 px-7 py-3 text-xs uppercase tracking-[0.2em] transition hover:border-champagne hover:text-champagne"
              >
                Submit Another RSVP
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45"
                >
                  Full Name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-white/15 bg-white/6 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-champagne"
                />
              </div>

              {/* Phone + Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45"
                  >
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0800 000 0000"
                    className="w-full border border-white/15 bg-white/6 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-champagne"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border border-white/15 bg-white/6 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-champagne"
                  />
                </div>
              </div>

              {/* Attendance */}
              <div>
                <label
                  htmlFor="attendance"
                  className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45"
                >
                  Will you be attending? *
                </label>

                <select
                  id="attendance"
                  name="attendance"
                  value={form.attendance}
                  onChange={handleChange}
                  className="w-full border border-white/15 bg-burgundy px-5 py-4 text-sm text-white/80 outline-none transition focus:border-champagne"
                >
                  <option value="" disabled>
                    Please select
                  </option>

                  <option value="yes">Yes, I'll be there ❤️</option>

                  <option value="no">Sadly, I can't make it</option>
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label
                  htmlFor="guests"
                  className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45"
                >
                  Number of Guests *
                </label>

                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={form.guests}
                  onChange={handleChange}
                  placeholder="How many people are attending?"
                  className="w-full border border-white/15 bg-white/6 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-champagne"
                />
              </div>

              {/* Event */}
              <div>
                <label
                  htmlFor="event"
                  className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45"
                >
                  Which event(s) will you attend? *
                </label>

                <select
                  id="event"
                  name="event"
                  value={form.event}
                  onChange={handleChange}
                  className="w-full border border-white/15 bg-burgundy px-5 py-4 text-sm text-white/80 outline-none transition focus:border-champagne"
                >
                  <option value="" disabled>
                    Select an event
                  </option>

                  <option value="traditional">Traditional Marriage</option>

                  <option value="church">Church Wedding</option>

                  <option value="reception">Wedding Reception</option>

                  <option value="all">All Events</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/45"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Leave a little message for Miracle & Steve (optional)"
                  className="w-full resize-none border border-white/15 bg-white/6 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-champagne"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="border border-red-300/20 bg-red-400/10 px-5 py-4 text-center text-xs text-red-100">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-3 bg-white px-6 py-5 text-xs uppercase tracking-[0.25em] text-burgundy transition hover:bg-champagne hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Sending RSVP...
                  </>
                ) : (
                  "Confirm My RSVP ❤️"
                )}
              </button>
            </form>
          )}

          {!submitted && (
            <p className="mt-6 text-center text-[10px] leading-5 text-white/30">
              Your RSVP information will only be used to help us plan our
              celebration.
            </p>
          )}
        </div>

        <div className="mt-20 border-t border-white/10 pt-12 text-center">
          <p className="font-display text-3xl italic text-white/65">
            We can't wait to celebrate with you.
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-champagne">
            Miracle & Steve
          </p>
        </div>
      </div>
    </section>
  );
}
