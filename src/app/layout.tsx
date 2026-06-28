import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoetheForge A2 - Persiapan Ujian Goethe-Zertifikat A2",
  description: "Platform latihan interaktif untuk mempersiapkan ujian Goethe-Zertifikat A2 dengan simulasi Lesen, Hören, Schreiben, Sprechen, dan latihan Wortschatz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-sans bg-bg-gray text-gray-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-bold text-gray-700">GoetheForge A2</p>
            <p className="mt-1">Aplikasi Persiapan Mandiri Ujian Goethe-Zertifikat A2 (Bilingual Jerman/Indonesia)</p>
            <p className="mt-4 text-xs text-gray-400">&copy; {new Date().getFullYear()} GoetheForge A2. Tidak terafiliasi dengan Goethe-Institut.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
