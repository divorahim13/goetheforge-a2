"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Award, Clock, AlertTriangle, CheckCircle, XCircle, 
  Play, ShieldAlert, BookOpen, Volume2, PenTool, RefreshCw, 
  HelpCircle, ChevronRight, Activity, ArrowRight, Pause
} from "lucide-react";
import { LESEN_BANK, HOREN_BANK, SCHREIBEN_BANK } from "@/lib/questions";
import { getProgress, addExamAttempt } from "@/lib/db";

type ExamPhase = "welcome" | "lesen" | "horen" | "schreiben" | "grading" | "results";

export default function SimulasiPage() {
  const [phase, setPhase] = useState<ExamPhase>("welcome");
  
  // Set index selected for this mock exam
  const [selectedSetIdx, setSelectedSetIdx] = useState(0);

  // Sub-timer for each section (30 mins = 1800 seconds)
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- ANSWERS STATE ---
  const [answersLesenT1, setAnswersLesenT1] = useState<{ [qId: string]: string }>({});
  const [answersLesenT2, setAnswersLesenT2] = useState<{ [qId: string]: string }>({});
  const [answersLesenT3, setAnswersLesenT3] = useState<{ [qId: string]: string }>({});
  const [answersLesenT4, setAnswersLesenT4] = useState<{ [qId: string]: string }>({});

  const [answersHorenT1, setAnswersHorenT1] = useState<{ [qId: string]: string }>({});
  const [answersHorenT2, setAnswersHorenT2] = useState<{ [name: string]: string }>({});
  const [answersHorenT3, setAnswersHorenT3] = useState<{ [qId: string]: string }>({});
  const [answersHorenT4, setAnswersHorenT4] = useState<{ [qId: string]: string }>({});

  const [textSchreibenT1, setTextSchreibenT1] = useState("");
  const [textSchreibenT2, setTextSchreibenT2] = useState("");

  // Sub-tabs in Lesen/Hören sections
  const [lesenTab, setLesenTab] = useState<"t1" | "t2" | "t3" | "t4">("t1");
  const [horenTab, setHorenTab] = useState<"t1" | "t2" | "t3" | "t4">("t1");

  // Audio simulation state for Horen
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playCounts, setPlayCounts] = useState<{ [id: string]: number }>({});
  const [audioProgress, setAudioProgress] = useState<{ [id: string]: number }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Final Results state
  const [lesenFinalScore, setLesenFinalScore] = useState(0);
  const [horenFinalScore, setHorenFinalScore] = useState(0);
  const [schreibenFinalScore, setSchreibenFinalScore] = useState(0);
  const [sprechenFinalScore, setSprechenFinalScore] = useState(15); // latest speaking or 15 fallback
  const [totalFinalScore, setTotalFinalScore] = useState(0);
  const [gradingMessage, setGradingMessage] = useState("");

  const clearSimCache = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("goetheforge_sim_phase");
      localStorage.removeItem("goetheforge_sim_time");
      localStorage.removeItem("goetheforge_sim_running");
      localStorage.removeItem("goetheforge_sim_lesen_t1");
      localStorage.removeItem("goetheforge_sim_lesen_t2");
      localStorage.removeItem("goetheforge_sim_lesen_t3");
      localStorage.removeItem("goetheforge_sim_lesen_t4");
      localStorage.removeItem("goetheforge_sim_horen_t1");
      localStorage.removeItem("goetheforge_sim_horen_t2");
      localStorage.removeItem("goetheforge_sim_horen_t3");
      localStorage.removeItem("goetheforge_sim_horen_t4");
      localStorage.removeItem("goetheforge_sim_schreiben_t1");
      localStorage.removeItem("goetheforge_sim_schreiben_t2");
      localStorage.removeItem("goetheforge_sim_play_counts");
      localStorage.removeItem("goetheforge_sim_lesen_tab");
      localStorage.removeItem("goetheforge_sim_horen_tab");
    }
  };

  const handleCancelExam = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan simulasi ujian ini? Semua jawaban dan waktu Anda saat ini akan direset.")) {
      stopSpeaking();
      setIsTimerRunning(false);
      clearSimCache();
      setPhase("welcome");
      
      // Reset all answers
      setAnswersLesenT1({});
      setAnswersLesenT2({});
      setAnswersLesenT3({});
      setAnswersLesenT4({});
      setAnswersHorenT1({});
      setAnswersHorenT2({});
      setAnswersHorenT3({});
      setAnswersHorenT4({});
      setTextSchreibenT1("");
      setTextSchreibenT2("");
      setPlayCounts({});
      setAudioProgress({});
      setTimeLeft(1800);
    }
  };

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedPhase = localStorage.getItem("goetheforge_sim_phase");
      const cachedTime = localStorage.getItem("goetheforge_sim_time");
      const cachedRunning = localStorage.getItem("goetheforge_sim_running");
      
      const cachedLesenT1 = localStorage.getItem("goetheforge_sim_lesen_t1");
      const cachedLesenT2 = localStorage.getItem("goetheforge_sim_lesen_t2");
      const cachedLesenT3 = localStorage.getItem("goetheforge_sim_lesen_t3");
      const cachedLesenT4 = localStorage.getItem("goetheforge_sim_lesen_t4");

      const cachedHorenT1 = localStorage.getItem("goetheforge_sim_horen_t1");
      const cachedHorenT2 = localStorage.getItem("goetheforge_sim_horen_t2");
      const cachedHorenT3 = localStorage.getItem("goetheforge_sim_horen_t3");
      const cachedHorenT4 = localStorage.getItem("goetheforge_sim_horen_t4");

      const cachedSchreibenT1 = localStorage.getItem("goetheforge_sim_schreiben_t1");
      const cachedSchreibenT2 = localStorage.getItem("goetheforge_sim_schreiben_t2");

      const cachedPlayCounts = localStorage.getItem("goetheforge_sim_play_counts");
      const cachedLesenTab = localStorage.getItem("goetheforge_sim_lesen_tab");
      const cachedHorenTab = localStorage.getItem("goetheforge_sim_horen_tab");

      if (cachedPhase && cachedPhase !== "welcome" && cachedPhase !== "results") {
        setPhase(cachedPhase as ExamPhase);
      }
      if (cachedTime) setTimeLeft(Number(cachedTime));
      if (cachedRunning) setIsTimerRunning(cachedRunning === "true");
      
      if (cachedLesenT1) setAnswersLesenT1(JSON.parse(cachedLesenT1));
      if (cachedLesenT2) setAnswersLesenT2(JSON.parse(cachedLesenT2));
      if (cachedLesenT3) setAnswersLesenT3(JSON.parse(cachedLesenT3));
      if (cachedLesenT4) setAnswersLesenT4(JSON.parse(cachedLesenT4));

      if (cachedHorenT1) setAnswersHorenT1(JSON.parse(cachedHorenT1));
      if (cachedHorenT2) setAnswersHorenT2(JSON.parse(cachedHorenT2));
      if (cachedHorenT3) setAnswersHorenT3(JSON.parse(cachedHorenT3));
      if (cachedHorenT4) setAnswersHorenT4(JSON.parse(cachedHorenT4));

      if (cachedSchreibenT1) setTextSchreibenT1(cachedSchreibenT1);
      if (cachedSchreibenT2) setTextSchreibenT2(cachedSchreibenT2);

      if (cachedPlayCounts) setPlayCounts(JSON.parse(cachedPlayCounts));
      if (cachedLesenTab) setLesenTab(cachedLesenTab as any);
      if (cachedHorenTab) setHorenTab(cachedHorenTab as any);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_phase", phase);
    }
  }, [phase]);

  useEffect(() => {
    if (typeof window !== "undefined" && phase !== "welcome" && phase !== "results") {
      localStorage.setItem("goetheforge_sim_time", timeLeft.toString());
    }
  }, [timeLeft, phase]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_running", isTimerRunning.toString());
    }
  }, [isTimerRunning]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_lesen_t1", JSON.stringify(answersLesenT1));
    }
  }, [answersLesenT1]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_lesen_t2", JSON.stringify(answersLesenT2));
    }
  }, [answersLesenT2]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_lesen_t3", JSON.stringify(answersLesenT3));
    }
  }, [answersLesenT3]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_lesen_t4", JSON.stringify(answersLesenT4));
    }
  }, [answersLesenT4]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_horen_t1", JSON.stringify(answersHorenT1));
    }
  }, [answersHorenT1]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_horen_t2", JSON.stringify(answersHorenT2));
    }
  }, [answersHorenT2]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_horen_t3", JSON.stringify(answersHorenT3));
    }
  }, [answersHorenT3]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_horen_t4", JSON.stringify(answersHorenT4));
    }
  }, [answersHorenT4]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_schreiben_t1", textSchreibenT1);
    }
  }, [textSchreibenT1]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_schreiben_t2", textSchreibenT2);
    }
  }, [textSchreibenT2]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_play_counts", JSON.stringify(playCounts));
    }
  }, [playCounts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_lesen_tab", lesenTab);
    }
  }, [lesenTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sim_horen_tab", horenTab);
    }
  }, [horenTab]);

  // Timer runner
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, phase]);

  const handleTimeUp = () => {
    stopSpeaking();
    if (phase === "lesen") {
      // Auto advance to horen
      setPhase("horen");
      setTimeLeft(1800); // Reset timer to 30 mins
    } else if (phase === "horen") {
      setPhase("schreiben");
      setTimeLeft(1800);
    } else if (phase === "schreiben") {
      handleCompleteExam();
    }
  };

  const startExam = () => {
    // Pick first exam set (Tes Model 1)
    const randSet = 0;
    setSelectedSetIdx(randSet);

    // Reset everything
    setAnswersLesenT1({});
    setAnswersLesenT2({});
    setAnswersLesenT3({});
    setAnswersLesenT4({});
    setAnswersHorenT1({});
    setAnswersHorenT2({});
    setAnswersHorenT3({});
    setAnswersHorenT4({});
    setTextSchreibenT1("");
    setTextSchreibenT2("");
    setPlayCounts({});
    setAudioProgress({});

    setPhase("lesen");
    setTimeLeft(1800);
    setIsTimerRunning(true);
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingAudioId(null);
  };

  const playHorenAudio = (audioId: string, textToSpeak: string, maxPlays: number) => {
    if (playingAudioId === audioId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    const count = playCounts[audioId] || 0;
    if (count >= maxPlays) {
      alert("Batas putar audio habis!");
      return;
    }

    setPlayCounts({ ...playCounts, [audioId]: count + 1 });
    setPlayingAudioId(audioId);

    // Initialize audio element with Neural MP3
    const audio = new Audio(`/audio/${audioId}.mp3`);
    audioRef.current = audio;

    // Time update listener
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(prev => ({ ...prev, [audioId]: progress }));
      }
    };

    // End listener
    audio.onended = () => {
      stopSpeaking();
    };

    // Play
    audio.play().catch(err => {
      console.warn("Failed to play MP3, falling back.", err);
      stopSpeaking();
    });
  };

  const handleManualSectionAdvance = () => {
    stopSpeaking();
    if (phase === "lesen") {
      if (confirm("Lanjut ke modul Hören? Anda tidak bisa kembali ke modul Lesen lagi.")) {
        setPhase("horen");
        setTimeLeft(1800);
      }
    } else if (phase === "horen") {
      if (confirm("Lanjut ke modul Schreiben? Anda tidak bisa kembali ke modul Hören lagi.")) {
        setPhase("schreiben");
        setTimeLeft(1800);
      }
    }
  };

  // Grade the full exam simulation
  const handleCompleteExam = async () => {
    stopSpeaking();
    setIsTimerRunning(false);
    setPhase("grading");
    setGradingMessage("Sedang mengoreksi jawaban Lesen dan Hören...");

    const setLesen = LESEN_BANK[selectedSetIdx];
    const setHoren = HOREN_BANK[selectedSetIdx];
    const setSchreiben = SCHREIBEN_BANK[selectedSetIdx];

    // 1. Grade Lesen
    let lesenCorrect = 0;
    setLesen.teil1.questions.forEach(q => {
      if (answersLesenT1[q.id] === q.correctAnswer) lesenCorrect++;
    });
    setLesen.teil2.questions.forEach(q => {
      if (answersLesenT2[q.id] === q.correctAnswer) lesenCorrect++;
    });
    setLesen.teil3.questions.forEach(q => {
      if (answersLesenT3[q.id] === q.correctAnswer) lesenCorrect++;
    });
    setLesen.teil4.people.forEach(p => {
      if (answersLesenT4[p.id] === p.correctAnswer) lesenCorrect++;
    });
    const lesenScore = (lesenCorrect / 20) * 25;
    setLesenFinalScore(lesenScore);

    // 2. Grade Hören
    let horenCorrect = 0;
    setHoren.teil1.questions.forEach(q => {
      if (answersHorenT1[q.id] === q.correctAnswer) horenCorrect++;
    });
    setHoren.teil2.matches.forEach(m => {
      if (answersHorenT2[m.name] === m.correctItem) horenCorrect++;
    });
    setHoren.teil3.questions.forEach(q => {
      if (answersHorenT3[q.id] === q.correctAnswer) horenCorrect++;
    });
    setHoren.teil4.questions.forEach(q => {
      const ansBool = answersHorenT4[q.id] || "";
      if (ansBool === q.correctAnswer) horenCorrect++;
    });
    const horenScore = (horenCorrect / 20) * 25;
    setHorenFinalScore(horenScore);

    // 3. Grade Schreiben (AI API CALLS)
    setGradingMessage("Sedang menghubungi AI Evaluator untuk memeriksa tulisan Anda...");
    let schreibenScore = 15; // default fallback

    try {
      // Call endpoint for Teil 1
      const resT1 = await fetch("/api/score-schreiben", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teil: 1,
          text: textSchreibenT1,
          situation: setSchreiben.teil1.situation,
          points: setSchreiben.teil1.points
        })
      });
      const dataT1 = await resT1.json();

      // Call endpoint for Teil 2
      const resT2 = await fetch("/api/score-schreiben", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teil: 2,
          text: textSchreibenT2,
          situation: setSchreiben.teil2.situation,
          points: setSchreiben.teil2.points
        })
      });
      const dataT2 = await resT2.json();

      // Convert letter grades to points
      const gradeMap: { [key: string]: number } = { A: 12.5, B: 10, C: 7.5, D: 5, E: 2.5 };
      const t1Val = gradeMap[dataT1.aufgabe] || 7.5;
      const t2Val = gradeMap[dataT2.aufgabe] || 7.5;
      schreibenScore = t1Val + t2Val;

    } catch (e) {
      console.warn("AI grading failed, using heuristic fallback score", e);
      // Heuristic fallback: check words counts
      const wc1 = textSchreibenT1.trim().split(/\s+/).length;
      const wc2 = textSchreibenT2.trim().split(/\s+/).length;
      let mockPts = 10; // base points
      if (wc1 >= 20 && wc1 <= 30) mockPts += 6;
      if (wc2 >= 30 && wc2 <= 40) mockPts += 6;
      schreibenScore = mockPts;
    }

    setSchreibenFinalScore(schreibenScore);

    // 4. Retrieve Sprechen score
    const userProgress = getProgress();
    let sprechenScore = 15;
    if (userProgress.sprechen && userProgress.sprechen.length > 0) {
      sprechenScore = userProgress.sprechen[userProgress.sprechen.length - 1].score;
    }
    setSprechenFinalScore(sprechenScore);

    // 5. Total
    const totalScore = lesenScore + horenScore + schreibenScore + sprechenScore;
    const roundedTotal = Math.round(totalScore * 100) / 100;
    setTotalFinalScore(roundedTotal);

    // Save attempt
    addExamAttempt({
      lesenScore: Math.round(lesenScore * 10) / 10,
      horenScore: Math.round(horenScore * 10) / 10,
      schreibenScore: Math.round(schreibenScore * 10) / 10,
      sprechenScore: Math.round(sprechenScore * 10) / 10,
      totalScore: roundedTotal,
      passed: roundedTotal >= 60,
      notes: `Ujian simulasi lengkap selesai. Set Soal: ${selectedSetIdx + 1}.`
    });

    setPhase("results");
  };

  const currentSetLesen = LESEN_BANK[selectedSetIdx];
  const currentSetHoren = HOREN_BANK[selectedSetIdx];
  const currentSetSchreiben = SCHREIBEN_BANK[selectedSetIdx];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ========================================== */}
      {/* 1. WELCOME STEP */}
      {/* ========================================== */}
      {phase === "welcome" && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-center">
          <ShieldAlert className="w-16 h-16 text-goethe-purple mx-auto animate-pulse" />
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Simulasi Ujian Goethe A2 Lengkap</h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Anda akan menjalani simulasi ujian dalam kondisi riil. Total waktu tertulis adalah <strong>90 Menit</strong> (3 Modul berturut-turut).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-y border-gray-100 py-6 my-2">
            <div className="space-y-1">
              <span className="font-extrabold text-[10px] text-gray-400 block uppercase">1. Lesen</span>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">30 Menit • 20 Soal. Tidak bisa kembali setelah lanjut.</p>
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-[10px] text-gray-400 block uppercase">2. Hören</span>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">30 Menit • 20 Soal. Kunci audio otomatis terkunci.</p>
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-[10px] text-gray-400 block uppercase">3. Schreiben</span>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">30 Menit • 2 Tugas. Penilaian menggunakan AI Claude.</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 text-left flex gap-3 text-xs text-amber-800 leading-relaxed font-medium">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p><strong>PENTING:</strong> Selama ujian berlangsung, Anda tidak boleh menengok kunci jawaban, transkrip audio, atau keluar halaman jika tidak ingin kehilangan progress. Skor kelulusan gabungan minimal <strong>60 / 100</strong>.</p>
          </div>

          <button
            onClick={startExam}
            className="px-8 py-3.5 bg-goethe-purple hover:bg-goethe-purple-hover text-white text-sm font-bold rounded-xl shadow-md shadow-goethe-purple/20 transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Mulai Simulasi Ujian
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. LESEN SECTION */}
      {/* ========================================== */}
      {phase === "lesen" && currentSetLesen && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-goethe-purple" />
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Kertas Ujian</span>
                <span className="text-sm font-black text-gray-800">MODUL 1: LESEN (MEMBACA)</span>
              </div>
            </div>
            {/* Timer & Cancel */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
                timeLeft < 300 ? "bg-error-light text-error border-error animate-pulse" : "bg-white text-gray-600 border-gray-200"
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
              <button
                type="button"
                onClick={handleCancelExam}
                className="flex items-center gap-1 py-1.5 px-2.5 text-xs font-bold text-error bg-error-light/50 hover:bg-error-light rounded-xl border border-error/25 transition-all cursor-pointer bg-white"
                title="Batalkan Ujian"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            </div>
          </div>

          {/* Sub tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-gray-100 gap-1 text-xs font-bold">
            {(["t1", "t2", "t3", "t4"] as const).map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setLesenTab(tab)}
                className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition-all ${
                  lesenTab === tab ? "bg-goethe-purple text-white shadow-2xs" : "text-gray-500 hover:text-goethe-purple"
                }`}
              >
                Teil {idx + 1}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
            
            {/* LESEN TEIL 1 */}
            {lesenTab === "t1" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 max-h-[400px] overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">{currentSetLesen.teil1.text}</p>
                </div>
                <div className="space-y-6">
                  {currentSetLesen.teil1.questions.map((q, idx) => (
                    <div key={q.id} className="space-y-3 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-sm text-gray-900">{idx + 1}. {q.question}</h4>
                      <div className="space-y-2">
                        {Object.entries(q.options).map(([key, opt]) => (
                          <label key={key} className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            answersLesenT1[q.id] === key ? "border-goethe-purple bg-goethe-light/40 font-bold" : "border-gray-50 hover:bg-gray-50"
                          }`}>
                            <input type="radio" name={`lesen-t1-${q.id}`} checked={answersLesenT1[q.id] === key} onChange={() => setAnswersLesenT1({ ...answersLesenT1, [q.id]: key })} className="accent-goethe-purple mt-0.5" />
                            <span>{key}) {opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LESEN TEIL 2 */}
            {lesenTab === "t2" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-5 bg-slate-900 text-white rounded-xl font-mono text-xs space-y-2.5 h-fit shadow-inner">
                  {currentSetLesen.teil2.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span>{it.storeName}</span>
                      <span className="text-amber-400 bg-slate-800 px-2 py-0.5 rounded">{it.floor}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  {currentSetLesen.teil2.questions.map((q, idx) => (
                    <div key={q.id} className="space-y-3 p-4 rounded-xl border border-gray-100">
                      <span className="font-extrabold text-[9px] text-gray-400 uppercase">Situasi {idx + 6}</span>
                      <h4 className="font-bold text-sm text-gray-800 leading-snug">{q.situation}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(q.options).map(([key, opt]) => (
                          <button key={key} onClick={() => setAnswersLesenT2({ ...answersLesenT2, [q.id]: key })} className={`py-2 px-1 border rounded-lg text-[10px] text-center font-bold cursor-pointer transition-colors ${
                            answersLesenT2[q.id] === key ? "bg-goethe-purple text-white border-goethe-purple shadow-xs" : "bg-white text-gray-600 hover:bg-gray-50 border-gray-100"
                          }`}>
                            <span className="block uppercase">{key})</span> {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LESEN TEIL 3 */}
            {lesenTab === "t3" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 max-h-[400px] overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">{currentSetLesen.teil3.email}</p>
                </div>
                <div className="space-y-6">
                  {currentSetLesen.teil3.questions.map((q, idx) => (
                    <div key={q.id} className="space-y-3 p-4 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-sm text-gray-900">{idx + 11}. {q.question}</h4>
                      <div className="space-y-2">
                        {Object.entries(q.options).map(([key, opt]) => (
                          <label key={key} className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            answersLesenT3[q.id] === key ? "border-goethe-purple bg-goethe-light/40 font-bold" : "border-gray-50 hover:bg-gray-50"
                          }`}>
                            <input type="radio" name={`lesen-t3-${q.id}`} checked={answersLesenT3[q.id] === key} onChange={() => setAnswersLesenT3({ ...answersLesenT3, [q.id]: key })} className="accent-goethe-purple mt-0.5" />
                            <span>{key}) {opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LESEN TEIL 4 */}
            {lesenTab === "t4" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="font-bold text-xs uppercase text-gray-400 border-b pb-1.5">Kandidat Orang</h4>
                  {currentSetLesen.teil4.people.map((p, idx) => (
                    <div key={p.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                      <span className="font-bold text-xs text-goethe-purple">{idx + 16}. {p.person}</span>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{p.description}</p>
                      <select
                        value={answersLesenT4[p.id] || ""}
                        onChange={(e) => setAnswersLesenT4({ ...answersLesenT4, [p.id]: e.target.value })}
                        className="text-xs font-bold rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none bg-white w-full"
                      >
                        <option value="">-- Jodohkan Iklan --</option>
                        {currentSetLesen.teil4.ads.map(ad => (
                          <option key={ad.id} value={ad.id}>Iklan {ad.id.toUpperCase()}</option>
                        ))}
                        <option value="X">X (Tidak ada iklan)</option>
                      </select>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-7 space-y-3">
                  <h4 className="font-bold text-xs uppercase text-gray-400 border-b pb-1.5">Iklan Pilihan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentSetLesen.teil4.ads.map(ad => (
                      <div key={ad.id} className="p-3 bg-white border border-gray-100 rounded-lg relative">
                        <span className="absolute top-2 right-2 w-5 h-5 bg-goethe-purple text-white rounded-full flex items-center justify-center font-bold text-[10px] uppercase">{ad.id}</span>
                        <h5 className="font-bold text-[11px] text-gray-800 pr-5 truncate">{ad.title}</h5>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{ad.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Control bottom */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
            <span className="text-xs text-gray-400 font-semibold">Tinjau ulang semua bagian sebelum lanjut.</span>
            <button
              onClick={handleManualSectionAdvance}
              className="px-6 py-2.5 bg-goethe-purple hover:bg-goethe-purple-hover text-white text-xs font-bold rounded-xl shadow-md shadow-goethe-purple/15 flex items-center gap-1.5 cursor-pointer"
            >
              Lanjut Ke Hören
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. HÖREN SECTION */}
      {/* ========================================== */}
      {phase === "horen" && currentSetHoren && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-goethe-purple" />
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Kertas Ujian</span>
                <span className="text-sm font-black text-gray-800">MODUL 2: HÖREN (MENDENGAR)</span>
              </div>
            </div>
            {/* Timer & Cancel */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
                timeLeft < 300 ? "bg-error-light text-error border-error animate-pulse" : "bg-white text-gray-600 border-gray-200"
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
              <button
                type="button"
                onClick={handleCancelExam}
                className="flex items-center gap-1 py-1.5 px-2.5 text-xs font-bold text-error bg-error-light/50 hover:bg-error-light rounded-xl border border-error/25 transition-all cursor-pointer bg-white"
                title="Batalkan Ujian"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            </div>
          </div>

          {/* Sub tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-gray-100 gap-1 text-xs font-bold">
            {(["t1", "t2", "t3", "t4"] as const).map((tab, idx) => (
              <button
                key={tab}
                onClick={() => {
                  stopSpeaking();
                  setHorenTab(tab);
                }}
                className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition-all ${
                  horenTab === tab ? "bg-goethe-purple text-white shadow-2xs" : "text-gray-500 hover:text-goethe-purple"
                }`}
              >
                Teil {idx + 1}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
            
            {/* HÖREN TEIL 1 */}
            {horenTab === "t1" && (
              <div className="space-y-6">
                {currentSetHoren.teil1.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-bold text-xs text-gray-800">Soal {idx + 1}</span>
                      {renderSimulationAudioPlayer(q.id, q.audioText, 2)}
                    </div>
                    <h4 className="font-bold text-xs text-gray-900">{idx + 1}. {q.question}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {Object.entries(q.options).map(([key, opt]) => (
                        <label key={key} className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs bg-white cursor-pointer ${
                          answersHorenT1[q.id] === key ? "border-goethe-purple bg-goethe-light font-bold text-goethe-dark" : "border-gray-50"
                        }`}>
                          <input type="radio" name={`horen-t1-${q.id}`} checked={answersHorenT1[q.id] === key} onChange={() => setAnswersHorenT1({ ...answersHorenT1, [q.id]: key })} className="accent-goethe-purple" />
                          <span>{key}) {opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* HÖREN TEIL 2 */}
            {horenTab === "t2" && (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-xs text-gray-700">Audio Utama Teil 2 (Diputar 1x)</span>
                  {renderSimulationAudioPlayer("sim-t2-main", currentSetHoren.teil2.audioText, 1)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
                  <div className="lg:col-span-5 space-y-3">
                    {currentSetHoren.teil2.matches.map((m, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center gap-2">
                        <span className="font-bold text-xs text-gray-800">{m.name}</span>
                        <select
                          value={answersHorenT2[m.name] || ""}
                          onChange={(e) => setAnswersHorenT2({ ...answersHorenT2, [m.name]: e.target.value })}
                          className="text-xs font-bold rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none bg-white w-48"
                        >
                          <option value="">-- Pilih Hobi --</option>
                          {currentSetHoren.teil2.items.map(it => (
                            <option key={it.id} value={it.id}>{it.label}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="lg:col-span-7 grid grid-cols-2 gap-2">
                    {currentSetHoren.teil2.items.map(it => (
                      <div key={it.id} className="p-3 bg-white border border-gray-100 rounded-lg flex gap-2">
                        <span className="w-5 h-5 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-[10px] uppercase">{it.id}</span>
                        <span className="font-bold text-[11px] text-gray-700 leading-tight">{it.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* HÖREN TEIL 3 */}
            {horenTab === "t3" && (
              <div className="space-y-6">
                {currentSetHoren.teil3.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-bold text-xs text-gray-800">Soal {idx + 11}</span>
                      {renderSimulationAudioPlayer(q.id, q.audioText, 1)}
                    </div>
                    <h4 className="font-bold text-xs text-gray-900">{idx + 11}. {q.question}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Object.entries(q.options).map(([key, opt]) => {
                        const isSelected = answersHorenT3[q.id] === key;
                        return (
                          <div
                            key={key}
                            onClick={() => setAnswersHorenT3({ ...answersHorenT3, [q.id]: key })}
                            className={`p-4 rounded-xl border bg-white text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                              isSelected ? "border-goethe-purple bg-goethe-light/30 font-bold" : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            <span className="font-bold text-[10px] uppercase text-gray-400 self-start">{key})</span>
                            <span className="text-[11px] font-bold text-slate-800">{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* HÖREN TEIL 4 */}
            {horenTab === "t4" && (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-xs text-gray-700">Audio Wawancara Teil 4 (Diputar 2x)</span>
                  {renderSimulationAudioPlayer("sim-t4-main", currentSetHoren.teil4.audioText, 2)}
                </div>
                <div className="space-y-3">
                  {currentSetHoren.teil4.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-0.5 flex-1">
                        <span className="font-bold text-[10px] text-gray-400">Pernyataan {idx + 16}</span>
                        <p className="font-bold text-xs text-slate-800">{q.statement}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {(["Ja", "Nein"] as const).map(choice => (
                          <button
                            key={choice}
                            onClick={() => setAnswersHorenT4({ ...answersHorenT4, [q.id]: choice })}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                              answersHorenT4[q.id] === choice ? "bg-goethe-purple text-white border-goethe-purple" : "bg-white text-gray-600 border-gray-100"
                            }`}
                          >
                            {choice === "Ja" ? "Ja (Richtig)" : "Nein (Falsch)"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Control bottom */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
            <span className="text-xs text-gray-400 font-semibold">Tinjau ulang jawaban Anda sebelum berlanjut.</span>
            <button
              onClick={handleManualSectionAdvance}
              className="px-6 py-2.5 bg-goethe-purple hover:bg-goethe-purple-hover text-white text-xs font-bold rounded-xl shadow-md shadow-goethe-purple/15 flex items-center gap-1.5 cursor-pointer"
            >
              Lanjut Ke Schreiben
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. SCHREIBEN SECTION */}
      {/* ========================================== */}
      {phase === "schreiben" && currentSetSchreiben && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-goethe-purple" />
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Kertas Ujian</span>
                <span className="text-sm font-black text-gray-800">MODUL 3: SCHREIBEN (MENULIS)</span>
              </div>
            </div>
            {/* Timer & Cancel */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
                timeLeft < 300 ? "bg-error-light text-error border-error animate-pulse" : "bg-white text-gray-600 border-gray-200"
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
              <button
                type="button"
                onClick={handleCancelExam}
                className="flex items-center gap-1 py-1.5 px-2.5 text-xs font-bold text-error bg-error-light/50 hover:bg-error-light rounded-xl border border-error/25 transition-all cursor-pointer bg-white"
                title="Batalkan Ujian"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Schreiben Teil 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
              <span className="font-extrabold text-[10px] text-gray-400 block uppercase">Teil 1 — SMS / WhatsApp (20-30 kata)</span>
              <div className="p-4 bg-gray-50 border rounded-xl">
                <p className="text-xs text-gray-700 leading-relaxed font-bold">{currentSetSchreiben.teil1.situation}</p>
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase">3 Poin Wajib:</span>
                  <ul className="list-disc pl-5 text-[10px] text-gray-600 font-semibold space-y-0.5">
                    {currentSetSchreiben.teil1.points.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
              </div>
              <textarea
                value={textSchreibenT1}
                onChange={(e) => setTextSchreibenT1(e.target.value)}
                className="w-full min-h-[140px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-goethe-purple text-xs leading-relaxed"
                placeholder="Tulis SMS Anda di sini..."
              ></textarea>
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                <span>Kata: {textSchreibenT1.trim() ? textSchreibenT1.trim().split(/\s+/).length : 0}</span>
                <span>Sasaran: 20-30 kata</span>
              </div>
            </div>

            {/* Schreiben Teil 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
              <span className="font-extrabold text-[10px] text-gray-400 block uppercase">Teil 2 — Email Formal (30-40 kata)</span>
              <div className="p-4 bg-gray-50 border rounded-xl">
                <p className="text-xs text-gray-700 leading-relaxed font-bold">{currentSetSchreiben.teil2.situation}</p>
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase">3 Poin Wajib:</span>
                  <ul className="list-disc pl-5 text-[10px] text-gray-600 font-semibold space-y-0.5">
                    {currentSetSchreiben.teil2.points.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
              </div>
              <textarea
                value={textSchreibenT2}
                onChange={(e) => setTextSchreibenT2(e.target.value)}
                className="w-full min-h-[140px] p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-goethe-purple text-xs leading-relaxed"
                placeholder="Tulis Email Anda di sini..."
              ></textarea>
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                <span>Kata: {textSchreibenT2.trim() ? textSchreibenT2.trim().split(/\s+/).length : 0}</span>
                <span>Sasaran: 30-40 kata</span>
              </div>
            </div>

          </div>

          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin menyelesaikan ujian dan mengirim lembar jawaban?")) {
                handleCompleteExam();
              }
            }}
            className="w-full py-4 bg-goethe-purple hover:bg-goethe-purple-hover text-white text-sm font-bold rounded-xl shadow-md shadow-goethe-purple/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-5 h-5" />
            Selesaikan & Kumpulkan Ujian
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. GRADING STEP */}
      {/* ========================================== */}
      {phase === "grading" && (
        <div className="max-w-md mx-auto text-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-in zoom-in-95 duration-200">
          <RefreshCw className="w-12 h-12 text-goethe-purple mx-auto animate-spin" />
          <h3 className="text-xl font-bold text-gray-900">Mengoreksi Jawaban Anda</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-semibold">{gradingMessage}</p>
        </div>
      )}

      {/* ========================================== */}
      {/* 6. RESULTS STEP */}
      {/* ========================================== */}
      {phase === "results" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Main Status header */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-5">
            <Award className="w-16 h-16 text-goethe-purple mx-auto animate-bounce" />
            
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-gray-900">Hasil Akhir Simulasi Ujian</h2>
              <p className="text-sm text-gray-500">Hasil akumulasi pengerjaan tertulis + nilai modul berbicara terakhir:</p>
            </div>

            {/* Total Points Display */}
            <div className="max-w-xs mx-auto py-4 border border-gray-100 bg-gray-50/50 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase">Skor Gabungan (Total)</span>
              <span className="block text-5xl font-black text-goethe-purple">{totalFinalScore} <span className="text-2xl text-gray-400 font-medium">/ 100</span></span>
            </div>

            {/* Passing Status */}
            <div className="max-w-md mx-auto">
              {totalFinalScore >= 60 ? (
                <div className="p-4 bg-success-light border border-success/20 text-success font-black rounded-2xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 animate-pulse" />
                  <span>BESTANDEN (Selamat! Anda Lulus Ujian A2! 🎉)</span>
                </div>
              ) : (
                <div className="p-4 bg-error-light border border-error/20 text-error font-black rounded-2xl flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                  <span>NICHT BESTANDEN (Nilai kelulusan minimum adalah 60.00)</span>
                </div>
              )}
            </div>
          </div>

          {/* Module Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderSimulationModuleCard("Lesen (Membaca)", lesenFinalScore, "Perlu konsentrasi pada kata kunci dan preposisi.")}
            {renderSimulationModuleCard("Hören (Mendengar)", horenFinalScore, "Latih pendengaran fokus dan antisipasi 10 jebakan.")}
            {renderSimulationModuleCard("Schreiben (Menulis)", schreibenFinalScore, "Perhatikan jumlah kata ideal (20-30 / 30-40) dan kasus Dativ/Akkusativ.")}
            {renderSimulationModuleCard("Sprechen (Berbicara)", sprechenFinalScore, "Latih negosiasi slot kosong dan respon dialog aktif.")}
          </div>

          {/* Recommendation Box */}
          <div className="bg-goethe-light p-6 rounded-2xl border border-goethe-purple/10 space-y-4">
            <h4 className="font-extrabold text-sm text-goethe-dark uppercase">Rekomendasi Fokus Belajar</h4>
            <div className="text-xs text-gray-700 space-y-2 leading-relaxed">
              <p>• <strong>Latihan Wortschatz:</strong> Pastikan Anda telah menghafal kata-kata dasar dari kategori <em>Rumah, Pekerjaan, Transport,</em> dan <em>Makanan</em> karena ini adalah topik utama ujian menulis dan membaca.</p>
              <p>• <strong>Ulangi Simulasi:</strong> Lakukan simulasi lagi secara acak untuk mengasah ketepatan waktu Anda. Kelola durasi agar tidak kehabisan waktu di modul membaca (Lesen) dan menulis (Schreiben).</p>
            </div>
            <button
              onClick={() => setPhase("welcome")}
              className="px-6 py-2.5 bg-goethe-purple hover:bg-goethe-purple-hover text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Ulangi Ujian Baru
            </button>
          </div>

        </div>
      )}

    </div>
  );

  // Audio player within simulation mode
  function renderSimulationAudioPlayer(audioId: string, textToSpeak: string, maxPlays: number) {
    const isThisPlaying = playingAudioId === audioId;
    const playCount = playCounts[audioId] || 0;
    const progress = audioProgress[audioId] || 0;
    const isExhausted = playCount >= maxPlays;

    return (
      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-150 shadow-2xs min-w-[240px]">
        <button
          type="button"
          disabled={isExhausted && !isThisPlaying}
          onClick={() => playHorenAudio(audioId, textToSpeak, maxPlays)}
          className={`p-2 rounded-lg text-white cursor-pointer ${
            isThisPlaying ? "bg-goethe-purple" : isExhausted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-goethe-purple hover:bg-goethe-purple-hover"
          }`}
        >
          {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
            <span>{isThisPlaying ? "Memutar..." : isExhausted ? "Batas Habis" : "Audio"}</span>
            <span>Putar: {playCount}/{maxPlays}</span>
          </div>
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-goethe-purple" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Mini score breakdown card
  function renderSimulationModuleCard(title: string, score: number, recText: string) {
    let cardColor = "border-gray-100 text-gray-900";
    let scoreBadge = "bg-gray-100 text-gray-700 border-gray-200";

    if (score >= 15) {
      cardColor = "border-success/20";
      scoreBadge = "bg-success-light text-success border-success/10";
    } else if (score >= 12) {
      cardColor = "border-warning/20";
      scoreBadge = "bg-warning-light text-amber-700 border-warning/15";
    } else {
      cardColor = "border-error/20";
      scoreBadge = "bg-error-light text-error border-error/10";
    }

    return (
      <div className={`p-5 bg-white border rounded-2xl shadow-2xs space-y-3 flex flex-col justify-between ${cardColor}`}>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-gray-800">{title}</h4>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{recText}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border font-black text-sm text-center ${scoreBadge}`}>
          {score} / 25 Punkte
        </div>
      </div>
    );
  }
}
