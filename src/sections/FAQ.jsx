import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const questions = [
  {
    question: "What should I wear?",
    answer:
      "Please dress within our wedding palette of ivory, nude, champagne, blush and soft coral. For the traditional marriage, elegant traditional attire is encouraged, while the church wedding calls for formal and elegant dressing.",
  },
  {
    question: "Where can I get the Asoebi?",
    answer:
      "Our official Asoebi is coral. You can view the package and place your order through the Asoebi section of this website.",
  },
  {
    question: "Can I send a gift if I cannot attend?",
    answer:
      "Absolutely. Your love and support mean so much to us. You can send a cash gift through the Give a Gift section even if you are unable to attend physically.",
  },
  {
    question: "Can I bring a plus-one?",
    answer:
      "Please follow the guest details on your invitation and indicate the number of guests attending when completing your RSVP. If you are unsure, please contact us before bringing an additional guest.",
  },
  {
    question: "Where will the wedding take place?",
    answer:
      "The wedding will take place in Lagos, Nigeria. Complete venue addresses and map directions will be added to the Wedding Events section once everything is finalized.",
  },
  {
    question: "Do I need to RSVP?",
    answer:
      "Yes, please. Your RSVP helps us prepare properly for everyone joining us. Kindly complete the RSVP form before the deadline stated on your invitation.",
  },
  {
    question: "Can I share the wedding website?",
    answer:
      "Yes! We would love for you to share the website with invited guests who may need the wedding details, RSVP information or gift options.",
  },
  {
    question: "Who can I contact if I have more questions?",
    answer:
      "If you have a question that isn't answered here, please use the contact information provided at the bottom of the website. We will be happy to help.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState(null);

  const toggleQuestion = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Need to know?"
          title="Frequently Asked Questions"
          description="A few helpful answers before you join us in celebrating this beautiful chapter."
        />

        <div className="mt-16 border-y border-brown/10">
          {questions.map((item, index) => {
            const isOpen = active === index;

            return (
              <div
                key={item.question}
                className="border-b border-brown/10 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl text-brown sm:text-2xl">
                    {item.question}
                  </span>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brown/10 transition duration-300 ${
                      isOpen
                        ? "rotate-180 border-burgundy bg-burgundy text-white"
                        : "text-burgundy"
                    }`}
                  >
                    <ChevronDown size={16} strokeWidth={1.5} />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl pb-7 pr-12 text-sm leading-7 text-brown/55">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-14 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-champagne">
            Still have a question?
          </p>

          <p className="mt-4 font-display text-2xl italic text-brown/60 sm:text-3xl">
            We would be happy to help.
          </p>

          <a
            href="#contact"
            className="mt-6 inline-block rounded-full border border-brown/15 px-7 py-3 text-xs uppercase tracking-[0.2em] text-brown transition hover:border-burgundy hover:bg-burgundy hover:text-white"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
