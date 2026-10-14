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
        {/* Story Image */}
        {/* Story Image */}
        <ScaleIn delay={0.15}>
          <div className="relative aspect-4/3 overflow-hidden bg-brown/5">
            {/* Blurred background image */}
            <img
              src="/images/our-story.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover "
              loading="lazy"
            />

            {/* Main image with subtle blur */}
            <img
              src="/images/our-story.jpg"
              alt="Miracle and Steve's love story"
              className="absolute inset-0 h-full w-full object-cover "
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />

            {/* Burgundy overlay, like the Hero video */}
            <div className="absolute inset-0 bg-[#5B1025]/40" />

            {/* Cinematic gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/35" />

            {/* Fallback shown if the image fails to load */}
            <div className="absolute inset-0 hidden items-center justify-center">
              <span className="font-display text-5xl text-white/60">
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

                <h3 className="mt-2 font-display text-3xl">
                  A Little Reply, A Beautiful Beginning
                </h3>

                <p className="mt-3 leading-7 text-brown/60">
                  Who would have thought that TikTok would be where our story
                  began? It started with a simple message and a reply I never
                  expected to give. I usually wouldn't respond, but somehow,
                  this time was different. What seemed like an ordinary
                  interaction became the beginning of something extraordinary.
                </p>
              </div>
            </FadeRight>

            {/* Chapter 02 */}
            <FadeRight delay={0.3}>
              <div>
                <p className="text-xs uppercase tracking-widest text-champagne">
                  Chapter 02
                </p>

                <h3 className="mt-2 font-display text-3xl">
                  The Love That Brought Peace
                </h3>

                <p className="mt-3 leading-7 text-brown/60">
                  From that first conversation, something beautiful began to
                  unfold. The conversations became meaningful, the connection
                  grew deeper, and what neither of us could have fully imagined
                  at the beginning became a love worth cherishing. Steve came
                  into Miracle's life with a sense of certainty, and along the
                  way, their story became one of love, peace, and choosing each
                  other.
                </p>
              </div>
            </FadeRight>

            {/* Chapter 03 */}
            <FadeRight delay={0.45}>
              <div>
                <p className="text-xs uppercase tracking-widest text-champagne">
                  Chapter 03
                </p>

                <h3 className="mt-2 font-display text-3xl">
                  From a Message to Forever
                </h3>

                <p className="mt-3 leading-7 text-brown/60">
                  Today, that little TikTok reply has become part of a much
                  bigger story: two hearts preparing to build a life together.
                  With love in their hearts and faith in God, Miracle and Steve
                  are stepping into a new chapter, grateful for how it began and
                  excited for all that lies ahead. Their next chapter isn't just
                  another page in their story. It's forever.
                </p>
              </div>
            </FadeRight>
          </div>
        </div>
      </div>
    </section>
  );
}
