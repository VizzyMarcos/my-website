'use client';

import { cartStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
  description?: string;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = cartStore();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${params.id}`);
      setProduct(response.data.data);
    } catch {
      console.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-[32px] px-6 py-16 text-center">
        <p className="text-lg font-medium text-slate-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-panel rounded-[32px] px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Product not found
        </h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="glass-panel overflow-hidden rounded-[32px]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>

      <div className="glass-panel rounded-[32px] p-6 md:p-8">
        <div className="mb-6 space-y-3 border-b border-slate-200/80 pb-6">
          <p className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {product.category || 'General'}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {product.name}
          </h1>
          <p className="text-base leading-8 text-slate-500">
            {product.description || 'A carefully selected product from the VicMart collection.'}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              Price
            </p>
            <div className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
              N{product.price}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
            In stock: <span className="font-bold text-slate-900">{product.stock}</span>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 text-lg text-slate-600 transition hover:text-slate-900"
            >
              -
            </button>
            <span className="min-w-10 text-center font-bold text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-4 py-2 text-lg text-slate-600 transition hover:text-slate-900"
            >
              +
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Choose quantity before adding to cart.
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className={`button-glow w-full rounded-2xl py-4 font-bold transition duration-300 hover:-translate-y-0.5 ${
            added ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'
          }`}
        >
          {added ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
