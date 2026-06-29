"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, BookOpen, Volume2, PenTool, Mic, 
  Flame, Award, Calendar, ChevronRight, User, Sparkles 
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
  { de: "Man lernt nie aus.", id: "Kita tidak pernah berhenti belajar. Setiap hari adalah kemajuan." },
  { de: "Erfolg hat drei Buchstaben: TUN!", id: "Sukses hanya terdiri dari tiga huruf: TUN! (LAKUKAN!)" },
  { de: "Der Weg ist das Ziel.", id: "Perjalanan belajar itu sendiri adalah tujuan kesuksesan Anda." }
];

export default function Home() {
  const [settings, setSettings] = useState<UserSettings>({ name: "", examDate: "" });
  const [progress, setProgress] = useState<ProgressState>({ lesen: [], horen: [], schreiben: [], sprechen: [] });
  const [vocabularyCount, setVocabularyCount] = useState({ learned: 0, total: 300 });
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, lastActiveDate: "", activityHistory: [] });
  
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [quote, setQuote] = useState({ de: "", id: "" });

  // Load data on mount
  useEffect(() => {
    // Initial updates
    updateStreak();
    
    const loadedSettings = getSettings();
    if (loadedSettings.level === "B1") {
      window.location.href = "/b1";
      return;
    }
    const loadedProgress = getProgress();
    const loadedWortschatz = getWortschatzProgress();
    const loadedStreak = getStreak();

    setSettings(loadedSettings);
    setNewName(loadedSettings.name);
    setNewDate(loadedSettings.examDate);
    setProgress(loadedProgress);
    setStreak(loadedStreak);

    // Count vocabulary
    const learned = Object.values(loadedWortschatz).filter(status => status === "learned").length;
    setVocabularyCount({ learned, total: 300 });

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
    // Update every hour
    const timer = setInterval(calculateTime, 3600000);
    return () => clearInterval(timer);
  }, [settings.examDate]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDate) return;
    
    const updated = { name: newName, examDate: newDate };
    saveSettings(updated);
    setSettings(updated);
    setIsEditingSettings(false);
  };

  const getLatestScoreInfo = (moduleName: keyof ProgressState) => {
    const list = progress[moduleName];
    if (!list || list.length === 0) return { text: "Belum ada riwayat", percent: 0, score: 0 };
    
    const latest = list[list.length - 1];
    // Goethe-Zertifikat A2 scores are scaled to 25
    // Let's assume input score is out of maxScore, let's normalize to 25
    const scoreInPunkte = (latest.score / latest.maxScore) * 25;
    const rounded = Math.round(scoreInPunkte * 100) / 100;
    const percent = (latest.score / latest.maxScore) * 100;

    return {
      text: `${rounded} / 25 Punkte (${Math.round(percent)}%)`,
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
            Persiapan Mandiri Goethe A2
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Halo, <span className="text-goethe-purple">{settings.name === "Pelajar B1" ? "Pelajar A2" : settings.name || "Pelajar A2"}</span>!
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">
            Selamat datang di <span className="font-bold">GoetheForge A2</span>. Ujian Goethe A2 terdiri dari 4 modul masing-masing berbobot 25 poin. Anda butuh minimal 60/100 poin (BESTANDEN) untuk lulus!
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
            <span className="text-gray-500 font-semibold text-sm">Estimasi Kesiapan Ujian</span>
            <Award className="w-5 h-5 text-success" />
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-black leading-none ${
                readiness >= 80 ? "text-success" : readiness >= 60 ? "text-amber-500" : "text-gray-400"
              }`}>{readiness}%</span>
              <span className="text-xs text-gray-500 font-medium ml-1">
                {readiness >= 80 ? "Siap Lulus!" : readiness >= 60 ? "Cukup Siap" : "Perlu Latihan"}
              </span>
            </div>
            {/* Progress bar visual */}
            <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  readiness >= 80 ? "bg-success" : readiness >= 60 ? "bg-amber-500" : "bg-gray-300"
                }`}
                style={{ width: `${readiness || 1}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 mt-1 flex justify-between items-center">
            <span>Kosakata dihafal: <span className="font-semibold text-gray-700">{vocabularyCount.learned} / {vocabularyCount.total}</span></span>
            <Link href="/wortschatz" className="text-goethe-purple hover:underline font-bold">Pelajari &rarr;</Link>
          </div>
        </div>
      </div>

      {/* Progress Dashboard Modules */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">4 Modul Utama Ujian</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LESEN */}
          {renderModuleCard(
            "Lesen (Membaca)", 
            "30 Menit • 4 Bagian • 20 Soal PG & Zuordnen", 
            "lesen", 
            "/lesen", 
            BookOpen, 
            "text-blue-500 bg-blue-50"
          )}

          {/* HÖREN */}
          {renderModuleCard(
            "Hören (Mendengar)", 
            "30 Menit • 4 Bagian • Audio Player & PG", 
            "horen", 
            "/horen", 
            Volume2, 
            "text-purple-500 bg-purple-50"
          )}

          {/* SCHREIBEN */}
          {renderModuleCard(
            "Schreiben (Menulis)", 
            "30 Menit • 2 Bagian • SMS & Email Formal", 
            "schreiben", 
            "/schreiben", 
            PenTool, 
            "text-emerald-500 bg-emerald-50"
          )}

          {/* SPRECHEN */}
          {renderModuleCard(
            "Sprechen (Berbicara)", 
            "15 Menit • 3 Bagian • AI Partner & Jadwal", 
            "sprechen", 
            "/sprechen", 
            Mic, 
            "text-rose-500 bg-rose-50"
          )}
        </div>
      </div>

      {/* Motivational Quote Card */}
      <div className="bg-goethe-light rounded-2xl p-6 border border-goethe-purple/10 flex items-start gap-4 shadow-sm relative overflow-hidden">
        <span className="text-4xl text-goethe-purple/20 font-serif leading-none select-none absolute top-4 left-4">“</span>
        <div className="pl-6 space-y-2 relative z-10">
          <p className="text-lg font-bold text-goethe-dark italic leading-snug">
            {quote.de}
          </p>
          <p className="text-sm text-gray-600 font-medium">
            &mdash; {quote.id}
          </p>
        </div>
      </div>

      {/* Edit Settings Modal */}
      {isEditingSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pengaturan Profil Ujian</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Panggilan Anda</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-goethe-purple focus:border-transparent text-sm"
                  placeholder="Contoh: Budi"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Ujian Goethe A2 Anda</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-goethe-purple focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSettings(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-goethe-purple hover:bg-goethe-purple-hover text-white rounded-xl text-sm font-semibold shadow-md shadow-goethe-purple/20 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Helper to render a module card
  function renderModuleCard(
    title: string, 
    desc: string, 
    key: keyof ProgressState, 
    href: string, 
    Icon: React.ElementType,
    iconClass: string
  ) {
    const latest = getLatestScoreInfo(key);
    
    // Determine status color based on score out of 25
    let scoreColor = "text-gray-500 bg-gray-50 border-gray-100";
    let barColor = "bg-gray-300";

    if (latest.percent > 0) {
      if (latest.score >= 15) {
        scoreColor = "text-success bg-success-light border-success/15";
        barColor = "bg-success";
      } else if (latest.score >= 12) {
        scoreColor = "text-amber-600 bg-warning-light border-warning/20";
        barColor = "bg-warning";
      } else {
        scoreColor = "text-error bg-error-light border-error/15";
        barColor = "bg-error";
      }
    }

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between gap-6 group">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${iconClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-goethe-purple transition-colors">{title}</h3>
            <p className="text-xs text-gray-500 font-medium">{desc}</p>
          </div>
        </div>

        {/* Score & Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-gray-400">Skor Terakhir:</span>
            <span className={`px-2 py-0.5 rounded-md border ${scoreColor}`}>
              {latest.text}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${latest.percent || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Link */}
        <Link 
          href={href} 
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 group-hover:bg-goethe-purple text-gray-700 group-hover:text-white font-semibold text-sm border border-gray-100 group-hover:border-goethe-purple transition-all cursor-pointer shadow-sm group-hover:shadow-goethe-purple/10"
        >
          Mulai Latihan
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    );
  }
}
