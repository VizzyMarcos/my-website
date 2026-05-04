'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { cartStore } from '@/lib/store';

export default function CartNotice() {
  const { cart, lastAddedProduct, dismissCartNotice } = cartStore();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (!lastAddedProduct) return;

    const timer = window.setTimeout(() => {
      dismissCartNotice();
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [lastAddedProduct, dismissCartNotice]);

  if (!lastAddedProduct) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:bottom-5 sm:left-auto sm:right-5 sm:max-w-sm sm:px-0 sm:pb-0">
      <div className="overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:rounded-3xl">
        <div className="flex items-start gap-3 border-b border-slate-100 p-4">
          <img
            src={lastAddedProduct.image}
            alt={lastAddedProduct.name}
            className="h-16 w-16 rounded-2xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-emerald-600">Added to cart</p>
            <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-slate-900">
              {lastAddedProduct.name}
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Qty: {lastAddedProduct.quantity} | Cart: {cartCount} item{cartCount === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={dismissCartNotice}
            aria-label="Close cart notification"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          >
            x
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          <button
            type="button"
            onClick={dismissCartNotice}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Keep shopping
          </button>
          <Link
            href="/cart"
            onClick={dismissCartNotice}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-600"
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}
