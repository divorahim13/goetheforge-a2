"use client";

import React, { useState } from "react";
import { 
  Lightbulb, BookOpen, Volume2, PenTool, Mic, 
  ChevronRight, Info, AlertTriangle, ArrowRight, HelpCircle 
} from "lucide-react";

export default function TipsPage() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>("lesen");

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-1">
        <div className="flex items-center gap-2 text-goethe-purple">
          <Lightbulb className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-wide">Tips & Strategi</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 font-sans">Strategi & Kunci Kelulusan Ujian</h1>
        <p className="text-xs text-gray-500 font-medium">Pelajari tips praktis, contoh jebakan umum, dan contoh percakapan model untuk meraih skor tinggi di ujian Goethe A2.</p>
      </div>

      {/* Accordions Wrapper */}
      <div className="space-y-4">
        
        {/* ========================================== */}
        {/* LESEN TIPS */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion("lesen")}
            className="w-full flex items-center justify-between p-5 font-bold text-gray-900 hover:text-goethe-purple transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base">LESEN TIPS — Strategi Membaca</h3>
                <p className="text-[10px] text-gray-400 font-medium">5 Strategi per Teil • Pola Kesalahan • Contoh Jebakan</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${activeAccordion === "lesen" ? "rotate-90 text-goethe-purple" : "text-gray-400"}`} />
          </button>

          {activeAccordion === "lesen" && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-6 text-xs text-gray-600 leading-relaxed animate-in slide-in-from-top duration-200">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200 pb-1 uppercase">Strategi per Teil</h4>
                  <ul className="list-decimal pl-5 space-y-2">
                    <li><strong className="text-gray-700">Teil 1 (Pengumuman):</strong> Jangan baca seluruh teks kata per kata dulu. Baca pertanyaannya dulu, lalu cari kata kunci (Keywords) di teks.</li>
                    <li><strong className="text-gray-700">Teil 2 (Papan Informasi):</strong> Pahami situasi orang tersebut dengan baik. Jika ia ingin "Pizzabrötchen", ia mencari toko roti (Bäckerei) atau restoran Italia, bukan toko sepatu. Jika tidak ada yang cocok, pilih "Anderer Stock".</li>
                    <li><strong className="text-gray-700">Teil 3 (Email/Surat):</strong> Perhatikan pengirim, penerima, dan preposisi waktu. Sering kali ada janji temu yang digeser (dari Kamis ke Sabtu). Jawaban benar adalah waktu baru.</li>
                    <li><strong className="text-gray-700">Teil 4 (Zuordnen/Menjodohkan):</strong> Jodohkan 6 iklan dengan 5 orang. Selalu ada 1 orang yang TIDAK memiliki iklan yang cocok (pilih X). Coret iklan yang sudah pasti terpakai.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200 pb-1 uppercase">Pola Kesalahan Umum</h4>
                  <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-3">
                    <p className="flex items-start gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /><span><strong>Asosiasi Kata Instan:</strong> Memilih jawaban hanya karena kata di pilihan ganda ada di teks. Ingat: kata yang sama persis biasanya adalah jebakan.</span></p>
                    <p className="flex items-start gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /><span><strong>Lupa Memilih X:</strong> Di Teil 4, selalu ada satu kandidat yang tidak mendapatkan iklan. Jangan memaksakan iklan yang mirip jika tidak cocok 100%.</span></p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* HÖREN TIPS */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion("horen")}
            className="w-full flex items-center justify-between p-5 font-bold text-gray-900 hover:text-goethe-purple transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base">HÖREN TIPS — Strategi Mendengar</h3>
                <p className="text-[10px] text-gray-400 font-medium">10 Pengecoh • Metode Coret Tabel • Cara Membaca Soal</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${activeAccordion === "horen" ? "rotate-90 text-goethe-purple" : "text-gray-400"}`} />
          </button>

          {activeAccordion === "horen" && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-6 text-xs text-gray-600 leading-relaxed animate-in slide-in-from-top duration-200">
              
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200 pb-1 uppercase">Teknik Mini-Tabel untuk Teil 2</h4>
                <p>Teil 2 hanya diputar <strong>1 kali</strong> dan menanyakan hobi dari 5 orang. Sering kali pembicara berbicara cepat. Sebelum audio dimulai, buatlah catatan kecil coret-coretan nama di kertas coretan ujian Anda:</p>
                <div className="p-4 bg-white rounded-xl border border-gray-100 font-mono text-[11px] max-w-md space-y-2">
                  <p>Schröder: <span className="text-gray-400">...</span> &rarr; <span className="text-success font-bold">Wandern (a)</span></p>
                  <p>Krause: <span className="text-gray-400">...</span> &rarr; <span className="text-success font-bold">Musik (b)</span></p>
                  <p>Müller: <span className="text-gray-400">...</span> &rarr; <span className="text-success font-bold">Kochen (c)</span></p>
                  <p className="text-gray-400">Coret opsi yang sudah pasti terpakai agar konsentrasi tidak terpecah!</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800 text-xs uppercase">Cara Membaca Soal Sebelum Audio</h4>
                  <p>Gunakan jeda waktu 5–10 detik sebelum audio berbunyi untuk membaca pernyataan atau pilihan ganda. Jangan melamun! Garis bawahi kata tanya utama (W-Fragen: Wann, Wo, Wie viel).</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800 text-xs uppercase">Jebakan Paling Sering: Perubahan Opini</h4>
                  <p>Narasumber sering mengucapkan: <em>"Ich wollte zuerst ein Hemd kaufen... aber am Ende habe ich einen Pullover genommen."</em> (Saya awalnya ingin beli kemeja... tapi akhirnya beli pulover). Jawaban benar adalah pulover.</p>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* SCHREIBEN TIPS */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion("schreiben")}
            className="w-full flex items-center justify-between p-5 font-bold text-gray-900 hover:text-goethe-purple transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base">SCHREIBEN TIPS — Strategi Menulis</h3>
                <p className="text-[10px] text-gray-400 font-medium">Salam Pembuka & Penutup • Contoh Jawaban A-Level vs C-Level</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${activeAccordion === "schreiben" ? "rotate-90 text-goethe-purple" : "text-gray-400"}`} />
          </button>

          {activeAccordion === "schreiben" && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-6 text-xs text-gray-600 leading-relaxed animate-in slide-in-from-top duration-200">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Templates table */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200 pb-1 uppercase">Struktur Wajib Menulis</h4>
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="font-bold text-goethe-purple">Teil 1 (SMS kepada Teman - Informal):</span>
                      <p className="mt-1">Pembuka: <em>Lieber Christian, / Liebe Sarah,</em></p>
                      <p>Penutup: <em>Viele Grüße / Dein(e) [Nama]</em></p>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                      <span className="font-bold text-goethe-purple">Teil 2 (Email Formal):</span>
                      <p className="mt-1">Pembuka: <em>Sehr geehrte Damen und Herren,</em></p>
                      <p>Penutup: <em>Mit freundlichen Grüßen,</em></p>
                    </div>
                  </div>
                </div>

                {/* Score comparison */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200 pb-1 uppercase">Bandingkan Jawaban</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-[11px]">
                      <span className="font-bold text-error block">C-Level Response (Banyak Kesalahan):</span>
                      <p className="italic">"Hallo Herr Wagner. Ich will Wohnung. Ich habe ein Frau. Wann kann kucken? Gruß Budi."</p>
                      <p className="text-gray-500 mt-1 font-medium">&rarr; Tidak sopan untuk formal, tata bahasa salah (kucken diganti besichtigen), tanpa salam penutup formal.</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-[11px]">
                      <span className="font-bold text-success block">A-Level Response (Sempurna A2):</span>
                      <p className="italic">"Sehr geehrter Herr Wagner, ich interessiere mich für Ihre Wohnung. Ich möchte gerne mit meiner Frau einziehen. Wann ist eine Besichtigung möglich? Mit freundlichen Grüßen, Budi."</p>
                      <p className="text-gray-500 mt-1 font-medium">&rarr; Sangat sopan, kosakata tepat, menjawab poin wajib dengan tata bahasa yang benar.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* SPRECHEN TIPS */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleAccordion("sprechen")}
            className="w-full flex items-center justify-between p-5 font-bold text-gray-900 hover:text-goethe-purple transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base">SPRECHEN TIPS — Strategi Berbicara</h3>
                <p className="text-[10px] text-gray-400 font-medium">Negosiasi Teil 3 • Rumus Menolak & Menyetujui • Atasi Lupa Kata</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-250 ${activeAccordion === "sprechen" ? "rotate-90 text-goethe-purple" : "text-gray-400"}`} />
          </button>

          {activeAccordion === "sprechen" && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-6 text-xs text-gray-600 leading-relaxed animate-in slide-in-from-top duration-200">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200 pb-1 uppercase">Kunci Negosiasi Ujian (Teil 3)</h4>
                  <p>Saat Anda dan partner bernegosiasi mencari waktu luang yang sama:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Jangan hanya diam menunggu partner berbicara. Mulailah mengusulkan waktu: <em>"Hast du am Samstag Zeit?"</em></li>
                    <li>Jika partner menolak, <span className="font-bold text-error">jangan langsung setuju</span> tanpa memeriksa jadwal. Katakan alasan berhalangan Anda sendiri dan tawarkan opsi alternatif.</li>
                    <li>Ingat: Kunci kelulusan Teil 3 adalah terjadinya <strong>kesepakatan waktu</strong> di akhir percakapan.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs border-b border-gray-200 pb-1 uppercase">Bagaimana Jika Lupa Kata? (Rescue Phrases)</h4>
                  <p>Jika di tengah ujian Anda lupa suatu kata dalam bahasa Jerman, jangan panik atau diam membisu. Gunakan kalimat penolong berikut:</p>
                  <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1 font-sans italic">
                    <p>"Wie sagt man das auf Deutsch?" <span className="text-gray-400 not-italic font-medium">(Bagaimana menyebutnya dalam bahasa Jerman?)</span></p>
                    <p>"Ich habe das Wort vergessen. Ich meine..." <span className="text-gray-400 not-italic font-medium">(Saya lupa katanya. Maksud saya...)</span></p>
                    <p>"Können Sie das bitte wiederholen?" <span className="text-gray-400 not-italic font-medium">(Bisakah Anda mengulanginya?)</span></p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
