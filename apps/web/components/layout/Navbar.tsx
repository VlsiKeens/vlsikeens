"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Courses", href: "#learning-paths" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
            VK
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              VLSIKeens
            </h1>
            <p className="-mt-1 text-xs text-slate-500">
              Learn • Build • Succeed
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-medium text-slate-700 transition-colors hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link
            href="/book-session"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Book Session
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-700 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white shadow-lg lg:hidden">
          <div className="flex flex-col p-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="py-3 font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/book-session"
              className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Book Session
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
