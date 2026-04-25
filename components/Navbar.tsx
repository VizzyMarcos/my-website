"use client";

import { useState } from "react";
import Link from "next/link";
import { cartStore } from "@/lib/store";

export default function Navbar() {
  const { cart } = cartStore();
  const cartCount = cart.length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-current"></span>
              <span className="block h-0.5 w-5 bg-current"></span>
              <span className="block h-0.5 w-5 bg-current"></span>
            </span>
          </button>

          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg text-white shadow-lg shadow-slate-900/15">
              V
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              VicMart
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/products" className="transition hover:text-slate-900">
            Products
          </Link>
          <Link href="/contact" className="transition hover:text-slate-900">
            Contact
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-white transition hover:bg-slate-800"
          >
            Cart
            {cartCount > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-base font-semibold text-slate-700">
            <Link
              href="/products"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Products
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Contact
            </Link>
            <Link
              href="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
