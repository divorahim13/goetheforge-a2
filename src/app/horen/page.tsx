"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, Play, Pause, AlertCircle, CheckCircle, 
  XCircle, ChevronRight, ChevronLeft, RefreshCw, HelpCircle, 
  ListFilter, Info, Eye, SidebarOpen, SidebarClose, Clock, Award
} from "lucide-react";
import { HOREN_BANK, HorenSet, HorenQuestion } from "@/lib/questions";
import { saveModuleProgress } from "@/lib/db";

// Trap descriptions for the sidebar
const HOREN_TRAPS = [
  { title: "1. Kata disebut ≠ jawaban", desc: "Kata yang terdengar persis sama di audio sering kali merupakan pengecoh. Jawaban benar biasanya diungkapkan dengan kata lain (sinonim) atau kalimat pembatalan setelah kata tersebut disebut." },
  { title: "2. Siapa melakukan apa", desc: "Dalam percakapan dengan dua orang, perhatikan siapa yang melakukan aksi tertentu. Pengecoh sering menyebutkan bahwa Orang A melakukan sesuatu, padahal soal menanyakan tentang Orang B." },
  { title: "3. Q20 fokus lemah", desc: "Pertanyaan terakhir di Teil 4 terkadang memerlukan kesimpulan umum dari seluruh wawancara, bukan hanya detail tunggal. Jangan terburu-buru mengambil kesimpulan di kalimat awal." },
  { title: "4. Asosiasi Visual", desc: "Di Teil 3, gambar pilihan ganda dirancang untuk memancing asosiasi cepat. Misalnya, mendengar kata 'Hose' (celana) langsung memilih celana, padahal dia akhirnya membatalkan pembelian celana tersebut." },
  { title: "5. Keinginan vs Realita", desc: "Sering kali pembicara menyebutkan apa yang ingin mereka lakukan (terbang/naik mobil), namun karena keadaan (macet/habis tiket), realitanya mereka naik kereta. Jawaban benar adalah realita." },
  { title: "6. Angka hampir sama", desc: "Jam, harga, dan nomor peron sering kali mirip. Contoh: 120 (harga asli), 80 (besok), 60 (hari ini). Dengarkan preposisi waktu (heute, ab morgen, statt) dengan cermat." },
  { title: "7. Perfekt vs Präsens", desc: "Perbedaan waktu (tenses). Pembicara menceritakan pekerjaan masa lalunya (früher... Kellner) dan pekerjaan saat ini (jetzt... Rezeption). Soal menanyakan pekerjaan SEKARANG." },
  { title: "8. Negasi tersembunyi", desc: "Kata-kata seperti 'kein-', 'nicht', 'leider', 'schade', 'außer' membalikkan makna kalimat. Kalimat positif terdengar di awal, tetapi dinegasikan di akhir kalimat." },
  { title: "9. Kejadian vs Akibat", desc: "Pahami hubungan sebab akibat. Misalnya: dia terlambat bukan karena bangun kesiangan, tetapi karena bus mogok di jalan. Bedakan pemicunya." },
  { title: "10. Sukarela vs Wajib", desc: "Perhatikan modal verben seperti 'müssen' (wajib) vs 'können/dürfen' (boleh/sukarela) di bagian wawancara Teil 4." }
];

export default function HorenModule() {
  const [setIndex, setSetIndex] = useState(0);
  const currentSet: HorenSet = HOREN_BANK[setIndex];

  // UI tabs & sidebar
  const [activeTab, setActiveTab] = useState<"t1" | "t2" | "t3" | "t4" | "results">("t1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exam state
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Answers state
  const [answersT1, setAnswersT1] = useState<{ [qId: string]: string }>({});
  const [answersT2, setAnswersT2] = useState<{ [name: string]: string }>({});
  const [answersT3, setAnswersT3] = useState<{ [qId: string]: string }>({});
  const [answersT4, setAnswersT4] = useState<{ [qId: string]: string }>({});

  // Audio Player states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null); // tracks currently playing audio ID
  const [playCounts, setPlayCounts] = useState<{ [audioId: string]: number }>({});
  const [audioProgress, setAudioProgress] = useState<{ [audioId: string]: number }>({}); // 0 to 100
  const [synthSpeaking, setSynthSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Format time
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
    setTimeLeft(1800);
    setPlayCounts({});
    setAudioProgress({});
    setActiveTab("t1");

    // Clear localStorage cache
    if (typeof window !== "undefined") {
      localStorage.removeItem("goetheforge_horen_time");
      localStorage.removeItem("goetheforge_horen_answers_t1");
      localStorage.removeItem("goetheforge_horen_answers_t2");
      localStorage.removeItem("goetheforge_horen_answers_t3");
      localStorage.removeItem("goetheforge_horen_answers_t4");
      localStorage.removeItem("goetheforge_horen_submitted");
      localStorage.removeItem("goetheforge_horen_play_counts");
      localStorage.removeItem("goetheforge_horen_tab");
    }
  };

  // Load answers & timer from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedTime = localStorage.getItem("goetheforge_horen_time");
      const cachedAnswersT1 = localStorage.getItem("goetheforge_horen_answers_t1");
      const cachedAnswersT2 = localStorage.getItem("goetheforge_horen_answers_t2");
      const cachedAnswersT3 = localStorage.getItem("goetheforge_horen_answers_t3");
      const cachedAnswersT4 = localStorage.getItem("goetheforge_horen_answers_t4");
      const cachedSubmitted = localStorage.getItem("goetheforge_horen_submitted");
      const cachedPlayCounts = localStorage.getItem("goetheforge_horen_play_counts");
      const cachedTab = localStorage.getItem("goetheforge_horen_tab");

      if (cachedTime) setTimeLeft(Number(cachedTime));
      if (cachedAnswersT1) setAnswersT1(JSON.parse(cachedAnswersT1));
      if (cachedAnswersT2) setAnswersT2(JSON.parse(cachedAnswersT2));
      if (cachedAnswersT3) setAnswersT3(JSON.parse(cachedAnswersT3));
      if (cachedAnswersT4) setAnswersT4(JSON.parse(cachedAnswersT4));
      if (cachedSubmitted) setIsSubmitted(cachedSubmitted === "true");
      if (cachedPlayCounts) setPlayCounts(JSON.parse(cachedPlayCounts));
      if (cachedTab) setActiveTab(cachedTab as any);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isSubmitted) {
        localStorage.removeItem("goetheforge_horen_time");
      } else {
        localStorage.setItem("goetheforge_horen_time", timeLeft.toString());
      }
    }
  }, [timeLeft, isSubmitted]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_horen_answers_t1", JSON.stringify(answersT1));
    }
  }, [answersT1]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_horen_answers_t2", JSON.stringify(answersT2));
    }
  }, [answersT2]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_horen_answers_t3", JSON.stringify(answersT3));
    }
  }, [answersT3]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_horen_answers_t4", JSON.stringify(answersT4));
    }
  }, [answersT4]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_horen_submitted", isSubmitted.toString());
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_horen_play_counts", JSON.stringify(playCounts));
    }
  }, [playCounts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_horen_tab", activeTab);
    }
  }, [activeTab]);

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSynthSpeaking(false);
    setPlayingAudioId(null);
  };

  // TTS & Playback Logic using static neural MP3 files
  const playAudio = (audioId: string, textToSpeak: string, maxPlays: number) => {
    if (playingAudioId === audioId) {
      // Toggle pause/stop
      stopSpeaking();
      return;
    }

    // Stop any current speaking audio
    stopSpeaking();

    const currentPlayCount = playCounts[audioId] || 0;
    if (currentPlayCount >= maxPlays) {
      alert("Batas putar untuk bagian ini sudah habis!");
      return;
    }

    // Increment play count
    const updatedCounts = { ...playCounts, [audioId]: currentPlayCount + 1 };
    setPlayCounts(updatedCounts);
    setPlayingAudioId(audioId);
    setSynthSpeaking(true);

    // Initialize audio element
    const audio = new Audio(`/audio/${audioId}.mp3`);
    audioRef.current = audio;

    // Progress updates
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(prev => ({ ...prev, [audioId]: progress }));
      }
    };

    // End of playback listener
    audio.onended = () => {
      stopSpeaking();
    };

    // Play MP3
    audio.play().catch(err => {
      console.warn("Failed to play MP3, falling back.", err);
      stopSpeaking();
    });
  };

  // Grade Calculations
  const calculateScores = () => {
    let t1Correct = 0;
    let t2Correct = 0;
    let t3Correct = 0;
    let t4Correct = 0;

    // Teil 1
    currentSet.teil1.questions.forEach((q) => {
      if (answersT1[q.id] === q.correctAnswer) t1Correct++;
    });

    // Teil 2
    currentSet.teil2.matches.forEach((m) => {
      if (answersT2[m.name] === m.correctItem) t2Correct++;
    });

    // Teil 3
    currentSet.teil3.questions.forEach((q) => {
      if (answersT3[q.id] === q.correctAnswer) t1Correct++; // wait, Teil 3 is sometimes lumped, let's keep it in t3 Correct
      if (answersT3[q.id] === q.correctAnswer) t3Correct++;
    });

    // Teil 4
    currentSet.teil4.questions.forEach((q) => {
      const ansBool = answersT4[q.id] === "Ja" ? "Ja" : answersT4[q.id] === "Nein" ? "Nein" : "";
      if (ansBool === q.correctAnswer) t4Correct++;
    });

    const totalRaw = t1Correct + t2Correct + t3Correct + t4Correct;
    const scaledScore = (totalRaw / 20) * 25;

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
    saveModuleProgress("horen", scores.scaled, 25);
    setActiveTab("results");

    if (auto) {
      alert("Waktu habis! Ujian Hören disubmit otomatis.");
    }
  };

  const scores = calculateScores();

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 animate-in fade-in duration-200">
      
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-goethe-purple">
              <Volume2 className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wide">Modul Hören</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Mendengar (Hörverstehen)</h1>
            <p className="text-xs text-gray-500 font-medium">Putar audio ujian, dengarkan baik-baik, lalu jawab pertanyaan. Waspadalah terhadap jebakan informasi!</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Set Picker */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-gray-400">Set:</label>
              <select
                disabled={isSubmitted}
                value={setIndex}
                onChange={(e) => handleReset(Number(e.target.value))}
                className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
              >
                {HOREN_BANK.map((set, idx) => (
                  <option key={set.id} value={idx}>{set.name}</option>
                ))}
              </select>
            </div>

            {/* Traps Drawer Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 hover:border-amber-400 text-amber-600 hover:bg-amber-50 text-xs font-bold transition-colors cursor-pointer bg-amber-50/20"
            >
              <Info className="w-3.5 h-3.5" />
              10 Jebakan Ujian
            </button>

            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
              timeLeft < 300 && !isSubmitted ? "bg-error-light text-error border-error animate-pulse" : "bg-white text-gray-600 border-gray-200"
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{isSubmitted ? "SELESAI" : formatTime(timeLeft)}</span>
            </div>

            {/* Reset Ujian Button */}
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset ulang lembar jawaban Anda dan mulai ulang waktu untuk set ini?")) {
                  handleReset();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-goethe-purple hover:bg-goethe-light rounded-xl border border-goethe-purple/20 transition-all cursor-pointer bg-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Ujian</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200 bg-white p-1.5 rounded-xl gap-1.5 shadow-xs">
          {(["t1", "t2", "t3", "t4"] as const).map((tab, idx) => {
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
                    ? "bg-goethe-purple text-white shadow-xs"
                    : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
                }`}
              >
                Teil {idx + 1}
              </button>
            );
          })}
          {isSubmitted && (
            <button
              onClick={() => {
                stopSpeaking();
                setActiveTab("results");
              }}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === "results"
                  ? "bg-success text-white"
                  : "text-success bg-success-light hover:bg-success/15"
              }`}
            >
              Hasil
            </button>
          )}
        </div>

        {/* Tab Content Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* TEIL 1 */}
          {activeTab === "t1" && (
            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
                <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 1 — 5 Percakapan Pendek</h3>
                <p className="text-xs text-gray-600">Anda akan mendengarkan 5 percakapan pendek. <strong>Setiap audio diputar 2x</strong>. Pilih jawaban yang benar (a, b, atau c).</p>
              </div>

              <div className="space-y-8">
                {currentSet.teil1.questions.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-xl border border-gray-100 bg-white space-y-4 shadow-2xs">
                    {/* Audio controller */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
                      <span className="font-bold text-sm text-gray-800">Soal {idx + 1}</span>
                      {renderAudioPlayer(q.id, q.audioText, 2)}
                    </div>

                    <h4 className="font-bold text-gray-900 text-sm">{idx + 1}. {q.question}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(q.options).map(([key, optionText]) => (
                        <label
                          key={key}
                          className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                            answersT1[q.id] === key
                              ? "border-goethe-purple bg-goethe-light/50 font-semibold text-goethe-dark"
                              : "border-gray-100 hover:bg-gray-50 text-gray-600"
                          } ${
                            isSubmitted
                              ? q.correctAnswer === key
                                ? "border-success bg-success-light/30 text-success font-semibold"
                                : answersT1[q.id] === key
                                  ? "border-error bg-error-light/30 text-error"
                                  : "opacity-60"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            disabled={isSubmitted}
                            name={`horen-t1-q-${q.id}`}
                            checked={answersT1[q.id] === key}
                            onChange={() => setAnswersT1({ ...answersT1, [q.id]: key })}
                            className="mt-0.5 accent-goethe-purple"
                          />
                          <span>
                            <span className="uppercase font-bold mr-1">{key})</span> {optionText}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Post-Submit explanations and transcript */}
                    {isSubmitted && renderPostSubmitFeedback(q)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEIL 2 */}
          {activeTab === "t2" && (
            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
                <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 2 — 1 Percakapan Panjang (Zuordnen)</h3>
                <p className="text-xs text-gray-600">Anda akan mendengarkan 1 percakapan panjang. <strong>Audio diputar 1x</strong>. Pasangkan nama kolega dengan aktivitas waktu luang mereka di kolom dropdown.</p>
              </div>

              {/* Audio controller */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="font-bold text-sm text-gray-800">Audio Utama Teil 2</span>
                  <p className="text-xs text-gray-500 font-medium">Perhatikan nama-nama orang yang disebut di percakapan.</p>
                </div>
                {renderAudioPlayer("t2-audio-main", currentSet.teil2.audioText, 1)}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                {/* Names and selectors */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm tracking-wide border-b border-gray-100 pb-2 uppercase">Kolega & Hobi</h4>
                  {currentSet.teil2.matches.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white space-y-3 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-gray-800">{m.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Hobi:</label>
                        <select
                          disabled={isSubmitted}
                          value={answersT2[m.name] || ""}
                          onChange={(e) => setAnswersT2({ ...answersT2, [m.name]: e.target.value })}
                          className={`text-xs font-bold rounded-lg border px-3 py-1.5 focus:outline-none ${
                            isSubmitted
                              ? answersT2[m.name] === m.correctItem
                                ? "bg-success-light text-success border-success"
                                : "bg-error-light text-error border-error"
                              : answersT2[m.name]
                                ? "bg-goethe-light text-goethe-dark border-goethe-purple"
                                : "bg-white text-gray-500 border-gray-200"
                          }`}
                        >
                          <option value="">-- Pilih Hobi --</option>
                          {currentSet.teil2.items.map((it) => (
                            <option key={it.id} value={it.id}>{it.label}</option>
                          ))}
                        </select>
                      </div>

                      {isSubmitted && (
                        <div className="mt-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1">
                          <p className="font-bold text-gray-700 flex items-center gap-1">
                            {answersT2[m.name] === m.correctItem ? (
                              <CheckCircle className="w-3.5 h-3.5 text-success" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-error" />
                            )}
                            <span>Jawaban: {currentSet.teil2.items.find(x=>x.id===m.correctItem)?.label}</span>
                          </p>
                          <p className="text-gray-500 leading-relaxed">{m.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hobbies list */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="font-bold text-gray-800 text-sm tracking-wide border-b border-gray-100 pb-2 uppercase">Daftar Pilihan Hobi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentSet.teil2.items.map((it) => (
                      <div key={it.id} className="p-3.5 rounded-xl border border-gray-100 bg-white flex gap-3 shadow-2xs">
                        <span className="font-bold text-xs bg-goethe-purple text-white w-5 h-5 rounded-full flex items-center justify-center shadow-xs uppercase">
                          {it.id}
                        </span>
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-gray-800 text-xs">{it.label}</h5>
                          <p className="text-[10px] text-gray-400">{it.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Post-Submit Transcript */}
              {isSubmitted && (
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 mt-4 space-y-2">
                  <span className="font-bold text-xs text-gray-600 block uppercase">Transkrip Percakapan</span>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-gray-100">{currentSet.teil2.audioText}</p>
                </div>
              )}
            </div>
          )}

          {/* TEIL 3 */}
          {activeTab === "t3" && (
            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
                <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 3 — 5 Percakapan Pendek (Pilihan Ganda Gambar)</h3>
                <p className="text-xs text-gray-600">Anda akan mendengarkan 5 percakapan pendek. <strong>Setiap audio diputar 1x</strong>. Pilih gambar pilihan ganda yang sesuai.</p>
              </div>

              <div className="space-y-8">
                {currentSet.teil3.questions.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-xl border border-gray-100 bg-white space-y-4 shadow-2xs">
                    {/* Audio controller */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
                      <span className="font-bold text-sm text-gray-800">Soal {idx + 11}</span>
                      {renderAudioPlayer(q.id, q.audioText, 1)}
                    </div>

                    <h4 className="font-bold text-gray-900 text-sm">{idx + 11}. {q.question}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(q.options).map(([key, opt]) => {
                        const isSelected = answersT3[q.id] === key;
                        const isCorrect = q.correctAnswer === key;
                        
                        let cardStyle = "border-gray-200 hover:border-gray-300";
                        if (isSelected) cardStyle = "border-goethe-purple ring-2 ring-goethe-purple/20 bg-goethe-light/35";
                        if (isSubmitted) {
                          if (isCorrect) {
                            cardStyle = "border-success bg-success-light/30 ring-2 ring-success/20";
                          } else if (isSelected) {
                            cardStyle = "border-error bg-error-light/30 ring-2 ring-error/20";
                          } else {
                            cardStyle = "opacity-50 border-gray-200";
                          }
                        }

                        return (
                          <div
                            key={key}
                            onClick={() => {
                              if (!isSubmitted) setAnswersT3({ ...answersT3, [q.id]: key });
                            }}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-between gap-3 text-center transition-all cursor-pointer h-36 ${cardStyle}`}
                          >
                            <div className="flex justify-between w-full items-center">
                              <span className="font-bold text-xs uppercase text-gray-400">{key})</span>
                              {isSelected && <span className="w-2.5 h-2.5 bg-goethe-purple rounded-full"></span>}
                            </div>
                            
                            {/* Graphic Mock Badge based on svgType */}
                            {renderMockGraphic(opt.svgType)}

                            <span className="text-xs font-bold text-gray-700 leading-tight">{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {isSubmitted && renderPostSubmitFeedback(q)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEIL 4 */}
          {activeTab === "t4" && (
            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
                <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 4 — 1 Wawancara Radio (Richtig/Falsch)</h3>
                <p className="text-xs text-gray-600">Anda akan mendengarkan wawancara radio yang cukup panjang. <strong>Audio diputar 2x</strong>. Tentukan apakah pernyataan 16–20 sesuai (Ja / Richtig) atau tidak (Nein / Falsch).</p>
              </div>

              {/* Audio controller */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="font-bold text-sm text-gray-800">Audio Wawancara Teil 4</span>
                  <p className="text-xs text-gray-500 font-medium">Perhatikan baik-baik pendapat narasumber terhadap topik.</p>
                </div>
                {renderAudioPlayer("t4-audio-interview", currentSet.teil4.audioText, 2)}
              </div>

              <div className="space-y-5 pt-2">
                {currentSet.teil4.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
                    <div className="space-y-1 flex-1">
                      <span className="font-bold text-xs text-gray-400">Pernyataan {idx + 16}</span>
                      <p className="font-bold text-gray-900 text-sm leading-snug">{q.statement}</p>
                    </div>

                    {/* Radio Selectors */}
                    <div className="flex gap-3 self-end sm:self-center">
                      {(["Ja", "Nein"] as const).map((choice) => {
                        const isChecked = answersT4[q.id] === choice;
                        const isCorrect = q.correctAnswer === choice;
                        
                        let labelStyle = "border-gray-200 text-gray-600 hover:bg-gray-50";
                        if (isChecked) labelStyle = "border-goethe-purple bg-goethe-light text-goethe-dark font-bold";
                        if (isSubmitted) {
                          if (isCorrect) {
                            labelStyle = "border-success bg-success-light text-success font-bold";
                          } else if (isChecked) {
                            labelStyle = "border-error bg-error-light text-error font-bold";
                          } else {
                            labelStyle = "opacity-50 border-gray-100 text-gray-400";
                          }
                        }

                        return (
                          <label
                            key={choice}
                            className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer ${labelStyle}`}
                          >
                            <input
                              type="radio"
                              disabled={isSubmitted}
                              name={`horen-t4-q-${q.id}`}
                              checked={isChecked}
                              onChange={() => setAnswersT4({ ...answersT4, [q.id]: choice })}
                              className="accent-goethe-purple"
                            />
                            <span>{choice === "Ja" ? "Ja (Richtig)" : "Nein (Falsch)"}</span>
                          </label>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="w-full sm:hidden pt-2 border-t border-gray-100">
                        {renderPostSubmitFeedback(q)}
                      </div>
                    )}
                  </div>
                ))}

                {isSubmitted && (
                  <div className="hidden sm:block">
                    {currentSet.teil4.questions.map((q, idx) => (
                      <div key={q.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg mt-3 text-xs space-y-1">
                        <p className="font-bold text-gray-700 flex items-center gap-1">
                          {answersT4[q.id] === q.correctAnswer ? (
                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-error" />
                          )}
                          <span>Pernyataan {idx + 16}: Kunci = {q.correctAnswer}</span>
                        </p>
                        <p className="text-gray-500 leading-relaxed">{q.explanation}</p>
                      </div>
                    ))}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 mt-4 space-y-2">
                      <span className="font-bold text-xs text-gray-600 block uppercase">Transkrip Wawancara</span>
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-gray-100">{currentSet.teil4.audioText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESULTS PAGE */}
          {activeTab === "results" && (
            <div className="p-8 text-center space-y-8 animate-in zoom-in-95 duration-200">
              <div className="max-w-md mx-auto space-y-4">
                <Award className="w-16 h-16 text-goethe-purple mx-auto animate-bounce" />
                <h2 className="text-3xl font-black text-gray-900 font-sans">Hasil Modul Hören</h2>
                <p className="text-gray-500 text-sm">Selamat! Anda telah menyelesaikan latihan Mendengar (Hören). Berikut adalah rincian skor Anda:</p>
              </div>

              {/* scorecard boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Teil 1</span>
                  <span className="text-xl font-black text-gray-800 mt-1">{scores.t1} / 5</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Teil 2</span>
                  <span className="text-xl font-black text-gray-800 mt-1">{scores.t2} / 5</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Teil 3</span>
                  <span className="text-xl font-black text-gray-800 mt-1">{scores.t3} / 5</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Teil 4</span>
                  <span className="text-xl font-black text-gray-800 mt-1">{scores.t4} / 5</span>
                </div>
                <div className="p-4 col-span-2 sm:col-span-1 bg-goethe-light rounded-xl border border-goethe-purple/10">
                  <span className="block text-xs font-bold text-goethe-purple uppercase">Total Poin</span>
                  <span className="text-xl font-black text-goethe-purple mt-1">{scores.scaled} / 25</span>
                </div>
              </div>

              {/* pass banner */}
              <div className="max-w-md mx-auto">
                {scores.scaled >= 15 ? (
                  <div className="p-4 bg-success-light border border-success/20 text-success font-bold rounded-2xl flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>BESTANDEN (Lulus Ujian Hören! 🎉)</span>
                  </div>
                ) : (
                  <div className="p-4 bg-error-light border border-error/20 text-error font-bold rounded-2xl flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>NICHT BESTANDEN (Skor kelulusan min. 15/25)</span>
                  </div>
                )}
              </div>

              {/* action links */}
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <button
                  onClick={() => setActiveTab("t1")}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 hover:border-goethe-purple text-gray-700 hover:text-goethe-purple font-bold text-sm transition-colors cursor-pointer bg-white"
                >
                  Tinjau Ulang Jawaban & Transkrip
                </button>
                <button
                  onClick={() => handleReset()}
                  className="px-6 py-2.5 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white font-bold text-sm shadow-md shadow-goethe-purple/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Ulangi Tes Set Ini
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action navigation bar */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => {
              const tabs: ("t1" | "t2" | "t3" | "t4" | "results")[] = ["t1", "t2", "t3", "t4", "results"];
              const currentIdx = tabs.indexOf(activeTab);
              if (currentIdx > 0) {
                stopSpeaking();
                setActiveTab(tabs[currentIdx - 1]);
              }
            }}
            disabled={activeTab === "t1"}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 hover:text-goethe-purple disabled:opacity-40 disabled:hover:text-gray-500 bg-white border border-gray-200 rounded-xl cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          {!isSubmitted && (
            <button
              onClick={() => {
                if (confirm("Apakah Anda yakin ingin mengakhiri ujian mendengarkan sekarang?")) {
                  handleSubmit();
                }
              }}
              className="px-6 py-2.5 bg-goethe-purple hover:bg-goethe-purple-hover text-white text-sm font-bold rounded-xl shadow-md shadow-goethe-purple/20 cursor-pointer animate-pulse"
            >
              Submit Jawaban
            </button>
          )}

          <button
            onClick={() => {
              const tabs: ("t1" | "t2" | "t3" | "t4" | "results")[] = ["t1", "t2", "t3", "t4", "results"];
              const currentIdx = tabs.indexOf(activeTab);
              const maxIdx = isSubmitted ? 4 : 3;
              if (currentIdx < maxIdx) {
                stopSpeaking();
                setActiveTab(tabs[currentIdx + 1]);
              }
            }}
            disabled={activeTab === "results" || (activeTab === "t4" && !isSubmitted)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 hover:text-goethe-purple disabled:opacity-40 disabled:hover:text-gray-500 bg-white border border-gray-200 rounded-xl cursor-pointer"
          >
            Berikutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Traps Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 shrink-0 h-fit max-h-[800px] overflow-y-auto sticky top-24 animate-in slide-in-from-right duration-250">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-gray-900 uppercase">10 Jebakan Hören</h3>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Ujian Goethe A2 dirancang dengan pengecoh. Pahami 10 jenis jebakan berikut:</p>
          <div className="space-y-4 divide-y divide-gray-100">
            {HOREN_TRAPS.map((t, idx) => (
              <div key={idx} className="pt-3 space-y-1">
                <h4 className="font-extrabold text-xs text-goethe-purple leading-snug">{t.title}</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Audio player UI element
  function renderAudioPlayer(audioId: string, textToSpeak: string, maxPlays: number) {
    const isThisPlaying = playingAudioId === audioId;
    const playCount = playCounts[audioId] || 0;
    const progress = audioProgress[audioId] || 0;
    const isExhausted = playCount >= maxPlays;

    return (
      <div className="flex items-center gap-3 w-full sm:w-auto bg-gray-50/70 p-2.5 rounded-xl border border-gray-100 min-w-[280px]">
        {/* Play/Pause Button */}
        <button
          type="button"
          disabled={isExhausted && !isThisPlaying}
          onClick={() => playAudio(audioId, textToSpeak, maxPlays)}
          className={`p-2.5 rounded-lg text-white transition-all cursor-pointer ${
            isThisPlaying
              ? "bg-goethe-purple hover:bg-goethe-purple-hover"
              : isExhausted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-goethe-purple hover:bg-goethe-purple-hover shadow-sm"
          }`}
        >
          {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Audio Progress Details */}
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>{isThisPlaying ? "Memutar..." : isExhausted ? "Batas Habis" : "Audio Siap"}</span>
            <span>Wiederholen: {playCount}/{maxPlays}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-goethe-purple rounded-full transition-all duration-200" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Speech visualizer bars */}
        {isThisPlaying && (
          <div className="flex items-center gap-0.5 h-6 px-1">
            <span className="w-0.5 bg-goethe-purple rounded-full animate-bounce h-3" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-0.5 bg-goethe-purple rounded-full animate-bounce h-5" style={{ animationDelay: '0.3s' }}></span>
            <span className="w-0.5 bg-goethe-purple rounded-full animate-bounce h-2" style={{ animationDelay: '0.5s' }}></span>
            <span className="w-0.5 bg-goethe-purple rounded-full animate-bounce h-4" style={{ animationDelay: '0.2s' }}></span>
          </div>
        )}
      </div>
    );
  }

  // Question explanation helper
  function renderPostSubmitFeedback(q: any) {
    return (
      <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-gray-700">
          <CheckCircle className="w-4 h-4 text-success" />
          <span>Kunci Jawaban: {q.correctAnswer.toUpperCase()}</span>
        </div>
        <p className="text-gray-600"><span className="font-bold text-amber-600">[Jebakan Ujian]:</span> {q.trapTip}</p>
        <p className="text-gray-600 leading-relaxed"><span className="font-bold">Penjelasan:</span> {q.explanation}</p>
        
        {/* Toggleable Transcript */}
        <details className="mt-2 group">
          <summary className="text-[11px] font-bold text-goethe-purple hover:underline cursor-pointer list-none flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Tampilkan Transkrip Audio &darr;</span>
          </summary>
          <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg text-gray-600 leading-relaxed font-sans italic">
            {q.audioText}
          </div>
        </details>
      </div>
    );
  }

  // Mock graphic SVGs for Teil 3 Choices
  function renderMockGraphic(svgType: string) {
    // Generates a mock icon representational block
    let color = "text-blue-500 bg-blue-50";
    if (svgType.includes("glasses") || svgType.includes("beer") || svgType.includes("flag")) color = "text-amber-500 bg-amber-50";
    if (svgType.includes("train") || svgType.includes("car") || svgType.includes("plane")) color = "text-purple-500 bg-purple-50";
    if (svgType.includes("shirt") || svgType.includes("bag")) color = "text-emerald-500 bg-emerald-50";

    return (
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${color} border border-gray-100/50`}>
        {svgType.slice(0, 3)}
      </div>
    );
  }
}
