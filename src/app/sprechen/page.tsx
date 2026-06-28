"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, User, Bot, Send, Calendar, AlertTriangle, 
  CheckCircle, HelpCircle, RefreshCw, Clock, Play, 
  Pause, RotateCcw, ChevronDown, ChevronUp, Eye, EyeOff, ChevronRight
} from "lucide-react";
import { 
  SPRECHEN_TEIL1_CARDS, SPRECHEN_TEIL2_THEMES, 
  SPRECHEN_TEIL3_SCENARIOS, SprechenTeil3Scenario 
} from "@/lib/questions";
import { saveModuleProgress } from "@/lib/db";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function SprechenModule() {
  const [activeTeil, setActiveTeil] = useState<"t1" | "t2" | "t3">("t1");

  // --- TEIL 1 STATE ---
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [showTeil1Answers, setShowTeil1Answers] = useState<{ [id: string]: boolean }>({});

  // --- TEIL 2 STATE ---
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const currentTheme = SPRECHEN_TEIL2_THEMES[selectedThemeIndex];
  const [monologTimeLeft, setMonologTimeLeft] = useState(120); // 2 minutes
  const [monologTimerRunning, setMonologTimerRunning] = useState(false);
  const [showModelMonolog, setShowModelMonolog] = useState(false);
  const monologTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- TEIL 3 STATE (INTERACTIVE CHAT SIMULATOR) ---
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const currentScenario: SprechenTeil3Scenario = SPRECHEN_TEIL3_SCENARIOS[scenarioIndex];
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPartnerSchedule, setShowPartnerSchedule] = useState(false);
  const [grammarCorrections, setGrammarCorrections] = useState<string[]>([]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showHelpers, setShowHelpers] = useState(true);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Teil 2 Timer Effect
  useEffect(() => {
    if (monologTimerRunning) {
      monologTimerRef.current = setInterval(() => {
        setMonologTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(monologTimerRef.current!);
            setMonologTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (monologTimerRef.current) clearInterval(monologTimerRef.current);
    }

    return () => {
      if (monologTimerRef.current) clearInterval(monologTimerRef.current);
    };
  }, [monologTimerRunning]);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedChat = localStorage.getItem("goetheforge_sprechen_chat_history");
      const cachedGrammar = localStorage.getItem("goetheforge_sprechen_grammar");
      const cachedAgreed = localStorage.getItem("goetheforge_sprechen_is_agreed");
      const cachedScore = localStorage.getItem("goetheforge_sprechen_final_score");
      const cachedFeedback = localStorage.getItem("goetheforge_sprechen_feedback");
      const cachedTeil = localStorage.getItem("goetheforge_sprechen_active_teil");

      if (cachedChat) setChatHistory(JSON.parse(cachedChat));
      if (cachedGrammar) setGrammarCorrections(JSON.parse(cachedGrammar));
      if (cachedAgreed) setIsAgreed(cachedAgreed === "true");
      if (cachedScore) setFinalScore(cachedScore ? Number(cachedScore) : null);
      if (cachedFeedback) setFeedbackText(cachedFeedback);
      if (cachedTeil) setActiveTeil(cachedTeil as any);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && chatHistory.length > 1) {
      localStorage.setItem("goetheforge_sprechen_chat_history", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sprechen_grammar", JSON.stringify(grammarCorrections));
    }
  }, [grammarCorrections]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sprechen_is_agreed", isAgreed.toString());
    }
  }, [isAgreed]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sprechen_final_score", finalScore !== null ? finalScore.toString() : "");
    }
  }, [finalScore]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sprechen_feedback", feedbackText);
    }
  }, [feedbackText]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("goetheforge_sprechen_active_teil", activeTeil);
    }
  }, [activeTeil]);

  // Initialize Teil 3 Chat
  useEffect(() => {
    // Only auto-initialize if there is no cache
    if (typeof window !== "undefined" && !localStorage.getItem("goetheforge_sprechen_chat_history")) {
      resetTeil3(false);
    }
  }, [scenarioIndex]);

  const resetTeil3 = (confirmRequired = true) => {
    if (confirmRequired && !confirm("Mulai ulang percakapan negosiasi dari awal? Semua chat & koreksi saat ini akan dihapus.")) {
      return;
    }

    setChatHistory([
      { 
        sender: "ai", 
        text: `Hallo! Lass uns einen Termin für das Treffen vereinbaren. Ich würde gerne für die Prüfung lernen. Wann hast du Zeit?` 
      }
    ]);
    setInputMsg("");
    setGrammarCorrections([]);
    setIsAgreed(false);
    setFinalScore(null);
    setFeedbackText("");

    if (typeof window !== "undefined") {
      localStorage.removeItem("goetheforge_sprechen_chat_history");
      localStorage.removeItem("goetheforge_sprechen_grammar");
      localStorage.removeItem("goetheforge_sprechen_is_agreed");
      localStorage.removeItem("goetheforge_sprechen_final_score");
      localStorage.removeItem("goetheforge_sprechen_feedback");
    }
  };

  // Format countdown time
  const formatMonologTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle Send message in Teil 3
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isTyping || isAgreed) return;

    const userText = inputMsg.trim();
    setInputMsg("");
    
    // Add user message to history
    const updatedHistory = [...chatHistory, { sender: "user", text: userText } as Message];
    setChatHistory(updatedHistory);
    
    // Show typing state
    setIsTyping(true);

    try {
      const resp = await fetch("/api/sprechen-dialog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          scenarioId: currentScenario.id,
          history: updatedHistory,
          scheduleB: currentScenario.scheduleB
        })
      });

      const data = await resp.json();
      
      setIsTyping(false);
      setChatHistory(prev => [...prev, { sender: "ai", text: data.response }]);
      
      if (data.corrections && data.corrections.length > 0) {
        setGrammarCorrections(prev => [...prev, ...data.corrections]);
      }

      if (data.agreed) {
        setIsAgreed(true);
        setFinalScore(data.score_update);
        setFeedbackText(data.feedback);
        saveModuleProgress("sprechen", data.score_update, 25);
      }
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      alert("Gagal terhubung dengan AI partner. Menggunakan respon otomatis.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <Mic className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Modul Sprechen</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 font-sans">Berbicara (Mündlicher Ausdruck)</h1>
          <p className="text-xs text-gray-500 font-medium">Ujian berbicara berdurasi 15 menit. Latih presentasi diri, monolog, dan simulasi dialog negoisasi.</p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 gap-1 sm:self-center">
          <button
            onClick={() => setActiveTeil("t1")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTeil === "t1" ? "bg-goethe-purple text-white shadow-xs" : "text-gray-500 hover:text-goethe-purple"
            }`}
          >
            Teil 1
          </button>
          <button
            onClick={() => setActiveTeil("t2")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTeil === "t2" ? "bg-goethe-purple text-white shadow-xs" : "text-gray-500 hover:text-goethe-purple"
            }`}
          >
            Teil 2
          </button>
          <button
            onClick={() => setActiveTeil("t3")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTeil === "t3" ? "bg-goethe-purple text-white shadow-xs" : "text-gray-500 hover:text-goethe-purple"
            }`}
          >
            Teil 3 (Utama)
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* TEIL 1: FRAGEN ZUR PERSON */}
      {/* ========================================== */}
      {activeTeil === "t1" && (
        <div className="space-y-6">
          <div className="bg-goethe-light border-l-4 border-goethe-purple p-5 rounded-r-xl">
            <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 1 — Perkenalan Diri (Fragen zur Person)</h3>
            <p className="text-xs text-gray-600">Klik salah satu kartu di bawah ini untuk melihat pertanyaan ujian terkait identitas diri, lalu coba jawab dalam bahasa Jerman. Anda bisa mencocokkannya dengan contoh jawaban yang tersedia.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPRECHEN_TEIL1_CARDS.map((card) => {
              const isFlipped = flippedCardId === card.id;
              const showAnswer = showTeil1Answers[card.id] || false;

              return (
                <div key={card.id} className="min-h-[220px] relative group perspective cursor-pointer">
                  <div
                    onClick={() => setFlippedCardId(isFlipped ? null : card.id)}
                    className={`w-full h-full duration-500 preserve-3d relative rounded-2xl border border-gray-100 shadow-2xs bg-white p-6 flex flex-col justify-between transition-all hover:shadow-md ${
                      isFlipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front side content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden bg-white rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-goethe-light text-goethe-purple flex items-center justify-center font-black text-sm">
                        ?
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Topik</span>
                        <h4 className="text-xl font-black text-gray-900">{card.keyword}</h4>
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold text-right block">Klik untuk membalik kartu &rarr;</span>
                    </div>

                    {/* Back side content (Flipped) */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between rotate-y-180 backface-hidden bg-white rounded-2xl border border-goethe-purple/20">
                      <div className="space-y-2">
                        <span className="text-xs text-goethe-purple font-bold uppercase tracking-wider">Pertanyaan Ujian:</span>
                        <p className="text-base font-bold text-gray-900 leading-snug">{card.question}</p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-gray-50">
                        {showAnswer ? (
                          <div className="space-y-1 animate-in fade-in duration-200">
                            <span className="text-[10px] text-success font-bold uppercase">Contoh Jawaban:</span>
                            <p className="text-xs text-gray-700 leading-relaxed font-sans italic">{card.answer}</p>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent card reflipping
                              setShowTeil1Answers({ ...showTeil1Answers, [card.id]: true });
                            }}
                            className="w-full text-center py-2 rounded-lg bg-gray-50 hover:bg-goethe-light text-gray-600 hover:text-goethe-purple font-bold text-[10px] transition-colors border border-gray-100"
                          >
                            Tampilkan Contoh Jawaban
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 text-right block">Klik di mana saja untuk kembali</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TEIL 2: VON SICH ERZÄHLEN */}
      {/* ========================================== */}
      {activeTeil === "t2" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: Theme Selector & Timer (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-4">
              <span className="font-bold text-xs text-gray-400 uppercase">Pilih Tema Monolog</span>
              <div className="space-y-2">
                {SPRECHEN_TEIL2_THEMES.map((theme, idx) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedThemeIndex(idx);
                      setMonologTimeLeft(120);
                      setMonologTimerRunning(false);
                      setShowModelMonolog(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-bold transition-all flex justify-between items-center cursor-pointer ${
                      selectedThemeIndex === idx
                        ? "border-goethe-purple bg-goethe-light text-goethe-dark"
                        : "border-gray-100 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <span>{theme.theme}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Speaking Timer */}
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-2xs text-center space-y-4">
              <span className="font-bold text-xs text-gray-400 uppercase block">Timer Latihan Monolog</span>
              
              <div className={`text-5xl font-black font-mono leading-none ${monologTimeLeft < 20 ? "text-error animate-pulse" : "text-gray-800"}`}>
                {formatMonologTime(monologTimeLeft)}
              </div>
              <p className="text-xs text-gray-500">Ujian berbicara Teil 2 meminta Anda bercerita selama 1–2 menit mengenai tema di atas.</p>
              
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setMonologTimerRunning(!monologTimerRunning)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                    monologTimerRunning ? "bg-amber-500 shadow-amber-500/10" : "bg-goethe-purple shadow-goethe-purple/10"
                  }`}
                >
                  {monologTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Mulai Bicara
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setMonologTimerRunning(false);
                    setMonologTimeLeft(120);
                  }}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-goethe-purple hover:bg-gray-50 transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Theme detail & Monolog sample (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-2xs space-y-6">
            <div className="bg-goethe-light border-l-4 border-goethe-purple p-4 rounded-r-xl">
              <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 2 — Von sich erzählen</h3>
              <p className="text-xs text-gray-600">Bicaralah secara bebas mengenai tema di bawah ini berdasarkan petunjuk sub-hints yang tertera.</p>
            </div>

            <div className="space-y-4">
              <span className="font-bold text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Tema Ujian</span>
              <h2 className="text-2xl font-black text-gray-900 leading-snug">{currentTheme.theme}</h2>
            </div>

            {/* Sub-hints grid */}
            <div className="space-y-3 pt-2">
              <span className="font-extrabold text-[10px] text-gray-400 block uppercase">Poin Petunjuk (Sub-Hints)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentTheme.hints.map((hint, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-center text-xs font-bold text-gray-700">
                    {hint}
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable monologue sample */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-gray-400 uppercase">Kunci & Model Monolog</span>
                <button
                  onClick={() => setShowModelMonolog(!showModelMonolog)}
                  className="flex items-center gap-1 text-xs font-bold text-goethe-purple hover:underline cursor-pointer"
                >
                  {showModelMonolog ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Sembunyikan Contoh
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Tampilkan Contoh Monolog
                    </>
                  )}
                </button>
              </div>

              {showModelMonolog && (
                <div className="p-5 bg-success-light/10 border border-success/15 rounded-xl space-y-2 animate-in slide-in-from-top duration-200">
                  <span className="text-[10px] text-success font-bold uppercase block">Jawaban Model (Level A2):</span>
                  <p className="text-sm text-gray-700 leading-relaxed font-sans italic">{currentTheme.modelResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TEIL 3: TERMIN VEREINBAREN */}
      {/* ========================================== */}
      {activeTeil === "t3" && (
        <div className="space-y-6">
          <div className="bg-goethe-light border-l-4 border-goethe-purple p-5 rounded-r-xl">
            <h3 className="font-bold text-goethe-dark text-sm mb-1">Teil 3 — Membuat Janji Temu (Termin vereinbaren)</h3>
            <p className="text-xs text-gray-600">Anda (Kandidat A) harus mencocokkan jadwal dengan partner Anda (Kandidat B/AI) untuk mencari slot waktu kosong yang sama. Ketik pesan Jerman Anda di obrolan untuk mengajukan, menolak, atau menyepakati jadwal.</p>
          </div>

          {/* Scenario Selector & Helper Links */}
          <div className="flex justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-goethe-purple" />
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Topik Pertemuan</span>
                <span className="text-sm font-bold text-gray-800">{currentScenario.theme}</span>
              </div>
            </div>

            <select
              value={scenarioIndex}
              onChange={(e) => setScenarioIndex(Number(e.target.value))}
              className="bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-700 focus:outline-none h-fit"
            >
              {SPRECHEN_TEIL3_SCENARIOS.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {idx === 3 ? "Skenario Tes Model 2" : `Skenario Dialog ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Schedules comparison (5 cols) */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* Kandidat A Schedule (User) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
                <span className="font-bold text-xs bg-goethe-purple text-white px-2.5 py-0.5 rounded-md">Jadwal Anda (Kandidat A)</span>
                <div className="space-y-2 pt-1 font-mono text-xs">
                  {Object.entries(currentScenario.scheduleA).map(([time, busyTask]) => (
                    <div key={time} className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-semibold">{time}</span>
                      {busyTask ? (
                        <span className="text-error font-bold bg-error-light px-2.5 py-0.5 rounded-md max-w-[150px] truncate" title={busyTask}>{busyTask}</span>
                      ) : (
                        <span className="text-success font-bold bg-success-light px-2.5 py-0.5 rounded-md">FREE (KOSONG)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Kandidat B Schedule (AI Partner) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs bg-slate-700 text-white px-2.5 py-0.5 rounded-md">Jadwal Partner (Kandidat B)</span>
                  <button
                    onClick={() => setShowPartnerSchedule(!showPartnerSchedule)}
                    className="text-[10px] font-bold text-goethe-purple hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showPartnerSchedule ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPartnerSchedule ? "Sembunyikan" : "Intip Jadwal"}
                  </button>
                </div>

                {/* Blurred or Visible Schedule */}
                <div className={`space-y-2 pt-1 font-mono text-xs transition-all duration-200 ${!showPartnerSchedule ? "blur-xs opacity-35 select-none pointer-events-none" : ""}`}>
                  {Object.entries(currentScenario.scheduleB).map(([time, busyTask]) => (
                    <div key={time} className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-semibold">{time}</span>
                      {busyTask ? (
                        <span className="text-error font-bold bg-error-light px-2.5 py-0.5 rounded-md max-w-[150px] truncate" title={busyTask}>{busyTask}</span>
                      ) : (
                        <span className="text-success font-bold bg-success-light px-2.5 py-0.5 rounded-md">FREE (KOSONG)</span>
                      )}
                    </div>
                  ))}
                </div>
                
                {!showPartnerSchedule && (
                  <div className="absolute inset-0 bg-white/20 flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-bold text-gray-500 bg-white border border-gray-200 shadow-xs px-3 py-1.5 rounded-lg">Jadwal tersembunyi selama ujian</span>
                  </div>
                )}
              </div>

              {/* Dialogue helper phrases panel */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-goethe-purple" />
                    Kamus Bantuan Ungkapan
                  </span>
                  <button 
                    onClick={() => setShowHelpers(!showHelpers)}
                    className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  >
                    {showHelpers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {showHelpers && (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <span className="font-extrabold text-[9px] text-gray-400 uppercase">Mengajukan Waktu (Vorschlagen)</span>
                      <p className="font-semibold text-gray-700 bg-gray-50 p-1.5 rounded-md border border-gray-100 font-mono">"Hast du am Samstag um 11:00 Uhr Zeit?"</p>
                      <p className="font-semibold text-gray-700 bg-gray-50 p-1.5 rounded-md border border-gray-100 font-mono">"Wie wäre es um 16 Uhr?"</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-extrabold text-[9px] text-gray-400 uppercase">Menolak & Alasan (Ablehnen)</span>
                      <p className="font-semibold text-gray-700 bg-gray-50 p-1.5 rounded-md border border-gray-100 font-mono">"Das geht leider nicht, weil ich da..."</p>
                      <p className="font-semibold text-gray-700 bg-gray-50 p-1.5 rounded-md border border-gray-100 font-mono">"Da habe ich keine Zeit, ich muss..."</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-extrabold text-[9px] text-gray-400 uppercase">Menyetujui (Zustimmen)</span>
                      <p className="font-semibold text-gray-700 bg-gray-50 p-1.5 rounded-md border border-gray-100 font-mono">"Ja, das passt mir sehr gut!"</p>
                      <p className="font-semibold text-gray-700 bg-gray-50 p-1.5 rounded-md border border-gray-100 font-mono">"Super, einverstanden!"</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Chat negotiations (8 cols) */}
            <div className="xl:col-span-8 space-y-6">
              
              {/* Real-time grammar corrections warning */}
              {grammarCorrections.length > 0 && !isAgreed && (
                <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Catatan Koreksi Grammar Jerman Anda:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-amber-900 leading-relaxed font-medium">
                    {grammarCorrections.map((corr, idx) => (
                      <li key={idx}>{corr}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chat Container */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col min-h-[420px] max-h-[600px]">
                
                {/* Chat Top bar */}
                <div className="bg-goethe-purple p-4 text-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Kandidat B (AI Partner)</h4>
                      <span className="text-[10px] text-goethe-light font-medium">Aktif • Mitra Ujian Anda</span>
                    </div>
                  </div>

                  <button
                    onClick={resetTeil3}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Mulai Ulang Percakapan"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Bubbles Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 scrollbar-thin">
                  {chatHistory.map((msg, idx) => {
                    const isAI = msg.sender === "ai";
                    return (
                      <div
                        key={idx}
                        className={`flex gap-2.5 max-w-[85%] ${isAI ? "self-start" : "self-end flex-row-reverse ml-auto"}`}
                      >
                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-2xs ${
                          isAI ? "bg-slate-200 text-slate-700" : "bg-goethe-purple text-white"
                        }`}>
                          {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>

                        {/* Bubble */}
                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                          isAI 
                            ? "bg-white text-gray-800 border border-gray-100 rounded-tl-xs shadow-3xs" 
                            : "bg-goethe-purple text-white rounded-tr-xs shadow-3xs shadow-goethe-purple/10"
                        }`}>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="flex gap-2.5 max-w-[85%] self-start">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl border border-gray-100 rounded-tl-xs shadow-3xs">
                        <div className="flex gap-1 h-3 items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef}></div>
                </div>

                {/* Form Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2.5 items-center">
                  <input
                    type="text"
                    disabled={isTyping || isAgreed}
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-goethe-purple text-xs placeholder-gray-300"
                    placeholder={isAgreed ? "Negosiasi telah diselesaikan!" : "Ketik pesan Anda dalam bahasa Jerman..."}
                  />
                  <button
                    type="submit"
                    disabled={isTyping || isAgreed || !inputMsg.trim()}
                    className="p-2.5 bg-goethe-purple disabled:bg-gray-300 text-white rounded-xl shadow-md shadow-goethe-purple/10 hover:bg-goethe-purple-hover cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* final score result overlay card */}
              {isAgreed && finalScore !== null && (
                <div className="p-6 bg-success-light/20 border border-success/20 rounded-2xl shadow-sm space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-6 h-6" />
                    <h3 className="font-extrabold text-sm uppercase tracking-wider">Kesepakatan Tercapai!</h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white border border-success/10 rounded-xl text-center shadow-2xs min-w-[100px]">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase">Skor Sprechen</span>
                      <span className="block text-3xl font-black text-success mt-1">{finalScore} / 25</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="block text-xs font-bold text-gray-700">Ulasan & Feedback Penilai:</span>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">{feedbackText}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
