"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, Play, Pause, AlertCircle, CheckCircle, 
  XCircle, ChevronRight, ChevronLeft, RefreshCw, HelpCircle, 
  ListFilter, Info, Eye, SidebarOpen, Clock, Award
} from "lucide-react";
import { HOREN_BANK_B1, HorenSetB1, HorenTeil1Item } from "@/lib/questions_b1";
import { saveModuleProgress } from "@/lib/db";

// Traps helper sidebar
const HOREN_TRAPS = [
  { title: "1. Kata Disebut ≠ Jawaban", desc: "Kata yang terdengar persis sama di audio sering kali merupakan pengecoh. Jawaban benar biasanya berupa sinonim atau kesimpulan." },
  { title: "2. Siapa yang Berbicara?", desc: "Di Teil 4 (diskusi), perhatikan argumen siapa yang sedang dibacakan. Pengecoh sering mengaitkan pernyataan ke pembicara yang salah." },
  { title: "3. Negasi Tersembunyi", desc: "Perhatikan kata penolakan atau kontras seperti 'nein', 'doch', 'nicht', 'leider', 'aber', 'entgegen unserer Vermutung' yang membatalkan pernyataan awal." },
  { title: "4. Batas Putar Audio", desc: "Ingat! Di ujian B1 asli, Teil 1 & 4 diputar DUA KALI, sedangkan Teil 2 & 3 hanya diputar SATU KALI. Latihlah kefokusan Anda!" },
  { title: "5. Keinginan vs Realita", desc: "Pembicara mungkin menyatakan rencana awal (misal: naik mobil), lalu menyebutkan hambatan (macet) sehingga realitanya naik kereta. Jawaban benar adalah realita." }
];

export default function B1HorenModule() {
  const [setIndex, setSetIndex] = useState(0);
  const currentSet: HorenSetB1 = HOREN_BANK_B1[setIndex];

  // UI tabs & sidebar
  const [activeTab, setActiveTab] = useState<"t1" | "t2" | "t3" | "t4" | "results">("t1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exam state
  const [timeLeft, setTimeLeft] = useState(2400); // 40 mins
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Answers state
  const [answersT1, setAnswersT1] = useState<{ [qId: string]: { tf?: string; mc?: string } }>({});
  const [answersT2, setAnswersT2] = useState<{ [qId: string]: string }>({});
  const [answersT3, setAnswersT3] = useState<{ [qId: string]: string }>({});
  const [answersT4, setAnswersT4] = useState<{ [qId: string]: string }>({});

  // TTS & Simulated Player states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playCounts, setPlayCounts] = useState<{ [id: string]: number }>({});
  const [audioProgress, setAudioProgress] = useState<{ [id: string]: number }>({}); // 0 to 100
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Save changes to localStorage Cache
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_b1_horen_answers_t1", JSON.stringify(answersT1));
      localStorage.setItem("goetheforge_b1_horen_answers_t2", JSON.stringify(answersT2));
      localStorage.setItem("goetheforge_b1_horen_answers_t3", JSON.stringify(answersT3));
      localStorage.setItem("goetheforge_b1_horen_answers_t4", JSON.stringify(answersT4));
      localStorage.setItem("goetheforge_b1_horen_play_counts", JSON.stringify(playCounts));
    }
  }, [answersT1, answersT2, answersT3, answersT4, playCounts]);

  // Load cache on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedAnswersT1 = localStorage.getItem("goetheforge_b1_horen_answers_t1");
      const cachedAnswersT2 = localStorage.getItem("goetheforge_b1_horen_answers_t2");
      const cachedAnswersT3 = localStorage.getItem("goetheforge_b1_horen_answers_t3");
      const cachedAnswersT4 = localStorage.getItem("goetheforge_b1_horen_answers_t4");
      const cachedPlayCounts = localStorage.getItem("goetheforge_b1_horen_play_counts");

      if (cachedAnswersT1) setAnswersT1(JSON.parse(cachedAnswersT1));
      if (cachedAnswersT2) setAnswersT2(JSON.parse(cachedAnswersT2));
      if (cachedAnswersT3) setAnswersT3(JSON.parse(cachedAnswersT3));
      if (cachedAnswersT4) setAnswersT4(JSON.parse(cachedAnswersT4));
      if (cachedPlayCounts) setPlayCounts(JSON.parse(cachedPlayCounts));
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = (newIndex = setIndex) => {
    stopSpeaking();
    setSetIndex(newIndex);
    setAnswersT1({});
    setAnswersT2({});
    setAnswersT3({});
    setAnswersT4({});
    setIsSubmitted(false);
    setTimeLeft(2400);
    setPlayCounts({});
    setAudioProgress({});
    setActiveTab("t1");
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setPlayingAudioId(null);
  };

  // TTS Player logic
  const playAudio = (audioId: string, textToSpeak: string, maxPlays: number) => {
    if (playingAudioId === audioId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const currentCount = playCounts[audioId] || 0;
    if (currentCount >= maxPlays) {
      alert(`Batas putar untuk bagian ini sudah habis! Maksimum ${maxPlays}x putar.`);
      return;
    }

    setPlayCounts(prev => ({ ...prev, [audioId]: currentCount + 1 }));
    setPlayingAudioId(audioId);
    setAudioProgress(prev => ({ ...prev, [audioId]: 0 }));

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Look for a German voice
      const voices = window.speechSynthesis.getVoices();
      const deVoice = voices.find(v => v.lang.startsWith("de") || v.lang.includes("DE"));
      if (deVoice) {
        utterance.voice = deVoice;
      }
      
      // B1 speed should be natural but clear
      utterance.rate = 0.88; 

      // Simulate player progress bar based on word count
      const wordsCount = textToSpeak.split(/\s+/).length;
      const estimatedDurationSeconds = (wordsCount / 130) * 60; // 130 words per minute average
      let elapsed = 0;
      
      progressIntervalRef.current = setInterval(() => {
        elapsed += 0.5;
        const progressPercent = Math.min((elapsed / estimatedDurationSeconds) * 100, 99);
        setAudioProgress(prev => ({ ...prev, [audioId]: progressPercent }));
      }, 500);

      utterance.onend = () => {
        setAudioProgress(prev => ({ ...prev, [audioId]: 100 }));
        stopSpeaking();
      };

      utterance.onerror = () => {
        stopSpeaking();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser Anda tidak mendukung Text-to-Speech.");
      setPlayingAudioId(null);
    }
  };

  // Score Calculator
  const calculateScores = () => {
    let t1Correct = 0;
    let t2Correct = 0;
    let t3Correct = 0;
    let t4Correct = 0;

    // Teil 1: 5 items, each has 2 sub-questions (1 TF and 1 MC)
    currentSet.teil1.questions.forEach((q) => {
      const userAns = answersT1[q.id] || {};
      if (userAns.tf === q.tfCorrectAnswer) t1Correct++;
      if (userAns.mc === q.mcCorrectAnswer) t1Correct++;
    });

    // Teil 2: 5 MC questions
    currentSet.teil2.questions.forEach((q) => {
      if (answersT2[q.id] === q.correctAnswer) t2Correct++;
    });

    // Teil 3: 7 TF questions
    currentSet.teil3.questions.forEach((q) => {
      if (answersT3[q.id] === q.correctAnswer) t3Correct++;
    });

    // Teil 4: 8 matching questions
    currentSet.teil4.questions.forEach((q) => {
      if (answersT4[q.id] === q.correctAnswer) t4Correct++;
    });

    const totalRaw = t1Correct + t2Correct + t3Correct + t4Correct;
    const scaledScore = (totalRaw / 30) * 100; // 30 items total, scale to 100

    return {
      t1: t1Correct,
      t2: t2Correct,
      t3: t3Correct,
      t4: t4Correct,
      raw: totalRaw,
      scaled: Math.round(scaledScore * 100) / 100
    };
  };

  const handleSubmit = (auto = false) => {
    if (isSubmitted) return;
    stopSpeaking();
    setIsSubmitted(true);

    const scores = calculateScores();
    saveModuleProgress("horen", scores.scaled, 100, "B1");
    setActiveTab("results");

    if (auto) {
      alert("Waktu simulasi Hören habis! Lembar jawaban telah disubmit otomatis.");
    }
  };

  const scores = calculateScores();
  const isTimeCritical = timeLeft < 300;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 relative">
      
      {/* Sidebar Traps Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 z-40 bg-goethe-purple hover:bg-goethe-purple-hover text-white p-3 rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer transition-all duration-300 hover:scale-105"
      >
        <ListFilter className="w-5 h-5" />
        <span className="text-xs font-bold pr-1">Tips Jebakan Hören</span>
      </button>

      {/* Traps Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-extrabold text-gray-900 text-base">Jebakan & Tips Hören B1</h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold border border-gray-200 px-2 py-1 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
              </div>
              <div className="space-y-4">
                {HOREN_TRAPS.map((t, idx) => (
                  <div key={idx} className="space-y-1.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-goethe-purple text-xs">{t.title}</h4>
                    <p className="text-gray-600 text-[11px] leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-gray-400 text-[10px] text-center pt-4">
              GoetheForge B1 • Pelajari Jebakan untuk Lulus Ujian
            </div>
          </div>
        </div>
      )}

      {/* Header and Set Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <Volume2 className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Modul Hören B1</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Mendengar (Hörverstehen)</h1>
          <p className="text-xs text-gray-500 font-medium">Latih pemahaman mendengarkan Anda dalam bahasa Jerman sesuai format ujian Goethe B1.</p>
        </div>

        {/* Set Selection & Timer */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500">Pilih Set:</label>
            <select
              disabled={isSubmitted}
              value={setIndex}
              onChange={(e) => handleReset(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-goethe-purple"
            >
              {HOREN_BANK_B1.map((set, idx) => (
                <option key={set.id} value={idx}>{set.name}</option>
              ))}
            </select>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold transition-all ${
            isSubmitted
              ? "bg-gray-50 text-gray-500 border-gray-200"
              : isTimeCritical
                ? "bg-error-light text-error border-error animate-pulse"
                : "bg-white text-gray-700 border-gray-200"
          }`}>
            <Clock className={`w-4 h-4 ${isTimeCritical && !isSubmitted ? "text-error" : "text-gray-500"}`} />
            <span>{isSubmitted ? "SELESAI" : formatTime(timeLeft)}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Reset ulang lembar jawaban Anda dan mulai ulang waktu untuk set ini?")) {
                handleReset();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-goethe-purple hover:bg-goethe-light rounded-xl border border-goethe-purple/20 transition-all cursor-pointer bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Ujian</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-gray-200 bg-white p-1.5 rounded-xl shadow-xs gap-1.5">
        {(["t1", "t2", "t3", "t4"] as const).map((tab, idx) => {
          const tabLabel = `Teil ${idx + 1}`;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                stopSpeaking();
                setActiveTab(tab);
              }}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-goethe-purple text-white shadow-sm"
                  : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
        {isSubmitted && (
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === "results"
                ? "bg-success text-white shadow-sm"
                : "text-success bg-success-light hover:bg-success/10"
            }`}
          >
            Hasil Ujian
          </button>
        )}
      </div>

      {/* Module Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* TEIL 1 */}
        {activeTab === "t1" && (
          <div className="p-6 space-y-6">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple flex items-start gap-3">
              <Info className="w-5 h-5 text-goethe-purple flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h3 className="font-bold text-goethe-dark text-sm">Teil 1: Pengumuman Pendek (Diputar 2x)</h3>
                <p className="text-gray-600 text-xs">
                  Anda akan mendengarkan 5 pesan pendek. Untuk setiap pesan, kerjakan 2 tugas: tentukan <b>Richtig/Falsch</b> untuk pernyataan awal, dan pilih jawaban <b>a, b, atau c</b> untuk pertanyaan pilihan ganda.
                </p>
              </div>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {currentSet.teil1.questions.map((q, idx) => {
                const audioId = `b1-h1-item-${idx + 1}`;
                const plays = playCounts[audioId] || 0;
                const isPlaying = playingAudioId === audioId;
                const progress = audioProgress[audioId] || 0;

                return (
                  <div key={q.id} className="p-5 bg-white border border-gray-150 rounded-2xl shadow-xs space-y-4">
                    {/* Audio Controller Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => playAudio(audioId, q.audioText, 2)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all cursor-pointer shadow-sm ${
                            isPlaying ? "bg-amber-500" : "bg-goethe-purple hover:bg-goethe-purple-hover"
                          }`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div>
                          <span className="text-xs font-black text-gray-800">Suara {idx + 1}</span>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Maks: 2x • Sisa Putar: {Math.max(0, 2 - plays)}x</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="flex-1 min-w-[120px] bg-gray-200 h-1.5 rounded-full overflow-hidden relative">
                        <div 
                          className="absolute left-0 top-0 h-full bg-goethe-purple rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Sub-question 1: TF */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">Tugas 1: Richtig / Falsch</span>
                        <p className="text-gray-800 text-sm font-semibold leading-normal">{q.tfQuestion}</p>
                        <div className="flex gap-2">
                          {(["Richtig", "Falsch"] as const).map(opt => {
                            const isSelected = answersT1[q.id]?.tf === opt;
                            return (
                              <button
                                key={opt}
                                disabled={isSubmitted}
                                onClick={() => setAnswersT1(prev => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), tf: opt }
                                }))}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-goethe-purple border-goethe-purple text-white shadow-sm"
                                    : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sub-question 2: MC */}
                      <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6">
                        <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">Tugas 2: Pilihan Ganda</span>
                        <p className="text-gray-800 text-sm font-semibold leading-normal">{q.mcQuestion}</p>
                        <div className="flex flex-col gap-2">
                          {(["a", "b", "c"] as const).map(key => {
                            const isSelected = answersT1[q.id]?.mc === key;
                            return (
                              <button
                                key={key}
                                disabled={isSubmitted}
                                onClick={() => setAnswersT1(prev => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), mc: key }
                                }))}
                                className={`text-left px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-goethe-purple border-goethe-purple text-white shadow-sm"
                                    : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                              >
                                <span className="font-bold mr-1 uppercase">{key}.</span> {q.mcOptions[key]}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TEIL 2 */}
        {activeTab === "t2" && (
          <div className="p-6 space-y-6">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple flex items-start gap-3">
              <Info className="w-5 h-5 text-goethe-purple flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h3 className="font-bold text-goethe-dark text-sm">Teil 2: Monolog / Presentasi (Diputar 1x)</h3>
                <p className="text-gray-600 text-xs">
                  Anda akan mendengarkan pembicaraan satu arah (seperti pemandu wisata). Jawablah 5 pertanyaan pilihan ganda berikut (a, b, atau c).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
              {/* Left Column: Audio controller */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4">
                <h4 className="font-extrabold text-gray-900 text-sm">Pemutar Audio Monolog</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Tekan tombol putar di bawah. Dengarkan petunjuk tentang istana kuno dengan saksama.
                </p>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-250 shadow-xs">
                  <button
                    onClick={() => playAudio("b1-h2-main", currentSet.teil2.audioText, 1)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shadow-sm ${
                      playingAudioId === "b1-h2-main" ? "bg-amber-500" : "bg-goethe-purple hover:bg-goethe-purple-hover"
                    }`}
                  >
                    {playingAudioId === "b1-h2-main" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                      <span>Maks: 1x</span>
                      <span>Sisa: {Math.max(0, 1 - (playCounts["b1-h2-main"] || 0))}x</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute left-0 top-0 h-full bg-goethe-purple rounded-full transition-all"
                        style={{ width: `${audioProgress["b1-h2-main"] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Questions */}
              <div className="lg:col-span-2 space-y-4">
                {currentSet.teil2.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white border border-gray-150 rounded-xl shadow-xs space-y-3">
                    <p className="text-gray-800 text-sm font-semibold">{idx + 11}. {q.question}</p>
                    <div className="flex flex-col gap-2">
                      {(["a", "b", "c"] as const).map(key => {
                        const isSelected = answersT2[q.id] === key;
                        return (
                          <button
                            key={key}
                            disabled={isSubmitted}
                            onClick={() => setAnswersT2(prev => ({ ...prev, [q.id]: key }))}
                            className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-goethe-purple border-goethe-purple text-white shadow-xs"
                                : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                            }`}
                          >
                            <span className="font-bold mr-1.5 uppercase">{key}.</span> {q.options[key]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEIL 3 */}
        {activeTab === "t3" && (
          <div className="p-6 space-y-6">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple flex items-start gap-3">
              <Info className="w-5 h-5 text-goethe-purple flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h3 className="font-bold text-goethe-dark text-sm">Teil 3: Percakapan Santai (Diputar 1x)</h3>
                <p className="text-gray-600 text-xs">
                  Anda akan mendengarkan percakapan informal antara dua orang. Tentukan apakah 7 pernyataan di bawah bernilai <b>Richtig</b> atau <b>Falsch</b> berdasarkan pembicaraan mereka.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
              {/* Left Column: Audio controller */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4">
                <h4 className="font-extrabold text-gray-900 text-sm">Pemutar Audio Percakapan</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Dengarkan pembicaraan tentang rencana kuliah di Spanyol antara Ben dan konsultan International Office.
                </p>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-250 shadow-xs">
                  <button
                    onClick={() => playAudio("b1-h3-main", currentSet.teil3.audioText, 1)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shadow-sm ${
                      playingAudioId === "b1-h3-main" ? "bg-amber-500" : "bg-goethe-purple hover:bg-goethe-purple-hover"
                    }`}
                  >
                    {playingAudioId === "b1-h3-main" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                      <span>Maks: 1x</span>
                      <span>Sisa: {Math.max(0, 1 - (playCounts["b1-h3-main"] || 0))}x</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute left-0 top-0 h-full bg-goethe-purple rounded-full transition-all"
                        style={{ width: `${audioProgress["b1-h3-main"] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Questions */}
              <div className="lg:col-span-2 space-y-4">
                {currentSet.teil3.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white border border-gray-150 rounded-xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex gap-2">
                      <span className="font-black text-goethe-purple text-xs">{idx + 16}.</span>
                      <p className="text-gray-800 text-xs font-semibold leading-normal">{q.statement}</p>
                    </div>

                    <div className="flex gap-2 shrink-0 pl-6 sm:pl-0">
                      {(["Richtig", "Falsch"] as const).map(opt => {
                        const isSelected = answersT3[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={isSubmitted}
                            onClick={() => setAnswersT3(prev => ({ ...prev, [q.id]: opt }))}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-goethe-purple border-goethe-purple text-white shadow-sm"
                                : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEIL 4 */}
        {activeTab === "t4" && (
          <div className="p-6 space-y-6">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple flex items-start gap-3">
              <Info className="w-5 h-5 text-goethe-purple flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h3 className="font-bold text-goethe-dark text-sm">Teil 4: Diskusi Radio (Diputar 2x)</h3>
                <p className="text-gray-600 text-xs">
                  Anda akan mendengarkan diskusi radio mengenai PR sekolah antara Moderator (Frau Berger), Kepala Sekolah (Herr Dr. Becker), dan Orang Tua (Frau Neumann). Tentukan siapa pemilik opini/pernyataan berikut:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
              {/* Left Column: Audio controller */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4">
                <h4 className="font-extrabold text-gray-900 text-sm">Pemutar Audio Wawancara</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Diskusi berdurasi panjang dengan perdebatan sengit tentang PR di sekolah.
                </p>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-250 shadow-xs">
                  <button
                    onClick={() => playAudio("b1-h4-main", currentSet.teil4.audioText, 2)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shadow-sm ${
                      playingAudioId === "b1-h4-main" ? "bg-amber-500" : "bg-goethe-purple hover:bg-goethe-purple-hover"
                    }`}
                  >
                    {playingAudioId === "b1-h4-main" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                      <span>Maks: 2x</span>
                      <span>Sisa: {Math.max(0, 2 - (playCounts["b1-h4-main"] || 0))}x</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute left-0 top-0 h-full bg-goethe-purple rounded-full transition-all"
                        style={{ width: `${audioProgress["b1-h4-main"] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Pilihan Pembicara:</span>
                  <div className="text-xs space-y-1 text-gray-700 font-medium">
                    <p><span className="font-bold text-goethe-purple">A:</span> Moderator ({currentSet.teil4.moderatorName})</p>
                    <p><span className="font-bold text-goethe-purple">B:</span> {currentSet.teil4.guest1Name}</p>
                    <p><span className="font-bold text-goethe-purple">C:</span> {currentSet.teil4.guest2Name}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Questions */}
              <div className="lg:col-span-2 space-y-4">
                {currentSet.teil4.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white border border-gray-150 rounded-xl shadow-xs space-y-3">
                    <div className="flex gap-2">
                      <span className="font-black text-goethe-purple text-xs">{idx + 23}.</span>
                      <p className="text-gray-800 text-xs font-semibold leading-normal">{q.statement}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pl-6">
                      {[
                        { key: "a", label: `A: Moderator` },
                        { key: "b", label: `B: ${currentSet.teil4.guest1Name}` },
                        { key: "c", label: `C: ${currentSet.teil4.guest2Name}` }
                      ].map(opt => {
                        const isSelected = answersT4[q.id] === opt.key;
                        return (
                          <button
                            key={opt.key}
                            disabled={isSubmitted}
                            onClick={() => setAnswersT4(prev => ({ ...prev, [q.id]: opt.key }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-goethe-purple border-goethe-purple text-white shadow-sm"
                                : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === "results" && isSubmitted && (
          <div className="p-6 text-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="max-w-md mx-auto bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-goethe-purple/10 flex items-center justify-center text-goethe-purple">
                <Award className="w-12 h-12" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900">Ujian Selesai!</h3>
                <p className="text-xs text-gray-500 font-semibold uppercase">Hasil Evaluasi Modul Hören B1</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-5 my-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">Jawaban Benar</span>
                  <p className="text-3xl font-black text-gray-900">{scores.raw} <span className="text-lg text-gray-400">/ 30</span></p>
                </div>
                <div className="text-center space-y-1 border-l border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Skor Goethe (100)</span>
                  <p className={`text-3xl font-black ${scores.scaled >= 60 ? "text-success" : "text-error"}`}>{scores.scaled}</p>
                </div>
              </div>

              <div className="space-y-2">
                {scores.scaled >= 60 ? (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-success-light text-success text-sm font-extrabold">
                    <CheckCircle className="w-4 h-4" />
                    BESTANDEN (LULUS)
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-error-light text-error text-sm font-extrabold">
                    <XCircle className="w-4 h-4" />
                    NICHT BESTANDEN (TIDAK LULUS)
                  </div>
                )}
                <p className="text-gray-500 text-xs leading-relaxed px-4">
                  {scores.scaled >= 60 
                    ? "Hebat sekali! Skor mendengarkan B1 Anda sudah mencukupi ambang batas kelulusan (min. 60 poin)."
                    : "Skor Anda masih di bawah 60 poin. Silakan pelajari kembali pembahasan di bawah."}
                </p>
              </div>
            </div>

            {/* Explanation details */}
            <div className="max-w-3xl mx-auto text-left space-y-6">
              <h4 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-goethe-purple" />
                <span>Analisis Jawaban & Transkrip:</span>
              </h4>

              {/* Teil 1 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 1: Pengumuman Pendek</h5>
                {currentSet.teil1.questions.map((q, idx) => {
                  const userAns = answersT1[q.id] || {};
                  const tfCorrect = userAns.tf === q.tfCorrectAnswer;
                  const mcCorrect = userAns.mc === q.mcCorrectAnswer;
                  return (
                    <div key={q.id} className="border-b border-gray-250 pb-4 last:border-b-0 last:pb-0 space-y-2">
                      <span className="font-black text-gray-800 text-xs uppercase">Pesan {idx + 1}</span>
                      <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100 leading-relaxed italic">
                        <b>Transkrip:</b> {q.audioText}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 text-xs">
                        <div className="space-y-1">
                          <p className="font-bold flex items-center gap-1">
                            {tfCorrect ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <XCircle className="w-3.5 h-3.5 text-error" />}
                            T1: {q.tfQuestion}
                          </p>
                          <p className="text-[11px] text-gray-500">Anda: {userAns.tf || "-"} | Kunci: {q.tfCorrectAnswer}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold flex items-center gap-1">
                            {mcCorrect ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <XCircle className="w-3.5 h-3.5 text-error" />}
                            T2: {q.mcQuestion}
                          </p>
                          <p className="text-[11px] text-gray-500">Anda: {userAns.mc ? userAns.mc.toUpperCase() : "-"} | Kunci: {q.mcCorrectAnswer.toUpperCase()}</p>
                        </div>
                      </div>
                      <p className="text-goethe-purple text-xs font-semibold pl-2 italic">Pembahasan: {q.explanation}</p>
                    </div>
                  );
                })}
              </div>

              {/* Teil 2 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 2: Monolog Schloss Albrechtsburg</h5>
                <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100 leading-relaxed italic">
                  <b>Transkrip Monolog:</b> {currentSet.teil2.audioText}
                </div>
                {currentSet.teil2.questions.map((q, idx) => {
                  const userAns = answersT2[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 space-y-1 pt-2">
                      <p className="text-xs font-bold flex items-center gap-1 text-gray-800">
                        {isCorrect ? <CheckCircle className="w-3.5 h-3.5 text-success animate-bounce" /> : <XCircle className="w-3.5 h-3.5 text-error" />}
                        {idx + 11}. {q.question}
                      </p>
                      <p className="text-[11px] text-gray-500 pl-4.5">
                        Anda: {userAns ? userAns.toUpperCase() : "-"} | Kunci: {q.correctAnswer.toUpperCase()}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-4.5 italic">Pembahasan: {q.explanation}</p>
                    </div>
                  );
                })}
              </div>

              {/* Teil 3 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 3: Percakapan Kuliah Spanyol</h5>
                <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100 leading-relaxed italic">
                  <b>Transkrip Percakapan:</b> {currentSet.teil3.audioText}
                </div>
                {currentSet.teil3.questions.map((q, idx) => {
                  const userAns = answersT3[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 space-y-1 pt-2">
                      <p className="text-xs font-bold flex items-center gap-1 text-gray-800">
                        {isCorrect ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <XCircle className="w-3.5 h-3.5 text-error" />}
                        {idx + 16}. {q.statement}
                      </p>
                      <p className="text-[11px] text-gray-500 pl-4.5">
                        Anda: {userAns || "-"} | Kunci: {q.correctAnswer}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-4.5 italic">Pembahasan: {q.explanation}</p>
                    </div>
                  );
                })}
              </div>

              {/* Teil 4 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 4: Diskusi Radio PR Sekolah</h5>
                <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100 leading-relaxed italic">
                  <b>Transkrip Diskusi:</b> {currentSet.teil4.audioText}
                </div>
                {currentSet.teil4.questions.map((q, idx) => {
                  const userAns = answersT4[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 space-y-1 pt-2">
                      <p className="text-xs font-bold flex items-center gap-1 text-gray-800">
                        {isCorrect ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <XCircle className="w-3.5 h-3.5 text-error" />}
                        {idx + 23}. {q.statement}
                      </p>
                      <p className="text-[11px] text-gray-500 pl-4.5">
                        Anda: {userAns ? userAns.toUpperCase() : "-"} | Kunci: {q.correctAnswer.toUpperCase()}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-4.5 italic">Pembahasan: {q.explanation}</p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <button
          disabled={activeTab === "t1"}
          onClick={() => {
            stopSpeaking();
            const tabs = ["t1", "t2", "t3", "t4"] as const;
            const curIdx = tabs.indexOf(activeTab as any);
            if (curIdx > 0) setActiveTab(tabs[curIdx - 1]);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {!isSubmitted ? (
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin mensubmit seluruh lembar jawaban Hören B1 ini?")) {
                handleSubmit();
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-goethe-purple/10 cursor-pointer"
          >
            Submit Jawaban
          </button>
        ) : (
          activeTab !== "results" && (
            <button
              onClick={() => {
                stopSpeaking();
                setActiveTab("results");
              }}
              className="px-6 py-2.5 rounded-xl bg-success hover:bg-success/90 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-success/10 cursor-pointer"
            >
              Lihat Hasil
            </button>
          )
        )}

        <button
          disabled={activeTab === "t4" || (activeTab === "results" && isSubmitted)}
          onClick={() => {
            stopSpeaking();
            const tabs = ["t1", "t2", "t3", "t4"] as const;
            const curIdx = tabs.indexOf(activeTab as any);
            if (curIdx >= 0 && curIdx < 3) setActiveTab(tabs[curIdx + 1]);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-goethe-purple border border-goethe-purple/20 hover:bg-goethe-light transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        >
          Berikutnya
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
