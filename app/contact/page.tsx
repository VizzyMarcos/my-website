"use client";

import { ChangeEvent, FormEvent, useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      alert(data.message || "Message sent successfully!");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="overflow-hidden rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-300/50 md:p-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
          Contact VicMart
        </p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
          We are here to help you buy with confidence.
        </h1>
        <p className="max-w-lg text-base leading-8 text-slate-300">
          Reach out for product questions, payment assistance, or order support.
          We respond as quickly as possible and keep communication simple.
        </p>

        <div className="mt-10 space-y-5 text-sm text-slate-200">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              Phone
            </p>
            <p className="mt-2 text-base font-semibold">+234 816 616 9609</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              WhatsApp
            </p>
            <a
              href="https://wa.me/2348166169609"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-base font-semibold text-white underline-offset-4 hover:underline"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              Email
            </p>
            <p className="mt-2 text-base font-semibold">
              chigbuvictor837@gmail.com
            </p>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[32px] p-6 md:p-8">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            Send a message
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Tell us what you need
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            required
          />

          <button
            type="submit"
            className="button-glow w-full rounded-2xl bg-slate-900 py-3.5 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
