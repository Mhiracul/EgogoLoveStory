import { useState } from "react";
import { X } from "lucide-react";

const links = [
  { label: "Our Story", href: "#our-story" },
  { label: "Wedding", href: "#wedding" },
  { label: "Dress Code", href: "#dress-code" },
  { label: "Asoebi", href: "#asoebi" },
  { label: "Gifts", href: "#gifts" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-brown/10 bg-ivory/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a href="#home" onClick={closeMenu} className="group flex items-center">
          <span className="font-display text-3xl font-semibold tracking-wide text-brown">
            M
          </span>

          <span className="mx-1 font-display text-xl text-champagne">&</span>

          <span className="font-display text-3xl font-semibold tracking-wide text-brown">
            S
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.12em] text-brown/60 transition hover:text-burgundy"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#rsvp"
            className="ml-2 rounded-full bg-burgundy px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-brown"
          >
            RSVP
          </a>
        </nav>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <X size={23} strokeWidth={1.5} />
          ) : (
            <div className="space-y-1.5">
              <span className="block h-px w-7 bg-brown" />
              <span className="block h-px w-5 bg-brown" />
              <span className="block h-px w-7 bg-brown" />
            </div>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-brown/10 bg-ivory px-6 py-8 lg:hidden">
          <nav className="flex flex-col">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`font-display text-2xl text-brown transition hover:text-burgundy ${
                  index !== links.length - 1
                    ? "border-b border-brown/10 py-4"
                    : "py-4"
                }`}
              >
                {link.label}
              </a>
            ))}

            <a
              href="#rsvp"
              onClick={closeMenu}
              className="mt-5 rounded-full bg-burgundy px-7 py-4 text-center text-xs uppercase tracking-[0.2em] text-white transition hover:bg-brown"
            >
              RSVP
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
