'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function TestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing API connection...');
    try {
      const response = await axios.get('/api/products');
      setResult(`✓ SUCCESS! API is working.\n\nResponse: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ API ERROR:\n\n${error.message}\n\nDetails: ${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const addTestProduct = async () => {
    setLoading(true);
    setResult('Adding test product...');
    try {
      const response = await axios.post('/api/products', {
        name: 'Test Product',
        price: 29.99,
        category: 'accessories',
        description: 'This is a test product',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        stock: 10,
      });
      setResult(`✓ SUCCESS! Product added.\n\n${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ ERROR adding product:\n\n${error.message}\n\nDetails: ${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>

      <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg mb-6">
        <p className="font-semibold mb-2">🔧 Troubleshooting Steps:</p>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>Check if MongoDB is running: <code className="bg-gray-200 px-2 py-1">net start MongoDB</code></li>
          <li>Verify <code className="bg-gray-200 px-2 py-1">.env.local</code> exists in project root</li>
          <li>Check browser console for errors (F12)</li>
          <li>Check terminal where you ran <code className="bg-gray-200 px-2 py-1">npm run dev</code></li>
          <li>Restart the dev server</li>
        </ol>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Quick Tests</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
          <button
            onClick={addTestProduct}
            disabled={loading}
            className="bg-secondary text-white px-4 py-2 rounded font-semibold hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Test Product'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto max-h-96 bg-white p-3 rounded border whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}

      <Link href="/admin" className="block mt-6 text-primary font-semibold hover:underline">
        ← Back to Admin
      </Link>
    </div>
  );
}
