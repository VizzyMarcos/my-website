import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VicMart - Electronic Gadgets Store",
  description: "Buy the best electronic gadgets and accessories online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.className} app-shell text-gray-900`}>
        <Navbar />

        <main className="page-shell min-h-screen">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
