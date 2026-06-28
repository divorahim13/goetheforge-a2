"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Clock, AlertTriangle, CheckCircle, XCircle, 
  ChevronRight, ChevronLeft, RefreshCw, Eye, BookOpen, Award
} from "lucide-react";
import { LESEN_BANK, LesenSet } from "@/lib/questions";
import { saveModuleProgress } from "@/lib/db";

export default function LesenModule() {
  const [setIndex, setSetIndex] = useState(0);
  const currentSet: LesenSet = LESEN_BANK[setIndex];

  // Tab state: 't1' | 't2' | 't3' | 't4' | 'results'
  const [activeTab, setActiveTab] = useState<"t1" | "t2" | "t3" | "t4" | "results">("t1");
  
  // Timer state (30 minutes = 1800 seconds)
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Answer states
  const [answersT1, setAnswersT1] = useState<{ [qId: string]: string }>({});
  const [answersT2, setAnswersT2] = useState<{ [qId: string]: string }>({});
  const [answersT3, setAnswersT3] = useState<{ [qId: string]: string }>({});
  const [answersT4, setAnswersT4] = useState<{ [qId: string]: string }>({});

  // Reset module when changing set or clicking reset
  const handleReset = (newIndex = setIndex) => {
    setSetIndex(newIndex);
    setAnswersT1({});
    setAnswersT2({});
    setAnswersT3({});
    setAnswersT4({});
    setIsSubmitted(false);
    setTimeLeft(1800);
    setActiveTab("t1");

    // Clear localStorage cache
    if (typeof window !== "undefined") {
      localStorage.removeItem("goetheforge_lesen_time");
      localStorage.removeItem("goetheforge_lesen_answers_t1");
      localStorage.removeItem("goetheforge_lesen_answers_t2");
      localStorage.removeItem("goetheforge_lesen_answers_t3");
      localStorage.removeItem("goetheforge_lesen_answers_t4");
      localStorage.removeItem("goetheforge_lesen_submitted");
      localStorage.removeItem("goetheforge_lesen_tab");
    }
  };

  // Load answers & timer from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedTime = localStorage.getItem("goetheforge_lesen_time");
      const cachedAnswersT1 = localStorage.getItem("goetheforge_lesen_answers_t1");
      const cachedAnswersT2 = localStorage.getItem("goetheforge_lesen_answers_t2");
      const cachedAnswersT3 = localStorage.getItem("goetheforge_lesen_answers_t3");
      const cachedAnswersT4 = localStorage.getItem("goetheforge_lesen_answers_t4");
      const cachedSubmitted = localStorage.getItem("goetheforge_lesen_submitted");
      const cachedTab = localStorage.getItem("goetheforge_lesen_tab");

      if (cachedTime) setTimeLeft(Number(cachedTime));
      if (cachedAnswersT1) setAnswersT1(JSON.parse(cachedAnswersT1));
      if (cachedAnswersT2) setAnswersT2(JSON.parse(cachedAnswersT2));
      if (cachedAnswersT3) setAnswersT3(JSON.parse(cachedAnswersT3));
      if (cachedAnswersT4) setAnswersT4(JSON.parse(cachedAnswersT4));
      if (cachedSubmitted) setIsSubmitted(cachedSubmitted === "true");
      if (cachedTab) setActiveTab(cachedTab as any);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isSubmitted) {
        localStorage.removeItem("goetheforge_lesen_time");
      } else {
        localStorage.setItem("goetheforge_lesen_time", timeLeft.toString());
      }
    }
  }, [timeLeft, isSubmitted]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_lesen_answers_t1", JSON.stringify(answersT1));
    }
  }, [answersT1]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_lesen_answers_t2", JSON.stringify(answersT2));
    }
  }, [answersT2]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_lesen_answers_t3", JSON.stringify(answersT3));
    }
  }, [answersT3]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_lesen_answers_t4", JSON.stringify(answersT4));
    }
  }, [answersT4]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_lesen_submitted", isSubmitted.toString());
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_lesen_tab", activeTab);
    }
  }, [activeTab]);

  // Timer effect
  useEffect(() => {
    if (isSubmitted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(true); // auto-submit on time up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted]);

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if less than 5 minutes remain
  const isTimeCritical = timeLeft < 300;

  // Grade calculation
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
    currentSet.teil2.questions.forEach((q) => {
      if (answersT2[q.id] === q.correctAnswer) t2Correct++;
    });

    // Teil 3
    currentSet.teil3.questions.forEach((q) => {
      if (answersT3[q.id] === q.correctAnswer) t3Correct++;
    });

    // Teil 4
    currentSet.teil4.people.forEach((p) => {
      if (answersT4[p.id] === p.correctAnswer) t4Correct++;
    });

    const totalRaw = t1Correct + t2Correct + t3Correct + t4Correct;
    const scaledScore = (totalRaw / 20) * 25; // betul/20 * 1.25 = Punkte/25

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
    setIsSubmitted(true);
    
    const scores = calculateScores();
    saveModuleProgress("lesen", scores.scaled, 25);
    setActiveTab("results");

    if (auto) {
      alert("Waktu habis! Jawaban Anda telah disubmit secara otomatis.");
    }
  };

  const scores = calculateScores();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Set Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Modul Lesen</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Membaca (Leseverstehen)</h1>
          <p className="text-xs text-gray-500 font-medium">Latih pemahaman bacaan Anda dalam bahasa Jerman sesuai format ujian Goethe A2.</p>
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
              {LESEN_BANK.map((set, idx) => (
                <option key={set.id} value={idx}>{set.name}</option>
              ))}
            </select>
          </div>

          {/* Countdown Clock */}
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

          {/* Reset Ujian Button */}
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
      <div className="flex border-b border-gray-200 bg-white p-1.5 rounded-xl shadow-xs gap-1.5">
        {(["t1", "t2", "t3", "t4"] as const).map((tab, idx) => {
          const tabLabel = `Teil ${idx + 1}`;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-goethe-purple text-white shadow-xs"
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
                ? "bg-success text-white shadow-xs"
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
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Petunjuk Teil 1</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Bacalah teks pengumuman di bawah ini, kemudian jawablah 5 pertanyaan pilihan ganda yang tersedia.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Text */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 max-h-[500px] overflow-y-auto">
                <h4 className="font-bold text-gray-800 mb-3 text-sm tracking-wide uppercase">Artikel / Pengumuman</h4>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line font-medium">{currentSet.teil1.text}</p>
              </div>

              {/* Right Column: Questions */}
              <div className="space-y-6">
                {currentSet.teil1.questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3 p-4 rounded-xl border border-gray-100 bg-white">
                    <h5 className="font-bold text-gray-900 text-sm">
                      {idx + 1}. {q.question}
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(q.options).map(([key, optionText]) => (
                        <label
                          key={key}
                          className={`flex items-start gap-3 p-3 rounded-lg border text-sm transition-all cursor-pointer ${
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
                            name={`lesen-t1-q-${q.id}`}
                            checked={answersT1[q.id] === key}
                            onChange={() => setAnswersT1({ ...answersT1, [q.id]: key })}
                            className="mt-0.5 accent-goethe-purple cursor-pointer"
                          />
                          <span className="leading-tight">
                            <span className="uppercase font-bold mr-1.5">{key})</span> {optionText}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Explanations */}
                    {isSubmitted && (
                      <div className="mt-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1">
                        <div className="flex items-center gap-1 font-bold text-gray-700">
                          {answersT1[q.id] === q.correctAnswer ? (
                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-error" />
                          )}
                          <span>Penjelasan (Kunci: {q.correctAnswer.toUpperCase()})</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEIL 2 */}
        {activeTab === "t2" && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Petunjuk Teil 2</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Bacalah situasi di bawah ini, kemudian tentukan di lantai mana Anda bisa menemukan toko atau layanan tersebut berdasarkan papan informasi gedung.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Information Board */}
              <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-inner border border-slate-800 space-y-4">
                <div className="text-center border-b border-slate-700 pb-3">
                  <h4 className="font-black text-sm tracking-widest text-goethe-purple-hover uppercase">Informationstafel / Papan Informasi</h4>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  {currentSet.teil2.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-300 font-semibold">{item.storeName}</span>
                      <span className="text-amber-400 font-bold bg-slate-800 px-2.5 py-1 rounded-md">{item.floor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {currentSet.teil2.questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3 p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="flex gap-2">
                      <span className="font-bold text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md h-fit">Situasi {idx + 1}</span>
                    </div>
                    <h5 className="font-bold text-gray-800 text-sm leading-snug">
                      {q.situation}
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {Object.entries(q.options).map(([key, optionText]) => {
                        const isSelected = answersT2[q.id] === key;
                        const isCorrect = q.correctAnswer === key;
                        
                        let btnStyle = "border-gray-100 text-gray-600 hover:bg-gray-50";
                        if (isSelected) {
                          btnStyle = "border-goethe-purple bg-goethe-light text-goethe-dark font-bold";
                        }
                        if (isSubmitted) {
                          if (isCorrect) {
                            btnStyle = "border-success bg-success-light text-success font-bold";
                          } else if (isSelected) {
                            btnStyle = "border-error bg-error-light text-error font-bold";
                          } else {
                            btnStyle = "opacity-50 border-gray-100 text-gray-400";
                          }
                        }

                        return (
                          <button
                            key={key}
                            disabled={isSubmitted}
                            onClick={() => setAnswersT2({ ...answersT2, [q.id]: key })}
                            className={`py-2 px-3 rounded-lg border text-xs text-center transition-all cursor-pointer ${btnStyle}`}
                          >
                            <span className="uppercase font-bold block mb-0.5">{key})</span>
                            <span className="line-clamp-1">{optionText}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="mt-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1">
                        <p className="font-bold text-gray-700 flex items-center gap-1">
                          {answersT2[q.id] === q.correctAnswer ? (
                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-error" />
                          )}
                          <span>Kunci: {q.correctAnswer.toUpperCase()}</span>
                        </p>
                        <p className="text-gray-600">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEIL 3 */}
        {activeTab === "t3" && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Petunjuk Teil 3</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Bacalah email di bawah ini, kemudian jawablah 5 pertanyaan pilihan ganda terkait pesan yang ada dalam email tersebut.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Email */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 max-h-[500px] overflow-y-auto font-sans">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4 text-xs font-semibold text-gray-400">
                  <span>DARI: Markus/Anna/Felix</span>
                  <span>•</span>
                  <span>KE: Teman</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line font-medium">{currentSet.teil3.email}</p>
              </div>

              {/* Right Column: Questions */}
              <div className="space-y-6">
                {currentSet.teil3.questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3 p-4 rounded-xl border border-gray-100 bg-white">
                    <h5 className="font-bold text-gray-900 text-sm">
                      {idx + 11}. {q.question}
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(q.options).map(([key, optionText]) => (
                        <label
                          key={key}
                          className={`flex items-start gap-3 p-3 rounded-lg border text-sm transition-all cursor-pointer ${
                            answersT3[q.id] === key
                              ? "border-goethe-purple bg-goethe-light/50 font-semibold text-goethe-dark"
                              : "border-gray-100 hover:bg-gray-50 text-gray-600"
                          } ${
                            isSubmitted
                              ? q.correctAnswer === key
                                ? "border-success bg-success-light/30 text-success font-semibold"
                                : answersT3[q.id] === key
                                  ? "border-error bg-error-light/30 text-error"
                                  : "opacity-60"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            disabled={isSubmitted}
                            name={`lesen-t3-q-${q.id}`}
                            checked={answersT3[q.id] === key}
                            onChange={() => setAnswersT3({ ...answersT3, [q.id]: key })}
                            className="mt-0.5 accent-goethe-purple cursor-pointer"
                          />
                          <span className="leading-tight">
                            <span className="uppercase font-bold mr-1.5">{key})</span> {optionText}
                          </span>
                        </label>
                      ))}
                    </div>

                    {isSubmitted && (
                      <div className="mt-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1">
                        <div className="flex items-center gap-1 font-bold text-gray-700">
                          {answersT3[q.id] === q.correctAnswer ? (
                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-error" />
                          )}
                          <span>Penjelasan (Kunci: {q.correctAnswer.toUpperCase()})</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEIL 4 */}
        {activeTab === "t4" && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Petunjuk Teil 4 (Zuordnen / Menjodohkan)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Jodohkan situasi 5 orang (kiri) dengan 6 iklan yang tertera (kanan). Setiap iklan hanya boleh digunakan sekali. Jika tidak ada iklan yang cocok untuk seseorang, pilih <strong>X (Tidak ada iklan)</strong>.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side: People (Lg: 5/12 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <h4 className="font-bold text-gray-900 text-sm tracking-wide border-b border-gray-100 pb-2 uppercase">Kandidat & Situasi</h4>
                {currentSet.teil4.people.map((p, idx) => (
                  <div key={p.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-goethe-purple">{idx + 16}. {p.person}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{p.description}</p>
                    
                    {/* Dropdown Selector */}
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Pilihan Iklan:</label>
                      <select
                        disabled={isSubmitted}
                        value={answersT4[p.id] || ""}
                        onChange={(e) => setAnswersT4({ ...answersT4, [p.id]: e.target.value })}
                        className={`text-xs font-bold rounded-lg border px-3 py-1.5 focus:outline-none ${
                          isSubmitted
                            ? answersT4[p.id] === p.correctAnswer
                              ? "bg-success-light text-success border-success"
                              : "bg-error-light text-error border-error"
                            : answersT4[p.id]
                              ? "bg-goethe-light text-goethe-dark border-goethe-purple"
                              : "bg-white text-gray-500 border-gray-200"
                        }`}
                      >
                        <option value="">-- Pilih Iklan --</option>
                        {currentSet.teil4.ads.map((ad) => (
                          <option key={ad.id} value={ad.id}>Iklan {ad.id.toUpperCase()} ({ad.title})</option>
                        ))}
                        <option value="X">X (Tidak Ada Iklan)</option>
                      </select>
                    </div>

                    {isSubmitted && (
                      <div className="mt-2 text-xs bg-white p-3 rounded-lg border border-gray-100 space-y-1">
                        <p className="font-bold text-gray-700 flex items-center gap-1">
                          {answersT4[p.id] === p.correctAnswer ? (
                            <CheckCircle className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-error" />
                          )}
                          <span>Kunci: {p.correctAnswer === "X" ? "X (Tidak ada iklan)" : `Iklan ${p.correctAnswer.toUpperCase()}`}</span>
                        </p>
                        <p className="text-gray-600 leading-relaxed">{p.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Side: Ads (Lg: 7/12 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm tracking-wide border-b border-gray-100 pb-2 uppercase">Daftar Iklan (Anzeigen)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentSet.teil4.ads.map((ad) => (
                    <div key={ad.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-white space-y-2 shadow-xs relative">
                      <span className="absolute top-3 right-3 font-bold text-xs bg-goethe-purple text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm uppercase">
                        {ad.id}
                      </span>
                      <h5 className="font-bold text-gray-800 text-xs pr-6 line-clamp-1">{ad.title}</h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{ad.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS PAGE */}
        {activeTab === "results" && (
          <div className="p-8 text-center space-y-8 animate-in zoom-in-95 duration-200">
            <div className="max-w-md mx-auto space-y-4">
              <Award className="w-16 h-16 text-goethe-purple mx-auto animate-bounce" />
              <h2 className="text-3xl font-black text-gray-900">Hasil Modul Lesen</h2>
              <p className="text-gray-500 text-sm">Selamat! Anda telah menyelesaikan latihan Membaca (Lesen). Berikut adalah rincian perolehan skor Anda:</p>
            </div>

            {/* Scorecard Box */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Teil 1</span>
                <span className="text-xl font-black text-gray-800 mt-1">{scores.t1} / 5</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Teil 2</span>
                <span className="text-xl font-black text-gray-800 mt-1">{scores.t2} / 5</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Teil 3</span>
                <span className="text-xl font-black text-gray-800 mt-1">{scores.t3} / 5</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span className="block text-xs font-bold text-gray-400 uppercase">Teil 4</span>
                <span className="text-xl font-black text-gray-800 mt-1">{scores.t4} / 5</span>
              </div>
              <div className="p-4 col-span-2 sm:col-span-1 bg-goethe-light rounded-xl border border-goethe-purple/10 text-center">
                <span className="block text-xs font-bold text-goethe-purple uppercase">Total Poin</span>
                <span className="text-xl font-black text-goethe-purple mt-1">{scores.scaled} / 25</span>
              </div>
            </div>

            {/* Passing Status Banner */}
            <div className="max-w-md mx-auto">
              {scores.scaled >= 15 ? (
                <div className="p-4 bg-success-light border border-success/20 text-success font-bold rounded-2xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>BESTANDEN (Lulus Ujian Lesen! 🎉)</span>
                </div>
              ) : (
                <div className="p-4 bg-error-light border border-error/20 text-error font-bold rounded-2xl flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>NICHT BESTANDEN (Skor kelulusan min. 15/25)</span>
                </div>
              )}
            </div>

            {/* Review and Reset actions */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <button
                onClick={() => setActiveTab("t1")}
                className="px-6 py-2.5 rounded-xl border border-gray-200 hover:border-goethe-purple text-gray-700 hover:text-goethe-purple font-bold text-sm transition-colors cursor-pointer bg-white"
              >
                Tinjau Ulang Jawaban (Review Mode)
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

      {/* Navigation Help Button Panel */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => {
            const tabs: ("t1" | "t2" | "t3" | "t4" | "results")[] = ["t1", "t2", "t3", "t4", "results"];
            const currentIdx = tabs.indexOf(activeTab);
            if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1]);
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
              if (confirm("Apakah Anda yakin ingin mengakhiri dan mengoreksi jawaban sekarang?")) {
                handleSubmit();
              }
            }}
            className="px-6 py-2.5 bg-goethe-purple hover:bg-goethe-purple-hover text-white text-sm font-bold rounded-xl shadow-md shadow-goethe-purple/20 cursor-pointer"
          >
            Submit Ujian
          </button>
        )}

        <button
          onClick={() => {
            const tabs: ("t1" | "t2" | "t3" | "t4" | "results")[] = ["t1", "t2", "t3", "t4", "results"];
            const currentIdx = tabs.indexOf(activeTab);
            const maxIdx = isSubmitted ? 4 : 3;
            if (currentIdx < maxIdx) setActiveTab(tabs[currentIdx + 1]);
          }}
          disabled={activeTab === "results" || (activeTab === "t4" && !isSubmitted)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 hover:text-goethe-purple disabled:opacity-40 disabled:hover:text-gray-500 bg-white border border-gray-200 rounded-xl cursor-pointer"
        >
          Berikutnya
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
