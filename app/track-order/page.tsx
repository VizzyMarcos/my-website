"use client";

import { FormEvent, useState } from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: "none" | "paystack";
  paymentStatus: "pending" | "paid" | "failed";
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

function getOrderStatus(paymentStatus: Order["paymentStatus"]) {
  if (paymentStatus === "paid") return "Order confirmed";
  if (paymentStatus === "failed") return "Payment failed";
  return "Awaiting payment";
}

function formatCurrency(value: number) {
  return `N${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const search = query.trim();

    if (!search) {
      setMessage("Enter your order ID or email address.");
      return;
    }

    setLoading(true);
    setMessage("");
    setOrders([]);

    try {
      const endpoint = search.includes("@")
        ? `/api/orders?email=${encodeURIComponent(search)}`
        : `/api/orders/${encodeURIComponent(search)}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.error || "No order found.");
        return;
      }

      const foundOrders = Array.isArray(data.data) ? data.data : [data.data];
      setOrders(foundOrders);

      if (foundOrders.length === 0) {
        setMessage("No orders found for those details.");
      }
    } catch {
      setMessage("Unable to check order right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-300/50 md:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
            Order Tracking
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
            Check your VicMart order status.
          </h1>
          <p className="max-w-lg text-base leading-8 text-slate-300">
            Enter the email used at checkout or paste your order ID to see the
            latest payment and order status.
          </p>
        </div>

        <div className="glass-panel rounded-[32px] p-6 md:p-8">
          <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-slate-900">
            Find your order
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Email address or order ID"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="button-glow w-full rounded-2xl bg-slate-900 py-3.5 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Track Order"}
            </button>
          </form>
          {message && (
            <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              {message}
            </p>
          )}
        </div>
      </section>

      {orders.length > 0 && (
        <section className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass-panel rounded-[28px] p-5 md:p-6">
              <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    {getOrderStatus(order.paymentStatus)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Placed by {order.customerName} on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                  {order.paymentMethod === "paystack" ? "Paystack" : "Pay at pickup"} | {order.paymentStatus}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {order.items.map((item, index) => (
                  <div key={`${order._id}-${index}`} className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-slate-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200/80 pt-5 text-base font-extrabold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
