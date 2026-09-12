import { useEffect, useMemo, useState } from "react";

import {
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const FILTERS = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "pending",
    label: "Pending",
  },
  {
    key: "approved",
    label: "Approved",
  },
  {
    key: "rejected",
    label: "Rejected",
  },
];

export default function GuestSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_URL}${image}`;
  };

  const fetchSubmissions = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/submissions/admin/all`, {
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
        throw new Error(data.message || "Unable to load guest submissions.");
      }

      setSubmissions(data.data || []);
    } catch (err) {
      console.error("Guest submissions fetch error:", err);

      setError(err.message || "Unable to load guest submissions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // =========================
  // COUNTS
  // =========================

  const pendingCount = useMemo(
    () => submissions.filter((item) => item.status === "pending").length,
    [submissions],
  );

  const approvedCount = useMemo(
    () => submissions.filter((item) => item.status === "approved").length,
    [submissions],
  );

  const rejectedCount = useMemo(
    () => submissions.filter((item) => item.status === "rejected").length,
    [submissions],
  );

  // =========================
  // FILTERED SUBMISSIONS
  // =========================

  const filteredSubmissions = useMemo(() => {
    let result = submissions;

    if (activeFilter !== "all") {
      result = result.filter((item) => item.status === activeFilter);
    }

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((item) => {
        const guestName = item.guestName?.toLowerCase() || "";
        const caption = item.caption?.toLowerCase() || "";

        return guestName.includes(query) || caption.includes(query);
      });
    }

    return result;
  }, [submissions, activeFilter, searchQuery]);

  // =========================
  // APPROVE
  // =========================

  const handleApprove = async (submission) => {
    try {
      setProcessingId(submission._id);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/submissions/admin/${submission._id}/approve`,
        {
          method: "PATCH",
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
        throw new Error(data.message || "Unable to approve submission.");
      }

      setSubmissions((current) =>
        current.map((item) =>
          item._id === submission._id
            ? {
                ...item,
                status: "approved",
                galleryPhoto: data.data?.galleryPhoto || null,
                reviewedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Guest submission approval error:", err);

      setError(err.message || "Unable to approve submission.");
    } finally {
      setProcessingId(null);
    }
  };

  // =========================
  // REJECT
  // =========================

  const handleReject = async (submission) => {
    const confirmed = window.confirm(
      `Reject the photo submitted by ${submission.guestName}?`,
    );

    if (!confirmed) return;

    try {
      setProcessingId(submission._id);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/submissions/admin/${submission._id}/reject`,
        {
          method: "PATCH",
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
        throw new Error(data.message || "Unable to reject submission.");
      }

      setSubmissions((current) =>
        current.map((item) =>
          item._id === submission._id
            ? {
                ...item,
                status: "rejected",
                reviewedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Guest submission rejection error:", err);

      setError(err.message || "Unable to reject submission.");
    } finally {
      setProcessingId(null);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (submission) => {
    const confirmed = window.confirm(
      "Delete this guest submission permanently?",
    );

    if (!confirmed) return;

    try {
      setProcessingId(submission._id);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/submissions/admin/${submission._id}`,
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
        throw new Error(data.message || "Unable to delete submission.");
      }

      setSubmissions((current) =>
        current.filter((item) => item._id !== submission._id),
      );

      if (selectedPhoto?._id === submission._id) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      console.error("Guest submission deletion error:", err);

      setError(err.message || "Unable to delete submission.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* =========================
          HEADER
      ========================= */}

      <div className="border-b border-brown/10 bg-white">
        <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
                Miracle & Steve
              </p>

              {pendingCount > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full bg-burgundy/5 px-3 py-1.5 text-[8px] uppercase tracking-[0.15em] text-burgundy">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy" />
                  {pendingCount}{" "}
                  {pendingCount === 1 ? "pending review" : "pending reviews"}
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl text-brown">
              Guest Photos
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-brown/45">
              Review memories shared by your wedding guests before they appear
              publicly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchSubmissions(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brown/10 bg-white px-5 py-3 text-xs uppercase tracking-[0.15em] text-brown transition hover:border-champagne disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="space-y-8 px-6 py-8 sm:px-8">
        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="flex items-start justify-between gap-4 border border-burgundy/10 bg-burgundy/5 px-5 py-4 text-sm text-burgundy">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =========================
            STATS
        ========================= */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SubmissionStat
            icon={Clock3}
            label="Pending"
            value={pendingCount}
            description="Waiting for your review"
            highlight={pendingCount > 0}
          />

          <SubmissionStat
            icon={CheckCircle2}
            label="Approved"
            value={approvedCount}
            description="Added to your gallery"
          />

          <SubmissionStat
            icon={XCircle}
            label="Rejected"
            value={rejectedCount}
            description="Not added publicly"
          />

          <SubmissionStat
            icon={Camera}
            label="Total"
            value={submissions.length}
            description="Guest submissions"
          />
        </div>

        {/* =========================
            INTRO
        ========================= */}

        <div className="border border-brown/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-champagne/10">
              <Camera size={24} className="text-champagne" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne">
                Guest Memories
              </p>

              <h2 className="mt-2 font-display text-2xl text-brown">
                Your guests can share the day
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-brown/40">
                Every submitted photo stays private until you approve it.
                Approved memories are automatically added to your public wedding
                gallery.
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            FILTER + SEARCH
        ========================= */}

        {!loading && submissions.length > 0 && (
          <div className="border border-brown/10 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto border border-brown/10 p-1">
                {FILTERS.map((filter) => {
                  const count =
                    filter.key === "all"
                      ? submissions.length
                      : submissions.filter((item) => item.status === filter.key)
                          .length;

                  const active = activeFilter === filter.key;

                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setActiveFilter(filter.key)}
                      className={`flex shrink-0 items-center gap-2 px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] transition ${
                        active
                          ? "bg-brown text-white"
                          : "text-brown/45 hover:bg-brown/5 hover:text-brown"
                      }`}
                    >
                      {filter.label}

                      <span
                        className={`text-[8px] ${
                          active ? "text-white/60" : "text-brown/25"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative w-full xl:max-w-xs">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/25"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search guest name..."
                  className="w-full border border-brown/10 bg-ivory/50 py-3 pl-11 pr-4 text-xs text-brown outline-none transition placeholder:text-brown/25 focus:border-champagne"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/30 transition hover:text-burgundy"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================
            CONTENT
        ========================= */}

        {loading ? (
          <div className="flex min-h-80 items-center justify-center border border-brown/10 bg-white">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw size={25} className="animate-spin text-champagne" />

              <p className="text-xs uppercase tracking-[0.18em] text-brown/35">
                Loading submissions...
              </p>
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <EmptyState type="all" />
        ) : filteredSubmissions.length === 0 ? (
          <EmptyState type={activeFilter} hasSearch={Boolean(searchQuery)} />
        ) : (
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne">
                  {activeFilter === "all"
                    ? "Submissions"
                    : `${activeFilter} submissions`}
                </p>

                <h2 className="mt-2 font-display text-2xl text-brown">
                  Guest Memories
                </h2>
              </div>

              <p className="text-[9px] uppercase tracking-[0.15em] text-brown/25">
                {filteredSubmissions.length}{" "}
                {filteredSubmissions.length === 1 ? "memory" : "memories"}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission._id}
                  submission={submission}
                  imageUrl={getImageUrl(submission.image)}
                  processing={processingId === submission._id}
                  onView={() => setSelectedPhoto(submission)}
                  onApprove={() => handleApprove(submission)}
                  onReject={() => handleReject(submission)}
                  onDelete={() => handleDelete(submission)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================
          PHOTO PREVIEW
      ========================= */}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-brown/80 px-4 py-6 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-brown/80 text-white transition hover:bg-burgundy"
              aria-label="Close photo preview"
            >
              <X size={18} />
            </button>

            <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
              <div className="flex min-h-75 items-center justify-center bg-brown/5">
                <img
                  src={getImageUrl(selectedPhoto.image)}
                  alt={selectedPhoto.caption || "Guest photo"}
                  className="max-h-[75vh] w-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-champagne">
                      Guest Memory
                    </p>

                    <StatusBadge status={selectedPhoto.status} />
                  </div>

                  <h3 className="mt-6 font-display text-3xl text-brown">
                    {selectedPhoto.guestName}
                  </h3>

                  {selectedPhoto.caption ? (
                    <p className="mt-4 text-sm leading-7 text-brown/50">
                      “{selectedPhoto.caption}”
                    </p>
                  ) : (
                    <p className="mt-4 text-xs italic text-brown/25">
                      No caption added.
                    </p>
                  )}

                  <div className="mt-8 border-t border-brown/10 pt-6">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-brown/25">
                      Submitted
                    </p>

                    <p className="mt-2 text-xs text-brown/50">
                      {formatDate(
                        selectedPhoto.createdAt || selectedPhoto.submittedAt,
                      )}
                    </p>
                  </div>

                  {selectedPhoto.reviewedAt && (
                    <div className="mt-5">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-brown/25">
                        Reviewed
                      </p>

                      <p className="mt-2 text-xs text-brown/50">
                        {formatDate(selectedPhoto.reviewedAt)}
                      </p>
                    </div>
                  )}
                </div>

                {selectedPhoto.status === "pending" && (
                  <div className="mt-8 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(null);
                        handleReject(selectedPhoto);
                      }}
                      disabled={processingId === selectedPhoto._id}
                      className="inline-flex items-center justify-center gap-2 border border-brown/10 px-3 py-3 text-[9px] uppercase tracking-[0.12em] text-brown/50 transition hover:border-burgundy/20 hover:text-burgundy disabled:opacity-50"
                    >
                      <X size={13} />
                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(null);
                        handleApprove(selectedPhoto);
                      }}
                      disabled={processingId === selectedPhoto._id}
                      className="inline-flex items-center justify-center gap-2 bg-brown px-3 py-3 text-[9px] uppercase tracking-[0.12em] text-white transition hover:bg-brown/90 disabled:opacity-50"
                    >
                      <Check size={13} />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   SUBMISSION CARD
========================= */

function SubmissionCard({
  submission,
  imageUrl,
  processing,
  onView,
  onApprove,
  onReject,
  onDelete,
  formatDate,
}) {
  return (
    <div className="group border border-brown/10 bg-white transition hover:border-brown/20 hover:shadow-sm">
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-brown/5">
        <img
          src={imageUrl}
          alt={submission.caption || "Guest submission"}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Status */}
        <div className="absolute left-4 top-4">
          <StatusBadge status={submission.status} />
        </div>

        {/* View */}
        <button
          type="button"
          onClick={onView}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-white/95 text-brown shadow-sm transition hover:bg-champagne"
          title="View photo"
          aria-label="View photo"
        >
          <Eye size={15} />
        </button>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne/10">
            <User size={15} className="text-champagne" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.15em] text-brown/30">
              Guest
            </p>

            <h3 className="mt-1 truncate font-display text-lg text-brown">
              {submission.guestName}
            </h3>
          </div>
        </div>

        {submission.caption && (
          <p className="mt-4 line-clamp-2 text-xs leading-5 text-brown/45">
            “{submission.caption}”
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[9px] uppercase tracking-[0.12em] text-brown/25">
            {formatDate(submission.createdAt || submission.submittedAt)}
          </p>

          {submission.status === "approved" && submission.galleryPhoto && (
            <span className="inline-flex items-center gap-1.5 text-[8px] uppercase tracking-[0.12em] text-green-700">
              <CheckCircle2 size={12} />
              In gallery
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 border-t border-brown/10 pt-4">
          {submission.status === "pending" ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onReject}
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 border border-brown/10 px-3 py-3 text-[9px] uppercase tracking-[0.12em] text-brown/50 transition hover:border-burgundy/20 hover:text-burgundy disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                Reject
              </button>

              <button
                type="button"
                onClick={onApprove}
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 bg-brown px-3 py-3 text-[9px] uppercase tracking-[0.12em] text-white transition hover:bg-brown/90 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Check size={13} />
                )}
                Approve
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] uppercase tracking-[0.12em] text-brown/30">
                {submission.status === "approved"
                  ? "Added to gallery"
                  : "Not published"}
              </p>

              <button
                type="button"
                onClick={onDelete}
                disabled={processing}
                className="flex h-9 w-9 items-center justify-center border border-brown/10 text-brown/30 transition hover:border-burgundy/20 hover:text-burgundy disabled:opacity-50"
                title="Delete submission"
                aria-label="Delete submission"
              >
                {processing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-champagne/10 text-champagne",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-burgundy/5 text-burgundy",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-[8px] uppercase tracking-[0.15em] backdrop-blur-sm ${
        styles[status] || "bg-white/90 text-brown"
      }`}
    >
      {status === "pending" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      {status === "approved" && <CheckCircle2 size={11} />}

      {status === "rejected" && <XCircle size={11} />}

      {labels[status] || status}
    </span>
  );
}

/* =========================
   EMPTY STATE
========================= */

function EmptyState({ type, hasSearch }) {
  const content = {
    all: {
      eyebrow: "Guest Photos",
      title: "No submissions yet",
      description:
        "When your guests start sharing their favourite wedding memories, they'll appear here for you to review.",
    },

    pending: {
      eyebrow: "Pending",
      title: "You're all caught up",
      description:
        "There are no guest photos waiting for your approval right now.",
    },

    approved: {
      eyebrow: "Approved",
      title: "No approved photos yet",
      description:
        "Photos you approve will appear here and will automatically be added to your public wedding gallery.",
    },

    rejected: {
      eyebrow: "Rejected",
      title: "No rejected photos",
      description: "Photos you reject will appear here.",
    },
  };

  const selected = content[type] || content.all;

  return (
    <div className="flex min-h-96 flex-col items-center justify-center border border-dashed border-brown/15 bg-white px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-champagne/10">
        {type === "pending" ? (
          <Clock3 size={27} className="text-champagne" />
        ) : type === "approved" ? (
          <CheckCircle2 size={27} className="text-champagne" />
        ) : type === "rejected" ? (
          <XCircle size={27} className="text-champagne" />
        ) : (
          <Camera size={28} className="text-champagne" />
        )}
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-champagne">
        {selected.eyebrow}
      </p>

      <h2 className="mt-2 font-display text-2xl text-brown">
        {hasSearch ? "No matching memories" : selected.title}
      </h2>

      <p className="mt-2 max-w-md text-xs leading-5 text-brown/40">
        {hasSearch
          ? "Try searching for a different guest name or clear your search."
          : selected.description}
      </p>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function SubmissionStat({
  icon: Icon,
  label,
  value,
  description,
  highlight = false,
}) {
  return (
    <div
      className={`border bg-white p-6 transition ${
        highlight ? "border-champagne/30" : "border-brown/10"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            highlight ? "bg-champagne/20" : "bg-champagne/10"
          }`}
        >
          <Icon size={17} className="text-champagne" />
        </div>

        {highlight && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-burgundy" />
        )}
      </div>

      <p className="mt-6 text-[9px] uppercase tracking-[0.2em] text-brown/35">
        {label}
      </p>

      <p className="mt-2 font-display text-2xl text-brown">{value}</p>

      <p className="mt-2 text-[10px] text-brown/30">{description}</p>
    </div>
  );
}
