'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[28px] shadow-xl shadow-slate-200/80 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white shadow-lg mb-4">
              V
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Forgot password?</h1>
            <p className="text-slate-500 mt-2 text-sm">Enter your email and we'll send you a reset link</p>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm font-semibold text-center">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}