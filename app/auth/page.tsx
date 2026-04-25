'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface UserState {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vicmart-user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('vicmart-user');
    setUser(null);
    setMessage('Logged out successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          setUser(response.data.data);
          localStorage.setItem('vicmart-user', JSON.stringify(response.data.data));
          setMessage(`✓ Welcome back, ${response.data.data.name}!`);
        } else {
          setMessage(`❌ ${response.data.error}`);
        }
      } else {
        const response = await axios.post('/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          setMessage(`✓ Account created: ${response.data.data.name}. Please log in.`);
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '' });
        } else {
          setMessage(`❌ ${response.data.error}`);
        }
      }
    } catch (error: any) {
      setMessage(`❌ ${error?.response?.data?.error || error.message || 'Server error'}`);
    }

    setTimeout(() => setMessage(''), 5000);
  };

  if (user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Hello, {user.name}</h1>
          <p className="text-gray-700 mb-4">Email: {user.email}</p>
          <p className="text-gray-700 mb-4">Role: {user.role}</p>
          <button onClick={logout} className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-blue-600 transition">
            Logout
          </button>
          <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-primary">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? 'Login to VicMart' : 'Create Account'}
        </h1>

        {message && (
          <div className="mb-4 p-3 bg-secondary text-white rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required={!isLogin}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <button type="submit" className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-blue-600 transition">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">{isLogin ? "Don't have an account?" : 'Already have an account?'}</p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ name: '', email: '', password: '' });
            }}
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>

        <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
