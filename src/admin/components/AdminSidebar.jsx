import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Camera,
  Gift,
  Heart,
  Image,
  LogOut,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const navigation = [
  { label: "Overview", icon: BarChart3, href: "/admin" },
  { label: "RSVPs", icon: Users, href: "/admin/rsvps" },
  { label: "Asoebi Orders", icon: ShoppingBag, href: "/admin/asoebi" },
  { label: "Cash Gifts", icon: Gift, href: "/admin/gifts" },
  { label: "Gift Registry", icon: CalendarDays, href: "/admin/registry" },
  { label: "Gallery", icon: Image, href: "/admin/gallery" },
  {
    label: "Guest Photos",
    icon: Camera,
    href: "/admin/submissions",
    badge: "guestPhotos",
  },
  {
    label: "Wedding Wishes",
    icon: Heart,
    href: "/admin/wishes",
    badge: "wishes",
  },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar({ open, onClose }) {
  const [pendingCounts, setPendingCounts] = useState({
    guestPhotos: 0,
    wishes: 0,
  });

  const fetchPendingCounts = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) return;

    try {
      const [photosResponse, wishesResponse] = await Promise.all([
        fetch(`${API_URL}/api/submissions/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/api/wishes/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (photosResponse.status === 401 || wishesResponse.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      const photosData = await photosResponse.json();
      const wishesData = await wishesResponse.json();

      const guestPhotos = (photosData.data || []).filter(
        (item) => item.status === "pending",
      ).length;

      const wishes = (wishesData.data || []).filter(
        (item) => item.status === "pending",
      ).length;

      setPendingCounts({
        guestPhotos,
        wishes,
      });
    } catch (error) {
      console.error("Sidebar pending counts error:", error);
    }
  };

  useEffect(() => {
    fetchPendingCounts();

    const interval = setInterval(fetchPendingCounts, 30000);

    return () => clearInterval(interval);
  }, []);

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
        {/* Logo */}
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
        <nav className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-3 text-[9px] uppercase tracking-[0.3em] text-white/25">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map(({ label, icon: Icon, href, badge }) => {
              const active =
                href === "/admin"
                  ? window.location.pathname === "/admin"
                  : window.location.pathname.startsWith(href);

              const pendingCount =
                badge === "guestPhotos"
                  ? pendingCounts.guestPhotos
                  : badge === "wishes"
                    ? pendingCounts.wishes
                    : 0;

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

                  <span className="flex-1">{label}</span>

                  {pendingCount > 0 && (
                    <span
                      className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                        active
                          ? "bg-brown text-champagne"
                          : "bg-burgundy text-white"
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
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
