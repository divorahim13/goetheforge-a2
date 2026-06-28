"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, BookOpen, Volume2, PenTool, Mic, 
  GraduationCap, Lightbulb, ClipboardCopy, BarChart3, Home 
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/lesen", label: "Lesen", icon: BookOpen },
  { href: "/horen", label: "Hören", icon: Volume2 },
  { href: "/schreiben", label: "Schreiben", icon: PenTool },
  { href: "/sprechen", label: "Sprechen", icon: Mic },
  { href: "/wortschatz", label: "Wortschatz", icon: GraduationCap },
  { href: "/tips", label: "Tips", icon: Lightbulb },
  { href: "/simulasi", label: "Simulasi", icon: ClipboardCopy },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <span className="w-10 h-10 rounded-xl bg-goethe-purple flex items-center justify-center text-white font-bold text-xl shadow-md shadow-goethe-purple/20 transition-transform group-hover:scale-105">
                GF
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-none group-hover:text-goethe-purple transition-colors">
                  GoetheForge <span className="text-goethe-purple">A2</span>
                </span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">
                  Persiapan Ujian Goethe A2
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-goethe-purple text-white shadow-md shadow-goethe-purple/15"
                      : "text-gray-600 hover:text-goethe-purple hover:bg-goethe-light"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-goethe-purple hover:bg-goethe-light transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-goethe-purple text-white"
                      : "text-gray-600 hover:text-goethe-purple hover:bg-goethe-light"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
