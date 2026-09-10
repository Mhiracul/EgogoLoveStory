import { Menu, Bell } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-brown/10 bg-ivory/90 px-5 backdrop-blur-xl sm:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} strokeWidth={1.5} />
      </button>

      <div className="hidden lg:block">
        <p className="text-[9px] uppercase tracking-[0.3em] text-brown/35">
          Wedding Management
        </p>

        <h1 className="mt-1 font-display text-2xl">Overview</h1>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center text-brown/50 transition hover:text-burgundy"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.5} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-coral" />
        </button>

        <div className="flex items-center gap-3 border-l border-brown/10 pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy font-display text-lg text-white">
            M
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-medium">Miracle</p>
            <p className="text-[9px] text-brown/40">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
