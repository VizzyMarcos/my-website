import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.6fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">V</span>
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900 transition hover:text-blue-600">VicMart</Link>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">VicMart is a modern online store focused on reliable electronic gadgets and everyday tech essentials. We make it easy for customers to browse, compare, and pay securely in one smooth shopping experience.</p>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">S</span>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">Support</h3>
          </div>
          <div className="space-y-3 pl-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-900">T</span>
              <Link href="/track-order" className="text-2xl font-extrabold tracking-tight text-slate-900 transition hover:text-blue-600">Track Order</Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-900">O</span>
              <Link href="/contact" className="text-2xl font-extrabold tracking-tight text-slate-900 transition hover:text-blue-600">Order Assistance</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200/80 px-4 py-5 text-center text-sm text-slate-500">&copy; 2026 VicMart. All rights reserved.</div>
    </footer>
  );
}
