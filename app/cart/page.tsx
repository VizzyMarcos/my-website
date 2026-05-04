'use client';

import { cartStore } from "@/lib/store";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

type PaymentMethod = 'none' | 'paystack';

interface CheckoutUser {
  id: string;
  email: string;
  name?: string;
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = cartStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('none');
  const [statusMessage, setStatusMessage] = useState('');

  // Restore saved checkout details after login redirect
  useEffect(() => {
    const saved = localStorage.getItem('vicmart-checkout');
    if (saved) {
      try {
        const { customer: savedCustomer, paymentMethod: savedMethod } = JSON.parse(saved);
        setCustomer(savedCustomer);
        setPaymentMethod(savedMethod);
      } catch (_) {}
      localStorage.removeItem('vicmart-checkout');
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [cart]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const reference = urlParams.get('reference') || urlParams.get('trxref');
    const canceled = urlParams.get('payment') === 'paystack_cancel';

    if (reference && orderId) {
      axios.post('/api/verify-payment', { orderId, reference })
        .then((response) => {
          if (response.data.success) {
            setStatusMessage(`Payment confirmed. Order ${orderId}.`);
            clearCart();
            return;
          }
          setStatusMessage(`Payment verification failed for order ${orderId}.`);
        })
        .catch((error) => {
          console.error('Failed to verify Paystack payment', error);
          setStatusMessage(`Payment verification failed for order ${orderId}.`);
        });
    } else if (canceled && orderId) {
      axios.patch(`/api/orders/${orderId}`, { paymentStatus: 'failed' })
        .then(() => setStatusMessage(`Payment failed. Order ${orderId}.`))
        .catch((error) => console.error('Failed to update order payment status', error));
    }

    if (orderId || reference || canceled) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [clearCart]);

  const fetchCartItems = async () => {
    try {
      const items: CartItem[] = [];
      for (const cartItem of cart) {
        const response = await axios.get(`/api/products/${cartItem.productId}`);
        items.push({ ...cartItem, product: response.data.data });
      }
      setCartItems(items);
    } catch (error) {
      console.error('Failed to load cart items', error);
    } finally {
      setLoading(false);
    }
  };

  const validCartItems = cartItems.filter((item) => item.product && item.quantity > 0);
  const total = validCartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const saveCheckoutAndRedirectToLogin = () => {
    localStorage.setItem('vicmart-checkout', JSON.stringify({ customer, paymentMethod }));
    localStorage.setItem('vicmart-post-login-redirect', '/cart');
    localStorage.removeItem('vicmart-user');
    window.location.href = '/login?redirect=/cart';
  };

  const getLoggedInUser = async (): Promise<CheckoutUser | null> => {
    try {
      const response = await axios.get('/api/auth/me');
      const savedUser = localStorage.getItem('vicmart-user');
      const localUser = savedUser ? JSON.parse(savedUser) : {};

      return {
        id: response.data.user.id,
        email: response.data.user.email,
        name: localUser.name,
      };
    } catch {
      return null;
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await getLoggedInUser();
    if (!user) {
      saveCheckoutAndRedirectToLogin();
      return;
    }

    if (!customer.name || !customer.email || !customer.phone) {
      setStatusMessage('Please enter customer details');
      return;
    }

    if (validCartItems.length === 0) {
      setStatusMessage('Your cart is empty');
      return;
    }

    try {
      const orderPayload = {
        userId: user.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: validCartItems.map((item) => ({
          productId: item.productId,
          name: item.product?.name,
          image: item.product?.image,
          price: item.product?.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentMethod,
      };

      const orderResult = await axios.post('/api/orders', orderPayload);

      if (!orderResult.data.success) {
        setStatusMessage(`Order creation failed: ${orderResult.data.error}`);
        return;
      }

      const orderId = orderResult.data.data._id;

      if (paymentMethod === 'paystack') {
        const initialize = await axios.post('/api/paystack', {
          email: customer.email,
          amount: total,
          callbackUrl: `${window.location.origin}/cart?orderId=${orderId}`,
          orderId,
        });

        if (!initialize.data.success) {
          setStatusMessage(`Paystack init failed: ${initialize.data.error}`);
          return;
        }

        window.location.href = initialize.data.data.authorization_url;
        return;
      }

      clearCart();
      setStatusMessage('Order created successfully! Payment method: none');
    } catch (error: unknown) {
      const checkoutError =
        axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : error instanceof Error
            ? error.message
            : 'Unknown checkout error';
      setStatusMessage(`Checkout error: ${checkoutError}`);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-[32px] px-6 py-16 text-center">
        <p className="text-lg font-medium text-slate-500">Loading cart...</p>
      </div>
    );
  }

  if (validCartItems.length === 0) {
    return (
      <div className="glass-panel rounded-[32px] px-6 py-16 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
          Your Basket
        </p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900">
          Your cart is empty
        </h1>
        <p className="mb-8 text-slate-500">
          Add a few products first, then come back here to complete your order.
        </p>
        <Link
          href="/products"
          className="inline-flex rounded-full bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-blue-600"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
          Checkout
        </p>
        <h1 className="section-title text-slate-900">Review your order</h1>
        <p className="section-copy max-w-2xl">
          Confirm your products, enter delivery details, and complete payment securely.
        </p>
      </div>

      {statusMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="glass-panel overflow-hidden rounded-[30px]">
          {validCartItems.map((item, index) => (
            <div
              key={item.productId}
              className={`flex flex-col gap-5 p-5 md:flex-row md:items-center md:gap-6 md:p-6 ${
                index !== validCartItems.length - 1 ? 'border-b border-slate-200/80' : ''
              }`}
            >
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="h-28 w-full rounded-2xl object-cover md:w-32"
              />
              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                      {item.product?.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">N{item.product?.price}</p>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">
                    N{((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-4 py-2 text-lg text-slate-600 transition hover:text-slate-900"
                    >-</button>
                    <span className="min-w-10 text-center font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-4 py-2 text-lg text-slate-600 transition hover:text-slate-900"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-sm font-bold text-rose-500 transition hover:text-rose-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel h-fit rounded-[30px] p-6 md:p-7">
          <div className="mb-6 space-y-2 border-b border-slate-200/80 pb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Order Summary</h2>
            <p className="text-sm text-slate-500">Complete your details and choose how you want to pay.</p>
          </div>

          <div className="mb-6 space-y-3 border-b border-slate-200/80 pb-6 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">N{total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">N0.00</span>
            </div>
            <div className="flex items-center justify-between text-base font-extrabold text-slate-900">
              <span>Total</span>
              <span>N{total.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} noValidate className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="none">Pay at pickup</option>
              <option value="paystack">Paystack</option>
            </select>

            <button
              type="submit"
              className="button-glow w-full rounded-2xl bg-slate-900 py-3.5 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600"
            >
              Complete Checkout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
