'use client';

import { useState } from "react";
import Link from "next/link";
import { cartStore } from "@/lib/store";

interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = cartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product.id.toString(), 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
      
      {/* Smaller Image */}
      <div className="overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-2 p-4">
        
        {/* Category Badge */}
        <p className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {product.category || "General"}
        </p>

        {/* Name & Stock */}
        <div className="space-y-0.5">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-base font-extrabold tracking-tight text-slate-900 transition hover:text-blue-600">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-400">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>

        {/* Price */}
        <span className="block text-lg font-extrabold tracking-tight text-slate-900">
          ₦{product.price.toLocaleString()}
        </span>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`button-glow w-full rounded-xl px-4 py-2.5 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${
            added
              ? "bg-emerald-600 text-white"
              : product.stock === 0
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-blue-600"
          }`}
        >
          {added ? "✓ Added" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}