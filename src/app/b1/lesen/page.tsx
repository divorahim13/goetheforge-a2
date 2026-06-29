"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Clock, AlertTriangle, CheckCircle, XCircle, 
  ChevronRight, ChevronLeft, RefreshCw, Eye, BookOpen, Award
} from "lucide-react";
import { LESEN_BANK_B1, LesenSetB1 } from "@/lib/questions_b1";
import { saveModuleProgress } from "@/lib/db";

export default function B1LesenModule() {
  const [setIndex, setSetIndex] = useState(0);
  const currentSet: LesenSetB1 = LESEN_BANK_B1[setIndex];

  // Tab state: 't1' | 't2' | 't3' | 't4' | 't5' | 'results'
  const [activeTab, setActiveTab] = useState<"t1" | "t2" | "t3" | "t4" | "t5" | "results">("t1");
  
  // Timer state (65 minutes = 3900 seconds)
  const [timeLeft, setTimeLeft] = useState(3900);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Answer states
  const [answersT1, setAnswersT1] = useState<{ [qId: string]: string }>({});
  const [answersT2, setAnswersT2] = useState<{ [qId: string]: string }>({});
  const [answersT3, setAnswersT3] = useState<{ [personId: string]: string }>({});
  const [answersT4, setAnswersT4] = useState<{ [qId: string]: string }>({});
  const [answersT5, setAnswersT5] = useState<{ [qId: string]: string }>({});

  const handleReset = (newIndex = setIndex) => {
    setSetIndex(newIndex);
    setAnswersT1({});
    setAnswersT2({});
    setAnswersT3({});
    setAnswersT4({});
    setAnswersT5({});
    setIsSubmitted(false);
    setTimeLeft(3900);
    setActiveTab("t1");

    if (typeof window !== "undefined") {
      localStorage.removeItem("goetheforge_b1_lesen_time");
      localStorage.removeItem("goetheforge_b1_lesen_answers_t1");
      localStorage.removeItem("goetheforge_b1_lesen_answers_t2");
      localStorage.removeItem("goetheforge_b1_lesen_answers_t3");
      localStorage.removeItem("goetheforge_b1_lesen_answers_t4");
      localStorage.removeItem("goetheforge_b1_lesen_answers_t5");
      localStorage.removeItem("goetheforge_b1_lesen_submitted");
      localStorage.removeItem("goetheforge_b1_lesen_tab");
    }
  };

  // Load cache on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedTime = localStorage.getItem("goetheforge_b1_lesen_time");
      const cachedAnswersT1 = localStorage.getItem("goetheforge_b1_lesen_answers_t1");
      const cachedAnswersT2 = localStorage.getItem("goetheforge_b1_lesen_answers_t2");
      const cachedAnswersT3 = localStorage.getItem("goetheforge_b1_lesen_answers_t3");
      const cachedAnswersT4 = localStorage.getItem("goetheforge_b1_lesen_answers_t4");
      const cachedAnswersT5 = localStorage.getItem("goetheforge_b1_lesen_answers_t5");
      const cachedSubmitted = localStorage.getItem("goetheforge_b1_lesen_submitted");
      const cachedTab = localStorage.getItem("goetheforge_b1_lesen_tab");

      if (cachedTime) setTimeLeft(Number(cachedTime));
      if (cachedAnswersT1) setAnswersT1(JSON.parse(cachedAnswersT1));
      if (cachedAnswersT2) setAnswersT2(JSON.parse(cachedAnswersT2));
      if (cachedAnswersT3) setAnswersT3(JSON.parse(cachedAnswersT3));
      if (cachedAnswersT4) setAnswersT4(JSON.parse(cachedAnswersT4));
      if (cachedAnswersT5) setAnswersT5(JSON.parse(cachedAnswersT5));
      if (cachedSubmitted) setIsSubmitted(cachedSubmitted === "true");
      if (cachedTab) setActiveTab(cachedTab as any);
    }
  }, []);

  // Save changes to cache
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isSubmitted) {
        localStorage.removeItem("goetheforge_b1_lesen_time");
      } else {
        localStorage.setItem("goetheforge_b1_lesen_time", timeLeft.toString());
      }
    }
  }, [timeLeft, isSubmitted]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_b1_lesen_answers_t1", JSON.stringify(answersT1));
      localStorage.setItem("goetheforge_b1_lesen_answers_t2", JSON.stringify(answersT2));
      localStorage.setItem("goetheforge_b1_lesen_answers_t3", JSON.stringify(answersT3));
      localStorage.setItem("goetheforge_b1_lesen_answers_t4", JSON.stringify(answersT4));
      localStorage.setItem("goetheforge_b1_lesen_answers_t5", JSON.stringify(answersT5));
      localStorage.setItem("goetheforge_b1_lesen_submitted", isSubmitted.toString());
      localStorage.setItem("goetheforge_b1_lesen_tab", activeTab);
    }
  }, [answersT1, answersT2, answersT3, answersT4, answersT5, isSubmitted, activeTab]);

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
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isTimeCritical = timeLeft < 300; // less than 5 minutes

  // Grade calculation
  const calculateScores = () => {
    let t1Correct = 0;
    let t2Correct = 0;
    let t3Correct = 0;
    let t4Correct = 0;
    let t5Correct = 0;

    // Teil 1
    currentSet.teil1.questions.forEach((q) => {
      if (answersT1[q.id] === q.correctAnswer) t1Correct++;
    });

    // Teil 2
    currentSet.teil2.text1.questions.forEach((q) => {
      if (answersT2[q.id] === q.correctAnswer) t2Correct++;
    });
    currentSet.teil2.text2.questions.forEach((q) => {
      if (answersT2[q.id] === q.correctAnswer) t2Correct++;
    });

    // Teil 3
    currentSet.teil3.people.forEach((p) => {
      const correctAns = currentSet.teil3.correctAnswers[p.id];
      if (answersT3[p.id] === correctAns) t3Correct++;
    });

    // Teil 4
    currentSet.teil4.comments.forEach((c) => {
      if (answersT4[c.id] === c.correctAnswer) t4Correct++;
    });

    // Teil 5
    currentSet.teil5.questions.forEach((q) => {
      if (answersT5[q.id] === q.correctAnswer) t5Correct++;
    });

    const totalRaw = t1Correct + t2Correct + t3Correct + t4Correct + t5Correct;
    const scaledScore = (totalRaw / 30) * 100; // 30 questions, scaled to 100

    return {
      t1: t1Correct,
      t2: t2Correct,
      t3: t3Correct,
      t4: t4Correct,
      t5: t5Correct,
      raw: totalRaw,
      scaled: Math.round(scaledScore * 100) / 100
    };
  };

  const handleSubmit = (auto = false) => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    
    const scores = calculateScores();
    saveModuleProgress("lesen", scores.scaled, 100, "B1");
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
            <span className="font-bold text-sm uppercase tracking-wide">Modul Lesen B1</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Membaca (Leseverstehen)</h1>
          <p className="text-xs text-gray-500 font-medium">Latih pemahaman bacaan Anda dalam bahasa Jerman sesuai format ujian Goethe B1 (60/100 untuk lulus).</p>
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
              {LESEN_BANK_B1.map((set, idx) => (
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
        {(["t1", "t2", "t3", "t4", "t5"] as const).map((tab, idx) => {
          const tabLabel = `Teil ${idx + 1}`;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 1: Pemahaman E-Mail/Blog</h3>
              <p className="text-gray-600 text-xs">
                Bacalah teks blog berikut dan tentukan apakah pernyataan 1 s.d 6 bernilai <b>Richtig</b> (Benar) atau <b>Falsch</b> (Salah) berdasarkan isi teks.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Text */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 md:p-6 space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin">
                <h4 className="font-extrabold text-gray-900 text-lg border-b border-gray-200 pb-2">{currentSet.teil1.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{currentSet.teil1.text}</p>
              </div>

              {/* Right Column: Questions */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-gray-800 text-sm mb-3">Pernyataan Richtig / Falsch:</h4>
                {currentSet.teil1.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-xs space-y-3">
                    <div className="flex gap-2">
                      <span className="font-black text-goethe-purple text-sm">{idx + 1}.</span>
                      <p className="text-gray-800 text-sm font-semibold leading-normal">{q.statement}</p>
                    </div>

                    <div className="flex gap-3 pl-6">
                      {(["Richtig", "Falsch"] as const).map((opt) => {
                        const isSelected = answersT1[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            disabled={isSubmitted}
                            onClick={() => setAnswersT1(prev => ({ ...prev, [q.id]: opt }))}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-goethe-purple border-goethe-purple text-white shadow-xs"
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

        {/* TEIL 2 */}
        {activeTab === "t2" && (
          <div className="p-6 space-y-8">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 2: Artikel Sachtexte</h3>
              <p className="text-gray-600 text-xs">
                Bacalah kedua artikel di bawah ini dan jawablah masing-masing 3 pertanyaan pilihan ganda (total 6 pertanyaan, a, b, atau c).
              </p>
            </div>

            {/* Article 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start border-b border-gray-100 pb-8">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 md:p-6 space-y-4">
                <h4 className="font-extrabold text-gray-900 text-base border-b border-gray-200 pb-2">{currentSet.teil2.text1.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{currentSet.teil2.text1.text}</p>
              </div>
              <div className="space-y-4">
                {currentSet.teil2.text1.questions.map((q, qidx) => (
                  <div key={q.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-xs space-y-3">
                    <p className="text-gray-800 text-sm font-semibold">{qidx + 7}. {q.question}</p>
                    <div className="flex flex-col gap-2">
                      {(["a", "b", "c"] as const).map((key) => {
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

            {/* Article 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 md:p-6 space-y-4">
                <h4 className="font-extrabold text-gray-900 text-base border-b border-gray-200 pb-2">{currentSet.teil2.text2.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{currentSet.teil2.text2.text}</p>
              </div>
              <div className="space-y-4">
                {currentSet.teil2.text2.questions.map((q, qidx) => (
                  <div key={q.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-xs space-y-3">
                    <p className="text-gray-800 text-sm font-semibold">{qidx + 10}. {q.question}</p>
                    <div className="flex flex-col gap-2">
                      {(["a", "b", "c"] as const).map((key) => {
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
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 3: Penjodohan Iklan (Anzeigen)</h3>
              <p className="text-gray-600 text-xs">
                Jodohkan situasi 7 orang berikut dengan 10 iklan yang tersedia. Jika tidak ada iklan yang cocok dengan kebutuhan seseorang, pilih <b>X (Keine Anzeige passt)</b>. Setiap iklan hanya boleh digunakan sekali.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Columns: 7 People */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-extrabold text-gray-800 text-sm mb-2">Orang dan Kebutuhannya:</h4>
                {currentSet.teil3.people.map((p, idx) => (
                  <div key={p.id} className="p-4 bg-gray-50 border border-gray-150 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <span className="text-xs font-black text-goethe-purple uppercase tracking-wider">Kebutuhan {idx + 13}</span>
                      <h5 className="font-bold text-gray-900 text-sm">{p.person}</h5>
                      <p className="text-gray-600 text-xs leading-normal">{p.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-500 whitespace-nowrap">Pilih Iklan:</label>
                      <select
                        disabled={isSubmitted}
                        value={answersT3[p.id] || ""}
                        onChange={(e) => setAnswersT3(prev => ({ ...prev, [p.id]: e.target.value }))}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-goethe-purple"
                      >
                        <option value="">-- Pilih --</option>
                        <option value="X">X (Tidak ada iklan cocok)</option>
                        {currentSet.teil3.ads.map(ad => (
                          <option key={ad.id} value={ad.id}>Iklan {ad.id.toUpperCase()}: {ad.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: 10 Ads */}
              <div className="space-y-4 bg-gray-50 p-4 border border-gray-100 rounded-xl max-h-[600px] overflow-y-auto scrollbar-thin">
                <h4 className="font-extrabold text-gray-900 text-sm border-b border-gray-200 pb-2 mb-2">Daftar Iklan (Anzeigen):</h4>
                {currentSet.teil3.ads.map(ad => (
                  <div key={ad.id} className="p-3 bg-white border border-gray-150 rounded-xl space-y-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-goethe-purple/10 text-goethe-purple font-bold text-xs uppercase mb-1">
                      {ad.id}
                    </span>
                    <h5 className="font-bold text-gray-900 text-xs">{ad.title}</h5>
                    <p className="text-gray-500 text-[11px] leading-relaxed">{ad.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEIL 4 */}
        {activeTab === "t4" && (
          <div className="p-6 space-y-6">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 4: Opini / Komentar</h3>
              <p className="text-gray-600 text-xs">
                Bacalah komentar dari 7 orang mengenai topik kontroversial di bawah ini. Tentukan apakah mereka setuju (<b>Ja</b>) atau tidak setuju (<b>Nein</b>) dengan topik tersebut.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-2">
              <span className="text-xs font-black text-goethe-purple uppercase tracking-wider">Topik Diskusi</span>
              <h4 className="font-black text-gray-900 text-lg">{currentSet.teil4.topic}</h4>
              <p className="text-gray-500 text-xs font-semibold">{currentSet.teil4.intro}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
              {currentSet.teil4.comments.map((c, idx) => (
                <div key={c.id} className="p-5 bg-white border border-gray-100 rounded-xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-goethe-light flex items-center justify-center text-[10px] font-bold text-goethe-purple">{idx + 20}</span>
                      <h5 className="font-extrabold text-gray-800 text-sm">{c.name}</h5>
                    </div>
                    <p className="text-gray-600 text-xs italic leading-relaxed pl-7">“{c.statement}”</p>
                  </div>

                  <div className="flex gap-2 pl-7 md:pl-0">
                    {(["Ja", "Nein"] as const).map((opt) => {
                      const isSelected = answersT4[c.id] === opt;
                      return (
                        <button
                          key={opt}
                          disabled={isSubmitted}
                          onClick={() => setAnswersT4(prev => ({ ...prev, [c.id]: opt }))}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? opt === "Ja"
                                ? "bg-success border-success text-white shadow-xs"
                                : "bg-error border-error text-white shadow-xs"
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
        )}

        {/* TEIL 5 */}
        {activeTab === "t5" && (
          <div className="p-6 space-y-6">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 5: Aturan / Regulasi</h3>
              <p className="text-gray-600 text-xs">
                Bacalah petunjuk/peraturan berikut dan jawablah 4 pertanyaan pilihan ganda di bawahnya (a, b, atau c).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Text */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 md:p-6 space-y-4">
                <h4 className="font-extrabold text-gray-900 text-lg border-b border-gray-200 pb-2">{currentSet.teil5.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{currentSet.teil5.text}</p>
              </div>

              {/* Right Column: Questions */}
              <div className="space-y-4">
                {currentSet.teil5.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-xs space-y-3">
                    <p className="text-gray-800 text-sm font-semibold">{idx + 27}. {q.question}</p>
                    <div className="flex flex-col gap-2">
                      {(["a", "b", "c"] as const).map((key) => {
                        const isSelected = answersT5[q.id] === key;
                        return (
                          <button
                            key={key}
                            disabled={isSubmitted}
                            onClick={() => setAnswersT5(prev => ({ ...prev, [q.id]: key }))}
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

        {/* RESULTS TAB */}
        {activeTab === "results" && isSubmitted && (
          <div className="p-6 text-center space-y-8 animate-in zoom-in-95 duration-300">
            {/* Score circle */}
            <div className="max-w-md mx-auto bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-goethe-purple/10 flex items-center justify-center text-goethe-purple">
                <Award className="w-12 h-12" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900">Ujian Selesai!</h3>
                <p className="text-xs text-gray-500 font-semibold uppercase">Hasil Evaluasi Modul Lesen B1</p>
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
                    ? "Luar biasa! Skor Anda sudah mencukupi ambang batas kelulusan modul membaca B1 (min. 60 poin)."
                    : "Skor Anda masih di bawah 60 poin. Silakan tinjau kembali penjelasan jawaban di bawah untuk memperdalam pemahaman."}
                </p>
              </div>
            </div>

            {/* Explanations list */}
            <div className="max-w-3xl mx-auto text-left space-y-6">
              <h4 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-goethe-purple" />
                <span>Analisis Jawaban & Pembahasan:</span>
              </h4>

              {/* Teil 1 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 1: Susanne's Blog</h5>
                {currentSet.teil1.questions.map((q, idx) => {
                  const userAns = answersT1[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 space-y-1">
                      <div className="flex items-start gap-2">
                        {isCorrect ? <CheckCircle className="w-4 h-4 text-success mt-0.5" /> : <XCircle className="w-4 h-4 text-error mt-0.5" />}
                        <p className="text-gray-800 text-xs font-bold">{idx + 1}. {q.statement}</p>
                      </div>
                      <p className="text-gray-500 text-xs pl-6">
                        <span className="font-semibold">Jawaban Anda:</span> {userAns || "-"} | <span className="font-semibold">Kunci:</span> {q.correctAnswer}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-6 italic">Pembahasan: {q.explanation}</p>
                    </div>
                  );
                })}
              </div>

              {/* Teil 2 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 2: Sachtexte</h5>
                {/* Text 1 Questions */}
                {currentSet.teil2.text1.questions.map((q, idx) => {
                  const userAns = answersT2[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="border-b border-gray-200 pb-3 space-y-1">
                      <div className="flex items-start gap-2">
                        {isCorrect ? <CheckCircle className="w-4 h-4 text-success mt-0.5" /> : <XCircle className="w-4 h-4 text-error mt-0.5" />}
                        <p className="text-gray-800 text-xs font-bold">{idx + 7}. {q.question}</p>
                      </div>
                      <p className="text-gray-500 text-xs pl-6">
                        <span className="font-semibold">Jawaban Anda:</span> {userAns ? userAns.toUpperCase() : "-"} | <span className="font-semibold">Kunci:</span> {q.correctAnswer.toUpperCase()}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-6 italic">Pembahasan: {q.explanation}</p>
                    </div>
                  );
                })}
                {/* Text 2 Questions */}
                {currentSet.teil2.text2.questions.map((q, idx) => {
                  const userAns = answersT2[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 space-y-1">
                      <div className="flex items-start gap-2">
                        {isCorrect ? <CheckCircle className="w-4 h-4 text-success mt-0.5" /> : <XCircle className="w-4 h-4 text-error mt-0.5" />}
                        <p className="text-gray-800 text-xs font-bold">{idx + 10}. {q.question}</p>
                      </div>
                      <p className="text-gray-500 text-xs pl-6">
                        <span className="font-semibold">Jawaban Anda:</span> {userAns ? userAns.toUpperCase() : "-"} | <span className="font-semibold">Kunci:</span> {q.correctAnswer.toUpperCase()}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-6 italic">Pembahasan: {q.explanation}</p>
                    </div>
                  );
                })}
              </div>

              {/* Teil 3 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 3: Penjodohan Iklan</h5>
                {currentSet.teil3.people.map((p, idx) => {
                  const userAns = answersT3[p.id];
                  const correctAns = currentSet.teil3.correctAnswers[p.id];
                  const isCorrect = userAns === correctAns;
                  return (
                    <div key={p.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 space-y-1">
                      <div className="flex items-start gap-2">
                        {isCorrect ? <CheckCircle className="w-4 h-4 text-success mt-0.5" /> : <XCircle className="w-4 h-4 text-error mt-0.5" />}
                        <p className="text-gray-800 text-xs font-bold">{idx + 13}. {p.person}</p>
                      </div>
                      <p className="text-gray-500 text-xs pl-6">
                        <span className="font-semibold">Jawaban Anda:</span> {userAns ? userAns.toUpperCase() : "-"} | <span className="font-semibold">Kunci:</span> {correctAns.toUpperCase()}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-6 italic">Pembahasan: {currentSet.teil3.explanation[p.id]}</p>
                    </div>
                  );
                })}
              </div>

              {/* Teil 4 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 4: Opini / Komentar</h5>
                {currentSet.teil4.comments.map((c, idx) => {
                  const userAns = answersT4[c.id];
                  const isCorrect = userAns === c.correctAnswer;
                  return (
                    <div key={c.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 space-y-1">
                      <div className="flex items-start gap-2">
                        {isCorrect ? <CheckCircle className="w-4 h-4 text-success mt-0.5" /> : <XCircle className="w-4 h-4 text-error mt-0.5" />}
                        <p className="text-gray-800 text-xs font-bold">{idx + 20}. {c.name}</p>
                      </div>
                      <p className="text-gray-500 text-xs pl-6">
                        <span className="font-semibold">Jawaban Anda:</span> {userAns || "-"} | <span className="font-semibold">Kunci:</span> {c.correctAnswer}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-6 italic">Pembahasan: {c.explanation}</p>
                    </div>
                  );
                })}
              </div>

              {/* Teil 5 Pembahasan */}
              <div className="space-y-3 bg-gray-50 p-5 border border-gray-100 rounded-2xl">
                <h5 className="font-black text-goethe-purple text-sm uppercase">Teil 5: Aturan Perpustakaan</h5>
                {currentSet.teil5.questions.map((q, idx) => {
                  const userAns = answersT5[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 space-y-1">
                      <div className="flex items-start gap-2">
                        {isCorrect ? <CheckCircle className="w-4 h-4 text-success mt-0.5" /> : <XCircle className="w-4 h-4 text-error mt-0.5" />}
                        <p className="text-gray-800 text-xs font-bold">{idx + 27}. {q.question}</p>
                      </div>
                      <p className="text-gray-500 text-xs pl-6">
                        <span className="font-semibold">Jawaban Anda:</span> {userAns ? userAns.toUpperCase() : "-"} | <span className="font-semibold">Kunci:</span> {q.correctAnswer.toUpperCase()}
                      </p>
                      <p className="text-goethe-purple text-xs font-semibold pl-6 italic">Pembahasan: {q.explanation}</p>
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
            const tabs = ["t1", "t2", "t3", "t4", "t5"] as const;
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
              if (confirm("Apakah Anda yakin ingin mensubmit seluruh modul membaca B1 ini?")) {
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
              onClick={() => setActiveTab("results")}
              className="px-6 py-2.5 rounded-xl bg-success hover:bg-success/90 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-success/10 cursor-pointer"
            >
              Lihat Hasil
            </button>
          )
        )}

        <button
          disabled={activeTab === "t5" || (activeTab === "results" && isSubmitted)}
          onClick={() => {
            const tabs = ["t1", "t2", "t3", "t4", "t5"] as const;
            const curIdx = tabs.indexOf(activeTab as any);
            if (curIdx >= 0 && curIdx < 4) setActiveTab(tabs[curIdx + 1]);
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
