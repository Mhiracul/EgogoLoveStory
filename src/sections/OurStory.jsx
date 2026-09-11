import SectionHeading from "../components/SectionHeading";
import { FadeUp, FadeRight, ScaleIn } from "../components/Motion";

export default function OurStory() {
  return (
    <section id="our-story" className="mx-auto max-w-7xl px-6 py-28">
      {/* Section Heading */}
      <FadeUp>
        <SectionHeading
          eyebrow="Our Story"
          title={
            <>
              And then,
              <span className="block italic text-burgundy">there was us.</span>
            </>
          }
        />
      </FadeUp>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        {/* Story Image */}
        <ScaleIn delay={0.15}>
          <div className="aspect-4/3 overflow-hidden bg-brown/5">
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-5xl text-brown/20">
                Our Story
              </span>
            </div>
          </div>
        </ScaleIn>

        {/* Story Chapters */}
        <div className="flex flex-col justify-center">
          <div className="space-y-8 border-l border-champagne/40 pl-8">
            {/* Chapter 01 */}
            <FadeRight delay={0.15}>
              <div>
                <p className="text-xs uppercase tracking-widest text-champagne">
                  Chapter 01
                </p>

                <h3 className="mt-2 font-display text-3xl">The Beginning</h3>

                <p className="mt-3 leading-7 text-brown/60">
                  Every beautiful story has a beginning. Ours began with two
                  people, one conversation and a journey neither of us knew
                  would lead here.
                </p>
              </div>
            </FadeRight>

            {/* Chapter 02 */}
            <FadeRight delay={0.3}>
              <div>
                <p className="text-xs uppercase tracking-widest text-champagne">
                  Chapter 02
                </p>

                <h3 className="mt-2 font-display text-3xl">The Journey</h3>

                <p className="mt-3 leading-7 text-brown/60">
                  Through every season, every laugh, every prayer and every
                  challenge, our story continued to unfold.
                </p>
              </div>
            </FadeRight>

            {/* Chapter 03 */}
            <FadeRight delay={0.45}>
              <div>
                <p className="text-xs uppercase tracking-widest text-champagne">
                  Chapter 03
                </p>

                <h3 className="mt-2 font-display text-3xl">Forever</h3>

                <p className="mt-3 leading-7 text-brown/60">
                  And now, we're stepping into our favourite chapter: forever
                  together.
                </p>
              </div>
            </FadeRight>
          </div>
        </div>
      </div>
    </section>
  );
}
