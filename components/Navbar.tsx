"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cartStore } from "@/lib/store";

export default function Navbar() {
  const { cart } = cartStore();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

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

          <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg text-white shadow-lg shadow-slate-900/15">
              V
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              VicMart
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden items-center gap-3 text-sm font-semibold md:flex">
          <Link
            href="/products"
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-white transition ${
              isActive('/products')
                ? 'bg-blue-600 shadow-lg shadow-blue-200'
                : 'bg-slate-900 hover:bg-blue-600'
            }`}
          >
            Products
          </Link>
          <Link
            href="/contact"
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-white transition ${
              isActive('/contact')
                ? 'bg-blue-600 shadow-lg shadow-blue-200'
                : 'bg-slate-900 hover:bg-blue-600'
            }`}
          >
            Contact
          </Link>
          <Link
            href="/cart"
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-white transition ${
              isActive('/cart')
                ? 'bg-blue-600 shadow-lg shadow-blue-200'
                : 'bg-slate-900 hover:bg-blue-600'
            }`}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-base font-semibold">
            <Link
              href="/products"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 transition ${
                isActive('/products')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Products
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 transition ${
                isActive('/contact')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Contact
            </Link>
            <Link
              href="/cart"
              onClick={closeMenu}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-white transition ${
                isActive('/cart')
                  ? 'bg-blue-600'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
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
