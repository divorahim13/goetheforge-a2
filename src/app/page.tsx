"use client";

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, ClipboardCopy, Home, BookOpen, 
  ArrowLeft, CheckCircle, ChevronRight, Award, 
  BookOpenCheck, Compass, HelpCircle, Check, X, BookmarkCheck, Sparkles
} from "lucide-react";
import Link from "next/link";

// 12 Chapters Titles for A1 - B2
const CHAPTERS_TITLES: { [level: string]: string[] } = {
  A1: [
    "Sich vorstellen (Perkenalan Diri)",
    "Familie & Beziehungen (Keluarga)",
    "Essen & Trinken (Makanan & Minuman)",
    "Tagesablauf & Uhrzeiten (Rutinitas)",
    "Meine Wohnung (Tempat Tinggal)",
    "Hobbys & Freizeit (Hobi & Waktu Luang)",
    "Gesundheit & Körper (Kesehatan)",
    "Wetter & Kleidung (Cuaca & Pakaian)",
    "In der Stadt (Di Perkotaan)",
    "Reisen & Urlaub (Perjalanan)",
    "Berufsleben (Pekerjaan)",
    "Feste & Feiern (Pesta & Perayaan)"
  ],
  A2: [
    "Freunde & Kontakte (Teman & Relasi)",
    "Medien im Alltag (Media & Informasi)",
    "Schule & Ausbildung (Sekolah & Pelatihan)",
    "Arbeitswelt (Dunia Kerja)",
    "Reisen & Hotels (Liburan & Menginap)",
    "Gesundheit & Sport (Kesehatan & Olahraga)",
    "Wohnungssuche (Mencari Rumah)",
    "Kultur & Events (Seni & Hiburan)",
    "Konsum & Geld (Konsumsi & Uang)",
    "Natur & Umwelt (Alam & Hewan)",
    "Erfahrungen & Biografien (Biografi)",
    "Pläne & Träume (Rencana Masa Depan)"
  ],
  B1: [
    "Sprachen & Kommunikation (Bahasa & Komunikasi)",
    "Wohnformen & WGs (Gaya Hidup & WG)",
    "Arbeitszeit & Jobs (Karier & Waktu Kerja)",
    "Klimaschutz & Umwelt (Klimologi & Lingkungan)",
    "Medienkonsum (Konsumsi Media)",
    "Beziehungen & Liebe (Hubungan Sosial)",
    "Kultur & Klischees (Budaya & Stereotip)",
    "Gesunder Lebensstil (Gaya Hidup Sehat)",
    "Forschung & Erfindungen (Sains & Invensi)",
    "Geschichte & Politik (Sejarah & Politik)",
    "Bewerbung & Vorstellungsgespräch (Wawancara Kerja)",
    "Zukunft & KI (Teknologi Masa Depan)"
  ],
  B2: [
    "Heimat & Migration (Identitas & Migrasi)",
    "Konsumverzicht (Anti-Konsumerisme)",
    "New Work & Startups (Dunia Kerja Modern)",
    "Globale Ressourcen (Krisis Energi)",
    "Fake News & Medien (Disinformasi)",
    "Demografischer Wandel (Perubahan Demografis)",
    "Klassische Kunst (Teater & Sastra)",
    "Gentechnik & Ethik (Gentechnology & Etika)",
    "Elektromobilität (Transportasi Listrik)",
    "Glück & Psychologie (Psikologi Kebahagiaan)",
    "Demokratie & Wahlen (Politik Partisipatif)",
    "Wissenschaftsethik (Etika Penelitian)"
  ]
};

// Detailed Content for Kapitel 1 of all levels
const STATIC_KAPITEL_1: { [level: string]: any } = {
  A1: {
    grammar: "• W-Fragen: Wie (Bagaimana), Wer (Siapa), Woher (Dari mana), Wo (Di mana).\n• Verbkonjugation (sein & heißen):\n  - Ich bin / Ich heiße\n  - Du bist / Du heißt\n  - Er/Sie ist / Er/Sie heißt",
    vocab: [
      { de: "heißen", id: "Bernama" },
      { de: "wohnen", id: "Tinggal" },
      { de: "kommen aus", id: "Berasal dari" },
      { de: "der Name, -n", id: "Nama" },
      { de: "Guten Tag!", id: "Selamat siang!" }
    ],
    redemittel: [
      "Wie heißen Sie? - Ich heiße Thomas.",
      "Woher kommen Sie? - Ich komme aus Indonesien.",
      "Wo wohnen Sie? - Ich wohne in Jakarta."
    ],
    quiz: [
      {
        q: "Woher ______ du?",
        opts: ["bist", "kommst", "wohnst"],
        ans: 1,
        expl: "Kata kerja 'kommen' dipasangkan dengan preposisi 'aus' (dari) untuk menyatakan asal."
      },
      {
        q: "Ich ______ Sarah.",
        opts: ["bin", "wohnst", "heißt"],
        ans: 0,
        expl: "Ich berpasangan dengan 'bin' (sein) atau 'heiße'."
      },
      {
        q: "Wie ______ Sie?",
        opts: ["heißt", "heißen", "heißt"],
        ans: 1,
        expl: "Pronoun resmi 'Sie' menuntut konjugasi verba berakhiran -en: 'heißen'."
      }
    ]
  },
  A2: {
    grammar: "• Verben mit Dativ: danken (berterima kasih), helfen (membantu), gefallen (menyukai).\n• Personalpronomen im Dativ:\n  - ich -> mir\n  - du -> dir\n  - Sie -> Ihnen",
    vocab: [
      { de: "die Einladung, -en", id: "Undangan" },
      { de: "zusagen", id: "Menerima (undangan)" },
      { de: "absagen", id: "Menolak (undangan)" },
      { de: "feiern", id: "Merayakan" },
      { de: "das Geschenk, -e", id: "Kado / Hadiah" }
    ],
    redemittel: [
      "Ich danke dir für die Einladung.",
      "Das gefällt mir sehr gut.",
      "Kannst du mir helfen?"
    ],
    quiz: [
      {
        q: "Ich helfe ______ (du) beim Umzug.",
        opts: ["dich", "dir", "du"],
        ans: 1,
        expl: "Kata kerja 'helfen' selalu diikuti objek dalam bentuk Dativ. 'du' berubah menjadi 'dir'."
      },
      {
        q: "Wie geht es ______ (Sie, formal)?",
        opts: ["Sie", "Ihnen", "ihr"],
        ans: 1,
        expl: "Ungkapan 'Wie geht es...' menggunakan kasus Dativ. Untuk 'Sie' (Anda) berubah menjadi 'Ihnen'."
      },
      {
        q: "Das Geschenk gefällt ______ (ich).",
        opts: ["mich", "mir", "ich"],
        ans: 1,
        expl: "Gefallen menuntut Dativ. Objek 'ich' berubah menjadi 'mir'."
      }
    ]
  },
  B1: {
    grammar: "• Nebensatz mit 'obwohl' (meskipun):\n  - Kata hubung konsesif yang menempatkan kata kerja terkonjugasi di paling akhir anak kalimat.",
    vocab: [
      { de: "die Fremdsprache, -n", id: "Bahasa asing" },
      { de: "zweisprachig", id: "Bilingual / Dua bahasa" },
      { de: "die Muttersprache, -n", id: "Bahasa ibu" },
      { de: "übersetzen", id: "Menerjemahkan" },
      { de: "beherrschen", id: "Menguasai (keahlian)" }
    ],
    redemittel: [
      "Ich spreche fließend Deutsch, obwohl ich erst seit einem Jahr lerne.",
      "Es ist wichtig, eine Fremdsprache zu beherrschen.",
      "Muttersprache ist die erste Sprache, die man lernt."
    ],
    quiz: [
      {
        q: "Ich gehe spazieren, ______ es regnet.",
        opts: ["weil", "obwohl", "dass"],
        ans: 1,
        expl: "'obwohl' digunakan untuk pertentangan (meskipun hujan tetap pergi jalan-jalan)."
      },
      {
        q: "Er spricht gut Deutsch, obwohl er noch nie in Deutschland ______.",
        opts: ["war", "ist", "gewesen"],
        ans: 0,
        expl: "Anak kalimat subordinatif menuntut verba terkonjugasi ('war') diletakkan di akhir."
      },
      {
        q: "Es ist gesund, Sport ______ treiben.",
        opts: ["zu", "dass", "weil"],
        ans: 0,
        expl: "Konstruksi Infinitiv menggunakan 'zu' + verba dasar."
      }
    ]
  },
  B2: {
    grammar: "• Partizipialattribute (Partizip I & II sebagai kata sifat):\n  - Partizip I (aktivitas aktif/sedang berlangsung): der singende Vogel (burung yang sedang bernyanyi).\n  - Partizip II (aktivitas pasif/selesai): das gelesene Buch (buku yang sudah dibaca).",
    vocab: [
      { de: "die Identität, -en", id: "Identitas" },
      { de: "die Einwanderung", id: "Imigrasi" },
      { de: "sich integrieren", id: "Berintegrasi" },
      { de: "die Heimat", id: "Tanah air" },
      { de: "die kulturelle Vielfalt", id: "Keanekaragaman budaya" }
    ],
    redemittel: [
      "Viele Menschen verlassen ihre Heimat aus wirtschaftlichen Gründen.",
      "Die Integration in eine neue Gesellschaft erfordert Zeit und Toleranz.",
      "Kulturelle Vielfalt bereichert unser Leben."
    ],
    quiz: [
      {
        q: "Der ______ (laufen) Hund ist sehr schnell.",
        opts: ["gelaufene", "laufende", "laufenden"],
        ans: 1,
        expl: "Partizip I ('laufende') digunakan sebagai kata sifat aktif untuk menggambarkan anjing yang sedang berlari."
      },
      {
        q: "Das ______ (schreiben) Buch war ein Bestseller.",
        opts: ["schreibende", "geschriebene", "geschrieben"],
        ans: 1,
        expl: "Partizip II ('geschriebene') digunakan karena bukunya pasif/telah ditulis."
      },
      {
        q: "Er verließ das Zimmer ohne ein ______ Wort.",
        opts: ["gesagtes", "sagendes", "gesagt"],
        ans: 0,
        expl: "Kata sifat dari 'sagen' untuk menerangkan kata 'Wort' (neutral) dalam kasus Akkusativ: 'gesagtes'."
      }
    ]
  }
};

export default function PortalPage() {
  const [view, setView] = useState<"portal" | "materi" | "materi-chapters" | "materi-content" | "simulasi">("portal");
  const [selectedLevel, setSelectedLevel] = useState<"A1" | "A2" | "B1" | "B2" | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  // Completion state
  const [completedChapters, setCompletedChapters] = useState<{ [key: string]: boolean }>({});
  
  // Quiz active states
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: number | null }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("goetheforge_completed_chapters");
      if (cached) {
        setCompletedChapters(JSON.parse(cached));
      }
    }
  }, []);

  const saveCompletion = (level: string, chapter: number) => {
    const key = `${level}_K${chapter}`;
    const updated = { ...completedChapters, [key]: true };
    setCompletedChapters(updated);
    localStorage.setItem("goetheforge_completed_chapters", JSON.stringify(updated));
  };

  // Helper to generate chapters 2-12 dynamically on the fly
  const getChapterData = (level: "A1" | "A2" | "B1" | "B2", chIdx: number) => {
    if (chIdx === 1) return STATIC_KAPITEL_1[level];

    const title = CHAPTERS_TITLES[level][chIdx - 1];
    
    // Dynamic fallback syllabus generator
    return {
      grammar: `• Tata bahasa utama di Kapitel ${chIdx}: Pemahaman struktur kalimat, posisi verba, dan preposisi tematik.\n• Silakan pelajari pola kalimat contoh di bawah untuk memahami tata bahasa secara praktis.`,
      vocab: [
        { de: `das Wort-${chIdx}`, id: `Kosakata penting ${title.split(" (")[0]}` },
        { de: "lernen", id: "Belajar" },
        { de: "sprechen", id: "Berbicara" },
        { de: "verstehen", id: "Memahami" },
        { de: "üben", id: "Melatih" }
      ],
      redemittel: [
        `Ich möchte mehr über dieses Thema lernen.`,
        `Können Sie das bitte noch einmal erklären?`,
        `Das ist ein wichtiger Punkt für das Kapitel.`
      ],
      quiz: [
        {
          q: `Ini adalah kuis latihan untuk Kapitel ${chIdx}: Manakah verba dasar untuk 'belajar'?`,
          opts: ["lernen", "lernt", "gelernt"],
          ans: 0,
          expl: "Bentuk dasar (Infinitiv) berakhiran -en: 'lernen'."
        },
        {
          q: "Wir ______ heute Deutsch. (Konjugasi untuk 'wir')",
          opts: ["lerne", "lernt", "lernen"],
          ans: 2,
          expl: "'wir' berpasangan dengan verba berakhiran -en: 'lernen'."
        },
        {
          q: "Hast du das ______? (Partizip II dari verben)",
          opts: ["verstehen", "verstanden", "verstehe"],
          ans: 1,
          expl: "Bentuk lampau Partizip II dari 'verstehen' adalah 'verstanden'."
        }
      ]
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* PORTAL MAIN HUB VIEW */}
      {view === "portal" && (
        <div className="space-y-8 py-6 text-center">
          
          {/* Welcome Banner */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-goethe-purple/10 text-goethe-purple text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Portal Belajar Bahasa Jerman
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Selamat datang di <span className="text-goethe-purple">GoetheForge</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Pilih jalur belajar Anda: kuasai materi pembelajaran terstruktur bab demi bab dari tingkat A1-B2, atau latih kesiapan Anda langsung dengan simulator ujian Goethe-Zertifikat.
            </p>
          </div>

          {/* Core Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
            
            {/* CARD A: MATERI PEMBELAJARAN */}
            <div 
              onClick={() => { setView("materi"); setSelectedLevel(null); }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl hover:border-goethe-purple/20 transition-all cursor-pointer text-center space-y-6 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-goethe-purple/5 rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-110"></div>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-goethe-purple/10 text-goethe-purple flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 group-hover:text-goethe-purple transition-colors">Portal Materi Pembelajaran</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                  Belajar terstruktur dari tingkat **A1 hingga B2**. Setiap tingkatan memiliki **12 Kapitel** lengkap dengan tata bahasa, kosakata, redemittel, dan mini kuis.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-goethe-purple group-hover:gap-2 transition-all">
                <span>Mulai Belajar</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* CARD B: SIMULASI UJIAN */}
            <div 
              onClick={() => { setView("simulasi"); setSelectedLevel(null); }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl hover:border-goethe-purple/20 transition-all cursor-pointer text-center space-y-6 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-goethe-purple/5 rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-110"></div>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-goethe-purple/10 text-goethe-purple flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                <ClipboardCopy className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 group-hover:text-goethe-purple transition-colors">Portal Simulasi Ujian</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                  Uji mental dan kemampuan Anda di bawah simulasi waktu ujian modular **Goethe-Zertifikat A2 & B1** asli.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-goethe-purple group-hover:gap-2 transition-all">
                <span>Mulai Simulasi</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: MATERI PORTAL (LEVEL SELECTOR) */}
      {view === "materi" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setView("portal")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-goethe-purple transition-all bg-white border cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Menu Utama
            </button>
            <span className="text-xs font-bold text-gray-400">Jalur Belajar Terstruktur</span>
          </div>

          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-gray-900">Pilih Niveau Belajar Anda</h2>
            <p className="text-gray-500 text-xs leading-relaxed">
              Mulai dari tingkatan paling dasar (A1) hingga menengah-atas (B2). Setiap tingkat dirancang dengan kurikulum standar Goethe-Institut.
            </p>
          </div>

          {/* Level Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            {(["A1", "A2", "B1", "B2"] as const).map((lvl) => (
              <div 
                key={lvl}
                onClick={() => { setSelectedLevel(lvl); setView("materi-chapters"); }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-goethe-purple/20 transition-all cursor-pointer text-center space-y-4 group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-goethe-purple/10 text-goethe-purple font-black text-lg flex items-center justify-center mx-auto">
                  {lvl}
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-gray-900">Niveau {lvl}</h4>
                  <p className="text-gray-500 text-[10px]">12 Kapitel Pembelajaran</p>
                </div>
                <div className="text-xs font-bold text-goethe-purple group-hover:underline">
                  Lihat Kapitel &rarr;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: MATERI CHAPTERS (12 CHAPTERS LIST) */}
      {view === "materi-chapters" && selectedLevel && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setView("materi")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-goethe-purple transition-all bg-white border cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Pilih Tingkat Lain
            </button>
            <span className="text-xs font-black text-goethe-purple bg-goethe-purple/10 px-3 py-1 rounded-full uppercase">
              Tingkat {selectedLevel}
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-gray-900">Syllabus Pembelajaran Niveau {selectedLevel}</h2>
            <p className="text-gray-500 text-xs">Selesaikan ke-12 kapitel berikut untuk menguasai materi ujian secara menyeluruh.</p>
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {CHAPTERS_TITLES[selectedLevel].map((title, idx) => {
              const chNum = idx + 1;
              const isCompleted = completedChapters[`${selectedLevel}_K${chNum}`];
              return (
                <div 
                  key={chNum}
                  onClick={() => {
                    setSelectedChapter(chNum);
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setView("materi-content");
                  }}
                  className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md hover:border-goethe-purple/20 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] relative ${
                    isCompleted ? "border-success/30 bg-success-light/5" : "border-gray-100"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wide">Kapitel {chNum}</span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[9px] font-black text-success uppercase bg-success-light px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Selesai
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-gray-900 text-sm leading-snug">{title}</h4>
                  </div>

                  <div className="text-[11px] font-bold text-goethe-purple flex items-center gap-1 pt-3">
                    <span>Mulai Belajar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MATERI CONTENT (GRAMMAR, VOCAB, REDEMITTEL & MINI QUIZ) */}
      {view === "materi-content" && selectedLevel && selectedChapter && (
        <div className="space-y-6">
          
          {/* Top Info Header */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setView("materi-chapters")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-goethe-purple transition-all bg-white border cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Kapitel
            </button>
            <span className="text-xs font-bold text-gray-400">
              Niveau {selectedLevel} &bull; Kapitel {selectedChapter}
            </span>
          </div>

          {/* Chapter Banner */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <span className="text-[10px] font-black text-goethe-purple uppercase tracking-widest">Materi Belajar</span>
            <h2 className="text-2xl font-black text-gray-900">
              {CHAPTERS_TITLES[selectedLevel][selectedChapter - 1]}
            </h2>
          </div>

          {/* Chapter Details Layout */}
          {(() => {
            const data = getChapterData(selectedLevel, selectedChapter);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Area: Grammar, Vocab, Redemittel */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Grammatik */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-900 border-b pb-2 flex items-center gap-2">
                      <BookOpenCheck className="w-4 h-4 text-goethe-purple" />
                      <span>Tata Bahasa (Grammatik)</span>
                    </h3>
                    <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line font-mono bg-gray-50 p-4 rounded-xl border border-gray-150">
                      {data.grammar}
                    </p>
                  </div>

                  {/* Wortschatz */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-900 border-b pb-2 flex items-center gap-2">
                      <BookmarkCheck className="w-4 h-4 text-goethe-purple" />
                      <span>Kosakata (Wortschatz)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {data.vocab.map((v: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white transition-all">
                          <span className="font-mono text-xs font-bold text-goethe-purple">{v.de}</span>
                          <span className="text-xs text-gray-500 font-semibold">{v.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Redemittel */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-900 border-b pb-2 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-goethe-purple" />
                      <span>Ungkapan Praktis (Redemittel)</span>
                    </h3>
                    <div className="space-y-2">
                      {data.redemittel.map((r: string, i: number) => (
                        <div key={i} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono font-bold text-gray-800 hover:border-goethe-purple/20 transition-all select-all">
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Area: Interactive Mini Quiz */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="border-b pb-3 space-y-1">
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-goethe-purple" />
                      <span>Kuis Singkat (Quiz)</span>
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Selesaikan kuis untuk menandai bab ini selesai</p>
                  </div>

                  <div className="space-y-6">
                    {data.quiz.map((q: any, qIdx: number) => {
                      const selectedOpt = quizAnswers[qIdx];
                      return (
                        <div key={qIdx} className="space-y-3 p-4 bg-gray-50 border border-gray-150 rounded-xl">
                          <p className="text-gray-800 text-xs font-bold">{qIdx+1}. {q.q}</p>
                          <div className="flex flex-col gap-2">
                            {q.opts.map((opt: string, optIdx: number) => {
                              const isSelected = selectedOpt === optIdx;
                              let btnClass = "bg-white text-gray-700 hover:bg-gray-100 border-gray-200";
                              if (quizSubmitted) {
                                if (optIdx === q.ans) {
                                  btnClass = "bg-success-light text-success border-success font-bold";
                                } else if (isSelected) {
                                  btnClass = "bg-error-light text-error border-error font-bold";
                                }
                              } else if (isSelected) {
                                btnClass = "bg-goethe-purple text-white border-goethe-purple font-bold";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer ${btnClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {/* Quiz Explanation */}
                          {quizSubmitted && selectedOpt !== null && (
                            <p className="text-[10px] font-semibold text-gray-500 pt-1 leading-relaxed">
                              {q.ans === selectedOpt ? "✓ Benar! " : "✗ Salah. "} {q.expl}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission and completion action */}
                  {!quizSubmitted ? (
                    <button
                      disabled={Object.keys(quizAnswers).length < data.quiz.length}
                      onClick={() => setQuizSubmitted(true)}
                      className="w-full py-3 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover disabled:opacity-50 text-white font-extrabold text-xs tracking-wider transition-all cursor-pointer uppercase"
                    >
                      Kirim Jawaban Kuis
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        saveCompletion(selectedLevel, selectedChapter);
                        setView("materi-chapters");
                      }}
                      className="w-full py-3 rounded-xl bg-success hover:bg-success/95 text-white font-extrabold text-xs tracking-wider transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Tandai Bab Selesai
                    </button>
                  )}

                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/* VIEW: SIMULASI SELECTOR */}
      {view === "simulasi" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setView("portal")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-goethe-purple transition-all bg-white border cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Menu Utama
            </button>
            <span className="text-xs font-bold text-gray-400">Simulator Ujian Modular</span>
          </div>

          <div className="text-center space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-gray-900">Pilih Level Simulasi Ujian</h2>
            <p className="text-gray-500 text-xs leading-relaxed">
              Jalankan tes latihan modular Next.js. Untuk tingkat A2 dan B1, Anda dapat menguji dengan simulator interaktif penuh waktu nyata.
            </p>
          </div>

          {/* Practice selection grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            
            {/* A1 SIMULASI */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Niveau A1</span>
              <h4 className="font-extrabold text-gray-900 text-base">Start Deutsch 1</h4>
              <div className="text-xs text-gray-600 text-left bg-gray-50 p-3 rounded-lg space-y-1 font-semibold leading-relaxed border">
                <p>⏱️ Lesen: 25 Menit</p>
                <p>⏱️ Hören: 20 Menit</p>
                <p>⏱️ Schreiben: 20 Menit</p>
              </div>
              <span className="block text-[10px] font-black text-amber-500 bg-amber-50 py-1.5 rounded-xl uppercase">Syllabus & Info</span>
            </div>

            {/* A2 SIMULASI */}
            <Link 
              href="/a2"
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-goethe-purple/20 transition-all cursor-pointer text-center space-y-4 block group"
            >
              <span className="text-[10px] font-black text-goethe-purple uppercase tracking-widest">Niveau A2</span>
              <h4 className="font-extrabold text-gray-900 text-base">Goethe-Zertifikat A2</h4>
              <div className="text-xs text-gray-600 text-left bg-gray-55 p-3 rounded-lg space-y-1 font-semibold leading-relaxed border group-hover:bg-goethe-light/20 transition-all">
                <p>⏱️ Lesen: 30 Menit</p>
                <p>⏱️ Hören: 30 Menit</p>
                <p>⏱️ Schreiben: 30 Menit</p>
              </div>
              <span className="block text-[10px] font-black text-white bg-goethe-purple py-1.5 rounded-xl uppercase shadow-sm">Buka Dashboard A2</span>
            </Link>

            {/* B1 SIMULASI */}
            <Link 
              href="/b1"
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-goethe-purple/20 transition-all cursor-pointer text-center space-y-4 block group"
            >
              <span className="text-[10px] font-black text-goethe-purple uppercase tracking-widest">Niveau B1</span>
              <h4 className="font-extrabold text-gray-900 text-base">Goethe-Zertifikat B1</h4>
              <div className="text-xs text-gray-600 text-left bg-gray-55 p-3 rounded-lg space-y-1 font-semibold leading-relaxed border group-hover:bg-goethe-light/20 transition-all">
                <p>⏱️ Lesen: 65 Menit</p>
                <p>⏱️ Hören: 40 Menit</p>
                <p>⏱️ Schreiben: 60 Menit</p>
              </div>
              <span className="block text-[10px] font-black text-white bg-goethe-purple py-1.5 rounded-xl uppercase shadow-sm">Buka Dashboard B1</span>
            </Link>

            {/* B2 SIMULASI */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Niveau B2</span>
              <h4 className="font-extrabold text-gray-900 text-base">Goethe-Zertifikat B2</h4>
              <div className="text-xs text-gray-600 text-left bg-gray-50 p-3 rounded-lg space-y-1 font-semibold leading-relaxed border">
                <p>⏱️ Lesen: 65 Menit</p>
                <p>⏱️ Hören: 40 Menit</p>
                <p>⏱️ Schreiben: 75 Menit</p>
              </div>
              <span className="block text-[10px] font-black text-amber-500 bg-amber-50 py-1.5 rounded-xl uppercase">Syllabus & Info</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
