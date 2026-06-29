"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, Award, Clock, Play, Pause, RotateCcw, 
  ChevronRight, Volume2, Info, CheckCircle, HelpCircle, FileText
} from "lucide-react";
import { SPRECHEN_BANK_B1, SprechenSetB1 } from "@/lib/questions_b1";

export default function B1SprechenModule() {
  const [activeTeil, setActiveTeil] = useState<"t1" | "t2" | "t3">("t1");
  const [setIndex] = useState(0);
  const currentSet: SprechenSetB1 = SPRECHEN_BANK_B1[setIndex];

  // --- TEIL 1 (PLANUNG) STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- TEIL 2 (PRÄSENTATION) STATE ---
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const currentTopic = currentSet.teil2.topics[selectedTopicIndex];
  const [timerVal, setTimerVal] = useState(180); // 3 minutes for B1 presentation
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Audio Recorder Handler
  const startRecording = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);
      
      recordIntervalRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Gagal mengakses mikrofon:", err);
      alert("Mohon izinkan akses mikrofon untuk berlatih berbicara.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all tracks on stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Presentation Timer Handlers
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerVal(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerVal(180);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <Mic className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Modul Sprechen B1</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Berbicara (Mündlicher Ausdruck)</h1>
          <p className="text-xs text-gray-500 font-medium">Latih kelancaran presentasi dan diskusi Anda dalam bahasa Jerman sesuai kriteria Goethe B1.</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 bg-white p-1.5 rounded-xl shadow-xs gap-1.5">
        {[
          { key: "t1", label: "Teil 1: Merencanakan Sesuatu" },
          { key: "t2", label: "Teil 2: Presentasi Topik" },
          { key: "t3", label: "Teil 3: Tanya Jawab / Umpan Balik" }
        ].map(tab => {
          const isActive = activeTeil === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTeil(tab.key as any)}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-goethe-purple text-white shadow-sm"
                  : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
        
        {/* TEIL 1 (GEMEINSAM ETWAS PLANEN) */}
        {activeTeil === "t1" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple">
              <h3 className="font-bold text-goethe-dark text-sm mb-0.5">Teil 1: Merencanakan Sesuatu Bersama Partner</h3>
              <p className="text-gray-600 text-xs">
                Anda dan partner Anda harus merencanakan sebuah acara bersama dalam waktu sekitar 3-4 menit. Sampaikan proposal Anda dan tanggapi usulan dari partner Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left column: Topic and Guidelines */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-gray-50 border border-gray-150 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">Topik Rencana</span>
                    <h4 className="font-black text-gray-900 text-base leading-normal">{currentSet.teil1.theme}</h4>
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed italic bg-white p-3 rounded-lg border border-gray-100">
                    Skenario: “{currentSet.teil1.situation}”
                  </p>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Poin yang Harus Didiskusikan:</span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
                      {currentSet.teil1.guidelines.map((g, i) => (
                        <li key={i} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-gray-150">
                          <span className="w-5 h-5 rounded-full bg-goethe-purple/10 flex items-center justify-center text-goethe-purple text-[10px] font-bold">{i+1}</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Microphone / Playground */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4 text-center">
                  <h4 className="font-bold text-gray-900 text-sm">Laboratorium Latihan Berbicara (Rekam Mandiri)</h4>
                  <p className="text-gray-500 text-xs max-w-md mx-auto">
                    Rekam suara Anda sendiri saat mencoba melisankan dialog perencanaan. Dengarkan kembali untuk mengevaluasi kelancaran dan intonasi Anda.
                  </p>

                  <div className="flex justify-center items-center gap-4 py-2">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-5 py-3 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md shadow-goethe-purple/10"
                      >
                        <Mic className="w-4 h-4 animate-pulse" />
                        Mulai Rekam Suara
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-5 py-3 rounded-xl bg-error hover:bg-error/95 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md shadow-error/10"
                      >
                        <Pause className="w-4 h-4 animate-bounce" />
                        Hentikan Rekam ({formatTime(recordTime)})
                      </button>
                    )}
                  </div>

                  {audioUrl && (
                    <div className="bg-white p-3 rounded-xl border border-gray-200 inline-flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-600">Putar Rekaman:</span>
                      <audio src={audioUrl} controls className="h-9"></audio>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column: Redemittel */}
              <div className="lg:col-span-5 bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4">
                <h4 className="font-extrabold text-gray-900 text-xs border-b border-gray-200 pb-2 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-goethe-purple" />
                  <span>Ungkapan Penting (Redemittel)</span>
                </h4>
                <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-thin">
                  {currentSet.teil1.redemittel.map((r, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 text-xs font-mono font-semibold text-gray-800 hover:border-goethe-purple/30 transition-all select-all">
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEIL 2 (PRÄSENTATION) */}
        {activeTeil === "t2" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple">
              <h3 className="font-bold text-goethe-dark text-sm mb-0.5">Teil 2: Menyampaikan Presentasi Singkat</h3>
              <p className="text-gray-600 text-xs">
                Anda diberikan pilihan 2 topik. Pilih salah satu dan berikan presentasi terstruktur selama sekitar 2-3 menit. Gunakan slide bantu di bawah.
              </p>
            </div>

            {/* Topic Switcher */}
            <div className="flex gap-4 border-b border-gray-200 pb-4">
              {currentSet.teil2.topics.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTopicIndex(idx);
                    setActiveSlide(0);
                    resetTimer();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedTopicIndex === idx
                      ? "bg-goethe-purple border-goethe-purple text-white shadow-xs"
                      : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  {idx === 0 ? "Topik A" : "Topik B"}: {t.title.replace("Thema A: ", "").replace("Thema B: ", "")}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Presentation Slides Playground */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Slide Container */}
                <div className="bg-gray-900 text-white rounded-2xl p-6 min-h-[300px] flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-16 -translate-y-16"></div>
                  
                  {/* Slide header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">Slide {activeSlide + 1} / 5</span>
                    <span className="text-xs font-bold text-white/50">{currentTopic.title}</span>
                  </div>

                  {/* Slide Body */}
                  <div className="my-6 space-y-4 flex-1 flex flex-col justify-center">
                    {activeSlide === 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xl font-extrabold text-goethe-purple">Folie 1: Einleitung & Struktur</h4>
                        <p className="text-sm text-gray-300 leading-relaxed font-mono italic">“{currentTopic.sampleIntro}”</p>
                      </div>
                    )}

                    {activeSlide === 1 && (
                      <div className="space-y-2">
                        <h4 className="text-xl font-extrabold text-goethe-purple">Folie 2: Persönliche Erfahrung</h4>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-black">{currentTopic.samplePoints[0].label}</p>
                        <p className="text-sm text-gray-300 leading-relaxed font-mono italic">“{currentTopic.samplePoints[0].text}”</p>
                      </div>
                    )}

                    {activeSlide === 2 && (
                      <div className="space-y-2">
                        <h4 className="text-xl font-extrabold text-goethe-purple">Folie 3: Situation im Heimatland</h4>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-black">{currentTopic.samplePoints[1].label}</p>
                        <p className="text-sm text-gray-300 leading-relaxed font-mono italic">“{currentTopic.samplePoints[1].text}”</p>
                      </div>
                    )}

                    {activeSlide === 3 && (
                      <div className="space-y-2">
                        <h4 className="text-xl font-extrabold text-goethe-purple">Folie 4: Vor- und Nachteile</h4>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-black">{currentTopic.samplePoints[2].label}</p>
                        <p className="text-sm text-gray-300 leading-relaxed font-mono italic">“{currentTopic.samplePoints[2].text}”</p>
                      </div>
                    )}

                    {activeSlide === 4 && (
                      <div className="space-y-2">
                        <h4 className="text-xl font-extrabold text-goethe-purple">Folie 5: Zusammenfassung & Dank</h4>
                        <p className="text-sm text-gray-300 leading-relaxed font-mono italic">“{currentTopic.sampleOutro}”</p>
                      </div>
                    )}
                  </div>

                  {/* Slide controls */}
                  <div className="flex justify-between items-center border-t border-white/10 pt-4">
                    <button
                      disabled={activeSlide === 0}
                      onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                      className="px-3.5 py-1.5 rounded-lg border border-white/20 text-xs font-bold hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      Kembali
                    </button>

                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3, 4].map(idx => (
                        <span 
                          key={idx} 
                          onClick={() => setActiveSlide(idx)}
                          className={`w-2 h-2 rounded-full cursor-pointer ${
                            activeSlide === idx ? "bg-goethe-purple" : "bg-white/20"
                          }`}
                        ></span>
                      ))}
                    </div>

                    <button
                      disabled={activeSlide === 4}
                      onClick={() => setActiveSlide(prev => Math.min(4, prev + 1))}
                      className="px-3.5 py-1.5 rounded-lg bg-goethe-purple hover:bg-goethe-purple-hover text-xs font-bold cursor-pointer"
                    >
                      Lanjut
                    </button>
                  </div>
                </div>

                {/* Presentation Timer Control */}
                <div className="bg-gray-50 border border-gray-150 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Pengatur Waktu Presentasi B1</span>
                    <h5 className="font-bold text-gray-900 text-sm">Durasi latihan presentasi disarankan: 3:00 menit</h5>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="font-mono text-xl font-bold bg-white px-4 py-2 border border-gray-250 rounded-xl text-gray-800 shadow-xs">
                      {formatTime(timerVal)}
                    </div>

                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shadow-sm ${
                        isTimerRunning ? "bg-amber-500" : "bg-goethe-purple hover:bg-goethe-purple-hover"
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <button
                      onClick={resetTimer}
                      className="w-10 h-10 rounded-xl border border-gray-200 hover:border-goethe-purple bg-white text-gray-500 hover:text-goethe-purple flex items-center justify-center transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Redemittel */}
              <div className="lg:col-span-4 bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4">
                <h4 className="font-extrabold text-gray-900 text-xs border-b border-gray-200 pb-2 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-goethe-purple" />
                  <span>Struktur Presentasi (Redemittel)</span>
                </h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
                  {currentSet.teil2.redemittel.map((r, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 text-xs font-mono font-semibold text-gray-800 hover:border-goethe-purple/30 transition-all select-all">
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEIL 3 (FEEDBACK & FRAGEN) */}
        {activeTeil === "t3" && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="bg-goethe-light rounded-xl p-4 border-l-4 border-goethe-purple">
              <h3 className="font-bold text-goethe-dark text-sm mb-0.5">Teil 3: Memberikan Umpan Balik & Menjawab Pertanyaan</h3>
              <p className="text-gray-600 text-xs">
                Setelah partner Anda melakukan presentasi, Anda harus memberikan feedback (umpan balik) singkat dan mengajukan 1 pertanyaan. Anda juga harus menjawab pertanyaan partner atas presentasi Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Guidelines giving feedback */}
              <div className="bg-gray-50 p-5 border border-gray-150 rounded-2xl space-y-4">
                <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-goethe-purple" />
                  <span>Cara Memberikan Umpan Balik & Pertanyaan</span>
                </h4>
                
                <ul className="space-y-2.5 text-xs text-gray-700">
                  {currentSet.teil3.guidelines.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-100 leading-relaxed font-semibold">
                      <span className="w-5 h-5 rounded-full bg-goethe-purple/10 text-goethe-purple flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i+1}</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Redemittel giving feedback */}
              <div className="bg-gray-50 p-5 border border-gray-150 rounded-2xl space-y-4">
                <h4 className="font-extrabold text-gray-900 text-xs border-b border-gray-250 pb-2 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-goethe-purple" />
                  <span>Ungkapan Menjawab & Bertanya (Redemittel)</span>
                </h4>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                  {currentSet.teil3.redemittel.map((r, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 text-xs font-mono font-semibold text-gray-800 hover:border-goethe-purple/30 transition-all select-all">
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
