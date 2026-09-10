import { Mail, MessageCircle } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="bg-cream/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="We're here for you"
          title="Get in Touch"
          description="Have a question about the wedding, Asoebi, gifts or anything else? We'd be happy to hear from you."
        />

        <div className="mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-2">
          {/* WhatsApp */}
          <a
            href="#"
            className="group border border-brown/10 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-coral/50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral transition group-hover:bg-coral group-hover:text-white">
              <MessageCircle size={23} strokeWidth={1.5} />
            </div>

            <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-champagne">
              WhatsApp
            </p>

            <h3 className="mt-2 font-display text-3xl">Chat With Us</h3>

            <p className="mt-3 text-sm leading-6 text-brown/50">
              Send us a message on WhatsApp if you have any questions about the
              celebration.
            </p>

            <span className="mt-7 inline-block text-[10px] uppercase tracking-[0.2em] text-coral">
              Start a conversation →
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:"
            className="group border border-brown/10 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-champagne/50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne/10 text-champagne transition group-hover:bg-champagne group-hover:text-white">
              <Mail size={23} strokeWidth={1.5} />
            </div>

            <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-champagne">
              Email
            </p>

            <h3 className="mt-2 font-display text-3xl">Send Us an Email</h3>

            <p className="mt-3 text-sm leading-6 text-brown/50">
              For wedding enquiries, Asoebi questions, gift information or other
              requests.
            </p>

            <span className="mt-7 inline-block text-[10px] uppercase tracking-[0.2em] text-burgundy">
              Send an email →
            </span>
          </a>
        </div>

        <div className="mx-auto mt-14 max-w-2xl text-center">
          <div className="mx-auto h-px w-12 bg-champagne" />

          <p className="mt-7 font-display text-2xl italic text-brown/60 sm:text-3xl">
            We can't wait to celebrate this beautiful chapter with you.
          </p>

          <p className="mt-5 text-xs uppercase tracking-[0.25em] text-burgundy">
            Miracle & Steve
          </p>
        </div>
      </div>
    </section>
  );
}
