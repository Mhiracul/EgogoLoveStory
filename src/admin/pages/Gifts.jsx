import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const formatNaira = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

export default function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchGifts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/gifts/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch gifts.");
      }

      setGifts(data.data);
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to fetch gifts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const stats = useMemo(() => {
    const paidGifts = gifts.filter((gift) => gift.paymentStatus === "paid");

    const pendingGifts = gifts.filter(
      (gift) => gift.paymentStatus === "pending",
    );

    const totalReceived = paidGifts.reduce(
      (total, gift) => total + Number(gift.amount),
      0,
    );

    return {
      totalReceived,
      paidCount: paidGifts.length,
      pendingCount: pendingGifts.length,
    };
  }, [gifts]);

  const deleteGift = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gift?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/gifts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete gift.");
      }

      setGifts((prev) => prev.filter((gift) => gift._id !== id));
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to delete gift.");
    }
  };

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-champagne">
            Wedding gifts
          </p>

          <h1 className="mt-2 font-display text-4xl text-brown">Cash Gifts</h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-brown/45">
            View gifts received from your loved ones and the beautiful messages
            they've shared.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchGifts}
          disabled={loading}
          className="rounded-full border border-brown/10 bg-white px-5 py-3 text-xs uppercase tracking-[0.15em] text-brown transition hover:border-champagne hover:text-burgundy disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-brown/10 bg-white p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-brown/35">
            Total received
          </p>

          <p className="mt-3 font-display text-3xl text-burgundy">
            {formatNaira(stats.totalReceived)}
          </p>
        </div>

        <div className="border border-brown/10 bg-white p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-brown/35">
            Confirmed gifts
          </p>

          <p className="mt-3 font-display text-3xl text-brown">
            {stats.paidCount}
          </p>
        </div>

        <div className="border border-brown/10 bg-white p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-brown/35">
            Pending
          </p>

          <p className="mt-3 font-display text-3xl text-brown">
            {stats.pendingCount}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 border border-burgundy/10 bg-burgundy/5 px-5 py-4 text-sm text-burgundy">
          {error}
        </div>
      )}

      {/* Gifts */}
      <div className="mt-8 border border-brown/10 bg-white">
        <div className="border-b border-brown/10 px-6 py-5">
          <h2 className="font-display text-2xl text-brown">All Gifts</h2>

          <p className="mt-1 text-xs text-brown/35">
            {gifts.length} gift{gifts.length === 1 ? "" : "s"} recorded
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-xs uppercase tracking-[0.2em] text-brown/30">
            Loading gifts...
          </div>
        ) : gifts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="font-display text-5xl text-champagne/40">♥</span>

            <p className="mt-4 font-display text-2xl text-brown/50">
              No gifts yet
            </p>

            <p className="mt-2 text-sm text-brown/30">
              Cash gifts will appear here once guests begin sending them.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-brown/10 bg-ivory/60">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-brown/35">
                      Guest
                    </th>

                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-brown/35">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-brown/35">
                      Message
                    </th>

                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-brown/35">
                      Gift Wall
                    </th>

                    <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-brown/35">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] uppercase tracking-[0.15em] text-brown/35">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {gifts.map((gift) => (
                    <tr
                      key={gift._id}
                      className="border-b border-brown/5 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-sm text-brown">
                          {gift.donorName}
                        </p>

                        <p className="mt-1 text-xs text-brown/35">
                          {gift.email}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-display text-xl text-burgundy">
                          {formatNaira(gift.amount)}
                        </p>
                      </td>

                      <td className="max-w-sm px-6 py-5">
                        <p className="text-sm leading-6 text-brown/50">
                          {gift.message ? `“${gift.message}”` : "No message"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                            gift.displayOnGiftWall
                              ? "bg-champagne/15 text-brown"
                              : "bg-brown/5 text-brown/35"
                          }`}
                        >
                          {gift.displayOnGiftWall ? "Visible" : "Private"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                            gift.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {gift.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => deleteGift(gift._id)}
                          className="text-xs text-burgundy/60 transition hover:text-burgundy"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-brown/5 lg:hidden">
              {gifts.map((gift) => (
                <div key={gift._id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl text-burgundy">
                        {gift.donorName}
                      </p>

                      <p className="mt-1 text-xs text-brown/35">{gift.email}</p>
                    </div>

                    <p className="font-display text-xl text-champagne">
                      {formatNaira(gift.amount)}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm leading-6 text-brown/50">
                      {gift.message ? `“${gift.message}”` : "No message"}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                        gift.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {gift.paymentStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                        gift.displayOnGiftWall
                          ? "bg-champagne/15 text-brown"
                          : "bg-brown/5 text-brown/35"
                      }`}
                    >
                      {gift.displayOnGiftWall ? "Gift Wall" : "Private"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteGift(gift._id)}
                    className="mt-5 text-xs text-burgundy/60 transition hover:text-burgundy"
                  >
                    Delete Gift
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
