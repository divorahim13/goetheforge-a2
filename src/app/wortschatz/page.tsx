"use client";

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, Search, Filter, BookOpen, CheckCircle, 
  HelpCircle, RefreshCw, ChevronLeft, ChevronRight, Check, X,
  Activity, Star, ListFilter
} from "lucide-react";
import { WORTSCHATZ_BANK, Word } from "@/lib/questions";
import { getWortschatzProgress, saveWortschatzStatus, WortschatzProgress } from "@/lib/db";

export default function WortschatzModule() {
  const [dbProgress, setDbProgress] = useState<WortschatzProgress>({});
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");

  // Study/Quiz states
  const [mode, setMode] = useState<"study" | "quiz">("study");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz input state
  const [quizInput, setQuizInput] = useState("");
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState(false);

  // Load progress on mount
  useEffect(() => {
    setDbProgress(getWortschatzProgress());
  }, []);

  // Filter words
  const filteredWords = WORTSCHATZ_BANK.filter((w) => {
    // Search query check
    const matchesSearch = 
      w.german.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.indonesian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.germanPlural && w.germanPlural.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter check
    const matchesCategory = selectedCategory === "Semua" || w.category === selectedCategory;

    // Status filter check
    const status = dbProgress[w.german] || "none";
    let matchesStatus = true;
    if (statusFilter === "Hafal") matchesStatus = status === "learned";
    else if (statusFilter === "Review") matchesStatus = status === "review";
    else if (statusFilter === "Belum") matchesStatus = status === "none";

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Safe Index Adjustment when filtered words change
  useEffect(() => {
    if (currentIndex >= filteredWords.length) {
      setCurrentIndex(Math.max(0, filteredWords.length - 1));
    }
    setIsFlipped(false);
    resetQuizState();
  }, [searchQuery, selectedCategory, statusFilter, filteredWords.length]);

  const resetQuizState = () => {
    setQuizInput("");
    setQuizChecked(false);
    setQuizIsCorrect(false);
  };

  const handleNext = () => {
    if (filteredWords.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    setIsFlipped(false);
    resetQuizState();
  };

  const handlePrev = () => {
    if (filteredWords.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    setIsFlipped(false);
    resetQuizState();
  };

  // Mark word status
  const handleMarkStatus = (germanWord: string, status: "none" | "learned" | "review") => {
    saveWortschatzStatus(germanWord, status);
    setDbProgress(prev => ({ ...prev, [germanWord]: status }));
  };

  // Get word color based on gender
  const getWordColorConfig = (w: Word) => {
    if (w.type === "noun") {
      if (w.gender === "der") return { border: "border-blue-200", text: "text-blue-600", bg: "bg-blue-50/50", badge: "bg-blue-600" };
      if (w.gender === "die") return { border: "border-rose-200", text: "text-rose-600", bg: "bg-rose-50/50", badge: "bg-rose-600" };
      if (w.gender === "das") return { border: "border-emerald-200", text: "text-emerald-600", bg: "bg-emerald-50/50", badge: "bg-emerald-600" };
    }
    return { border: "border-gray-200", text: "text-gray-600", bg: "bg-gray-50/50", badge: "bg-gray-500" };
  };

  // Check Quiz Answer
  const handleCheckQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizInput.trim() || filteredWords.length === 0) return;

    const currentWord = filteredWords[currentIndex];
    
    // Normalize user input & correct answer
    // Remove articles from user input if they typed it, but check both
    const cleanUser = quizInput.trim().toLowerCase().replace(/^(der|die|das)\s+/, "");
    const cleanCorrect = currentWord.german.toLowerCase().replace(/^(der|die|das)\s+/, "");

    const isCorrect = 
      cleanUser === cleanCorrect || 
      quizInput.trim().toLowerCase() === currentWord.german.toLowerCase();

    setQuizIsCorrect(isCorrect);
    setQuizChecked(true);

    if (isCorrect) {
      handleMarkStatus(currentWord.german, "learned");
    } else {
      handleMarkStatus(currentWord.german, "review");
    }
  };

  // Categories list
  const CATEGORIES = [
    "Semua", "Rumah", "Sekolah", "Olahraga", "Makanan", "Transport", 
    "Kesehatan", "Belanja", "Pekerjaan", "Keluarga", "Sosial", "Geografi", 
    "Waktu", "Cuaca", "Verben", "Lain-lain"
  ];

  // Stats calculation
  const getCategoryStats = (cat: string) => {
    const list = WORTSCHATZ_BANK.filter(w => cat === "Semua" || w.category === cat);
    const learned = list.filter(w => dbProgress[w.german] === "learned").length;
    return {
      total: list.length,
      learned,
      percent: list.length > 0 ? Math.round((learned / list.length) * 100) : 0
    };
  };

  const globalStats = getCategoryStats("Semua");
  const activeWord = filteredWords[currentIndex];
  const colorConfig = activeWord ? getWordColorConfig(activeWord) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <GraduationCap className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Latihan Wortschatz</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 font-sans">Kumpulan Kosakata A2</h1>
          <p className="text-xs text-gray-500 font-medium">Hafalkan 300+ kata benda, kata kerja, dan kata sifat penting untuk ujian Goethe-Zertifikat A2.</p>
        </div>

        {/* Global Progress Bar in Header */}
        <div className="bg-goethe-light border border-goethe-purple/10 px-4 py-3 rounded-xl min-w-[200px] text-center space-y-1 sm:self-center">
          <div className="flex justify-between items-center text-xs font-bold text-goethe-dark">
            <span>Total Hafal:</span>
            <span>{globalStats.learned} / {globalStats.total} ({globalStats.percent}%)</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-goethe-purple rounded-full" style={{ width: `${globalStats.percent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-goethe-purple text-xs"
            placeholder="Cari kata (Jerman / Indonesia)..."
          />
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>Tema: {cat}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="Semua">Status: Semua Kata</option>
            <option value="Hafal">Status: Sudah Hafal</option>
            <option value="Review">Status: Perlu Review</option>
            <option value="Belum">Status: Belum Dihafal</option>
          </select>
        </div>
      </div>

      {/* Workspace Area: Flashcard Deck vs Category Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Learning Modes & Flashcard (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Mode Switcher */}
          <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100 gap-1.5 shadow-2xs">
            <button
              onClick={() => {
                setMode("study");
                setIsFlipped(false);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "study" ? "bg-goethe-purple text-white shadow-2xs" : "text-gray-500 hover:text-goethe-purple"
              }`}
            >
              Mode Belajar (DE &rarr; ID)
            </button>
            <button
              onClick={() => {
                setMode("quiz");
                resetQuizState();
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "quiz" ? "bg-goethe-purple text-white shadow-2xs" : "text-gray-500 hover:text-goethe-purple"
              }`}
            >
              Mode Kuis Ketik (ID &rarr; DE)
            </button>
          </div>

          {/* Flashcard Component */}
          {filteredWords.length > 0 && activeWord ? (
            <div className="space-y-6">
              
              {/* The Card */}
              {mode === "study" ? (
                // Study card (Flippable)
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`min-h-[260px] bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-all hover:shadow-md relative overflow-hidden select-none ${
                    isFlipped ? "border-goethe-purple/20 bg-goethe-light/10" : ""
                  }`}
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
                    Kategori: {activeWord.category}
                  </span>

                  {/* Word Display */}
                  <div className="my-6 space-y-2">
                    {!isFlipped ? (
                      // Front: German
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {activeWord.gender && (
                            <span className={`text-[10px] uppercase font-black text-white px-2 py-0.5 rounded-md ${colorConfig?.badge}`}>
                              {activeWord.gender}
                            </span>
                          )}
                          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-snug">
                            {activeWord.german}
                          </h2>
                        </div>
                        {activeWord.germanPlural && (
                          <p className="text-sm text-gray-500 font-semibold italic">Plural: {activeWord.germanPlural}</p>
                        )}
                      </div>
                    ) : (
                      // Back: Indonesian
                      <h3 className="text-2xl font-black text-goethe-purple tracking-tight leading-snug">
                        {activeWord.indonesian}
                      </h3>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 font-semibold">Klik kartu untuk membalik &rarr;</span>
                </div>
              ) : (
                // Quiz card (Interactive form)
                <div className="min-h-[260px] bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col justify-between items-center text-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
                    Kuis: {activeWord.category}
                  </span>

                  <div className="my-4 space-y-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">Terjemahkan ke Bahasa Jerman:</span>
                    <h3 className="text-2xl font-black text-gray-900 leading-snug">{activeWord.indonesian}</h3>
                  </div>

                  <form onSubmit={handleCheckQuiz} className="w-full max-w-sm space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        disabled={quizChecked}
                        value={quizInput}
                        onChange={(e) => setQuizInput(e.target.value)}
                        className={`flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-goethe-purple text-xs font-semibold ${
                          quizChecked
                            ? quizIsCorrect
                              ? "bg-success-light/35 border-success text-success"
                              : "bg-error-light/35 border-error text-error"
                            : "bg-white border-gray-200"
                        }`}
                        placeholder="Ketik kata bahasa Jerman..."
                        autoFocus
                      />
                      {!quizChecked ? (
                        <button
                          type="submit"
                          disabled={!quizInput.trim()}
                          className="px-4 py-2 bg-goethe-purple hover:bg-goethe-purple-hover disabled:bg-gray-300 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Cek
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Lanjut
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Corrections result box */}
                  {quizChecked && (
                    <div className="w-full max-w-sm animate-in slide-in-from-bottom duration-250">
                      {quizIsCorrect ? (
                        <p className="text-xs text-success font-bold flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Betul!
                        </p>
                      ) : (
                        <div className="text-xs text-error font-bold space-y-1">
                          <p className="flex items-center justify-center gap-1"><X className="w-4 h-4" /> Salah!</p>
                          <p className="text-gray-500 font-medium">Kunci: <span className="font-bold text-gray-800">{activeWord.german}</span></p>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-gray-400">Jawab dengan atau tanpa artikel (der/die/das).</span>
                </div>
              )}

              {/* Status Markings & Navigation Row */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {/* Status Marking Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkStatus(activeWord.german, "learned")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      dbProgress[activeWord.german] === "learned"
                        ? "bg-success text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:text-success hover:border-success"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Sudah Hafal
                  </button>
                  <button
                    onClick={() => handleMarkStatus(activeWord.german, "review")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      dbProgress[activeWord.german] === "review"
                        ? "bg-amber-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:text-amber-500 hover:border-amber-500"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    Review
                  </button>
                  {dbProgress[activeWord.german] && dbProgress[activeWord.german] !== "none" && (
                    <button
                      onClick={() => handleMarkStatus(activeWord.german, "none")}
                      className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-error hover:border-error rounded-xl cursor-pointer"
                      title="Reset Status"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Deck Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-goethe-purple hover:border-goethe-purple cursor-pointer shadow-3xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-extrabold text-gray-500 font-mono">
                    {currentIndex + 1} / {filteredWords.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-goethe-purple hover:border-goethe-purple cursor-pointer shadow-3xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <Search className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">Tidak Ada Kosakata Cocok</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">Sesuaikan kata pencarian atau filter status untuk menemukan kosakata yang ingin dilatih.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                  setStatusFilter("Semua");
                }}
                className="px-4 py-2 bg-goethe-purple text-white text-xs font-bold rounded-xl shadow-sm hover:bg-goethe-purple-hover cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

        </div>

        {/* Right Side: Category statistics (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-2 flex items-center gap-2 text-gray-700">
            <Activity className="w-4.5 h-4.5 text-goethe-purple" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider">Hafalan per Topik</h4>
          </div>
          
          <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
            {CATEGORIES.slice(1).map((cat) => {
              const stats = getCategoryStats(cat);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                    <span>{cat}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{stats.learned} / {stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-goethe-purple rounded-full transition-all duration-300"
                      style={{ width: `${stats.percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
