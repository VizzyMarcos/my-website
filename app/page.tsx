import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export const revalidate = 0;

interface HomeProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
  description?: string;
}

async function getProducts(): Promise<HomeProduct[]> {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(6).lean().exec();
    const typedProducts = products as Array<{
      _id: { toString(): string };
      name: string;
      price: number;
      image: string;
      stock: number;
      category?: string;
      description?: string;
    }>;

    return typedProducts.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category,
      description: product.description,
    }));
  } catch {
    console.log("Using demo products - MongoDB not connected");
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[36px] bg-slate-900 px-6 py-10 text-white shadow-2xl shadow-slate-300/50 md:px-10 md:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <p className="w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-200">
              Trusted Electronics Store
            </p>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
                Shop smarter with premium gadgets that fit real life.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                Discover dependable laptops, accessories, and everyday tech in
                a storefront built for speed, trust, and secure payments.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="button-glow rounded-full bg-white px-6 py-3 font-bold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Browse Products
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                Fast Checkout
              </p>
              <p className="mt-2 text-3xl font-extrabold">Paystack Live</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                Product Focus
              </p>
              <p className="mt-2 text-3xl font-extrabold">Smart Tech</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                Customer Promise
              </p>
              <p className="mt-2 text-3xl font-extrabold">Secure Orders</p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[32px] p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Featured Collection
            </p>
            <h2 className="section-title text-slate-900">
              Popular products ready to order
            </h2>
          </div>
          <p className="max-w-2xl section-copy text-sm md:text-base">
            A curated mix of products customers can browse quickly and purchase
            with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products && products.length > 0 ? (
            products.map((product: HomeProduct) => (
              <ProductCard
                key={product._id}
                product={{ ...product, id: product._id }}
              />
            ))
          ) : (
            <div className="col-span-full rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <p className="text-base text-slate-600">
                No products available yet. Visit{" "}
                <Link href="/admin" className="font-bold text-blue-600">
                  /admin
                </Link>{" "}
                to add products.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-block rounded-full bg-slate-900 px-8 py-3 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600"
          >
            View All Products →
          </Link>
        </div>
      </section>
    </div>
  );
}