"use client";

import React, { useState } from "react";
import { 
  GraduationCap, BookOpen, PenTool, Mic, HelpCircle, 
  ChevronRight, Sparkles, AlertCircle, ArrowLeft, BookOpenCheck
} from "lucide-react";
import Link from "next/link";

export default function A2MateriPage() {
  const [activeTab, setActiveTab] = useState<"grammar" | "vocab" | "redemittel" | "strategies">("grammar");

  const grammarTopics = [
    {
      title: "Anak Kalimat: weil & dass",
      desc: "Menggabungkan dua kalimat dengan konjungsi sebab (weil) dan isi (dass). Verba berada di akhir kalimat.",
      example: "• Ich kann nicht kommen, weil ich krank bin. (Sebab)\n• Ich denke, dass Deutsch lernen wichtig ist. (Isi)"
    },
    {
      title: "Wechselpräpositionen (Preposisi Dua Arah)",
      desc: "Preposisi yang menggunakan kasus Dativ (menunjukkan posisi diam/Wo) atau Akkusativ (menunjukkan gerakan/Wohin).",
      example: "• Wo: Das Buch liegt auf dem Tisch (Dativ - maskulin/neutral dem).\n• Wohin: Ich lege das Buch auf den Tisch (Akkusativ - maskulin den)."
    },
    {
      title: "Verben mit Dativ / Akkusativ",
      desc: "Beberapa kata kerja menuntut objek dalam kasus Dativ (seperti helfen, gefallen, danken) sedangkan mayoritas menuntut Akkusativ.",
      example: "• Dativ: Ich helfe dir (bukan dich).\n• Akkusativ: Ich liebe dich (bukan dir)."
    },
    {
      title: "Perfekt (Bentuk Lampau Percakapan)",
      desc: "Dibentuk dengan kata kerja bantu (haben atau sein) di posisi kedua, diikuti Partizip II di akhir kalimat.",
      example: "• Mit haben: Ich habe Deutsch gelernt.\n• Mit sein (gerakan/perubahan keadaan): Ich bin nach Berlin gefahren."
    }
  ];

  const vocabTopics = [
    {
      category: "Arbeit & Berufsleben (Dunia Kerja)",
      items: [
        { de: "der Beruf, -e", id: "Pekerjaan" },
        { de: "die Stelle, -n", id: "Lowongan / Posisi" },
        { de: "sich bewerben", id: "Melamar pekerjaan" },
        { de: "der Vertrag, -e", id: "Kontrak" }
      ]
    },
    {
      category: "Gesundheit & Körper (Kesehatan)",
      items: [
        { de: "krank sein", id: "Sakit" },
        { de: "die Praxis, -en", id: "Klinik / Tempat praktik dokter" },
        { de: "das Rezept, -e", id: "Resep obat" },
        { de: "die Schmerzen (Pl.)", id: "Rasa sakit / Nyeri" }
      ]
    },
    {
      category: "Reisen & Verkehr (Perjalanan)",
      items: [
        { de: "die Fahrkarte, -n", id: "Tiket perjalanan" },
        { de: "der Bahnhof, -e", id: "Stasiun kereta" },
        { de: "umsteigen", id: "Transit / Pindah kereta/bus" },
        { de: "pünktlich", id: "Tepat waktu" }
      ]
    }
  ];

  const redemittelTopics = [
    {
      title: "Mengundang Seseorang (Einladung)",
      sentences: [
        "Ich möchte dich herzlich zu meiner Party einladen.",
        "Hast du am Samstag Zeit?",
        "Kommst du zu meinem Geburtstag?"
      ]
    },
    {
      title: "Menerima Undangan (Zusagen)",
      sentences: [
        "Vielen Dank für die Einladung! Ich komme sehr gerne.",
        "Ja, das passt mir gut.",
        "Ich bin auf jeden Fall dabei."
      ]
    },
    {
      title: "Menolak Undangan (Absagen)",
      sentences: [
        "Es tut mir leid, aber ich kann leider nicht kommen.",
        "Ich muss an diesem Tag arbeiten.",
        "Vielleicht klappt es ein anderes Mal."
      ]
    }
  ];

  const strategies = [
    {
      module: "Lesen (Membaca)",
      tips: [
        "Cari kata kunci (Schlüsselwörter) di pertanyaan, lalu cari sinonimnya di teks.",
        "Jangan terhambat pada kata sulit yang tidak penting untuk menjawab pertanyaan.",
        "Perhatikan kata penyangkal seperti 'nicht', 'kein', atau 'nie' yang bisa membalikkan makna."
      ]
    },
    {
      module: "Hören (Mendengar)",
      tips: [
        "Manfaatkan waktu jeda sebelum audio diputar untuk membaca soal dan memahami pilihan jawaban.",
        "Fokus pada angka, waktu, dan nama tempat yang sering menjadi jebakan.",
        "Teil 1 diputar dua kali, manfaatkan putaran pertama untuk memilih dan putaran kedua untuk konfirmasi."
      ]
    },
    {
      module: "Schreiben (Menulis)",
      tips: [
        "Pastikan semua 3 poin wajib terjawab dengan jelas di lembar jawaban Anda.",
        "Gunakan tata bahasa A2 yang sederhana namun benar dibanding menggunakan kalimat kompleks yang berisiko salah.",
        "Ingat salam pembuka dan penutup yang sesuai untuk jenis tulisan pribadi maupun formal."
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
            <span className="font-bold text-sm uppercase tracking-wide">Materi Pembelajaran A2</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Portal Belajar Goethe A2</h1>
          <p className="text-xs text-gray-500 font-medium">Tingkatkan pemahaman tata bahasa, kosakata, dan strategi ujian Anda sebelum simulasi.</p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 hover:text-goethe-purple rounded-xl border border-gray-200 hover:border-goethe-purple/20 transition-all bg-white self-start md:self-center cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl shadow-xs gap-1">
        {[
          { key: "grammar", label: "Tata Bahasa (Grammatik)" },
          { key: "vocab", label: "Kosakata Pilihan" },
          { key: "redemittel", label: "Struktur Kalimat" },
          { key: "strategies", label: "Strategi Ujian A2" }
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
