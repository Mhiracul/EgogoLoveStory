import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

export default function RSVPs() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");

  const [selectedRSVP, setSelectedRSVP] = useState(null);

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
      setError(error.message || "Unable to load RSVPs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const filteredRSVPs = useMemo(() => {
    return rsvps.filter((rsvp) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        rsvp.name?.toLowerCase().includes(searchValue) ||
        rsvp.phone?.toLowerCase().includes(searchValue) ||
        rsvp.email?.toLowerCase().includes(searchValue);

      const matchesAttendance =
        attendanceFilter === "all" || rsvp.attendance === attendanceFilter;

      const matchesEvent = eventFilter === "all" || rsvp.event === eventFilter;

      return matchesSearch && matchesAttendance && matchesEvent;
    });
  }, [rsvps, search, attendanceFilter, eventFilter]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this RSVP? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rsvp/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete RSVP.");
      }

      setRsvps((previous) => previous.filter((rsvp) => rsvp._id !== id));

      if (selectedRSVP?._id === id) {
        setSelectedRSVP(null);
      }
    } catch (error) {
      setError(error.message || "Unable to delete RSVP.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatEvent = (event) => {
    const events = {
      traditional: "Traditional Marriage",
      church: "Church Wedding",
      reception: "Wedding Reception",
      all: "All Events",
    };

    return events[event] || event;
  };

  return (
    <div className="p-5 sm:p-8">
      {/* Page heading */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
            Guest Management
          </p>

          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            RSVP Management
          </h2>

          <p className="mt-3 text-sm text-brown/50">
            Manage everyone who has responded to your wedding invitation.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRSVPs}
          disabled={loading}
          className="flex items-center justify-center gap-2 border border-brown/10 bg-white px-5 py-3 text-[10px] uppercase tracking-[0.2em] transition hover:border-champagne hover:text-burgundy disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            strokeWidth={1.5}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="border border-brown/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-cream text-burgundy">
              <Users size={18} strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brown/35">
                Total Responses
              </p>

              <p className="font-display text-3xl">{rsvps.length}</p>
            </div>
          </div>
        </div>

        <div className="border border-brown/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-green-50 text-green-700">
              <Users size={18} strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brown/35">
                Attending
              </p>

              <p className="font-display text-3xl">
                {rsvps.filter((rsvp) => rsvp.attendance === "yes").length}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-brown/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-red-50 text-red-600">
              <Users size={18} strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brown/35">
                Not Attending
              </p>

              <p className="font-display text-3xl">
                {rsvps.filter((rsvp) => rsvp.attendance === "no").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 border border-brown/10 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_220px]">
          {/* Search */}
          <div className="relative">
            <Search
              size={17}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/30"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, phone or email..."
              className="h-12 w-full border border-brown/10 bg-ivory pl-11 pr-4 text-sm outline-none transition placeholder:text-brown/30 focus:border-champagne"
            />
          </div>

          {/* Attendance */}
          <div className="relative">
            <select
              value={attendanceFilter}
              onChange={(event) => setAttendanceFilter(event.target.value)}
              className="h-12 w-full appearance-none border border-brown/10 bg-ivory px-4 pr-10 text-sm outline-none focus:border-champagne"
            >
              <option value="all">All Responses</option>
              <option value="yes">Attending</option>
              <option value="no">Not Attending</option>
            </select>

            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brown/40"
            />
          </div>

          {/* Event */}
          <div className="relative">
            <select
              value={eventFilter}
              onChange={(event) => setEventFilter(event.target.value)}
              className="h-12 w-full appearance-none border border-brown/10 bg-ivory px-4 pr-10 text-sm outline-none focus:border-champagne"
            >
              <option value="all">All Events</option>
              <option value="traditional">Traditional Marriage</option>
              <option value="church">Church Wedding</option>
              <option value="reception">Wedding Reception</option>
            </select>

            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brown/40"
            />
          </div>
        </div>

        {(search || attendanceFilter !== "all" || eventFilter !== "all") && (
          <div className="mt-3 flex items-center justify-between border-t border-brown/5 pt-3">
            <p className="text-xs text-brown/40">
              Showing {filteredRSVPs.length} of {rsvps.length} responses
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setAttendanceFilter("all");
                setEventFilter("all");
              }}
              className="text-[9px] uppercase tracking-[0.15em] text-burgundy"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <section className="border border-brown/10 bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2
              size={30}
              strokeWidth={1.5}
              className="animate-spin text-champagne"
            />

            <p className="mt-4 text-xs text-brown/40">
              Loading guest responses...
            </p>
          </div>
        ) : filteredRSVPs.length === 0 ? (
          <div className="px-6 py-24 text-center">
            <Search
              size={35}
              strokeWidth={1}
              className="mx-auto text-champagne/60"
            />

            <p className="mt-5 font-display text-2xl text-brown/60">
              No guests found
            </p>

            <p className="mt-2 text-xs text-brown/35">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead>
                <tr className="border-b border-brown/10 bg-cream/30 text-left">
                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Guest
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Status
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Guests
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Event
                  </th>

                  <th className="px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-[9px] uppercase tracking-[0.15em] text-brown/35">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRSVPs.map((rsvp) => (
                  <tr
                    key={rsvp._id}
                    className="border-b border-brown/5 last:border-0 hover:bg-cream/20"
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

                    <td className="px-6 py-5 text-sm text-brown/60">
                      {formatEvent(rsvp.event)}
                    </td>

                    <td className="px-6 py-5 text-xs text-brown/40">
                      {formatDate(rsvp.createdAt)}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRSVP(rsvp)}
                          className="flex h-9 w-9 items-center justify-center border border-brown/10 text-brown/45 transition hover:border-champagne hover:text-burgundy"
                          title="View RSVP"
                        >
                          <Eye size={16} strokeWidth={1.5} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(rsvp._id)}
                          disabled={deleting === rsvp._id}
                          className="flex h-9 w-9 items-center justify-center border border-red-100 text-red-400 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
                          title="Delete RSVP"
                        >
                          {deleting === rsvp._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Guest Details Modal */}
      {selectedRSVP && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brown/50 p-5 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-brown/10 px-6 py-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-champagne">
                  RSVP Details
                </p>

                <h3 className="mt-1 font-display text-3xl">
                  {selectedRSVP.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRSVP(null)}
                className="flex h-9 w-9 items-center justify-center text-brown/40 hover:text-burgundy"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <Detail label="Phone Number" value={selectedRSVP.phone} />

              <Detail
                label="Email Address"
                value={selectedRSVP.email || "Not provided"}
              />

              <Detail
                label="Attendance"
                value={
                  selectedRSVP.attendance === "yes"
                    ? "Attending"
                    : "Not Attending"
                }
              />

              <Detail label="Number of Guests" value={selectedRSVP.guests} />

              <Detail label="Event" value={formatEvent(selectedRSVP.event)} />

              <Detail
                label="RSVP Date"
                value={formatDate(selectedRSVP.createdAt)}
              />

              {selectedRSVP.message && (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-brown/35">
                    Message
                  </p>

                  <div className="mt-2 border border-brown/10 bg-white p-4 text-sm leading-6 text-brown/60">
                    {selectedRSVP.message}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-brown/10 p-6">
              <button
                type="button"
                onClick={() => setSelectedRSVP(null)}
                className="w-full bg-burgundy px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-brown"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="border-b border-brown/5 pb-4">
      <p className="text-[9px] uppercase tracking-[0.2em] text-brown/35">
        {label}
      </p>

      <p className="mt-1 text-sm text-brown/70">{value}</p>
    </div>
  );
}
