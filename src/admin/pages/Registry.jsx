import { useCallback, useEffect, useMemo, useState } from "react";
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
const REGISTRY_GOAL = 20000000;
const MIN_OUR_HOME_AMOUNT = 50000;

const registryItems = [
  {
    id: "pressure-cooker",
    title: "Silver Crest 10-in-1 Electric Pressure Cooker",
    amount: 143180,
    quantityNeeded: 1,
  },
  {
    id: "microwave",
    title: "Digital Countertop Microwave Oven",
    amount: 75535,
    quantityNeeded: 1,
  },
  {
    id: "refrigerator",
    title: "Double Door Home Refrigerator",
    amount: 238680,
    quantityNeeded: 1,
  },
  {
    id: "television",
    title: "Hisense 4K Smart UHD Television",
    amount: 512500,
    quantityNeeded: 1,
  },
  {
    id: "air-fryer",
    title: "Digital XL Rapid Air Fryer",
    amount: 64973,
    quantityNeeded: 1,
  },
  {
    id: "juice-extractor",
    title: "Electric Cold-Press Juice Extractor",
    amount: 33516,
    quantityNeeded: 1,
  },
  {
    id: "dinner-set",
    title: "16 Pieces Ceramic Dinner Set (Plates, Cups, Bowls)",
    amount: 49850,
    quantityNeeded: 1,
  },
  {
    id: "plate-rack",
    title: "Stainless Steel Kitchen Plate Rack Organizer",
    amount: 48999,
    quantityNeeded: 1,
  },
  {
    id: "bedsheet",
    title: "Luxury Egyptian Cotton Bed Sheet Set",
    amount: 14950,
    quantityNeeded: 1,
  },
  {
    id: "toyota-rav4",
    title: "Toyota RAV4 (2014 Model SUV)",
    amount: 10500000,
    quantityNeeded: 1,
  },
  {
    id: "washing-machine",
    title: "Automatic Front-Load Washing Machine",
    amount: 481525,
    quantityNeeded: 1,
  },
  {
    id: "chest-freezer",
    title: "Deep Chest Freezer",
    amount: 255320,
    quantityNeeded: 1,
  },
  {
    id: "air-conditioner",
    title: "Hisense 1.5HP GenCool Dual Inverter Air Conditioner",
    amount: 368600,
    quantityNeeded: 2,
  },
  {
    id: "air-fryer-oven",
    title:
      "Sedar 24L All Stainless Steel French Door Multifunction Air Fryer Oven + 1 Enamel Bake Tray",
    amount: 245000,
    quantityNeeded: 1,
  },
  {
    id: "glass-bowls",
    title: "12 Piece Set of High Borosilicate Glass Bowls",
    amount: 60000,
    quantityNeeded: 1,
  },
  {
    id: "adjustable-desk",
    title: "Adjustable Desk",
    amount: 400000,
    quantityNeeded: 2,
  },
  {
    id: "solar-system",
    title: "Complete Home Solar Power System",
    amount: 5100000,
    quantityNeeded: 1,
  },
  {
    id: "starlink",
    title: "Starlink High-Speed Internet Setup",
    amount: 650000,
    quantityNeeded: 1,
  },
  {
    id: "cutlery",
    title: "Elegant 24-Piece Cutlery Set",
    amount: 18000,
    quantityNeeded: 1,
  },
  {
    id: "knife-set",
    title: "Premium Kitchen Knife Set",
    amount: 16500,
    quantityNeeded: 1,
  },
  { id: "mug-set", title: "Ceramic Mug Set", amount: 12500, quantityNeeded: 1 },
  {
    id: "toaster",
    title: "2-Slice Electric Toaster",
    amount: 14000,
    quantityNeeded: 1,
  },
  {
    id: "food-processor",
    title: "16-in-1 Food Processor",
    amount: 155000,
    quantityNeeded: 1,
  },
  {
    id: "blanket",
    title: "Cozy Fleece Blanket",
    amount: 25000,
    quantityNeeded: 1,
  },
  {
    id: "throw-pillows",
    title: "Decorative Throw Pillows",
    amount: 20000,
    quantityNeeded: 1,
  },
  {
    id: "microphone",
    title: "Hollyland Lark M2 Microphone Combo",
    amount: 160000,
    quantityNeeded: 1,
  },
  {
    id: "honeymoon-fund",
    title: "Honeymoon Travel & Experience Fund",
    amount: 5000000,
    quantityNeeded: 1,
  },
  {
    id: "cookware",
    title: "High-End Non-Stick Cookware Set (12-Piece)",
    amount: 115500,
    quantityNeeded: 1,
  },
  {
    id: "power-station",
    title: "Portable Solar Power Station / Powerbox",
    amount: 345000,
    quantityNeeded: 1,
  },
  {
    id: "standing-fan",
    title: "18-Inch Rechargeable Standing Fan",
    amount: 88500,
    quantityNeeded: 2,
  },
  {
    id: "gas-cooker",
    title: "Qasa 4 Burners Table Top Glass Gas Cooker",
    amount: 105000,
    quantityNeeded: 1,
  },
  {
    id: "ergonomic-chair",
    title: "Generic Moq Ergonomic Swivel Mesh High Back Chair With Headrest",
    amount: 116800,
    quantityNeeded: 2,
  },
  { id: "our-home", title: "Our Home", amount: null, quantityNeeded: 0 },
];

const itemById = new Map(registryItems.map((item) => [item.id, item]));

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

function resolveRegistryItem(gift) {
  // Prefer the stable ID sent by the public registry.
  if (gift.registryItemId && itemById.has(gift.registryItemId)) {
    return itemById.get(gift.registryItemId);
  }

  // Support older records that stored the item title.
  const savedTitle = normalize(gift.registryItem);
  if (savedTitle) {
    const exactMatch = registryItems.find(
      (item) => normalize(item.title) === savedTitle,
    );

    if (exactMatch) return exactMatch;
  }

  // Fallback for older records that only stored the item in the message.
  const message = normalize(gift.message);

  return (
    registryItems.find(
      (item) =>
        message.includes(normalize(item.title)) ||
        message.includes(`registry contribution: ${normalize(item.title)}`),
    ) || null
  );
}

function isPaid(gift) {
  return normalize(gift.paymentStatus) === "paid";
}

function isValidPaidRegistryGift(gift, item) {
  if (!isPaid(gift) || !item) return false;

  const amount = Number(gift.amount);

  if (!Number.isFinite(amount) || amount <= 0) return false;

  if (item.id === "our-home") {
    return amount >= MIN_OUR_HOME_AMOUNT;
  }

  // Fixed-price gifts must be paid in full.
  return amount === item.amount;
}

export default function Registry() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchGifts = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_URL}/api/gifts/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to load registry data.");
      }

      setGifts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Registry fetch error:", err);
      setError(err.message || "Unable to load registry data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  const registryGifts = useMemo(
    () =>
      gifts.map((gift) => ({
        ...gift,
        resolvedItem: resolveRegistryItem(gift),
      })),
    [gifts],
  );

  // Only recognized registry gifts are included in this dashboard.
  const recognizedGifts = useMemo(
    () => registryGifts.filter((gift) => gift.resolvedItem),
    [registryGifts],
  );

  // Validate the amount as well as the paid status before counting it.
  const validPaidGifts = useMemo(
    () =>
      recognizedGifts.filter((gift) =>
        isValidPaidRegistryGift(gift, gift.resolvedItem),
      ),
    [recognizedGifts],
  );

  const paidRegistryGifts = useMemo(
    () => recognizedGifts.filter(isPaid),
    [recognizedGifts],
  );

  const pendingRegistryGifts = useMemo(
    () =>
      recognizedGifts.filter(
        (gift) => normalize(gift.paymentStatus) === "pending",
      ),
    [recognizedGifts],
  );

  const totalReceived = useMemo(
    () =>
      validPaidGifts.reduce(
        (total, gift) => total + Number(gift.amount || 0),
        0,
      ),
    [validPaidGifts],
  );

  const remaining = Math.max(REGISTRY_GOAL - totalReceived, 0);
  const overallProgress = Math.min((totalReceived / REGISTRY_GOAL) * 100, 100);

  const ourHomeGifts = validPaidGifts.filter(
    (gift) => gift.resolvedItem.id === "our-home",
  );

  const ourHomeReceived = ourHomeGifts.reduce(
    (total, gift) => total + Number(gift.amount || 0),
    0,
  );

  const fixedPriceReceived = validPaidGifts
    .filter((gift) => gift.resolvedItem.id !== "our-home")
    .reduce((total, gift) => total + Number(gift.amount || 0), 0);

  const getItemStats = (item) => {
    const contributions = validPaidGifts.filter(
      (gift) => gift.resolvedItem.id === item.id,
    );

    const received = contributions.reduce(
      (total, gift) => total + Number(gift.amount || 0),
      0,
    );

    const quantityGifted = item.id === "our-home" ? 0 : contributions.length;

    const fullyGifted =
      item.quantityNeeded > 0 && quantityGifted >= item.quantityNeeded;

    const target =
      item.id === "our-home" ? null : item.amount * item.quantityNeeded;

    const progress =
      target && target > 0 ? Math.min((received / target) * 100, 100) : null;

    return {
      contributions,
      received,
      quantityGifted,
      fullyGifted,
      target,
      progress,
      remaining: target === null ? null : Math.max(target - received, 0),
    };
  };

  const filteredContributions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recognizedGifts.filter((gift) => {
      const normalizedStatus = normalize(gift.paymentStatus);

      const matchesStatus =
        statusFilter === "all" || normalizedStatus === statusFilter;

      const matchesSearch =
        !query ||
        normalize(gift.donorName).includes(query) ||
        normalize(gift.email).includes(query) ||
        normalize(gift.resolvedItem?.title).includes(query) ||
        normalize(gift.registryItemId).includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [recognizedGifts, search, statusFilter]);

  return (
    <div className="min-h-screen bg-ivory">
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
              Track gifts and contributions across your entire registry.
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
        {error && (
          <div className="border border-burgundy/10 bg-burgundy/5 px-5 py-4 text-sm text-burgundy">
            {error}
          </div>
        )}

        {/* Overview */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Gift}
            label="Registry Goal"
            value={formatNaira(REGISTRY_GOAL)}
            description="Overall contribution goal"
          />

          <StatCard
            icon={WalletCards}
            label="Total Received"
            value={formatNaira(totalReceived)}
            description={`${validPaidGifts.length} verified paid contribution${validPaidGifts.length === 1 ? "" : "s"}`}
          />

          <StatCard
            icon={Clock3}
            label="Remaining"
            value={formatNaira(remaining)}
            description="Amount remaining to the overall goal"
          />

          <StatCard
            icon={TrendingUp}
            label="Progress"
            value={`${Math.round(overallProgress)}%`}
            description="Towards the overall goal"
          />
        </div>

        {/* Overall progress */}
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

          <div className="mt-4 grid gap-3 text-xs text-brown/50 sm:grid-cols-2">
            <p>
              Fixed-price gifts received:{" "}
              <strong className="text-brown">
                {formatNaira(fixedPriceReceived)}
              </strong>
            </p>

            <p>
              Our Home contributions:{" "}
              <strong className="text-brown">
                {formatNaira(ourHomeReceived)}
              </strong>
            </p>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-brown/35">
            Only paid registry contributions with valid amounts count towards
            these figures. Fixed-price gifts are counted only when the full
            listed price has been paid.
          </p>
        </div>

        {/* All registry items */}
        <section>
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-champagne">
              All Registry Items
            </p>

            <h2 className="mt-2 font-display text-2xl text-brown">
              Gift Funding Status
            </h2>

            <p className="mt-2 text-xs text-brown/40">
              Each fixed-price item is tracked separately, including items where
              more than one unit is needed.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {registryItems.map((item) => {
              const stats = getItemStats(item);
              const isOurHome = item.id === "our-home";

              return (
                <article
                  key={item.id}
                  className="border border-brown/10 bg-white p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/10">
                        {isOurHome ? (
                          <Home size={17} className="text-champagne" />
                        ) : (
                          <Gift size={17} className="text-champagne" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-display text-lg leading-6 text-brown">
                          {item.title}
                        </h3>

                        <p className="mt-1 break-all text-[10px] text-brown/30">
                          ID: {item.id}
                        </p>
                      </div>
                    </div>

                    {stats.fullyGifted && (
                      <span className="shrink-0 rounded-full bg-green-50 px-2 py-1 text-[9px] text-green-700">
                        Fully gifted
                      </span>
                    )}
                  </div>

                  <div className="mt-5 border border-brown/10 bg-ivory p-4">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-brown/35">
                      {isOurHome ? "Contribution Type" : "Price per unit"}
                    </p>

                    <p className="mt-2 font-display text-xl text-burgundy">
                      {isOurHome ? "Any amount" : formatNaira(item.amount)}
                    </p>

                    {isOurHome ? (
                      <p className="mt-1 text-[10px] text-brown/40">
                        Minimum contribution: {formatNaira(MIN_OUR_HOME_AMOUNT)}
                      </p>
                    ) : (
                      <p className="mt-1 text-[10px] text-brown/40">
                        Quantity needed: {item.quantityNeeded}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="border border-brown/10 p-3">
                      <p className="text-[9px] uppercase tracking-[0.12em] text-brown/35">
                        Amount Received
                      </p>
                      <p className="mt-2 wrap-break-word font-display text-base text-brown">
                        {formatNaira(stats.received)}
                      </p>
                    </div>

                    <div className="border border-brown/10 p-3">
                      <p className="text-[9px] uppercase tracking-[0.12em] text-brown/35">
                        {isOurHome ? "Contributions" : "Units Gifted"}
                      </p>
                      <p className="mt-2 font-display text-base text-brown">
                        {isOurHome
                          ? stats.contributions.length
                          : `${Math.min(stats.quantityGifted, item.quantityNeeded)} / ${item.quantityNeeded}`}
                      </p>
                    </div>
                  </div>

                  {!isOurHome && (
                    <>
                      <div className="mt-5 flex items-center justify-between text-[10px]">
                        <span className="uppercase tracking-[0.12em] text-brown/35">
                          Funding progress
                        </span>
                        <span className="font-medium text-burgundy">
                          {Math.round(stats.progress || 0)}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-brown/5">
                        <div
                          className="h-full rounded-full bg-champagne transition-all duration-700"
                          style={{
                            width: `${stats.progress || 0}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 text-[10px] text-brown/35">
                        {stats.fullyGifted
                          ? "All required units have been gifted."
                          : `${formatNaira(stats.remaining)} remaining to fund all required units.`}
                      </div>
                    </>
                  )}

                  {isOurHome && (
                    <div className="mt-5 flex items-start gap-2 border border-champagne/20 bg-champagne/5 px-3 py-3 text-[10px] leading-5 text-brown/50">
                      <Home
                        size={14}
                        className="mt-0.5 shrink-0 text-champagne"
                      />
                      All verified Our Home contributions are added together.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Contribution history */}
        <section className="border border-brown/10 bg-white">
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
                No registry contributions found
              </p>

              <p className="mt-2 max-w-sm text-xs leading-5 text-brown/35">
                Contributions matching your search and selected payment filter
                will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5">
                <thead>
                  <tr className="border-b border-brown/10 bg-ivory/60">
                    {["Donor", "Registry Item", "Amount", "Status", "Date"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-brown/35"
                        >
                          {heading}
                        </th>
                      ),
                    )}
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
                          {gift.email || "No email"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-xs text-brown">
                          {gift.resolvedItem?.title || gift.registryItem}
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
        </section>

        {pendingRegistryGifts.length > 0 && (
          <div className="flex items-start gap-4 border border-champagne/20 bg-champagne/5 px-5 py-5">
            <Clock3 size={18} className="mt-0.5 shrink-0 text-champagne" />

            <div>
              <p className="text-sm font-medium text-brown">
                {pendingRegistryGifts.length} pending registry payment
                {pendingRegistryGifts.length === 1 ? "" : "s"}
              </p>

              <p className="mt-1 text-xs leading-5 text-brown/40">
                Pending payments are displayed in the history but do not count
                towards the received total or gifted-item quantities.
              </p>
            </div>
          </div>
        )}

        {paidRegistryGifts.length > validPaidGifts.length && (
          <div className="border border-champagne/20 bg-champagne/5 px-5 py-4 text-xs leading-5 text-brown/60">
            Some records marked paid have amounts that do not match their
            registry item's rules. They are excluded from the totals. Review
            these records and their Paystack verification on the backend.
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

      <p className="mt-2 wrap-break-word font-display text-2xl text-brown">
        {value}
      </p>

      <p className="mt-2 text-[10px] text-brown/30">{description}</p>
    </div>
  );
}

function PaymentStatus({ status }) {
  const normalized = normalize(status);

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

  if (normalized === "failed") {
    return (
      <span className="inline-flex rounded-full bg-burgundy/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-burgundy">
        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-brown/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-brown/50">
      {status || "Unknown"}
    </span>
  );
}
