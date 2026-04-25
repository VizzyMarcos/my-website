import Link from "next/link";

const previews = [
  {
    title: "Subtle Card Hover",
    tag: "Best for stores",
    description:
      "Product cards lift gently with a soft shadow and image zoom. It feels polished without distracting from shopping.",
    className:
      "group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/80",
    demo: (
      <div className="space-y-4 p-4">
        <div className="overflow-hidden rounded-[20px] bg-slate-100">
          <div className="h-44 w-full bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.28),_transparent_35%),linear-gradient(135deg,_#dbeafe,_#f8fafc)] transition duration-500 group-hover:scale-105" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-24 rounded-full bg-slate-100" />
          <div className="h-6 w-40 rounded-full bg-slate-200" />
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 rounded-full bg-slate-900/90" />
            <div className="h-3 w-16 rounded-full bg-slate-100" />
          </div>
          <div className="h-11 rounded-2xl bg-slate-900 transition group-hover:bg-blue-600" />
        </div>
      </div>
    ),
  },
  {
    title: "Elegant Button Glow",
    tag: "Good accent",
    description:
      "Primary buttons carry a soft glow and richer hover state. This adds personality while keeping the page clean.",
    className:
      "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
    demo: (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-6 rounded-[20px] bg-[linear-gradient(180deg,_#ffffff,_#f8fafc)]">
        <div className="h-7 w-40 rounded-full bg-slate-200" />
        <button className="rounded-full bg-slate-900 px-8 py-4 font-bold text-white shadow-[0_0_0_0_rgba(37,99,235,0.45)] transition duration-300 hover:bg-blue-600 hover:shadow-[0_18px_45px_-12px_rgba(37,99,235,0.55)]">
          Shop Now
        </button>
        <div className="h-3 w-52 rounded-full bg-slate-100" />
      </div>
    ),
  },
  {
    title: "Soft Entrance Animations",
    tag: "Modern feel",
    description:
      "Sections fade upward into place with light stagger. It makes the site feel alive without looking noisy.",
    className:
      "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
    demo: (
      <div className="grid min-h-[320px] content-center gap-4 rounded-[20px] bg-[linear-gradient(180deg,_#f8fafc,_#ffffff)] p-6">
        <div className="animate-[fadeUp_1.1s_ease_forwards] rounded-2xl bg-slate-900 p-5 opacity-0 [animation-delay:0.05s]">
          <div className="h-4 w-24 rounded-full bg-white/20" />
        </div>
        <div className="animate-[fadeUp_1.1s_ease_forwards] rounded-2xl bg-slate-100 p-5 opacity-0 [animation-delay:0.2s]">
          <div className="h-4 w-32 rounded-full bg-slate-300" />
        </div>
        <div className="animate-[fadeUp_1.1s_ease_forwards] rounded-2xl bg-blue-50 p-5 opacity-0 [animation-delay:0.35s]">
          <div className="h-4 w-28 rounded-full bg-blue-200" />
        </div>
      </div>
    ),
  },
  {
    title: "Premium Loading Effect",
    tag: "Nice extra",
    description:
      "A refined skeleton shimmer gives the site a stronger first impression while content loads.",
    className:
      "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm",
    demo: (
      <div className="space-y-4 rounded-[20px] bg-[linear-gradient(180deg,_#ffffff,_#f8fafc)] p-4">
        <div className="h-40 rounded-2xl bg-[linear-gradient(110deg,_#e2e8f0_8%,_#f8fafc_18%,_#e2e8f0_33%)] bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />
        <div className="h-4 w-24 rounded-full bg-[linear-gradient(110deg,_#e2e8f0_8%,_#f8fafc_18%,_#e2e8f0_33%)] bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />
        <div className="h-6 w-40 rounded-full bg-[linear-gradient(110deg,_#e2e8f0_8%,_#f8fafc_18%,_#e2e8f0_33%)] bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />
        <div className="h-11 rounded-2xl bg-[linear-gradient(110deg,_#e2e8f0_8%,_#f8fafc_18%,_#e2e8f0_33%)] bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />
      </div>
    ),
  },
];

export default function StylePreviewPage() {
  return (
    <div className="space-y-8">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="overflow-hidden rounded-[36px] bg-slate-900 px-6 py-10 text-white shadow-2xl shadow-slate-300/50 md:px-10 md:py-14">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
          Visual Options
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Choose the effect style you want for VicMart
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          These are visual previews so you can compare the styles before I add one
          to the real website.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
          >
            Back to Home
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {previews.map((preview) => (
          <article key={preview.title} className={preview.className}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  {preview.tag}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                  {preview.title}
                </h2>
              </div>
            </div>
            <p className="mb-6 text-sm leading-7 text-slate-600">
              {preview.description}
            </p>
            {preview.demo}
          </article>
        ))}
      </section>

      <section className="glass-panel rounded-[30px] p-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Best recommendation
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
          For your store, I recommend a combination of <strong>Subtle Card Hover</strong>
          {" "}plus <strong>Elegant Button Glow</strong>. It keeps the site premium,
          trustworthy, and unique without making checkout feel playful or distracting.
        </p>
      </section>
    </div>
  );
}
