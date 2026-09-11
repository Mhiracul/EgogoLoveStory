import { useEffect, useState } from "react";

export default function Countdown() {
  const [time, setTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    // TEMPORARY DATE
    // Replace this when the actual wedding date is confirmed.
    const weddingDate = new Date("2027-04-01T10:00:00");

    const update = () => {
      const difference = weddingDate - new Date();

      if (difference <= 0) return;

      setTime({
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0",
        ),

        hours: String(
          Math.floor((difference / (1000 * 60 * 60)) % 24),
        ).padStart(2, "0"),

        minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(
          2,
          "0",
        ),

        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      });
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  const items = [
    ["days", time.days],
    ["hours", time.hours],
    ["minutes", time.minutes],
    ["seconds", time.seconds],
  ];

  return (
    <section className="border-y border-brown/10 bg-white/40 py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne">
          Counting down to forever
        </p>

        <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-8">
          {items.map(([label, value]) => (
            <div key={label}>
              <p className="font-display text-4xl sm:text-6xl">{value}</p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-brown/50 sm:text-xs">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
