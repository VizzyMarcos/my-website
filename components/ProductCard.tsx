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
    <div className="group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/80">
      <div className="overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-5">
        <p className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          {product.category || "General"}
        </p>

        <div className="space-y-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900 transition hover:text-blue-600">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-slate-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            N{product.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`button-glow w-full rounded-2xl px-4 py-3 font-bold transition duration-300 hover:-translate-y-0.5 ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 text-white hover:bg-blue-600"
          }`}
        >
          {added ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
