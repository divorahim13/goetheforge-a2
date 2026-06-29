"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Award, Clock, AlertTriangle, CheckCircle, XCircle, 
  Play, ShieldAlert, BookOpen, Volume2, PenTool, RefreshCw, 
  HelpCircle, ChevronRight, Activity, ArrowRight, Pause
} from "lucide-react";
import { LESEN_BANK_B1, HOREN_BANK_B1, SCHREIBEN_BANK_B1 } from "@/lib/questions_b1";
import { getProgress, addExamAttempt } from "@/lib/db";

type ExamPhase = "welcome" | "lesen" | "horen" | "schreiben" | "grading" | "results";

export default function B1SimulasiPage() {
  const [phase, setPhase] = useState<ExamPhase>("welcome");
  const [selectedSetIdx] = useState(0);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(3900); // Lesen is 65 mins = 3900 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- ANSWERS STATE ---
  const [answersLesenT1, setAnswersLesenT1] = useState<{ [qId: string]: string }>({});
  const [answersLesenT2, setAnswersLesenT2] = useState<{ [qId: string]: string }>({});
  const [answersLesenT3, setAnswersLesenT3] = useState<{ [personId: string]: string }>({});
  const [answersLesenT4, setAnswersLesenT4] = useState<{ [qId: string]: string }>({});
  const [answersLesenT5, setAnswersLesenT5] = useState<{ [qId: string]: string }>({});

  const [answersHorenT1, setAnswersHorenT1] = useState<{ [qId: string]: { tf?: string; mc?: string } }>({});
  const [answersHorenT2, setAnswersHorenT2] = useState<{ [qId: string]: string }>({});
  const [answersHorenT3, setAnswersHorenT3] = useState<{ [qId: string]: string }>({});
  const [answersHorenT4, setAnswersHorenT4] = useState<{ [qId: string]: string }>({});

  const [textSchreibenT1, setTextSchreibenT1] = useState("");
  const [textSchreibenT2, setTextSchreibenT2] = useState("");
  const [textSchreibenT3, setTextSchreibenT3] = useState("");

  // Sub-tabs in current phase
  const [lesenTab, setLesenTab] = useState<"t1" | "t2" | "t3" | "t4" | "t5">("t1");
  const [horenTab, setHorenTab] = useState<"t1" | "t2" | "t3" | "t4">("t1");
  const [schreibenTab, setSchreibenTab] = useState<"t1" | "t2" | "t3">("t1");

  // Audio simulation state for Horen
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playCounts, setPlayCounts] = useState<{ [id: string]: number }>({});
  const [audioProgress, setAudioProgress] = useState<{ [id: string]: number }>({});
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Final Results state
  const [lesenFinalScore, setLesenFinalScore] = useState(0);
  const [horenFinalScore, setHorenFinalScore] = useState(0);
  const [schreibenFinalScore, setSchreibenFinalScore] = useState(0);
  const [totalFinalScore, setTotalFinalScore] = useState(0);
  const [isPassedAll, setIsPassedAll] = useState(false);

  // Draft cache keys
  const cacheKeys = {
    PHASE: "goetheforge_b1_sim_phase",
    TIME: "goetheforge_b1_sim_time",
    RUNNING: "goetheforge_b1_sim_running",
    ANS_L1: "goetheforge_b1_sim_lesen_t1",
    ANS_L2: "goetheforge_b1_sim_lesen_t2",
    ANS_L3: "goetheforge_b1_sim_lesen_t3",
    ANS_L4: "goetheforge_b1_sim_lesen_t4",
    ANS_L5: "goetheforge_b1_sim_lesen_t5",
    ANS_H1: "goetheforge_b1_sim_horen_t1",
    ANS_H2: "goetheforge_b1_sim_horen_t2",
    ANS_H3: "goetheforge_b1_sim_horen_t3",
    ANS_H4: "goetheforge_b1_sim_horen_t4",
    TEXT_S1: "goetheforge_b1_sim_schreiben_t1",
    TEXT_S2: "goetheforge_b1_sim_schreiben_t2",
    TEXT_S3: "goetheforge_b1_sim_schreiben_t3",
    PLAY_COUNTS: "goetheforge_b1_sim_play_counts",
  };

  const clearSimCache = () => {
    if (typeof window !== "undefined") {
      Object.values(cacheKeys).forEach(k => localStorage.removeItem(k));
    }
  };

  const handleCancelExam = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan simulasi ujian B1 ini? Semua jawaban dan progres saat ini akan dihapus.")) {
      stopSpeaking();
      setIsTimerRunning(false);
      clearSimCache();
      setPhase("welcome");
      
      // Reset states
      setAnswersLesenT1({});
      setAnswersLesenT2({});
      setAnswersLesenT3({});
      setAnswersLesenT4({});
      setAnswersLesenT5({});
      setAnswersHorenT1({});
      setAnswersHorenT2({});
      setAnswersHorenT3({});
      setAnswersHorenT4({});
      setTextSchreibenT1("");
      setTextSchreibenT2("");
      setTextSchreibenT3("");
      setPlayCounts({});
      setAudioProgress({});
      setTimeLeft(3900);
    }
  };

  // Load cache on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cPhase = localStorage.getItem(cacheKeys.PHASE) as ExamPhase;
      const cTime = localStorage.getItem(cacheKeys.TIME);
      const cRunning = localStorage.getItem(cacheKeys.RUNNING);
      
      const cL1 = localStorage.getItem(cacheKeys.ANS_L1);
      const cL2 = localStorage.getItem(cacheKeys.ANS_L2);
      const cL3 = localStorage.getItem(cacheKeys.ANS_L3);
      const cL4 = localStorage.getItem(cacheKeys.ANS_L4);
      const cL5 = localStorage.getItem(cacheKeys.ANS_L5);

      const cH1 = localStorage.getItem(cacheKeys.ANS_H1);
      const cH2 = localStorage.getItem(cacheKeys.ANS_H2);
      const cH3 = localStorage.getItem(cacheKeys.ANS_H3);
      const cH4 = localStorage.getItem(cacheKeys.ANS_H4);

      const cS1 = localStorage.getItem(cacheKeys.TEXT_S1);
      const cS2 = localStorage.getItem(cacheKeys.TEXT_S2);
      const cS3 = localStorage.getItem(cacheKeys.TEXT_S3);
      
      const cPlay = localStorage.getItem(cacheKeys.PLAY_COUNTS);

      if (cPhase) setPhase(cPhase);
      if (cTime) setTimeLeft(Number(cTime));
      if (cRunning) setIsTimerRunning(cRunning === "true");

      if (cL1) setAnswersLesenT1(JSON.parse(cL1));
      if (cL2) setAnswersLesenT2(JSON.parse(cL2));
      if (cL3) setAnswersLesenT3(JSON.parse(cL3));
      if (cL4) setAnswersLesenT4(JSON.parse(cL4));
      if (cL5) setAnswersLesenT5(JSON.parse(cL5));

      if (cH1) setAnswersHorenT1(JSON.parse(cH1));
      if (cH2) setAnswersHorenT2(JSON.parse(cH2));
      if (cH3) setAnswersHorenT3(JSON.parse(cH3));
      if (cH4) setAnswersHorenT4(JSON.parse(cH4));

      if (cS1) setTextSchreibenT1(cS1);
      if (cS2) setTextSchreibenT2(cS2);
      if (cS3) setTextSchreibenT3(cS3);

      if (cPlay) setPlayCounts(JSON.parse(cPlay));
    }
  }, []);

  // Save changes to cache
  useEffect(() => {
    if (typeof window !== "undefined" && phase !== "welcome" && phase !== "results") {
      localStorage.setItem(cacheKeys.PHASE, phase);
      localStorage.setItem(cacheKeys.TIME, timeLeft.toString());
      localStorage.setItem(cacheKeys.RUNNING, isTimerRunning.toString());

      localStorage.setItem(cacheKeys.ANS_L1, JSON.stringify(answersLesenT1));
      localStorage.setItem(cacheKeys.ANS_L2, JSON.stringify(answersLesenT2));
      localStorage.setItem(cacheKeys.ANS_L3, JSON.stringify(answersLesenT3));
      localStorage.setItem(cacheKeys.ANS_L4, JSON.stringify(answersLesenT4));
      localStorage.setItem(cacheKeys.ANS_L5, JSON.stringify(answersLesenT5));

      localStorage.setItem(cacheKeys.ANS_H1, JSON.stringify(answersHorenT1));
      localStorage.setItem(cacheKeys.ANS_H2, JSON.stringify(answersHorenT2));
      localStorage.setItem(cacheKeys.ANS_H3, JSON.stringify(answersHorenT3));
      localStorage.setItem(cacheKeys.ANS_H4, JSON.stringify(answersHorenT4));

      localStorage.setItem(cacheKeys.TEXT_S1, textSchreibenT1);
      localStorage.setItem(cacheKeys.TEXT_S2, textSchreibenT2);
      localStorage.setItem(cacheKeys.TEXT_S3, textSchreibenT3);

      localStorage.setItem(cacheKeys.PLAY_COUNTS, JSON.stringify(playCounts));
    }
  }, [phase, timeLeft, isTimerRunning, answersLesenT1, answersLesenT2, answersLesenT3, answersLesenT4, answersLesenT5, answersHorenT1, answersHorenT2, answersHorenT3, answersHorenT4, textSchreibenT1, textSchreibenT2, textSchreibenT3, playCounts]);

  // Timer runner effect
  useEffect(() => {
    if (!isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSectionTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, phase]);

  const handleSectionTimeUp = () => {
    if (phase === "lesen") {
      alert("Waktu modul Lesen habis! Lanjut ke modul Hören.");
      transitionToHoren();
    } else if (phase === "horen") {
      alert("Waktu modul Hören habis! Lanjut ke modul Schreiben.");
      transitionToSchreiben();
    } else if (phase === "schreiben") {
      alert("Waktu modul Schreiben habis! Masuk ke proses Penilaian.");
      transitionToGrading();
    }
  };

  const startExam = () => {
    clearSimCache();
    setPhase("lesen");
    setTimeLeft(3900); // 65 mins
    setIsTimerRunning(true);
  };

  const transitionToHoren = () => {
    stopSpeaking();
    setPhase("horen");
    setTimeLeft(2400); // 40 mins
    setIsTimerRunning(true);
  };

  const transitionToSchreiben = () => {
    stopSpeaking();
    setPhase("schreiben");
    setTimeLeft(3600); // 60 mins
    setIsTimerRunning(true);
  };

  const transitionToGrading = () => {
    stopSpeaking();
    setIsTimerRunning(false);
    setPhase("grading");
  };

  // TTS Player logic for Hören section
  const playAudio = (audioId: string, textToSpeak: string, maxPlays: number) => {
    if (playingAudioId === audioId) {
      stopSpeaking();
      return;
    }
    stopSpeaking();

    const currentCount = playCounts[audioId] || 0;
    if (currentCount >= maxPlays) {
      alert(`Batas putar sudah habis (${maxPlays}x)!`);
      return;
    }

    setPlayCounts(prev => ({ ...prev, [audioId]: currentCount + 1 }));
    setPlayingAudioId(audioId);
    setAudioProgress(prev => ({ ...prev, [audioId]: 0 }));

    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      const deVoice = voices.find(v => v.lang.startsWith("de") || v.lang.includes("DE"));
      if (deVoice) utterance.voice = deVoice;
      utterance.rate = 0.88;

      const wordsCount = textToSpeak.split(/\s+/).length;
      const duration = (wordsCount / 130) * 60;
      let elapsed = 0;

      progressIntervalRef.current = setInterval(() => {
        elapsed += 0.5;
        setAudioProgress(prev => ({ ...prev, [audioId]: Math.min((elapsed / duration) * 100, 99) }));
      }, 500);

      utterance.onend = () => {
        setAudioProgress(prev => ({ ...prev, [audioId]: 100 }));
        stopSpeaking();
      };
      utterance.onerror = () => stopSpeaking();

      window.speechSynthesis.speak(utterance);
    } else {
      alert("TTS tidak didukung.");
      setPlayingAudioId(null);
    }
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

  // Grading logic
  const calculateFinalScores = (schreibenSelfScore: number) => {
    const setLesen = LESEN_BANK_B1[selectedSetIdx];
    const setHoren = HOREN_BANK_B1[selectedSetIdx];

    // 1. Lesen calculation
    let lCorrect = 0;
    setLesen.teil1.questions.forEach(q => {
      if (answersLesenT1[q.id] === q.correctAnswer) lCorrect++;
    });
    setLesen.teil2.text1.questions.forEach(q => {
      if (answersLesenT2[q.id] === q.correctAnswer) lCorrect++;
    });
    setLesen.teil2.text2.questions.forEach(q => {
      if (answersLesenT2[q.id] === q.correctAnswer) lCorrect++;
    });
    setLesen.teil3.people.forEach(p => {
      if (answersLesenT3[p.id] === setLesen.teil3.correctAnswers[p.id]) lCorrect++;
    });
    setLesen.teil4.comments.forEach(c => {
      if (answersLesenT4[c.id] === c.correctAnswer) lCorrect++;
    });
    setLesen.teil5.questions.forEach(q => {
      if (answersLesenT5[q.id] === q.correctAnswer) lCorrect++;
    });

    const lScaled = Math.round((lCorrect / 30) * 100);

    // 2. Hören calculation
    let hCorrect = 0;
    setHoren.teil1.questions.forEach(q => {
      const u = answersHorenT1[q.id] || {};
      if (u.tf === q.tfCorrectAnswer) hCorrect++;
      if (u.mc === q.mcCorrectAnswer) hCorrect++;
    });
    setHoren.teil2.questions.forEach(q => {
      if (answersHorenT2[q.id] === q.correctAnswer) hCorrect++;
    });
    setHoren.teil3.questions.forEach(q => {
      if (answersHorenT3[q.id] === q.correctAnswer) hCorrect++;
    });
    setHoren.teil4.questions.forEach(q => {
      if (answersHorenT4[q.id] === q.correctAnswer) hCorrect++;
    });

    const hScaled = Math.round((hCorrect / 30) * 100);

    // 3. Save states
    setLesenFinalScore(lScaled);
    setHorenFinalScore(hScaled);
    setSchreibenFinalScore(schreibenSelfScore);

    const total = lScaled + hScaled + schreibenSelfScore;
    setTotalFinalScore(total);

    const passed = lScaled >= 60 && hScaled >= 60 && schreibenSelfScore >= 60;
    setIsPassedAll(passed);

    // Add attempt to database (B1 specific)
    addExamAttempt({
      lesenScore: lScaled,
      horenScore: hScaled,
      schreibenScore: schreibenSelfScore,
      totalScore: total,
      passed,
      notes: `Simulasi Ujian B1 (Set: ${setLesen.name})`
    }, "B1");

    clearSimCache();
    setPhase("results");
  };

  const getWordCount = (str: string) => {
    if (!str.trim()) return 0;
    return str.trim().split(/\s+/).length;
  };

  const currentSetLesen = LESEN_BANK_B1[selectedSetIdx];
  const currentSetHoren = HOREN_BANK_B1[selectedSetIdx];
  const currentSetSchreiben = SCHREIBEN_BANK_B1[selectedSetIdx];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* PHASE: WELCOME */}
      {phase === "welcome" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-goethe-purple/10 flex items-center justify-center text-goethe-purple animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">Simulasi Penuh B1</span>
            <h1 className="text-3xl font-black text-gray-900">Ujian Simulasi Mandiri (Echtzeit)</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              Uji ketahanan mental dan kecakapan Anda di bawah tekanan waktu asli ujian Goethe-Zertifikat B1.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-150 text-left space-y-3.5 text-xs text-gray-700 font-semibold">
            <h4 className="font-extrabold text-gray-900 uppercase tracking-wide">Ketentuan Simulasi:</h4>
            <div className="space-y-2 leading-relaxed">
              <p>⏱️ <b>Lesen</b>: 65 Menit (30 Pertanyaan / 5 Bagian)</p>
              <p>🎵 <b>Hören</b>: 40 Menit (30 Pertanyaan / 4 Bagian • TTS Fallback)</p>
              <p>✍️ <b>Schreiben</b>: 60 Menit (3 Tugas Menulis)</p>
              <p>⚠️ <b>Peringatan</b>: Jika Anda memuat ulang (refresh) halaman atau menekan tombol kembali, lembar jawaban Anda tidak akan terhapus, tetapi waktu ujian akan terus berjalan di latar belakang.</p>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-3.5 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white font-extrabold text-sm tracking-wide transition-all shadow-md shadow-goethe-purple/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Mulai Simulasi Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TIMEOUT CONTROL & EXIT DURING EXAM */}
      {phase !== "welcome" && phase !== "grading" && phase !== "results" && (
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
            <Activity className="w-4 h-4 text-goethe-purple animate-pulse" />
            <span>Modul Aktif: {phase}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono text-sm font-black bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl text-gray-800 flex items-center gap-1.5 shadow-xs">
              <Clock className="w-4 h-4 text-goethe-purple" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={handleCancelExam}
              className="px-3.5 py-1.5 rounded-xl border border-error/30 hover:bg-error-light hover:border-error text-xs font-bold text-error cursor-pointer bg-white transition-all"
            >
              Batalkan Simulasi
            </button>
          </div>
        </div>
      )}

      {/* PHASE: LESEN (READING) */}
      {phase === "lesen" && (
        <div className="space-y-6">
          {/* Sub-tabs */}
          <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl gap-1">
            {(["t1", "t2", "t3", "t4", "t5"] as const).map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setLesenTab(tab)}
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lesenTab === tab ? "bg-goethe-purple text-white" : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
                }`}
              >
                Teil {idx + 1}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[400px]">
            {lesenTab === "t1" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-150 max-h-[450px] overflow-y-auto scrollbar-thin">
                  <h4 className="font-black text-gray-900 text-base mb-2">{currentSetLesen.teil1.title}</h4>
                  <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{currentSetLesen.teil1.text}</p>
                </div>
                <div className="space-y-4">
                  {currentSetLesen.teil1.questions.map((q, i) => (
                    <div key={q.id} className="p-4 border border-gray-150 rounded-xl space-y-2.5">
                      <p className="text-gray-800 text-xs font-bold">{i+1}. {q.statement}</p>
                      <div className="flex gap-2">
                        {(["Richtig", "Falsch"] as const).map(opt => (
                          <button
                            key={opt}
                            onClick={() => setAnswersLesenT1(prev => ({ ...prev, [q.id]: opt }))}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black border cursor-pointer ${
                              answersLesenT1[q.id] === opt ? "bg-goethe-purple text-white" : "bg-white text-gray-700 border-gray-255"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesenTab === "t2" && (
              <div className="space-y-8">
                {/* Text 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-gray-100 pb-8">
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-150">
                    <h4 className="font-black text-gray-900 text-base mb-2">{currentSetLesen.teil2.text1.title}</h4>
                    <p className="text-gray-700 text-xs leading-relaxed">{currentSetLesen.teil2.text1.text}</p>
                  </div>
                  <div className="space-y-4">
                    {currentSetLesen.teil2.text1.questions.map((q, i) => (
                      <div key={q.id} className="p-4 border border-gray-150 rounded-xl space-y-2.5">
                        <p className="text-gray-800 text-xs font-bold">{i+7}. {q.question}</p>
                        <div className="flex flex-col gap-2">
                          {(["a", "b", "c"] as const).map(key => (
                            <button
                              key={key}
                              onClick={() => setAnswersLesenT2(prev => ({ ...prev, [q.id]: key }))}
                              className={`w-full text-left px-3 py-2 rounded-xl border text-[10px] font-semibold cursor-pointer ${
                                answersLesenT2[q.id] === key ? "bg-goethe-purple text-white" : "bg-white text-gray-700 border-gray-200"
                              }`}
                            >
                              <span className="font-bold mr-1 uppercase">{key}.</span> {q.options[key]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-150">
                    <h4 className="font-black text-gray-900 text-base mb-2">{currentSetLesen.teil2.text2.title}</h4>
                    <p className="text-gray-700 text-xs leading-relaxed">{currentSetLesen.teil2.text2.text}</p>
                  </div>
                  <div className="space-y-4">
                    {currentSetLesen.teil2.text2.questions.map((q, i) => (
                      <div key={q.id} className="p-4 border border-gray-150 rounded-xl space-y-2.5">
                        <p className="text-gray-800 text-xs font-bold">{i+10}. {q.question}</p>
                        <div className="flex flex-col gap-2">
                          {(["a", "b", "c"] as const).map(key => (
                            <button
                              key={key}
                              onClick={() => setAnswersLesenT2(prev => ({ ...prev, [q.id]: key }))}
                              className={`w-full text-left px-3 py-2 rounded-xl border text-[10px] font-semibold cursor-pointer ${
                                answersLesenT2[q.id] === key ? "bg-goethe-purple text-white" : "bg-white text-gray-700 border-gray-200"
                              }`}
                            >
                              <span className="font-bold mr-1 uppercase">{key}.</span> {q.options[key]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {lesenTab === "t3" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {currentSetLesen.teil3.people.map((p, idx) => (
                    <div key={p.id} className="p-4 bg-gray-50 border border-gray-150 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">Kebutuhan {idx+13}</span>
                        <h5 className="font-bold text-gray-900 text-sm">{p.person}</h5>
                        <p className="text-gray-600 text-xs leading-normal">{p.description}</p>
                      </div>
                      <select
                        value={answersLesenT3[p.id] || ""}
                        onChange={(e) => setAnswersLesenT3(prev => ({ ...prev, [p.id]: e.target.value }))}
                        className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
                      >
                        <option value="">-- Pilih --</option>
                        <option value="X">X (Tidak ada)</option>
                        {currentSetLesen.teil3.ads.map(ad => (
                          <option key={ad.id} value={ad.id}>Iklan {ad.id.toUpperCase()}: {ad.title}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl max-h-[500px] overflow-y-auto scrollbar-thin space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs border-b pb-1">Daftar Iklan:</h4>
                  {currentSetLesen.teil3.ads.map(ad => (
                    <div key={ad.id} className="p-2.5 bg-white border border-gray-150 rounded-lg space-y-1">
                      <span className="font-bold text-goethe-purple text-xs uppercase">{ad.id}</span>
                      <h5 className="font-bold text-gray-900 text-xs">{ad.title}</h5>
                      <p className="text-gray-500 text-[10px] leading-relaxed">{ad.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesenTab === "t4" && (
              <div className="space-y-6">
                <div className="bg-gray-50 border p-4 rounded-xl">
                  <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wide">Topik Diskusi</span>
                  <h4 className="font-bold text-gray-900 text-base">{currentSetLesen.teil4.topic}</h4>
                </div>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {currentSetLesen.teil4.comments.map((c, i) => (
                    <div key={c.id} className="p-4 border rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h5 className="font-bold text-gray-800 text-xs">{c.name}</h5>
                        <p className="text-gray-600 text-xs italic">“{c.statement}”</p>
                      </div>
                      <div className="flex gap-2">
                        {(["Ja", "Nein"] as const).map(opt => (
                          <button
                            key={opt}
                            onClick={() => setAnswersLesenT4(prev => ({ ...prev, [c.id]: opt }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                              answersLesenT4[c.id] === opt ? "bg-goethe-purple text-white" : "bg-white text-gray-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesenTab === "t5" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-150">
                  <h4 className="font-black text-gray-900 text-base mb-2">{currentSetLesen.teil5.title}</h4>
                  <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{currentSetLesen.teil5.text}</p>
                </div>
                <div className="space-y-4">
                  {currentSetLesen.teil5.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 border border-gray-150 rounded-xl space-y-2.5">
                      <p className="text-gray-800 text-xs font-bold">{idx+27}. {q.question}</p>
                      <div className="flex flex-col gap-2">
                        {(["a", "b", "c"] as const).map(key => (
                          <button
                            key={key}
                            onClick={() => setAnswersLesenT5(prev => ({ ...prev, [q.id]: key }))}
                            className={`w-full text-left px-3 py-2 rounded-xl border text-[10px] font-semibold cursor-pointer ${
                              answersLesenT5[q.id] === key ? "bg-goethe-purple text-white" : "bg-white text-gray-700 border-gray-200"
                            }`}
                          >
                            <span className="font-bold mr-1 uppercase">{key}.</span> {q.options[key]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex justify-end p-4 bg-white rounded-2xl border">
            <button
              onClick={() => {
                if (confirm("Lanjut ke modul Hören? Sesi membaca tidak akan bisa diulang.")) {
                  transitionToHoren();
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer"
            >
              Lanjut ke Hören
            </button>
          </div>
        </div>
      )}

      {/* PHASE: HÖREN (LISTENING) */}
      {phase === "horen" && (
        <div className="space-y-6">
          <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl gap-1">
            {(["t1", "t2", "t3", "t4"] as const).map((tab, idx) => (
              <button
                key={tab}
                onClick={() => { stopSpeaking(); setHorenTab(tab); }}
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  horenTab === tab ? "bg-goethe-purple text-white" : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
                }`}
              >
                Teil {idx + 1}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[400px]">
            {horenTab === "t1" && (
              <div className="space-y-6">
                {currentSetHoren.teil1.questions.map((q, idx) => {
                  const audioId = `sim-b1-h1-${idx+1}`;
                  return (
                    <div key={q.id} className="p-4 border rounded-xl space-y-4">
                      <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border">
                        <button
                          onClick={() => playAudio(audioId, q.audioText, 2)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all cursor-pointer ${
                            playingAudioId === audioId ? "bg-amber-500" : "bg-goethe-purple"
                          }`}
                        >
                          {playingAudioId === audioId ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <span className="text-xs font-black text-gray-800">Suara {idx+1} (Diputar maks 2x • Sisa: {Math.max(0, 2 - (playCounts[audioId] || 0))}x)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-gray-800 text-xs font-bold">1. {q.tfQuestion}</p>
                          <div className="flex gap-2">
                            {(["Richtig", "Falsch"] as const).map(opt => (
                              <button
                                key={opt}
                                onClick={() => setAnswersHorenT1(prev => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), tf: opt }
                                }))}
                                className={`px-4 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                                  answersHorenT1[q.id]?.tf === opt ? "bg-goethe-purple text-white" : "bg-white text-gray-700"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-gray-800 text-xs font-bold">2. {q.mcQuestion}</p>
                          <div className="flex flex-col gap-1.5">
                            {(["a", "b", "c"] as const).map(key => (
                              <button
                                key={key}
                                onClick={() => setAnswersHorenT1(prev => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), mc: key }
                                }))}
                                className={`text-left px-3 py-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                                  answersHorenT1[q.id]?.mc === key ? "bg-goethe-purple text-white" : "bg-white text-gray-700"
                                }`}
                              >
                                <span className="font-bold mr-1 uppercase">{key}.</span> {q.mcOptions[key]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {horenTab === "t2" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-5 rounded-xl border space-y-3">
                  <h5 className="font-bold text-gray-900 text-sm">Monolog Schloss</h5>
                  <p className="text-gray-500 text-xs">Diputar maks 1x. Klik tombol untuk memutar audio.</p>
                  <button
                    onClick={() => playAudio("sim-b1-h2", currentSetHoren.teil2.audioText, 1)}
                    className="px-4 py-2 bg-goethe-purple hover:bg-goethe-purple-hover text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {playingAudioId === "sim-b1-h2" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    <span>{playingAudioId === "sim-b1-h2" ? "Pause" : "Mulai Putar"} ({Math.max(0, 1 - (playCounts["sim-b1-h2"] || 0))}x)</span>
                  </button>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  {currentSetHoren.teil2.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 border rounded-xl space-y-2.5">
                      <p className="text-gray-800 text-xs font-bold">{idx+11}. {q.question}</p>
                      <div className="flex flex-col gap-1.5">
                        {(["a", "b", "c"] as const).map(key => (
                          <button
                            key={key}
                            onClick={() => setAnswersHorenT2(prev => ({ ...prev, [q.id]: key }))}
                            className={`w-full text-left px-3 py-2 rounded-xl border text-[10px] font-semibold cursor-pointer ${
                              answersHorenT2[q.id] === key ? "bg-goethe-purple text-white" : "bg-white text-gray-700 border-gray-200"
                            }`}
                          >
                            <span className="font-bold mr-1 uppercase">{key}.</span> {q.options[key]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {horenTab === "t3" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-5 rounded-xl border space-y-3">
                  <h5 className="font-bold text-gray-900 text-sm">Percakapan Kuliah</h5>
                  <p className="text-gray-500 text-xs">Diputar maks 1x. Klik tombol untuk memutar audio.</p>
                  <button
                    onClick={() => playAudio("sim-b1-h3", currentSetHoren.teil3.audioText, 1)}
                    className="px-4 py-2 bg-goethe-purple hover:bg-goethe-purple-hover text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {playingAudioId === "sim-b1-h3" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    <span>{playingAudioId === "sim-b1-h3" ? "Pause" : "Mulai Putar"} ({Math.max(0, 1 - (playCounts["sim-b1-h3"] || 0))}x)</span>
                  </button>
                </div>
                <div className="lg:col-span-2 space-y-3">
                  {currentSetHoren.teil3.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 border rounded-xl flex items-center justify-between gap-3">
                      <p className="text-gray-800 text-xs font-semibold">{idx+16}. {q.statement}</p>
                      <div className="flex gap-2">
                        {(["Richtig", "Falsch"] as const).map(opt => (
                          <button
                            key={opt}
                            onClick={() => setAnswersHorenT3(prev => ({ ...prev, [q.id]: opt }))}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                              answersHorenT3[q.id] === opt ? "bg-goethe-purple text-white" : "bg-white text-gray-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {horenTab === "t4" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-5 rounded-xl border space-y-3">
                  <h5 className="font-bold text-gray-900 text-sm">Diskusi Talkshow PR</h5>
                  <p className="text-gray-500 text-xs">Diputar maks 2x. Klik tombol untuk memutar audio.</p>
                  <button
                    onClick={() => playAudio("sim-b1-h4", currentSetHoren.teil4.audioText, 2)}
                    className="px-4 py-2 bg-goethe-purple hover:bg-goethe-purple-hover text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {playingAudioId === "sim-b1-h4" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    <span>{playingAudioId === "sim-b1-h4" ? "Pause" : "Mulai Putar"} ({Math.max(0, 2 - (playCounts["sim-b1-h4"] || 0))}x)</span>
                  </button>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  {currentSetHoren.teil4.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 border rounded-xl space-y-3">
                      <p className="text-gray-800 text-xs font-semibold">{idx+23}. {q.statement}</p>
                      <div className="flex gap-2">
                        {[
                          { key: "a", label: "A: Moderator" },
                          { key: "b", label: "B: Schulleiter" },
                          { key: "c", label: "C: Orang Tua" }
                        ].map(opt => (
                          <button
                            key={opt.key}
                            onClick={() => setAnswersHorenT4(prev => ({ ...prev, [q.id]: opt.key }))}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                              answersHorenT4[q.id] === opt.key ? "bg-goethe-purple text-white" : "bg-white text-gray-700"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end p-4 bg-white rounded-2xl border">
            <button
              onClick={() => {
                if (confirm("Lanjut ke modul Schreiben? Sesi mendengarkan tidak akan bisa diulang.")) {
                  transitionToSchreiben();
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer"
            >
              Lanjut ke Schreiben
            </button>
          </div>
        </div>
      )}

      {/* PHASE: SCHREIBEN (WRITING) */}
      {phase === "schreiben" && (
        <div className="space-y-6">
          <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl gap-1">
            {[
              { key: "t1", label: "Teil 1: Email Pribadi" },
              { key: "t2", label: "Teil 2: Forum Opini" },
              { key: "t3", label: "Teil 3: Email Formil" }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setSchreibenTab(t.key as any)}
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  schreibenTab === t.key ? "bg-goethe-purple text-white" : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border p-6 space-y-6">
            <div className="bg-gray-50 p-4 border rounded-xl space-y-2">
              <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">
                {schreibenTab === "t1" ? "Tugas 1: E-Mail Pribadi (~80 kata)" : schreibenTab === "t2" ? "Tugas 2: Opini Forum (~80 kata)" : "Tugas 3: E-Mail Resmi (~40 kata)"}
              </span>
              <h4 className="font-extrabold text-gray-900 text-sm">
                {schreibenTab === "t1" ? currentSetSchreiben.teil1.title : schreibenTab === "t2" ? currentSetSchreiben.teil2.title : currentSetSchreiben.teil3.title}
              </h4>
              <p className="text-gray-600 text-xs italic bg-white p-3 rounded-lg border">
                {schreibenTab === "t1" ? currentSetSchreiben.teil1.situation : schreibenTab === "t2" ? currentSetSchreiben.teil2.situation : currentSetSchreiben.teil3.situation}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                <span>Draf Tulisan Anda:</span>
                <span className="text-goethe-purple font-extrabold bg-goethe-light px-2.5 py-1 rounded-full">
                  {schreibenTab === "t1" ? getWordCount(textSchreibenT1) : schreibenTab === "t2" ? getWordCount(textSchreibenT2) : getWordCount(textSchreibenT3)} Kata
                </span>
              </div>
              <textarea
                value={schreibenTab === "t1" ? textSchreibenT1 : schreibenTab === "t2" ? textSchreibenT2 : textSchreibenT3}
                onChange={(e) => {
                  if (schreibenTab === "t1") setTextSchreibenT1(e.target.value);
                  else if (schreibenTab === "t2") setTextSchreibenT2(e.target.value);
                  else setTextSchreibenT3(e.target.value);
                }}
                placeholder="Tulis di sini dalam bahasa Jerman..."
                className="w-full min-h-[220px] bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-goethe-purple transition-all"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end p-4 bg-white rounded-2xl border">
            <button
              onClick={() => {
                if (confirm("Apakah Anda yakin ingin menyelesaikan simulasi ujian menulis B1? Sesi ini akan ditutup dan dinilai.")) {
                  transitionToGrading();
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer"
            >
              Selesaikan Ujian
            </button>
          </div>
        </div>
      )}

      {/* PHASE: GRADING */}
      {phase === "grading" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">Evaluasi Akhir</span>
            <h2 className="text-2xl font-black text-gray-900">Masukkan Nilai Menulis (Schreiben)</h2>
            <p className="text-gray-500 text-xs">
              Ujian menulis dinilai mandiri/manual dari draf Anda. Silakan tentukan perkiraan nilai kelulusan menulis Anda (0 - 100).
            </p>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin space-y-4">
            <div className="p-4 bg-gray-50 border rounded-xl space-y-2">
              <h5 className="font-extrabold text-xs text-gray-700">Draf Teil 1 E-Mail:</h5>
              <p className="text-[11px] font-mono text-gray-600 bg-white p-2 rounded-lg border whitespace-pre-wrap">{textSchreibenT1 || "(Kosong)"}</p>
            </div>
            <div className="p-4 bg-gray-50 border rounded-xl space-y-2">
              <h5 className="font-extrabold text-xs text-gray-700">Draf Teil 2 Forum:</h5>
              <p className="text-[11px] font-mono text-gray-600 bg-white p-2 rounded-lg border whitespace-pre-wrap">{textSchreibenT2 || "(Kosong)"}</p>
            </div>
            <div className="p-4 bg-gray-50 border rounded-xl space-y-2">
              <h5 className="font-extrabold text-xs text-gray-700">Draf Teil 3 Formil:</h5>
              <p className="text-[11px] font-mono text-gray-600 bg-white p-2 rounded-lg border whitespace-pre-wrap">{textSchreibenT3 || "(Kosong)"}</p>
            </div>
          </div>

          {/* Score Slider */}
          <div className="p-5 bg-goethe-light/30 border border-goethe-purple/10 rounded-2xl space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-gray-600">
              <span>Beri Nilai Modul Menulis (0 - 100):</span>
              <span className="text-goethe-purple text-lg font-black">{schreibenFinalScore} / 100</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={schreibenFinalScore}
              onChange={(e) => setSchreibenFinalScore(Number(e.target.value))}
              className="w-full accent-goethe-purple cursor-pointer h-2 bg-gray-200 rounded-full"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
              <span>0 (Buruk)</span>
              <span>60 (Lulus)</span>
              <span>100 (Sempurna)</span>
            </div>
          </div>

          <button
            onClick={() => calculateFinalScores(schreibenFinalScore)}
            className="w-full py-3 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white font-extrabold text-xs tracking-wider transition-all shadow-md cursor-pointer uppercase"
          >
            Kalkulasi & Terbitkan Hasil Ujian
          </button>
        </div>
      )}

      {/* PHASE: RESULTS */}
      {phase === "results" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-150 shadow-md space-y-8 animate-in zoom-in-95 duration-300 relative">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-goethe-purple/5 rounded-full translate-x-12 -translate-y-12"></div>
          
          <div className="text-center space-y-4 relative">
            <div className="mx-auto w-16 h-16 rounded-full bg-goethe-purple/10 flex items-center justify-center text-goethe-purple shadow-sm">
              <Award className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Hasil Simulasi Ujian B1</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Evaluasi Goethe-Zertifikat B1 Modular</p>
            </div>
          </div>

          {/* Certificate mock */}
          <div className="border-4 border-double border-gray-300 p-6 rounded-2xl bg-gray-50/50 space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-goethe-purple/5 rounded-full"></div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest">Goethe-Zertifikat B1</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Hasil Simulasi Mandiri (Echtzeit)</p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-gray-250 py-5">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Modul Lesen</span>
                <p className={`text-2xl font-black ${lesenFinalScore >= 60 ? "text-success" : "text-error"}`}>{lesenFinalScore}</p>
                <span className="text-[9px] font-black">{lesenFinalScore >= 60 ? "LULUS" : "GAGAL"}</span>
              </div>
              <div className="text-center space-y-1 border-x border-gray-250">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Modul Hören</span>
                <p className={`text-2xl font-black ${horenFinalScore >= 60 ? "text-success" : "text-error"}`}>{horenFinalScore}</p>
                <span className="text-[9px] font-black">{horenFinalScore >= 60 ? "LULUS" : "GAGAL"}</span>
              </div>
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Modul Schreiben</span>
                <p className={`text-2xl font-black ${schreibenFinalScore >= 60 ? "text-success" : "text-error"}`}>{schreibenFinalScore}</p>
                <span className="text-[9px] font-black">{schreibenFinalScore >= 60 ? "LULUS" : "GAGAL"}</span>
              </div>
            </div>

            <div className="text-center space-y-2 pt-2">
              {isPassedAll ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-success-light text-success text-xs font-black">
                  <CheckCircle className="w-4 h-4" />
                  SECARA KESELURUHAN: LULUS MANDIRI (BESTANDEN)
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-error-light text-error text-xs font-black">
                  <XCircle className="w-4 h-4" />
                  ADA MODUL YANG BELUM LULUS (NICHT BESTANDEN)
                </div>
              )}
              <p className="text-gray-500 text-[11px] leading-relaxed max-w-sm mx-auto">
                {isPassedAll
                  ? "Selamat! Anda berhasil mencapai nilai di atas 60 poin untuk semua modul ujian tertulis B1. Tingkatkan kepercayaan diri Anda untuk ujian asli!"
                  : "Anda belum berhasil lulus di seluruh modul tertulis. Untuk mendapatkan sertifikat B1 lengkap, Anda harus mengulang modul yang bernilai di bawah 60 poin."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setPhase("welcome")}
            className="w-full py-3 rounded-xl border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-extrabold transition-all cursor-pointer text-center"
          >
            Mulai Ulang Simulasi Baru
          </button>
        </div>
      )}
    </div>
  );
}
