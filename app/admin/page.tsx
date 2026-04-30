'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const ADMIN_PASSWORD = 'Daddy424#';

interface Product {
  _id: string;
  name: string;
  price: number;
  category?: string;
  description: string;
  image: string;
  stock: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('❌ Incorrect password. Try again.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data.data || []);
      setMessage('✓ Products loaded successfully!');
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof Error) {
        setMessage(`❌ Failed to load products: ${error.message}`);
      } else {
        setMessage('❌ Failed to load products');
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      type ProductRequest = FormData | {
        name: string;
        price: number;
        description: string;
        stock: number;
        image: string;
      };
      type HeadersConfig = Record<string, string> | Record<string, never>;

      let data: ProductRequest;
      let headers: HeadersConfig = {};

      if (imageFile) {
        const form = new FormData();
        form.append('name', formData.name);
        form.append('price', formData.price);
        form.append('description', formData.description);
        form.append('stock', formData.stock);
        form.append('imageFile', imageFile);
        data = form;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        data = {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          stock: parseInt(formData.stock),
          image: formData.image,
        };
      }

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, data, { headers });
        setMessage('✓ Product updated successfully!');
      } else {
        await axios.post('/api/products', data, { headers });
        setMessage('✓ Product added successfully!');
      }

      setFormData({ name: '', price: '', description: '', image: '', stock: '' });
      setImageFile(null);
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error: string } }; message?: string };
      setMessage('Error: ' + (axiosError.response?.data?.error || axiosError.message || 'Unknown error'));
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      stock: product.stock.toString(),
    });
    setImageFile(null);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        setMessage('✓ Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      } catch {
        setMessage('Failed to delete product');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setImageFile(null);
    setFormData({ name: '', price: '', description: '', image: '', stock: '' });
  };

  // 🔐 Password Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2 text-center">Admin Access</h1>
          <p className="text-sm text-slate-500 text-center mb-6">Enter your password to continue</p>

          {passwordError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold text-center">
              {passwordError}
            </div>
          )}

          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition"
          >
            Login
          </button>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:underline">
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded font-semibold ${message.includes('✓') ? 'bg-secondary text-white' : 'bg-danger text-white'}`}>
          {message}
        </div>
      )}

      <div className="mb-8">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-blue-600"
          >
            + Add New Product
          </button>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                {imageFile && (
                  <p className="text-sm text-green-700 mt-2">Selected: {imageFile.name}</p>
                )}
                {!imageFile && formData.image && (
                  <p className="text-sm text-gray-600 mt-2">Current: {formData.image}</p>
                )}
              </div>
              <textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
                required
              />
              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded font-semibold hover:bg-blue-600"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-400 text-white py-2 rounded font-semibold hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Product</th>
              <th className="px-6 py-3 text-left font-semibold">Price</th>
              <th className="px-6 py-3 text-left font-semibold">Stock</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-semibold">₦{product.price.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-danger text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-600">
                  No products yet. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p className="font-semibold mb-2">📊 Total Products: {products.length}</p>
        <p>Total Stock: {products.reduce((sum, p) => sum + p.stock, 0)} units</p>
      </div>
    </div>
  );
}