import { CalendarDays, Gift, Heart, House } from "lucide-react";

const items = [
  {
    label: "Home",
    href: "#home",
    icon: House,
  },
  {
    label: "Wedding",
    href: "#wedding",
    icon: CalendarDays,
  },
  {
    label: "Gifts",
    href: "#gifts",
    icon: Gift,
  },
  {
    label: "RSVP",
    href: "#rsvp",
    icon: Heart,
  },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brown/10 bg-ivory/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(58,41,34,0.08)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map(({ label, href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="flex min-w-16 flex-col items-center gap-1 py-2 text-brown/45 transition hover:text-burgundy active:text-burgundy"
          >
            <Icon size={18} strokeWidth={1.5} />

            <span className="text-[9px] uppercase tracking-[0.12em]">
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
