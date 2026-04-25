'use client';

import { useState, useEffect } from 'react';
import ProductCard from "@/components/ProductCard";
import axios from 'axios';

interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      const productsData = response.data.data || [];
      setProducts(productsData);
    } catch {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="glass-panel rounded-[32px] px-6 py-16 text-center">
        <p className="text-lg font-medium text-slate-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
          Product Catalog
        </p>
        <h1 className="section-title text-slate-900">Explore our latest collection</h1>
        <p className="section-copy max-w-2xl">
          Search through featured gadgets, filter by category, and find the right fit quickly.
        </p>
      </div>

      <div className="glass-panel rounded-[30px] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <p className="mt-3 text-sm text-slate-500">
              Found {filtered.length} products
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={{ ...product, id: product._id }} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[30px] px-6 py-16 text-center">
          <p className="text-lg text-slate-500">
            No products found. Try a different search or category.
          </p>
        </div>
      )}
    </div>
  );
}
