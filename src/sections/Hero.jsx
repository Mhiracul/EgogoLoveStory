import { motion } from "framer-motion";
import Prewedding from "../assets/Prewedding.png";
import { FadeUp, FadeLeft, FadeRight } from "../components/Motion";
export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-45 top-[15%] h-105 w-105 rounded-full bg-champagne/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-45 -right-37.5 h-125 w-125 rounded-full bg-burgundy/5 blur-3xl" />

      <div className="pointer-events-none absolute right-[12%] top-[20%] hidden font-display text-[220px] leading-none text-champagne/5 lg:block">
        &
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-24">
        {/* LEFT */}
        <div className="relative z-10 text-center lg:text-left">
          {/* Save the Date */}
          <FadeUp delay={0.1}>
            <div className="mb-7 flex items-center justify-center gap-4 lg:justify-start">
              <span className="h-px w-10 bg-champagne" />

              <p className="text-[10px] uppercase tracking-[0.4em] text-champagne">
                Save the Date
              </p>

              <span className="h-px w-10 bg-champagne lg:hidden" />
            </div>
          </FadeUp>

          {/* Names */}
          <FadeLeft delay={0.2}>
            <h1 className="font-display text-[5.5rem] font-medium leading-[0.78] tracking-[-0.04em] sm:text-[7rem] lg:text-[9.5rem]">
              Miracle
              <span className="block pl-10 text-champagne lg:pl-16">&</span>
              <span className="block">Steve</span>
            </h1>
          </FadeLeft>

          {/* Tagline */}
          <FadeUp delay={0.45}>
            <div className="mt-8">
              <p className="font-display text-2xl italic text-brown/65 sm:text-3xl">
                Our forever begins here.
              </p>

              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-burgundy">
                #TheEgogoLoveStory
              </p>
            </div>
          </FadeUp>

          {/* Wedding date */}
          <FadeUp delay={0.6}>
            <div className="mx-auto mt-9 flex w-fit items-center gap-5 border-y border-brown/10 py-4 lg:mx-0">
              <div className="text-center">
                <p className="font-display text-2xl">April</p>

                <p className="text-[9px] uppercase tracking-[0.25em] text-brown/45">
                  2027
                </p>
              </div>

              <span className="h-9 w-px bg-champagne/40" />

              <div className="text-center">
                <p className="font-display text-2xl">Lagos</p>

                <p className="text-[9px] uppercase tracking-[0.25em] text-brown/45">
                  Nigeria
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Actions */}
          <FadeUp delay={0.75}>
            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a
                href="#rsvp"
                className="rounded-full bg-brown px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-burgundy"
              >
                RSVP
              </a>

              <a
                href="#wedding"
                className="rounded-full border border-brown/20 px-8 py-4 text-xs uppercase tracking-[0.2em] transition hover:border-champagne hover:text-burgundy"
              >
                Explore Wedding
              </a>
            </div>
          </FadeUp>
        </div>

        {/* RIGHT IMAGE AREA */}
        <FadeRight delay={0.25}>
          <div className="relative mx-auto w-full max-w-142.5">
            {/* Gold border */}
            <motion.div
              className="absolute -right-3 -top-3 h-full w-full border border-champagne/30"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.4,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* Image */}
            <div className="relative aspect-4/5 overflow-hidden bg-brown/10">
              <motion.img
                src={Prewedding}
                alt="Miracle and Steve — pre-wedding portrait"
                className="absolute inset-0 h-full w-full object-cover object-center"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />

              {/* Subtle luxury overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-brown/15 via-transparent to-transparent" />
            </div>

            {/* Floating note */}
            <FadeUp delay={0.8}>
              <div className="absolute -bottom-7 -left-5 hidden max-w-57.5 border border-champagne/30 bg-ivory px-7 py-5 shadow-xl sm:block">
                <p className="font-display text-xl italic leading-6">
                  "Two hearts,
                  <br />
                  one beautiful journey."
                </p>
              </div>
            </FadeUp>

            {/* Number */}
            <FadeUp delay={0.95}>
              <div className="absolute -right-6 bottom-8 hidden sm:block">
                <p className="font-display text-6xl text-champagne/30">01</p>
              </div>
            </FadeUp>
          </div>
        </FadeRight>
      </div>

      {/* Scroll indicator */}
      <FadeUp delay={1.1}>
        <a
          href="#our-story"
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-brown/35 sm:flex"
        >
          <span>Scroll to explore</span>

          <motion.span
            className="h-10 w-px bg-champagne/50"
            animate={{
              scaleY: [0.4, 1, 0.4],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </a>
      </FadeUp>
    </section>
  );
}
