"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, BookOpen, Volume2, PenTool, Mic, 
  GraduationCap, Lightbulb, ClipboardCopy, BarChart3, Home, Globe 
} from "lucide-react";
import { getSettings, saveSettings } from "@/lib/db";

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
  const [level, setLevel] = useState<"A2" | "B1">("A2");
  const pathname = usePathname() || "";

  useEffect(() => {
    const settings = getSettings();
    if (settings.level) {
      setLevel(settings.level);
    }
  }, []);

  const getHref = (href: string) => {
    if (level === "B1") {
      if (href === "/") return "/b1";
      return `/b1${href}`;
    }
    return href;
  };

  const handleLevelChange = (newLevel: "A2" | "B1") => {
    setLevel(newLevel);
    const settings = getSettings();
    settings.level = newLevel;
    saveSettings(settings);
    
    // Determine redirect url
    let targetPath = "/";
    if (newLevel === "B1") {
      if (pathname.startsWith("/lesen")) targetPath = "/b1/lesen";
      else if (pathname.startsWith("/horen")) targetPath = "/b1/horen";
      else if (pathname.startsWith("/schreiben")) targetPath = "/b1/schreiben";
      else if (pathname.startsWith("/sprechen")) targetPath = "/b1/sprechen";
      else if (pathname.startsWith("/simulasi")) targetPath = "/b1/simulasi";
      else targetPath = "/b1";
    } else {
      if (pathname.startsWith("/b1/lesen")) targetPath = "/lesen";
      else if (pathname.startsWith("/b1/horen")) targetPath = "/horen";
      else if (pathname.startsWith("/b1/schreiben")) targetPath = "/schreiben";
      else if (pathname.startsWith("/b1/sprechen")) targetPath = "/sprechen";
      else if (pathname.startsWith("/b1/simulasi")) targetPath = "/simulasi";
      else targetPath = "/";
    }
    window.location.href = targetPath;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href={level === "B1" ? "/b1" : "/"} className="flex items-center gap-2 cursor-pointer group">
              <span className="w-10 h-10 rounded-xl bg-goethe-purple flex items-center justify-center text-white font-bold text-xl shadow-md shadow-goethe-purple/20 transition-transform group-hover:scale-105">
                GF
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-none group-hover:text-goethe-purple transition-colors">
                  GoetheForge <span className="text-goethe-purple">{level}</span>
                </span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">
                  Persiapan Ujian Goethe {level}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1 mr-2 border-r border-gray-100 pr-3">
              {/* Level Selector Toggle */}
              <div className="bg-gray-100 p-0.5 rounded-xl flex gap-0.5 text-xs font-bold">
                <button
                  onClick={() => handleLevelChange("A2")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    level === "A2"
                      ? "bg-goethe-purple text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Goethe A2
                </button>
                <button
                  onClick={() => handleLevelChange("B1")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    level === "B1"
                      ? "bg-goethe-purple text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Goethe B1
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const targetHref = getHref(item.href);
                const isActive = pathname === targetHref || (targetHref !== "/" && targetHref !== "/b1" && pathname?.startsWith(targetHref));
                return (
                  <Link
                    key={item.href}
                    href={targetHref}
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
          </div>

          {/* Mobile Control and Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Level selector on mobile header */}
            <select
              value={level}
              onChange={(e) => handleLevelChange(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-goethe-purple focus:outline-none"
            >
              <option value="A2">Goethe A2</option>
              <option value="B1">Goethe B1</option>
            </select>

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
              const targetHref = getHref(item.href);
              const isActive = pathname === targetHref || (targetHref !== "/" && targetHref !== "/b1" && pathname?.startsWith(targetHref));
              return (
                <Link
                  key={item.href}
                  href={targetHref}
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
