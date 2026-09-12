import { useEffect, useMemo, useState } from "react";
import {
  Gift,
  TrendingUp,
  WalletCards,
  Clock3,
  RefreshCw,
  Search,
  CheckCircle2,
  Home,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const REGISTRY_GOAL = 10000000;
const registryItems = [
  {
    icon: "01",
    title: "Dinner Set",
    description:
      "Help us fill our new home with beautiful pieces we'll enjoy together for years to come.",
    target: 150000,
  },
  {
    icon: "02",
    title: "Kitchen",
    description:
      "Contribute towards creating a warm and beautiful kitchen for our new home.",
    target: 200000,
  },
  {
    icon: "03",
    title: "Bedroom",
    description:
      "Help us create a comfortable and beautiful space as we begin our life together.",
    target: 250000,
  },
  {
    icon: "04",
    title: "Our Home",
    description: "Contributions towards anything needed for our new home.",
    target: null,
  },
];

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getRegistryItem = (gift) => {
  if (gift.registryItem) {
    return gift.registryItem;
  }

  // Fallback for older contributions created before
  // registryItem was added to the frontend.
  const message = gift.message || "";

  const match = registryItems.find(
    (item) =>
      message.includes(item.title) ||
      message.includes(`Registry contribution: ${item.title}`),
  );

  return match?.title || null;
};

export default function Registry() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchGifts = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/gifts/admin/all`, {
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load registry data.");
      }

      setGifts(data.data || []);
    } catch (err) {
      console.error("Registry fetch error:", err);
      setError(err.message || "Unable to load registry data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const registryGifts = useMemo(() => {
    return gifts
      .map((gift) => ({
        ...gift,
        resolvedRegistryItem: getRegistryItem(gift),
      }))
      .filter((gift) => gift.resolvedRegistryItem);
  }, [gifts]);

  const paidRegistryGifts = useMemo(
    () =>
      registryGifts.filter(
        (gift) => gift.paymentStatus?.toLowerCase() === "paid",
      ),
    [registryGifts],
  );

  const pendingRegistryGifts = useMemo(
    () =>
      registryGifts.filter(
        (gift) => gift.paymentStatus?.toLowerCase() === "pending",
      ),
    [registryGifts],
  );

  const totalReceived = useMemo(
    () =>
      paidRegistryGifts.reduce(
        (total, gift) => total + Number(gift.amount || 0),
        0,
      ),
    [paidRegistryGifts],
  );

  const remaining = Math.max(REGISTRY_GOAL - totalReceived, 0);

  const overallProgress =
    REGISTRY_GOAL > 0
      ? Math.min((totalReceived / REGISTRY_GOAL) * 100, 100)
      : 0;
  const filteredContributions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registryGifts.filter((gift) => {
      const matchesStatus =
        statusFilter === "all" ||
        gift.paymentStatus?.toLowerCase() === statusFilter;

      const matchesSearch =
        !query ||
        gift.donorName?.toLowerCase().includes(query) ||
        gift.email?.toLowerCase().includes(query) ||
        gift.resolvedRegistryItem?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [registryGifts, search, statusFilter]);

  const getItemStats = (item) => {
    const contributions = paidRegistryGifts.filter(
      (gift) => gift.resolvedRegistryItem === item.title,
    );

    const received = contributions.reduce(
      (total, gift) => total + Number(gift.amount || 0),
      0,
    );

    const progress = item.target
      ? Math.min((received / item.target) * 100, 100)
      : null;

    return {
      contributions,
      received,
      progress,
      remaining: item.target ? Math.max(item.target - received, 0) : null,
    };
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="border-b border-brown/10 bg-white">
        <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
              Miracle & Steve
            </p>

            <h1 className="mt-2 font-display text-3xl text-brown">
              Gift Registry
            </h1>

            <p className="mt-2 text-sm text-brown/45">
              Track contributions towards the items in your registry.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchGifts(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brown/10 bg-white px-5 py-3 text-xs uppercase tracking-[0.15em] text-brown transition hover:border-champagne disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="space-y-8 px-6 py-8 sm:px-8">
        {/* Error */}
        {error && (
          <div className="border border-burgundy/10 bg-burgundy/5 px-5 py-4 text-sm text-burgundy">
            {error}
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Gift}
            label="Registry Goal"
            value={formatNaira(REGISTRY_GOAL)}
            description="Our overall home & registry goal"
          />

          <StatCard
            icon={WalletCards}
            label="Total Received"
            value={formatNaira(totalReceived)}
            description={`${paidRegistryGifts.length} paid contribution${
              paidRegistryGifts.length === 1 ? "" : "s"
            }`}
          />

          <StatCard
            icon={Clock3}
            label="Remaining"
            value={formatNaira(remaining)}
            description="On fixed-value items"
          />

          <StatCard
            icon={TrendingUp}
            label="Progress"
            value={`${Math.round(overallProgress)}%`}
            description="Towards fixed-value items"
          />
        </div>

        {/* Main Progress */}
        <div className="border border-brown/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne">
                Overall Registry Progress
              </p>

              <h2 className="mt-2 font-display text-2xl text-brown">
                {formatNaira(totalReceived)}
                <span className="text-brown/30">
                  {" "}
                  / {formatNaira(REGISTRY_GOAL)}
                </span>
              </h2>
            </div>

            <span className="font-display text-2xl text-burgundy">
              {Math.round(overallProgress)}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-brown/5">
            <div
              className="h-full rounded-full bg-champagne transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <p className="mt-3 text-[11px] text-brown/35">
            Our overall registry goal is ₦10,000,000. Every contribution,
            regardless of which registry item is selected, counts towards this
            goal.
          </p>
        </div>

        {/* Registry Items */}
        <div>
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-champagne">
              Registry Items
            </p>
            <h2 className="mt-2 font-display text-2xl text-brown">
              What guests are contributing towards
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {registryItems.map((item) => {
              const stats = getItemStats(item);

              return (
                <div
                  key={item.title}
                  className="border border-brown/10 bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne/10 font-display text-sm text-champagne">
                        {item.icon}
                      </div>

                      <div>
                        <h3 className="font-display text-2xl text-brown">
                          {item.title}
                        </h3>

                        <p className="mt-1 max-w-md text-xs leading-5 text-brown/40">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {item.target ? (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-brown/30">
                          Target
                        </p>
                        <p className="mt-1 font-display text-lg text-burgundy">
                          {formatNaira(item.target)}
                        </p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-brown/30">
                          Type
                        </p>
                        <p className="mt-1 font-display text-lg text-burgundy">
                          Any Amount
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-4">
                    <div className="border border-brown/10 bg-ivory p-4">
                      <p className="text-[9px] uppercase tracking-[0.15em] text-brown/30">
                        Received
                      </p>
                      <p className="mt-2 font-display text-xl text-brown">
                        {formatNaira(stats.received)}
                      </p>
                    </div>

                    <div className="border border-brown/10 bg-ivory p-4">
                      <p className="text-[9px] uppercase tracking-[0.15em] text-brown/30">
                        Contributions
                      </p>
                      <p className="mt-2 font-display text-xl text-brown">
                        {stats.contributions.length}
                      </p>
                    </div>
                  </div>

                  {item.target ? (
                    <>
                      <div className="mt-6 flex items-center justify-between text-[10px]">
                        <span className="uppercase tracking-[0.15em] text-brown/30">
                          Funded
                        </span>

                        <span className="font-medium text-burgundy">
                          {Math.round(stats.progress)}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-brown/5">
                        <div
                          className="h-full rounded-full bg-champagne transition-all duration-700"
                          style={{
                            width: `${stats.progress}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex justify-between text-[10px] text-brown/30">
                        <span>{formatNaira(stats.received)} received</span>

                        <span>
                          {stats.remaining > 0
                            ? `${formatNaira(stats.remaining)} remaining`
                            : "Fully funded"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 flex items-center gap-2 border border-champagne/20 bg-champagne/5 px-4 py-3 text-[11px] text-brown/45">
                      <Home size={14} className="text-champagne" />
                      No fixed target — every contribution goes towards your new
                      home.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contributions */}
        <div className="border border-brown/10 bg-white">
          <div className="border-b border-brown/10 px-6 py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne">
                  Contribution History
                </p>

                <h2 className="mt-2 font-display text-2xl text-brown">
                  Registry Contributions
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/30"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search donor or item..."
                    className="w-full border border-brown/10 bg-ivory py-3 pl-10 pr-4 text-xs outline-none transition focus:border-champagne sm:w-64"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="border border-brown/10 bg-ivory px-4 py-3 text-xs text-brown outline-none focus:border-champagne"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-champagne" />
            </div>
          ) : filteredContributions.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <Gift size={30} className="text-brown/15" />

              <p className="mt-4 font-display text-xl text-brown">
                No registry contributions yet
              </p>

              <p className="mt-2 max-w-sm text-xs leading-5 text-brown/35">
                Once guests contribute through the Gift Registry, their
                contributions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5">
                <thead>
                  <tr className="border-b border-brown/10 bg-ivory/60">
                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-brown/35">
                      Donor
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-brown/35">
                      Registry Item
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-brown/35">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-brown/35">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-brown/35">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContributions.map((gift) => (
                    <tr
                      key={gift._id}
                      className="border-b border-brown/5 last:border-0 hover:bg-ivory/40"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-brown">
                          {gift.donorName || "Anonymous"}
                        </p>

                        <p className="mt-1 text-[10px] text-brown/35">
                          {gift.email}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 text-xs text-brown">
                          <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
                          {gift.resolvedRegistryItem}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-display text-lg text-burgundy">
                          {formatNaira(gift.amount)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <PaymentStatus status={gift.paymentStatus} />
                      </td>

                      <td className="px-6 py-5 text-xs text-brown/40">
                        {formatDate(gift.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Notice */}
        {pendingRegistryGifts.length > 0 && (
          <div className="flex items-start gap-4 border border-champagne/20 bg-champagne/5 px-5 py-5">
            <Clock3 size={18} className="mt-0.5 shrink-0 text-champagne" />

            <div>
              <p className="text-sm font-medium text-brown">
                {pendingRegistryGifts.length} pending registry payment
                {pendingRegistryGifts.length === 1 ? "" : "s"}
              </p>

              <p className="mt-1 text-xs leading-5 text-brown/40">
                Pending payments are not included in your registry progress
                until Paystack verification marks them as paid.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="border border-brown/10 bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/10">
          <Icon size={17} className="text-champagne" />
        </div>

        <CheckCircle2 size={15} className="text-brown/10" />
      </div>

      <p className="mt-6 text-[9px] uppercase tracking-[0.2em] text-brown/35">
        {label}
      </p>

      <p className="mt-2 font-display text-2xl text-brown">{value}</p>

      <p className="mt-2 text-[10px] text-brown/30">{description}</p>
    </div>
  );
}

function PaymentStatus({ status }) {
  const normalized = status?.toLowerCase();

  if (normalized === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-green-700">
        <CheckCircle2 size={12} />
        Paid
      </span>
    );
  }

  if (normalized === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-brown/60">
        <Clock3 size={12} />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-burgundy/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-burgundy">
      {status || "Unknown"}
    </span>
  );
}
