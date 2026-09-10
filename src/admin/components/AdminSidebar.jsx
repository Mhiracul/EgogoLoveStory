import {
  BarChart3,
  CalendarDays,
  Gift,
  Image,
  LogOut,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    icon: BarChart3,
    href: "/admin",
  },
  {
    label: "RSVPs",
    icon: Users,
    href: "/admin/rsvps",
  },
  {
    label: "Asoebi Orders",
    icon: ShoppingBag,
    href: "/admin/asoebi",
  },
  {
    label: "Cash Gifts",
    icon: Gift,
    href: "/admin/gifts",
  },
  {
    label: "Gift Registry",
    icon: CalendarDays,
    href: "/admin/registry",
  },
  {
    label: "Gallery",
    icon: Image,
    href: "/admin/gallery",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-brown/40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-brown/10 bg-brown text-ivory transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-7">
          <div>
            <p className="font-display text-3xl">
              M <span className="text-champagne">&</span> S
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/35">
              Wedding Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-7">
          <p className="mb-4 px-3 text-[9px] uppercase tracking-[0.3em] text-white/25">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map(({ label, icon: Icon, href }) => {
              const active =
                href === "/admin"
                  ? window.location.pathname === "/admin"
                  : window.location.pathname.startsWith(href);

              return (
                <a
                  key={label}
                  href={href}
                  onClick={onClose}
                  className={`flex w-full items-center gap-4 px-4 py-3.5 text-left text-sm transition ${
                    active
                      ? "bg-champagne text-brown"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} />

                  <span>{label}</span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-5">
          <div className="mb-5 px-3">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
              Wedding
            </p>

            <p className="mt-1 font-display text-xl text-white/70">
              Miracle & Steve
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("adminToken");
              window.location.href = "/admin/login";
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
