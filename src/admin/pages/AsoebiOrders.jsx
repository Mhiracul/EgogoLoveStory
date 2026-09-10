import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Search,
  RefreshCw,
  Trash2,
  X,
  Package,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "ready",
  "completed",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed"];

const formatMoney = (amount) => {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  const classes = {
    pending: "bg-champagne/15 text-brown",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-purple-50 text-purple-700",
    ready: "bg-coral/10 text-coral",
    completed: "bg-green-50 text-green-700",
    cancelled: "bg-burgundy/10 text-burgundy",
    paid: "bg-green-50 text-green-700",
    failed: "bg-burgundy/10 text-burgundy",
  };

  return classes[status] || "bg-brown/5 text-brown/60";
};

export default function AsoebiOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/asoebi`,
        {
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
        throw new Error(data.message || "Unable to fetch Asoebi orders.");
      }

      setOrders(data.data || []);
    } catch (error) {
      setError(error.message || "Unable to load Asoebi orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        order.customerName?.toLowerCase().includes(searchText) ||
        order.phone?.toLowerCase().includes(searchText) ||
        order.email?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const updateOrder = async (id, updates) => {
    try {
      setUpdating(id);

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/asoebi/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to update order.");
      }

      setOrders((previous) =>
        previous.map((order) => (order._id === id ? data.data : order)),
      );

      setSelectedOrder(data.data);
    } catch (error) {
      setError(error.message || "Unable to update order.");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Asoebi order? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/asoebi/${id}`,
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
        throw new Error(data.message || "Unable to delete order.");
      }

      setOrders((previous) => previous.filter((order) => order._id !== id));

      if (selectedOrder?._id === id) {
        setSelectedOrder(null);
      }
    } catch (error) {
      setError(error.message || "Unable to delete order.");
    } finally {
      setDeleting(null);
    }
  };

  const totalOrders = orders.length;

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid",
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending",
  ).length;

  const totalValue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((total, order) => total + Number(order.amount || 0), 0);

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-champagne">
              Asoebi Management
            </p>

            <h1 className="mt-2 font-display text-4xl text-brown">
              Asoebi Orders
            </h1>

            <p className="mt-2 text-sm text-brown/50">
              Manage Coral Asoebi orders and payment status.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm font-medium text-brown transition hover:bg-brown/5 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={totalOrders}
            icon={<Package size={19} />}
          />

          <StatCard
            label="Paid Orders"
            value={paidOrders}
            icon={<span className="text-lg">₦</span>}
          />

          <StatCard
            label="Pending Orders"
            value={pendingOrders}
            icon={<span className="text-lg">◷</span>}
          />

          <StatCard
            label="Paid Value"
            value={formatMoney(totalValue)}
            icon={<span className="text-lg">₦</span>}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
            <span>{error}</span>

            <button type="button" onClick={() => setError("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-brown/10 bg-white p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/30"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone or email..."
                className="w-full rounded-xl border border-brown/10 bg-ivory py-3 pl-11 pr-4 text-sm outline-none focus:border-champagne"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-brown/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-champagne"
            >
              <option value="all">All Orders</option>

              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-xl border border-brown/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-champagne"
            >
              <option value="all">All Payments</option>

              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-brown/10 bg-white">
          {loading ? (
            <div className="flex min-h-75 items-center justify-center">
              <Loader2 size={28} className="animate-spin text-champagne" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">
              <Package size={36} className="text-brown/20" />

              <h3 className="mt-4 font-display text-2xl text-brown">
                No Asoebi orders
              </h3>

              <p className="mt-2 text-sm text-brown/40">
                Orders submitted through the wedding website will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left">
                <thead className="border-b border-brown/10 bg-ivory">
                  <tr>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-brown/40">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-brown/40">
                      Package
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-brown/40">
                      Qty
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-brown/40">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-brown/40">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-brown/40">
                      Order
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-brown/40">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-brown/10">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-ivory/60"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-brown">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-xs text-brown/40">
                          {order.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-brown">
                          {order.packageName}
                        </p>

                        {order.size && (
                          <p className="mt-1 text-xs text-brown/40">
                            Size: {order.size}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-brown">
                        {order.quantity}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-brown">
                        {formatMoney(order.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.paymentStatus} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brown/5 text-brown/60 transition hover:bg-brown/10 hover:text-brown"
                            title="View order"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(order._id)}
                            disabled={deleting === order._id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-burgundy/5 text-burgundy/60 transition hover:bg-burgundy/10 hover:text-burgundy disabled:opacity-50"
                            title="Delete order"
                          >
                            {deleting === order._id ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
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
        </div>

        <p className="mt-4 text-xs text-brown/40">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brown/50 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-ivory shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brown/10 bg-ivory px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-coral">
                  Asoebi Order
                </p>

                <h2 className="mt-1 font-display text-3xl text-brown">
                  {selectedOrder.customerName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brown/5 text-brown/60 hover:bg-brown/10"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-7 p-6">
              {/* Customer */}
              <div>
                <p className="text-xs uppercase tracking-wider text-brown/40">
                  Customer Details
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    icon={<Phone size={16} />}
                    label="Phone"
                    value={selectedOrder.phone}
                  />

                  <InfoItem
                    icon={<Mail size={16} />}
                    label="Email"
                    value={selectedOrder.email || "Not provided"}
                  />

                  <InfoItem
                    icon={<MapPin size={16} />}
                    label="Address"
                    value={selectedOrder.address || "Not provided"}
                  />

                  <InfoItem
                    icon={<Package size={16} />}
                    label="Order Date"
                    value={formatDate(selectedOrder.createdAt)}
                  />
                </div>
              </div>

              {/* Order */}
              <div className="border-t border-brown/10 pt-6">
                <p className="text-xs uppercase tracking-wider text-brown/40">
                  Order Details
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <InfoItem label="Package" value={selectedOrder.packageName} />

                  <InfoItem label="Quantity" value={selectedOrder.quantity} />

                  <InfoItem
                    label="Size"
                    value={selectedOrder.size || "Not provided"}
                  />

                  <InfoItem
                    label="Amount"
                    value={formatMoney(selectedOrder.amount)}
                  />
                </div>
              </div>

              {/* Status controls */}
              <div className="border-t border-brown/10 pt-6">
                <p className="text-xs uppercase tracking-wider text-brown/40">
                  Manage Order
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-brown/60">
                      Payment Status
                    </label>

                    <select
                      value={selectedOrder.paymentStatus}
                      disabled={updating === selectedOrder._id}
                      onChange={(e) =>
                        updateOrder(selectedOrder._id, {
                          paymentStatus: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
                    >
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-brown/60">
                      Order Status
                    </label>

                    <select
                      value={selectedOrder.orderStatus}
                      disabled={updating === selectedOrder._id}
                      onChange={(e) =>
                        updateOrder(selectedOrder._id, {
                          orderStatus: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-brown/10 bg-white px-4 py-3 text-sm outline-none focus:border-champagne"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="rounded-xl bg-white p-5">
                  <p className="text-xs uppercase tracking-wider text-brown/40">
                    Customer Notes
                  </p>

                  <p className="mt-3 text-sm leading-6 text-brown/70">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(selectedOrder._id)}
                disabled={deleting === selectedOrder._id}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-burgundy/20 px-4 py-3 text-sm font-medium text-burgundy transition hover:bg-burgundy/5 disabled:opacity-50"
              >
                {deleting === selectedOrder._id ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Trash2 size={17} />
                )}
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-brown/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-brown/40">
          {label}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-champagne/10 text-champagne">
          {icon}
        </div>
      </div>

      <p className="mt-4 font-display text-3xl text-brown">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium capitalize ${getStatusClass(
        status,
      )}`}
    >
      {status}
    </span>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="flex items-center gap-2 text-brown/40">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>

      <p className="mt-2 wrap-break-word text-sm text-brown">{value}</p>
    </div>
  );
}
