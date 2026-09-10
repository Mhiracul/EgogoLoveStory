import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Gift,
  Heart,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRSVPs = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rsvp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch RSVPs.");
      }

      setRsvps(data.data || []);
    } catch (error) {
      setError(error.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const stats = useMemo(() => {
    const totalRSVPs = rsvps.length;

    const attending = rsvps.filter((rsvp) => rsvp.attendance === "yes").length;

    const notAttending = rsvps.filter(
      (rsvp) => rsvp.attendance === "no",
    ).length;

    const totalGuests = rsvps
      .filter((rsvp) => rsvp.attendance === "yes")
      .reduce((total, rsvp) => total + Number(rsvp.guests || 0), 0);

    return {
      totalRSVPs,
      attending,
      notAttending,
      totalGuests,
    };
  }, [rsvps]);

  const statCards = [
    {
      label: "Total RSVPs",
      value: stats.totalRSVPs,
      description: "Guest responses",
      icon: Users,
    },
    {
      label: "Attending",
      value: stats.attending,
      description: "Confirmed responses",
      icon: Heart,
    },
    {
      label: "Guests",
      value: stats.totalGuests,
      description: "People attending",
      icon: CalendarDays,
    },
    {
      label: "Not Attending",
      value: stats.notAttending,
      description: "Declined invitations",
      icon: Gift,
    },
  ];

  return (
    <div className="p-5 sm:p-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
            Welcome back
          </p>

          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            Let's prepare for forever.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-brown/50">
            Here's an overview of everything happening around the Miracle &
            Steve wedding.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRSVPs}
          disabled={loading}
          className="flex items-center justify-center gap-2 border border-brown/10 bg-white px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-brown transition hover:border-champagne hover:text-burgundy disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            strokeWidth={1.5}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, description, icon: Icon }) => (
          <div
            key={label}
            className="border border-brown/10 bg-white p-6 transition hover:border-champagne/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center bg-cream text-burgundy">
                <Icon size={19} strokeWidth={1.5} />
              </div>

              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="text-brown/20"
              />
            </div>

            <p className="mt-7 text-[9px] uppercase tracking-[0.2em] text-brown/35">
              {label}
            </p>

            <p className="mt-2 font-display text-4xl">{value}</p>

            <p className="mt-1 text-xs text-brown/35">{description}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* RSVP Table */}
      <section className="mt-8 border border-brown/10 bg-white">
        <div className="flex flex-col gap-3 border-b border-brown/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-champagne">
              Guest Management
            </p>

            <h3 className="mt-1 font-display text-2xl">Recent RSVPs</h3>
          </div>

          <span className="text-xs text-brown/40">
            {rsvps.length} response{rsvps.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              size={30}
              strokeWidth={1.5}
              className="animate-spin text-champagne"
            />

            <p className="mt-4 text-xs text-brown/40">
              Loading guest responses...
            </p>
          </div>
        ) : rsvps.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <Users
              size={35}
              strokeWidth={1}
              className="mx-auto text-champagne/60"
            />

            <p className="mt-5 font-display text-2xl text-brown/60">
              No RSVPs yet
            </p>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-brown/35">
              Guest responses will appear here once people begin submitting
              their RSVP.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190">
              <thead>
                <tr className="border-b border-brown/10 text-left">
                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Guest
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Attendance
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Guests
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Event
                  </th>
                </tr>
              </thead>

              <tbody>
                {rsvps.map((rsvp) => (
                  <tr
                    key={rsvp._id}
                    className="border-b border-brown/5 last:border-0 hover:bg-cream/30"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">{rsvp.name}</p>

                      {rsvp.email && (
                        <p className="mt-1 text-xs text-brown/35">
                          {rsvp.email}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-5 text-sm text-brown/60">
                      {rsvp.phone}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] ${
                          rsvp.attendance === "yes"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {rsvp.attendance === "yes"
                          ? "Attending"
                          : "Not Attending"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-brown/60">
                      {rsvp.guests}
                    </td>

                    <td className="px-6 py-5 text-sm capitalize text-brown/60">
                      {rsvp.event === "all" ? "All Events" : rsvp.event}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Wedding Status */}
      <section className="mt-8 border border-brown/10 bg-burgundy p-7 text-white">
        <p className="text-[9px] uppercase tracking-[0.3em] text-champagne">
          Wedding Status
        </p>

        <h3 className="mt-5 font-display text-4xl">April 2027</h3>

        <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
          Your wedding details, events and guest information will all be managed
          from this dashboard.
        </p>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
            Hashtag
          </p>

          <p className="mt-2 font-display text-2xl text-champagne">
            #TheEgogoLoveStory
          </p>
        </div>
      </section>
    </div>
  );
}
