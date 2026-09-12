import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  Heart,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const filters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function Wishes() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedWish, setSelectedWish] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const getToken = () => localStorage.getItem("adminToken");

  const fetchWishes = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/api/wishes/admin/all`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load wishes.");
      }

      const data = await response.json();

      setWishes(data.data || []);
    } catch (error) {
      console.error("Wishes fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setProcessingId(id);

      const response = await fetch(
        `${API_URL}/api/wishes/admin/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Unable to ${action} wish.`);
      }

      await fetchWishes();
      setSelectedWish(null);
    } catch (error) {
      console.error(`Wish ${action} error:`, error);
      alert(error.message || "Something went wrong.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this wish?",
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);

      const response = await fetch(`${API_URL}/api/wishes/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete wish.");
      }

      setWishes((current) => current.filter((wish) => wish._id !== id));

      setSelectedWish(null);
    } catch (error) {
      console.error("Wish delete error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setProcessingId(null);
    }
  };

  const counts = useMemo(
    () => ({
      all: wishes.length,
      pending: wishes.filter((wish) => wish.status === "pending").length,
      approved: wishes.filter((wish) => wish.status === "approved").length,
      rejected: wishes.filter((wish) => wish.status === "rejected").length,
    }),
    [wishes],
  );

  const filteredWishes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return wishes.filter((wish) => {
      const matchesFilter =
        activeFilter === "all" || wish.status === activeFilter;

      const matchesSearch =
        !query ||
        wish.guestName?.toLowerCase().includes(query) ||
        wish.message?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [wishes, activeFilter, search]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock3,
      className: "bg-champagne/15 text-brown border-champagne/30",
    },
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-green-50 text-green-700 border-green-200",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-burgundy/5 text-burgundy border-burgundy/20",
    },
  };

  return (
    <div className="min-h-screen bg-ivory px-6 py-8 md:px-10 lg:px-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 border-b border-brown/10 pb-7 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-burgundy">
            Guestbook
          </p>

          <h1 className="mt-2 font-display text-4xl text-brown md:text-5xl">
            Wedding Wishes
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-brown/50">
            Review the beautiful messages your guests have sent before they
            appear on your wedding website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchWishes(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 border border-brown/15 bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-brown transition hover:border-brown disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-brown/10 bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.25em] text-brown/40">
              Total Wishes
            </p>

            <Heart size={17} strokeWidth={1.4} className="text-champagne" />
          </div>

          <p className="mt-4 font-display text-3xl text-brown">{counts.all}</p>
        </div>

        <div className="border border-champagne/30 bg-champagne/5 p-6">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.25em] text-brown/40">
              Pending
            </p>

            <Clock3 size={17} strokeWidth={1.4} className="text-burgundy" />
          </div>

          <p className="mt-4 font-display text-3xl text-brown">
            {counts.pending}
          </p>
        </div>

        <div className="border border-green-100 bg-green-50/40 p-6">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.25em] text-brown/40">
              Approved
            </p>

            <CheckCircle2
              size={17}
              strokeWidth={1.4}
              className="text-green-600"
            />
          </div>

          <p className="mt-4 font-display text-3xl text-brown">
            {counts.approved}
          </p>
        </div>

        <div className="border border-burgundy/10 bg-burgundy/5 p-6">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.25em] text-brown/40">
              Rejected
            </p>

            <XCircle size={17} strokeWidth={1.4} className="text-burgundy" />
          </div>

          <p className="mt-4 font-display text-3xl text-brown">
            {counts.rejected}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                  active
                    ? "bg-brown text-ivory"
                    : "border border-brown/10 bg-white text-brown/50 hover:border-brown/25 hover:text-brown"
                }`}
              >
                {filter.label} ({counts[filter.value]})
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search
            size={16}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/30"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search wishes..."
            className="w-full border border-brown/10 bg-white py-3 pl-11 pr-4 text-sm text-brown outline-none transition placeholder:text-brown/30 focus:border-champagne"
          />
        </div>
      </div>

      {/* Wishes */}
      <div className="mt-8">
        {loading ? (
          <div className="flex min-h-75 items-center justify-center">
            <Loader2 size={25} className="animate-spin text-champagne" />
          </div>
        ) : filteredWishes.length === 0 ? (
          <div className="border border-brown/10 bg-white/60 px-8 py-16 text-center">
            <Heart
              size={30}
              strokeWidth={1.2}
              className="mx-auto text-champagne"
            />

            <h3 className="mt-5 font-display text-2xl text-brown">
              No wishes found
            </h3>

            <p className="mt-2 text-sm text-brown/45">
              {search
                ? "Try a different search."
                : "There are no wishes in this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredWishes.map((wish) => {
              const status = statusConfig[wish.status] || statusConfig.pending;

              const StatusIcon = status.icon;
              const isProcessing = processingId === wish._id;

              return (
                <article
                  key={wish._id}
                  className="group relative border border-brown/10 bg-white/70 p-6 transition hover:border-champagne/40 hover:shadow-lg hover:shadow-brown/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/15">
                        <User
                          size={17}
                          strokeWidth={1.4}
                          className="text-burgundy"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-display text-lg text-brown">
                          {wish.guestName}
                        </p>

                        <p className="text-[9px] uppercase tracking-[0.18em] text-brown/35">
                          {formatDate(wish.submittedAt || wish.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] ${status.className}`}
                    >
                      <StatusIcon size={11} />
                      {status.label}
                    </span>
                  </div>

                  <div className="relative mt-6 border-t border-brown/10 pt-5">
                    <span className="absolute -top-3 left-0 bg-white/70 pr-2 font-display text-3xl leading-none text-champagne/60">
                      “
                    </span>

                    <p className="line-clamp-5 text-sm leading-7 text-brown/65">
                      {wish.message}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-brown/10 pt-5">
                    <button
                      type="button"
                      onClick={() => setSelectedWish(wish)}
                      className="flex flex-1 items-center justify-center gap-2 border border-brown/10 px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-brown/60 transition hover:border-brown hover:text-brown"
                    >
                      <Eye size={14} />
                      View
                    </button>

                    {wish.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAction(wish._id, "approve")}
                          disabled={isProcessing}
                          className="flex h-10 w-10 items-center justify-center bg-green-700 text-white transition hover:bg-green-800 disabled:opacity-50"
                          title="Approve"
                        >
                          {isProcessing ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAction(wish._id, "reject")}
                          disabled={isProcessing}
                          className="flex h-10 w-10 items-center justify-center bg-burgundy text-white transition hover:bg-burgundy/90 disabled:opacity-50"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(wish._id)}
                      disabled={isProcessing}
                      className="flex h-10 w-10 items-center justify-center border border-burgundy/15 text-burgundy transition hover:bg-burgundy hover:text-white disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedWish && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brown/60 px-5 py-8 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto bg-ivory shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedWish(null)}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center text-brown/50 transition hover:text-brown"
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="p-8 md:p-10">
              <div className="pr-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-burgundy">
                  Guestbook Message
                </p>

                <h3 className="mt-3 font-display text-3xl text-brown">
                  {selectedWish.guestName}
                </h3>

                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-brown/35">
                  Submitted{" "}
                  {formatDate(
                    selectedWish.submittedAt || selectedWish.createdAt,
                  )}
                </p>
              </div>

              <div className="relative mt-8 border-y border-brown/10 py-8">
                <span className="absolute -top-4 left-0 bg-ivory pr-3 font-display text-5xl leading-none text-champagne/60">
                  “
                </span>

                <p className="text-base leading-8 text-brown/70">
                  {selectedWish.message}
                </p>
              </div>

              <div className="mt-7 flex items-center justify-between">
                {(() => {
                  const status =
                    statusConfig[selectedWish.status] || statusConfig.pending;

                  const StatusIcon = status.icon;

                  return (
                    <span
                      className={`inline-flex items-center gap-2 border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] ${status.className}`}
                    >
                      <StatusIcon size={13} />
                      {status.label}
                    </span>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => handleDelete(selectedWish._id)}
                  className="inline-flex items-center gap-2 border border-burgundy/15 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-burgundy transition hover:bg-burgundy hover:text-white"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>

              {selectedWish.status === "pending" && (
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAction(selectedWish._id, "reject")}
                    disabled={processingId === selectedWish._id}
                    className="flex items-center justify-center gap-2 border border-burgundy/20 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-burgundy transition hover:bg-burgundy hover:text-white disabled:opacity-50"
                  >
                    <X size={14} />
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(selectedWish._id, "approve")}
                    disabled={processingId === selectedWish._id}
                    className="flex items-center justify-center gap-2 bg-green-700 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-green-800 disabled:opacity-50"
                  >
                    {processingId === selectedWish._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
