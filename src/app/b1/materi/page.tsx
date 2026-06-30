"use client";

import React, { useState } from "react";
import { 
  GraduationCap, BookOpen, PenTool, Mic, HelpCircle, 
  ChevronRight, Sparkles, AlertCircle, ArrowLeft, BookOpenCheck
} from "lucide-react";
import Link from "next/link";

export default function B1MateriPage() {
  const [activeTab, setActiveTab] = useState<"grammar" | "vocab" | "redemittel" | "strategies">("grammar");

  const grammarTopics = [
    {
      title: "Anak Kalimat: obwohl, da, seitdem",
      desc: "Menghubungkan anak kalimat subordinatif B1 dengan posisi verba di akhir kalimat.",
      example: "• obwohl (meskipun): Ich gehe spazieren, obwohl es regnet.\n• da (karena/karena alasan logis): Da ich krank bin, bleibe ich im Bett.\n• seitdem (sejak): Seitdem ich in Deutschland wohne, spreche ich besser Deutsch."
    },
    {
      title: "Konjunktiv II (Pengandaian & Kesopanan)",
      desc: "Menyatakan harapan, penyesalan, atau kalimat bersyarat secara halus dan sopan. Menggunakan wörte: wäre, hätte, atau würde + Infinitiv.",
      example: "• Sopan: Könnten Sie mir bitte helfen? (Bisa bantu saya?)\n• Harapan: Wenn ich reich wäre, würde ich eine Weltreise machen."
    },
    {
      title: "Infinitiv mit 'zu' (Konstruksi Infinitif)",
      desc: "Menggabungkan dua kalimat di mana verba di kalimat kedua berada dalam bentuk dasar (Infinitiv) diawali partikel 'zu'.",
      example: "• Ich habe keine Zeit, heute ins Kino zu gehen.\n• Es ist verboten, hier das Auto zu parken."
    },
    {
      title: "Passiv (Kalimat Pasif)",
      desc: "Menekankan tindakan atau objek tindakan dibanding pelaku tindakan itu sendiri. Dibentuk dengan werden + Partizip II.",
      example: "• Präsens: Das Haus wird renoviert (Rumah sedang direnovasi).\n• Präteritum: Das Haus wurde gestern renoviert (Rumah kemarin direnovasi)."
    }
  ];

  const vocabTopics = [
    {
      category: "Umwelt & Klimaschutz (Lingkungan B1)",
      items: [
        { de: "der Umweltschutz", id: "Perlindungan lingkungan" },
        { de: "der Müll trennen", id: "Memisahkan sampah" },
        { de: "die Energie sparen", id: "Menghemat energi" },
        { de: "umweltfreundlich", id: "Ramah lingkungan" }
      ]
    },
    {
      category: "Medien & Technologie (Teknologi)",
      items: [
        { de: "die sozialen Netzwerke (Pl.)", id: "Jejaring sosial / Medsos" },
        { de: "im Internet recherchieren", id: "Mencari informasi di internet" },
        { de: "die Digitalisierung", id: "Digitalisasi" },
        { de: "das Smartphone nutzen", id: "Menggunakan ponsel pintar" }
      ]
    },
    {
      category: "Konsum & Einkaufen (Konsumsi)",
      items: [
        { de: "die Werbung, -en", id: "Iklan" },
        { de: "online einkaufen", id: "Belanja online" },
        { de: "die Verpackung, -en", id: "Kemasan" },
        { de: "das Angebot, -e", id: "Penawaran / Promo" }
      ]
    }
  ];

  const redemittelTopics = [
    {
      title: "Membuka Presentasi B1 (Einleitung)",
      sentences: [
        "Das Thema meiner Präsentation lautet...",
        "Ich möchte Ihnen heute folgendes Thema vorstellen...",
        "Meine Präsentation besteht aus folgenden Teilen..."
      ]
    },
    {
      title: "Vor- und Nachteile (Pro & Kontra)",
      sentences: [
        "Ein großer Vorteil von... ist, dass...",
        "Auf der anderen Seite gibt es auch Nachteile, zum Beispiel...",
        "Man muss auch bedenken, dass..."
      ]
    },
    {
      title: "Mengutarakan Opini / Menyimpulkan",
      sentences: [
        "Meiner Meinung nach sollten wir...",
        "Ich bin fest davon überzeugt, dass...",
        "Zusammenfassend lässt sich sagen, dass..."
      ]
    }
  ];

  const strategies = [
    {
      module: "Lesen B1 (65 Menit)",
      tips: [
        "Teil 1: Baca teks blog dengan cermat, pahami nada opini penulis (Richtig/Falsch).",
        "Teil 3: Kelompokkan orang dan iklan yang bersesuaian. Ingat, ada 1 orang yang tidak mendapatkan iklan (jawaban X).",
        "Teil 4: Cari kata kunci persetujuan (Ja) atau penolakan (Nein) terhadap topik diskusi."
      ]
    },
    {
      module: "Hören B1 (40 Menit)",
      tips: [
        "Teil 1: Perhatikan baik-baik karena setiap audio memiliki 2 pertanyaan (1 R/F + 1 Pilihan Ganda).",
        "Teil 3: Audio percakapan kasual informal hanya diputar 1 kali, buat catatan kecil saat mendengarkan.",
        "Teil 4: Identifikasi suara moderator (biasanya netral), orang tua (biasanya skeptis/konservatif), dan guru (profesional)."
      ]
    },
    {
      module: "Schreiben B1 (60 Menit)",
      tips: [
        "Teil 1: Jawab ketiga poin email pribadi dengan panjang sekitar 80 kata.",
        "Teil 2: Nyatakan opini forum secara sopan dan terstruktur. Gunakan kata penghubung B1 (weil, da, obwohl).",
        "Teil 3: Jaga email formal agar ringkas (~40 kata) dengan salam penutup resmi yang tepat."
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <GraduationCap className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Materi Pembelajaran B1</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Portal Belajar Goethe B1</h1>
          <p className="text-xs text-gray-500 font-medium">Kuasai tata bahasa kompleks B1, kosakata akademis-sosial, serta trik menjawab ujian modular.</p>
        </div>

        <Link
          href="/b1"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 hover:text-goethe-purple rounded-xl border border-gray-200 hover:border-goethe-purple/20 transition-all bg-white self-start md:self-center cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl shadow-xs gap-1">
        {[
          { key: "grammar", label: "Tata Bahasa (Grammatik B1)" },
          { key: "vocab", label: "Kosakata Tematis" },
          { key: "redemittel", label: "Redemittel Presentasi" },
          { key: "strategies", label: "Strategi Ujian B1" }
        ].map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-goethe-purple text-white shadow-sm"
                  : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[350px]">
        
        {/* GRAMMAR TAB */}
        {activeTab === "grammar" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grammarTopics.map((topic, i) => (
              <div key={i} className="bg-gray-50 border border-gray-150 p-5 rounded-2xl space-y-3 hover:border-goethe-purple/20 transition-all">
                <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-goethe-purple/10 text-goethe-purple flex items-center justify-center text-[10px] font-black">{i+1}</span>
                  {topic.title}
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed font-semibold">{topic.desc}</p>
                <div className="bg-white p-3 rounded-xl border border-gray-100 text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {topic.example}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VOCABULARY TAB */}
        {activeTab === "vocab" && (
          <div className="space-y-6">
            {vocabTopics.map((topic, i) => (
              <div key={i} className="space-y-3">
                <h4 className="font-black text-gray-900 text-sm border-b pb-2 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-goethe-purple rounded-xs"></span>
                  {topic.category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topic.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-goethe-purple/10 transition-all">
                      <span className="font-mono text-xs font-bold text-goethe-purple">{item.de}</span>
                      <span className="text-xs text-gray-600 font-semibold">{item.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REDEMITTEL TAB */}
        {activeTab === "redemittel" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {redemittelTopics.map((topic, i) => (
              <div key={i} className="bg-gray-50 border border-gray-150 p-5 rounded-2xl space-y-4">
                <h4 className="font-extrabold text-gray-900 text-sm border-b pb-2 flex items-center gap-1.5">
                  {topic.title}
                </h4>
                <div className="space-y-2">
                  {topic.sentences.map((sentence, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 text-xs font-mono font-bold text-gray-800 leading-relaxed hover:border-goethe-purple/20 transition-all select-all">
                      {sentence}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STRATEGIES TAB */}
        {activeTab === "strategies" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {strategies.map((strat, i) => (
              <div key={i} className="p-5 border rounded-2xl flex flex-col md:flex-row gap-4 items-start bg-gray-50 hover:bg-white hover:border-goethe-purple/20 transition-all">
                <div className="bg-goethe-purple/10 px-3.5 py-1.5 rounded-xl text-goethe-purple text-xs font-black uppercase tracking-wide shrink-0">
                  {strat.module}
                </div>
                <ul className="space-y-2.5 text-xs text-gray-700 font-semibold leading-relaxed">
                  {strat.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-goethe-purple shrink-0 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
