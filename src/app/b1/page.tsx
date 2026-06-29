"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, BookOpen, Volume2, PenTool, Mic, 
  Flame, Award, Calendar, ChevronRight, User, Sparkles, AlertCircle 
} from "lucide-react";
import { 
  getSettings, saveSettings, getProgress, 
  getWortschatzProgress, getStreak, updateStreak,
  UserSettings, ProgressState, StreakData 
} from "@/lib/db";

const MOTIVATIONAL_QUOTES = [
  { de: "Übung macht den Meister.", id: "Latihan membuat sempurna. Teruslah berlatih!" },
  { de: "Aller Anfang ist schwer.", id: "Setiap permulaan memang terasa sulit, jangan menyerah." },
  { de: "Wer rastet, der rostet.", id: "Siapa yang berhenti belajar akan tumpul. Jaga momentum Anda!" },
  { de: "Man lernt nie aus.", id: "Kita nicht pernah berhenti belajar. Setiap hari adalah kemajuan." },
  { de: "Erfolg hat drei Buchstaben: TUN!", id: "Sukses hanya terdiri dari tiga huruf: TUN! (LAKUKAN!)" },
  { de: "Der Weg ist das Ziel.", id: "Perjalanan belajar itu sendiri adalah tujuan kesuksesan Anda." }
];

export default function B1Dashboard() {
  const [settings, setSettings] = useState<UserSettings>({ name: "", examDate: "", level: "B1" });
  const [progress, setProgress] = useState<ProgressState>({ lesen: [], horen: [], schreiben: [], sprechen: [] });
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, lastActiveDate: "", activityHistory: [] });
  
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [quote, setQuote] = useState({ de: "", id: "" });

  // Load data on mount
  useEffect(() => {
    updateStreak();
    
    const loadedSettings = getSettings();
    // Force level to B1 if they are on /b1
    if (loadedSettings.level !== "B1") {
      loadedSettings.level = "B1";
      saveSettings(loadedSettings);
    }
    const loadedProgress = getProgress("B1");
    const loadedStreak = getStreak();

    setSettings(loadedSettings);
    setNewName(loadedSettings.name);
    setNewDate(loadedSettings.examDate);
    setProgress(loadedProgress);
    setStreak(loadedStreak);

    // Pick random quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  // Calculate countdown whenever examDate changes
  useEffect(() => {
    if (!settings.examDate) return;

    const calculateTime = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(settings.examDate);
      target.setHours(0, 0, 0, 0);
      
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 3600000);
    return () => clearInterval(timer);
  }, [settings.examDate]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDate) return;
    
    const updated = { name: newName, examDate: newDate, level: "B1" as const };
    saveSettings(updated);
    setSettings(updated);
    setIsEditingSettings(false);
  };

  const getLatestScoreInfo = (moduleName: keyof ProgressState) => {
    const list = progress[moduleName];
    if (!list || list.length === 0) return { text: "Belum ada riwayat", percent: 0, score: 0 };
    
    const latest = list[list.length - 1];
    // Goethe-Zertifikat B1 scores are scaled to 100
    const percent = (latest.score / latest.maxScore) * 100;
    const rounded = Math.round(percent * 100) / 100;

    return {
      text: `${rounded} / 100 Punkte (${Math.round(percent)}%)`,
      percent,
      score: rounded
    };
  };

  // Calculate estimated readiness percentage
  const getReadinessPercentage = () => {
    const modules: (keyof ProgressState)[] = ["lesen", "horen", "schreiben", "sprechen"];
    let testedCount = 0;
    let totalScore = 0;

    modules.forEach(mod => {
      const latest = getLatestScoreInfo(mod);
      if (latest.percent > 0 || progress[mod].length > 0) {
        testedCount++;
        totalScore += latest.percent;
      }
    });

    if (testedCount === 0) return 0;
    return Math.round(totalScore / testedCount);
  };

  const readiness = getReadinessPercentage();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-goethe-purple/5 rounded-full translate-x-12 -translate-y-12"></div>
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-goethe-purple font-semibold text-sm tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            Persiapan Mandiri Goethe B1
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Halo, <span className="text-goethe-purple">{settings.name || "Pelajar B1"}</span>!
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">
            Selamat datang di <span className="font-bold">GoetheForge B1</span>. Ujian Goethe B1 bersifat modular. Anda membutuhkan minimal <span className="font-bold text-goethe-purple">60/100 poin</span> di masing-masing modul untuk lulus!
          </p>
        </div>

        {/* Action button to edit settings */}
        <button
          onClick={() => setIsEditingSettings(true)}
          className="flex items-center gap-2 self-start md:self-center px-4 py-2.5 rounded-xl border border-gray-200 hover:border-goethe-purple text-gray-700 hover:text-goethe-purple font-semibold text-sm transition-all cursor-pointer bg-gray-50/50 hover:bg-goethe-light"
        >
          <User className="w-4 h-4" />
          Edit Profil & Tanggal Ujian
        </button>
      </div>

      {/* Countdown & Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Countdown Timer */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold text-sm">Hitung Mundur Ujian</span>
            <Clock className="w-5 h-5 text-goethe-purple" />
          </div>
          <div className="my-4">
            {daysRemaining !== null ? (
              daysRemaining > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-goethe-purple leading-none">{daysRemaining}</span>
                  <span className="text-lg font-bold text-gray-700">Hari lagi</span>
                </div>
              ) : daysRemaining === 0 ? (
                <span className="text-2xl font-extrabold text-success">Hari H Ujian! 🎉 Viel Glück!</span>
              ) : (
                <span className="text-lg font-bold text-gray-500">Ujian telah lewat ({Math.abs(daysRemaining)} hari yang lalu)</span>
              )
            ) : (
              <span className="text-gray-400">Memuat...</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Target Ujian: <span className="font-semibold text-gray-700">{settings.examDate ? new Date(settings.examDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}</span></span>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold text-sm">Streak Belajar</span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="my-4 flex items-baseline gap-1.5">
            <span className="text-5xl font-black text-amber-500 leading-none">{streak.currentStreak}</span>
            <span className="text-lg font-bold text-gray-700">Hari Beruntun</span>
          </div>
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 mt-1">
            <span>Kerjakan latihan apa saja untuk mempertahankan streak!</span>
          </div>
        </div>

        {/* Readiness Gauge */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold text-sm">Estimasi Kesiapan Ujian B1</span>
            <Award className="w-5 h-5 text-success" />
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-black leading-none ${
                readiness >= 80 ? "text-success" : readiness >= 60 ? "text-amber-500" : "text-gray-400"
              }`}>{readiness}%</span>
              <span className="text-xs text-gray-500 font-medium ml-1">
                {readiness >= 80 ? "Siap Lulus B1!" : readiness >= 60 ? "Cukup Siap" : "Perlu Latihan"}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  readiness >= 80 ? "bg-success" : readiness >= 60 ? "bg-amber-500" : "bg-gray-300"
                }`}
                style={{ width: `${readiness}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 mt-1">
            <span>Rata-rata dari nilai kelulusan modular Anda.</span>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-goethe-light border border-goethe-purple/10 rounded-2xl p-5 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-goethe-purple flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-goethe-dark font-bold italic text-base">“{quote.de}”</p>
          <p className="text-gray-600 text-xs font-semibold">{quote.id}</p>
        </div>
      </div>

      {/* Learning Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Modul Latihan Mandiri B1</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Lesen Module */}
          <Link href="/b1/lesen" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-goethe-purple transition-all duration-300 flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-goethe-purple/10 flex items-center justify-center text-goethe-purple group-hover:bg-goethe-purple group-hover:text-white transition-all">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-goethe-purple transition-colors">Lesen (Membaca)</h3>
                <p className="text-gray-500 text-xs font-medium">5 Bagian • 65 Menit • Pemahaman Teks B1</p>
                <p className="text-goethe-purple text-xs font-bold mt-1">
                  Nilai Terakhir: {getLatestScoreInfo("lesen").text}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-goethe-purple transition-colors group-hover:translate-x-1" />
          </Link>

          {/* Hören Module */}
          <Link href="/b1/horen" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-goethe-purple transition-all duration-300 flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-goethe-purple/10 flex items-center justify-center text-goethe-purple group-hover:bg-goethe-purple group-hover:text-white transition-all">
                <Volume2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-goethe-purple transition-colors">Hören (Mendengar)</h3>
                <p className="text-gray-500 text-xs font-medium">4 Bagian • 40 Menit • Percakapan & Radio B1</p>
                <p className="text-goethe-purple text-xs font-bold mt-1">
                  Nilai Terakhir: {getLatestScoreInfo("horen").text}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-goethe-purple transition-colors group-hover:translate-x-1" />
          </Link>

          {/* Schreiben Module */}
          <Link href="/b1/schreiben" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-goethe-purple transition-all duration-300 flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-goethe-purple/10 flex items-center justify-center text-goethe-purple group-hover:bg-goethe-purple group-hover:text-white transition-all">
                <PenTool className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-goethe-purple transition-colors">Schreiben (Menulis)</h3>
                <p className="text-gray-500 text-xs font-medium">3 Tugas • 60 Menit • E-Mail & Opini Forum B1</p>
                <p className="text-goethe-purple text-xs font-bold mt-1">
                  Nilai Terakhir: {getLatestScoreInfo("schreiben").text}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-goethe-purple transition-colors group-hover:translate-x-1" />
          </Link>

          {/* Sprechen Module */}
          <Link href="/b1/sprechen" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-goethe-purple transition-all duration-300 flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-goethe-purple/10 flex items-center justify-center text-goethe-purple group-hover:bg-goethe-purple group-hover:text-white transition-all">
                <Mic className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-goethe-purple transition-colors">Sprechen (Berbicara)</h3>
                <p className="text-gray-500 text-xs font-medium">3 Bagian • 15 Menit • Presentasi & Diskusi B1</p>
                <p className="text-goethe-purple text-xs font-bold mt-1">
                  Status: Panduan & Redemittel Lengkap
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-goethe-purple transition-colors group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-light text-error text-xs font-extrabold uppercase tracking-wide">
            <AlertCircle className="w-3.5 h-3.5" />
            Ujian Simulasi Penuh B1
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Simulasi Ujian Goethe B1 (Echtzeit)</h3>
          <p className="text-gray-600 text-sm">
            Kerjakan modul Lesen (65 m), Hören (40 m), dan Schreiben (60 m) secara berturut-turut tanpa jeda sesuai regulasi asli Goethe-Zertifikat B1.
          </p>
        </div>
        <Link href="/b1/simulasi" className="px-6 py-3 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-goethe-purple/10 hover:shadow-lg text-center cursor-pointer">
          Mulai Simulasi Ujian
        </Link>
      </div>

      {/* Settings Modal (Overlay) */}
      {isEditingSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-gray-900 mb-4">Edit Profil Belajar B1</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Nama Anda</label>
                <input 
                  type="text" 
                  required
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-goethe-purple"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Tanggal Target Ujian B1</label>
                <input 
                  type="date" 
                  required
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-goethe-purple"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSettings(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-goethe-purple text-white font-bold text-sm hover:bg-goethe-purple-hover transition-all cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
