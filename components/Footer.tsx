import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.6fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
              V
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              VicMart
            </span>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            VicMart is a modern online store focused on reliable electronic
            gadgets and everyday tech essentials. We make it easy for customers
            to browse, compare, and pay securely in one smooth shopping
            experience.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">
            Support
          </h3>
          <div className="space-y-3 text-sm font-medium text-slate-600">
            <Link href="/track-order" className="block transition hover:text-blue-600">
              Track Order
            </Link>
            <Link href="/contact" className="block transition hover:text-blue-600">
              Order Assistance
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/80 px-4 py-5 text-center text-sm text-slate-500">
        &copy; 2026 VicMart. All rights reserved.
      </div>
    </footer>
  );
}
