"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, Flame, Award, Calendar, AlertCircle, 
  CheckCircle, ArrowRight, BookOpen, Volume2, PenTool, Mic, TrendingUp 
} from "lucide-react";
import { 
  getProgress, getExamHistory, getStreak,
  ProgressState, ExamAttempt, StreakData 
} from "@/lib/db";

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressState>({ lesen: [], horen: [], schreiben: [], sprechen: [] });
  const [examHistory, setExamHistory] = useState<ExamAttempt[]>([]);
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, lastActiveDate: "", activityHistory: [] });

  useEffect(() => {
    setProgress(getProgress());
    setExamHistory(getExamHistory());
    setStreak(getStreak());
  }, []);

  // Calculate stats
  const getAverageScore = (key: keyof ProgressState) => {
    const list = progress[key];
    if (!list || list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 25, 0);
    return Math.round((sum / list.length) * 10) / 10;
  };

  const avgLesen = getAverageScore("lesen");
  const avgHoren = getAverageScore("horen");
  const avgSchreiben = getAverageScore("schreiben");
  const avgSprechen = getAverageScore("sprechen");

  const getBestScore = (key: keyof ProgressState) => {
    const list = progress[key];
    if (!list || list.length === 0) return 0;
    const scores = list.map(c => (c.score / c.maxScore) * 25);
    return Math.round(Math.max(...scores) * 10) / 10;
  };

  const bestLesen = getBestScore("lesen");
  const bestHoren = getBestScore("horen");
  const bestSchreiben = getBestScore("schreiben");
  const bestSprechen = getBestScore("sprechen");

  // Determine weakest point
  const getWeakestModule = () => {
    const scores = [
      { name: "Lesen", score: avgLesen, href: "/lesen", icon: BookOpen, color: "text-blue-500 bg-blue-50" },
      { name: "Hören", score: avgHoren, href: "/horen", icon: Volume2, color: "text-purple-500 bg-purple-50" },
      { name: "Schreiben", score: avgSchreiben, href: "/schreiben", icon: PenTool, color: "text-emerald-500 bg-emerald-50" },
      { name: "Sprechen", score: avgSprechen, href: "/sprechen", icon: Mic, color: "text-rose-500 bg-rose-50" }
    ];
    
    // Filter out modules that haven't been tried yet (score === 0)
    const tested = scores.filter(s => s.score > 0);
    if (tested.length === 0) return null;

    tested.sort((a, b) => a.score - b.score);
    return tested[0]; // module with lowest average score
  };

  const weakPoint = getWeakestModule();

  // SVG Chart points generator
  // We'll graph the latest 6 exam attempts in examHistory
  const generateChartPoints = (width: number, height: number) => {
    if (examHistory.length < 2) return null;
    
    const maxDataPoints = 6;
    const data = examHistory.slice(-maxDataPoints);
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const xStep = chartWidth / (data.length - 1);
    
    // Y scale is 0 to 100 points
    return data.map((d, index) => {
      const x = padding + index * xStep;
      const y = padding + chartHeight - (d.totalScore / 100) * chartHeight;
      return { x, y, score: d.totalScore, date: new Date(d.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) };
    });
  };

  const chartWidth = 500;
  const chartHeight = 220;
  const chartPoints = generateChartPoints(chartWidth, chartHeight);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <BarChart3 className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Analisis Progress</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 font-sans">Perkembangan Belajar Anda</h1>
          <p className="text-xs text-gray-500 font-medium">Pantau riwayat pengerjaan modul, streak belajar harian, serta tren nilai simulasi Anda.</p>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/50 px-4 py-2.5 rounded-xl text-amber-700">
            <Flame className="w-5 h-5 fill-amber-500 stroke-amber-500 animate-pulse" />
            <div>
              <span className="block text-[9px] font-bold text-amber-500 uppercase leading-none">Streak</span>
              <span className="text-base font-extrabold">{streak.currentStreak} Hari</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200/50 px-4 py-2.5 rounded-xl text-goethe-purple">
            <Award className="w-5 h-5 animate-pulse" />
            <div>
              <span className="block text-[9px] text-goethe-purple font-bold uppercase leading-none">Simulasi</span>
              <span className="text-base font-extrabold">{examHistory.length} Kali</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Module Stats & Weak Points */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module Averages (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-6">
          <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-wide">Rata-rata Skor per Modul</h3>
          
          <div className="space-y-4">
            {renderModuleProgressBar("Lesen (Membaca)", avgLesen, bestLesen, "text-blue-500", "bg-blue-500")}
            {renderModuleProgressBar("Hören (Mendengar)", avgHoren, bestHoren, "text-purple-500", "bg-purple-500")}
            {renderModuleProgressBar("Schreiben (Menulis)", avgSchreiben, bestSchreiben, "text-emerald-500", "bg-emerald-500")}
            {renderModuleProgressBar("Sprechen (Berbicara)", avgSprechen, bestSprechen, "text-rose-500", "bg-rose-500")}
          </div>
        </div>

        {/* Weak Point Analysis Card (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-wide">Analisis Kelemahan</h3>
            {weakPoint ? (
              <div className="space-y-4 pt-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${weakPoint.color}`}>
                    <weakPoint.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">Modul Paling Lemah</span>
                    <span className="text-base font-black text-gray-900">{weakPoint.name} (Rata-rata: {weakPoint.score}/25)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Rata-rata poin Anda pada modul <span className="font-bold text-gray-800">{weakPoint.name}</span> masih di bawah modul lainnya. Kami merekomendasikan untuk meluangkan lebih banyak waktu di halaman latihan ini.
                </p>
              </div>
            ) : (
              <div className="space-y-2 pt-3 text-center py-6">
                <CheckCircle className="w-10 h-10 text-success mx-auto" />
                <h4 className="font-bold text-xs text-gray-800">Progress Cukup Merata</h4>
                <p className="text-[11px] text-gray-500">Anda belum merekam latihan atau nilai Anda sangat seimbang. Kerjakan latihan di dashboard!</p>
              </div>
            )}
          </div>

          {weakPoint && (
            <Link 
              href={weakPoint.href} 
              className="mt-6 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white text-xs font-bold transition-all shadow-md shadow-goethe-purple/10"
            >
              Latih Modul {weakPoint.name} Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* SVG Chart: Simulation History Trends */}
      {examHistory.length >= 2 && chartPoints ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <TrendingUp className="w-4.5 h-4.5 text-goethe-purple" />
            <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">Tren Nilai Ujian Simulasi</h3>
          </div>
          
          <div className="w-full flex justify-center py-2 overflow-x-auto scrollbar-thin">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-xl h-auto">
              {/* Grid Lines */}
              {[20, 40, 60, 80, 100].map((gridLine) => {
                const y = chartHeight - 30 - (gridLine / 100) * (chartHeight - 60);
                return (
                  <g key={gridLine}>
                    <line x1="30" y1={y} x2={chartWidth - 30} y2={y} stroke="#f1f1f1" strokeWidth="1" />
                    <text x="10" y={y + 4} fill="#999" fontSize="9" fontFamily="monospace" fontWeight="bold">{gridLine}</text>
                  </g>
                );
              })}

              {/* Draw connection line */}
              <path
                d={chartPoints.map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ")}
                fill="none"
                stroke="#6b0080"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Draw Data Points circles */}
              {chartPoints.map((pt, idx) => (
                <g key={idx} className="group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5.5"
                    fill="#ffffff"
                    stroke="#6b0080"
                    strokeWidth="3.5"
                    className="transition-all duration-200 cursor-pointer hover:r-7"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    fill="#6b0080"
                    fontSize="10"
                    fontWeight="black"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {pt.score}
                  </text>
                  <text
                    x={pt.x}
                    y={chartHeight - 10}
                    fill="#777"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {pt.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      ) : null}

      {/* Complete Simulation Log */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Calendar className="w-4 h-4 text-goethe-purple" />
            Riwayat Simulasi Lengkap
          </h3>
        </div>

        {examHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-extrabold uppercase border-b border-gray-100">
                  <th className="p-4">Tanggal / Waktu</th>
                  <th className="p-4">Lesen</th>
                  <th className="p-4">Hören</th>
                  <th className="p-4">Schreiben</th>
                  <th className="p-4">Sprechen</th>
                  <th className="p-4">Skor Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {examHistory.slice().reverse().map((attempt, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 font-medium">
                    <td className="p-4 text-gray-500">
                      {new Date(attempt.date).toLocaleString("id-ID", { 
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 text-gray-700 font-semibold">{attempt.lesenScore} / 25</td>
                    <td className="p-4 text-gray-700 font-semibold">{attempt.horenScore} / 25</td>
                    <td className="p-4 text-gray-700 font-semibold">{attempt.schreibenScore} / 25</td>
                    <td className="p-4 text-gray-700 font-semibold">{attempt.sprechenScore ?? "-"} / 25</td>
                    <td className="p-4 text-goethe-purple font-black text-sm">{attempt.totalScore} / 100</td>
                    <td className="p-4">
                      {attempt.passed ? (
                        <span className="px-2.5 py-1 text-[10px] font-bold bg-success-light text-success border border-success/15 rounded-md">BESTANDEN</span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-bold bg-error-light text-error border border-error/15 rounded-md">FAIL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <p className="font-bold">Belum ada riwayat simulasi ujian.</p>
            <p className="text-[11px] leading-relaxed max-w-xs mx-auto">Selesaikan set lengkap di menu <strong>Simulasi</strong> untuk menguji ketahanan dan kemampuan Anda secara riil!</p>
            <Link 
              href="/simulasi" 
              className="inline-block mt-4 px-5 py-2.5 bg-goethe-purple hover:bg-goethe-purple-hover text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Mulai Ujian Pertama
            </Link>
          </div>
        )}
      </div>

    </div>
  );

  // Custom Progress bar drawer for module card
  function renderModuleProgressBar(title: string, avgScore: number, bestScore: number, textStyle: string, bgStyle: string) {
    const percent = Math.min((avgScore / 25) * 100, 100);
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-gray-700">{title}</span>
          <span className="text-gray-400">Rata-rata: <span className={`font-black ${textStyle}`}>{avgScore} / 25</span> (Terbaik: {bestScore})</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${bgStyle}`} style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    );
  }
}
