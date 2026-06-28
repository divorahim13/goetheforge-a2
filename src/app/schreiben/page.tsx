"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  PenTool, Clock, Award, Save, RefreshCw, Send, CheckSquare, 
  ChevronRight, AlertCircle, CheckCircle, Info, FileText 
} from "lucide-react";
import { SCHREIBEN_BANK, SchreibenScenario } from "@/lib/questions";
import { saveModuleProgress } from "@/lib/db";

export default function SchreibenModule() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const currentScenario: SchreibenScenario = SCHREIBEN_BANK[scenarioIndex];

  // Active sub-module: "t1" (SMS) | "t2" (Email)
  const [activeTeil, setActiveTeil] = useState<"t1" | "t2">("t1");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isExamRunning, setIsExamRunning] = useState(true);

  // Input states
  const [textT1, setTextT1] = useState("");
  const [textT2, setTextT2] = useState("");

  // Point checklists
  const [checkedPointsT1, setCheckedPointsT1] = useState<boolean[]>([false, false, false]);
  const [checkedPointsT2, setCheckedPointsT2] = useState<boolean[]>([false, false, false]);

  // AI Evaluation states
  const [loadingAI, setLoadingAI] = useState(false);
  const [evaluationT1, setEvaluationT1] = useState<{
    aufgabe: string;
    sprache: string;
    feedback: string;
    beispiel: string;
  } | null>(null);
  const [evaluationT2, setEvaluationT2] = useState<{
    aufgabe: string;
    sprache: string;
    feedback: string;
    beispiel: string;
  } | null>(null);

  // Helper toggle
  const [showTemplates, setShowTemplates] = useState(true);

  // Timer Ref
  useEffect(() => {
    if (!isExamRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExamRunning(false);
          alert("Waktu menulis Anda sudah habis!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamRunning]);

  // Load Auto-Saved Drafts and full state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const draftT1 = localStorage.getItem(`goetheforge_draft_schreiben_t1_${scenarioIndex}`);
      const draftT2 = localStorage.getItem(`goetheforge_draft_schreiben_t2_${scenarioIndex}`);
      const cachedTime = localStorage.getItem(`goetheforge_schreiben_time_${scenarioIndex}`);
      const cachedExamRunning = localStorage.getItem(`goetheforge_schreiben_running_${scenarioIndex}`);
      const cachedPointsT1 = localStorage.getItem(`goetheforge_schreiben_points_t1_${scenarioIndex}`);
      const cachedPointsT2 = localStorage.getItem(`goetheforge_schreiben_points_t2_${scenarioIndex}`);
      const cachedEvalT1 = localStorage.getItem(`goetheforge_schreiben_eval_t1_${scenarioIndex}`);
      const cachedEvalT2 = localStorage.getItem(`goetheforge_schreiben_eval_t2_${scenarioIndex}`);
      const cachedTab = localStorage.getItem(`goetheforge_schreiben_tab_${scenarioIndex}`);

      if (draftT1) setTextT1(draftT1);
      if (draftT2) setTextT2(draftT2);
      if (cachedTime) setTimeLeft(Number(cachedTime));
      if (cachedExamRunning) setIsExamRunning(cachedExamRunning === "true");
      if (cachedPointsT1) setCheckedPointsT1(JSON.parse(cachedPointsT1));
      if (cachedPointsT2) setCheckedPointsT2(JSON.parse(cachedPointsT2));
      if (cachedEvalT1) setEvaluationT1(JSON.parse(cachedEvalT1));
      if (cachedEvalT2) setEvaluationT2(JSON.parse(cachedEvalT2));
      if (cachedTab) setActiveTeil(cachedTab as any);
    }
  }, [scenarioIndex]);

  // Auto-Save Drafts on change
  const handleTextChange = (text: string, type: "t1" | "t2") => {
    if (type === "t1") {
      setTextT1(text);
      localStorage.setItem(`goetheforge_draft_schreiben_t1_${scenarioIndex}`, text);
    } else {
      setTextT2(text);
      localStorage.setItem(`goetheforge_draft_schreiben_t2_${scenarioIndex}`, text);
    }
  };

  // Cache changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`goetheforge_schreiben_time_${scenarioIndex}`, timeLeft.toString());
    }
  }, [timeLeft, scenarioIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`goetheforge_schreiben_running_${scenarioIndex}`, isExamRunning.toString());
    }
  }, [isExamRunning, scenarioIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`goetheforge_schreiben_points_t1_${scenarioIndex}`, JSON.stringify(checkedPointsT1));
    }
  }, [checkedPointsT1, scenarioIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`goetheforge_schreiben_points_t2_${scenarioIndex}`, JSON.stringify(checkedPointsT2));
    }
  }, [checkedPointsT2, scenarioIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (evaluationT1) {
        localStorage.setItem(`goetheforge_schreiben_eval_t1_${scenarioIndex}`, JSON.stringify(evaluationT1));
      } else {
        localStorage.removeItem(`goetheforge_schreiben_eval_t1_${scenarioIndex}`);
      }
    }
  }, [evaluationT1, scenarioIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (evaluationT2) {
        localStorage.setItem(`goetheforge_schreiben_eval_t2_${scenarioIndex}`, JSON.stringify(evaluationT2));
      } else {
        localStorage.removeItem(`goetheforge_schreiben_eval_t2_${scenarioIndex}`);
      }
    }
  }, [evaluationT2, scenarioIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`goetheforge_schreiben_tab_${scenarioIndex}`, activeTeil);
    }
  }, [activeTeil, scenarioIndex]);

  // Helper templates
  const TEMPLATE_SMS = {
    openings: ["Lieber Christian,", "Hallo Christian,", "Hallo Sarah,"],
    closings: ["Viele Grüße", "Dein/Deine [Nama]", "Bis bald"]
  };

  const TEMPLATE_EMAIL = {
    openings: ["Sehr geehrte Damen und Herren,", "Sehr geehrter Herr Wagner,", "Sehr geehrte Frau Schmidt,"],
    closings: ["Mit freundlichen Grüßen,", "Freundliche Grüße,", "Ich warte auf Ihre Antwort."]
  };

  const insertTemplateText = (tpl: string) => {
    if (activeTeil === "t1") {
      handleTextChange(tpl + "\n" + textT1, "t1");
    } else {
      handleTextChange(tpl + "\n" + textT2, "t2");
    }
  };

  // Word Counters & Color coding
  const getWordCount = (str: string) => {
    if (!str.trim()) return 0;
    return str.trim().split(/\s+/).length;
  };

  const getWordCountConfig = (count: number, type: "t1" | "t2") => {
    const min = type === "t1" ? 20 : 30;
    const max = type === "t1" ? 30 : 40;

    if (count === 0) return { color: "text-gray-400", bg: "bg-gray-100", label: "Belum menulis" };
    if (count < min - 5 || count > max + 5) {
      return { color: "text-error font-bold", bg: "bg-error-light", label: `Terlalu ${count < min ? "sedikit" : "banyak"}!` };
    }
    if (count < min || count > max) {
      return { color: "text-amber-600 font-semibold", bg: "bg-warning-light", label: "Mendekati batas" };
    }
    return { color: "text-success font-black", bg: "bg-success-light", label: "Ideal (Sesuai ketentuan)" };
  };

  // Submit and Call AI Endpoint
  const handleAIEvaluation = async () => {
    const text = activeTeil === "t1" ? textT1 : textT2;
    if (getWordCount(text) < 5) {
      alert("Tulisan Anda terlalu singkat untuk dinilai AI.");
      return;
    }

    setLoadingAI(true);
    try {
      const resp = await fetch("/api/score-schreiben", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teil: activeTeil === "t1" ? 1 : 2,
          text,
          situation: activeTeil === "t1" ? currentScenario.teil1.situation : currentScenario.teil2.situation,
          points: activeTeil === "t1" ? currentScenario.teil1.points : currentScenario.teil2.points
        })
      });

      const data = await resp.json();
      if (activeTeil === "t1") {
        setEvaluationT1(data);
      } else {
        setEvaluationT2(data);
      }

      // Save grade to history
      // Scale evaluation grade: A = 12.5, B = 10, C = 7.5, D = 5, E = 2.5 per section
      // German writing is graded based on two parts, total score out of 25.
      // We will parse AI grade A-E to numbers
      const gradeMap: { [key: string]: number } = { A: 12.5, B: 10, C: 7.5, D: 5, E: 2.5 };
      const aufgabeVal = gradeMap[data.aufgabe] || 7.5;
      const spracheVal = gradeMap[data.sprache] || 7.5;
      const scaledPunkte = aufgabeVal + spracheVal; // total points out of 25

      saveModuleProgress("schreiben", scaledPunkte, 25);
    } catch (e) {
      console.error(e);
      alert("Gagal melakukan koreksi AI. Silakan coba lagi.");
    } finally {
      setLoadingAI(false);
    }
  };

  // Reset module
  const handleResetScenario = (newIdx = scenarioIndex) => {
    if (confirm("Reset ulang lembar jawaban Anda untuk skenario ini?")) {
      setScenarioIndex(newIdx);
      setTextT1("");
      setTextT2("");
      setCheckedPointsT1([false, false, false]);
      setCheckedPointsT2([false, false, false]);
      setEvaluationT1(null);
      setEvaluationT2(null);
      setTimeLeft(1800);
      setIsExamRunning(true);
      
      // Clear localStorage cache
      if (typeof window !== "undefined") {
        localStorage.removeItem(`goetheforge_draft_schreiben_t1_${newIdx}`);
        localStorage.removeItem(`goetheforge_draft_schreiben_t2_${newIdx}`);
        localStorage.removeItem(`goetheforge_schreiben_time_${newIdx}`);
        localStorage.removeItem(`goetheforge_schreiben_running_${newIdx}`);
        localStorage.removeItem(`goetheforge_schreiben_points_t1_${newIdx}`);
        localStorage.removeItem(`goetheforge_schreiben_points_t2_${newIdx}`);
        localStorage.removeItem(`goetheforge_schreiben_eval_t1_${newIdx}`);
        localStorage.removeItem(`goetheforge_schreiben_eval_t2_${newIdx}`);
        localStorage.removeItem(`goetheforge_schreiben_tab_${newIdx}`);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const count = getWordCount(activeTeil === "t1" ? textT1 : textT2);
  const wordConfig = getWordCountConfig(count, activeTeil);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <PenTool className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Modul Schreiben</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Menulis (Schreibkompetenz)</h1>
          <p className="text-xs text-gray-500 font-medium">Tulis pesan singkat dalam bahasa Jerman. AI akan mengoreksi tata bahasa dan memberikan nilai resmi.</p>
        </div>

        {/* Set Selector & Timer */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-gray-400">Skenario:</label>
            <select
              value={scenarioIndex}
              onChange={(e) => handleResetScenario(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none"
            >
              {SCHREIBEN_BANK.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {idx === 3 ? "Skenario Tes Model 2" : `Skenario Latihan ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <button
            onClick={() => handleResetScenario()}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-goethe-purple hover:bg-gray-50 transition-colors cursor-pointer"
            title="Reset latihan"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Timer display */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
            timeLeft < 300 ? "bg-error-light text-error border-error animate-pulse" : "bg-white text-gray-600 border-gray-200"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Teil Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-white p-1.5 rounded-xl gap-1.5 shadow-xs">
        <button
          onClick={() => setActiveTeil("t1")}
          className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTeil === "t1"
              ? "bg-goethe-purple text-white shadow-xs"
              : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
          }`}
        >
          Teil 1 (SMS / WhatsApp • 20-30 Kata)
        </button>
        <button
          onClick={() => setActiveTeil("t2")}
          className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTeil === "t2"
              ? "bg-goethe-purple text-white shadow-xs"
              : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
          }`}
        >
          Teil 2 (Email Formal • 30-40 Kata)
        </button>
      </div>

      {/* Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Scenarios & Checklists (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Situation card */}
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-wide">
              {activeTeil === "t1" ? currentScenario.teil1.title : currentScenario.teil2.title}
            </h3>
            
            <div className="space-y-3">
              <span className="font-bold text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md h-fit">Skenario Soal</span>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {activeTeil === "t1" ? currentScenario.teil1.situation : currentScenario.teil2.situation}
              </p>
            </div>

            {/* Required points checklist */}
            <div className="space-y-3 pt-2">
              <span className="font-bold text-xs bg-goethe-purple text-white px-2 py-0.5 rounded-md h-fit">3 Poin Wajib</span>
              <p className="text-[11px] text-gray-500">Centang poin berikut secara mandiri setelah Anda menulisnya:</p>
              <div className="space-y-2">
                {(activeTeil === "t1" ? currentScenario.teil1.points : currentScenario.teil2.points).map((pt, idx) => {
                  const isChecked = activeTeil === "t1" ? checkedPointsT1[idx] : checkedPointsT2[idx];
                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked 
                          ? "border-success bg-success-light/35 font-semibold text-success-light text-success" 
                          : "border-gray-100 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (activeTeil === "t1") {
                            const updated = [...checkedPointsT1];
                            updated[idx] = !updated[idx];
                            setCheckedPointsT1(updated);
                          } else {
                            const updated = [...checkedPointsT2];
                            updated[idx] = !updated[idx];
                            setCheckedPointsT2(updated);
                          }
                        }}
                        className="accent-success"
                      />
                      <span>{pt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Template helper suggestions */}
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <Info className="w-4 h-4 text-goethe-purple" />
                Template Pembuka/Penutup
              </h3>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-[10px] font-bold text-goethe-purple hover:underline cursor-pointer"
              >
                {showTemplates ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            {showTemplates && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="font-extrabold text-[10px] text-gray-400 block uppercase">Salam Pembuka (Begrüßung)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeTeil === "t1" ? TEMPLATE_SMS.openings : TEMPLATE_EMAIL.openings).map((str, idx) => (
                      <button
                        key={idx}
                        onClick={() => insertTemplateText(str)}
                        className="px-2.5 py-1.5 bg-gray-50 hover:bg-goethe-light border border-gray-100 hover:border-goethe-purple rounded-lg text-xs font-semibold text-gray-700 hover:text-goethe-purple cursor-pointer transition-colors"
                      >
                        {str}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-50">
                  <span className="font-extrabold text-[10px] text-gray-400 block uppercase">Salam Penutup (Grußformel)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeTeil === "t1" ? TEMPLATE_SMS.closings : TEMPLATE_EMAIL.closings).map((str, idx) => (
                      <button
                        key={idx}
                        onClick={() => insertTemplateText(str)}
                        className="px-2.5 py-1.5 bg-gray-50 hover:bg-goethe-light border border-gray-100 hover:border-goethe-purple rounded-lg text-xs font-semibold text-gray-700 hover:text-goethe-purple cursor-pointer transition-colors"
                      >
                        {str}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Text Editor & AI Corrections (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main writing sheet */}
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-4">
            
            {/* Word count header info */}
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-gray-400 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Lembar Jawaban Anda
              </span>
              
              {/* Word counter badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${wordConfig.color} ${wordConfig.bg}`}>
                <span>Jumlah Kata: {count}</span>
                <span className="opacity-50">•</span>
                <span>{wordConfig.label}</span>
              </div>
            </div>

            {/* Textarea Input */}
            <textarea
              value={activeTeil === "t1" ? textT1 : textT2}
              onChange={(e) => handleTextChange(e.target.value, activeTeil)}
              className="w-full min-h-[180px] p-4 border border-gray-200 focus:border-goethe-purple rounded-xl focus:outline-none focus:ring-1 focus:ring-goethe-purple text-sm leading-relaxed font-sans placeholder-gray-300"
              placeholder={activeTeil === "t1" ? "Schreibe eine SMS/WhatsApp..." : "Schreibe eine formelle E-Mail..."}
            ></textarea>

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                <Save className="w-3.5 h-3.5" />
                Draf disimpan otomatis di peramban Anda.
              </span>
              
              <button
                disabled={loadingAI || count < 5}
                onClick={handleAIEvaluation}
                className="flex items-center gap-2 px-5 py-2.5 bg-goethe-purple hover:bg-goethe-purple-hover disabled:bg-gray-300 text-white rounded-xl text-xs font-bold shadow-md shadow-goethe-purple/15 transition-all cursor-pointer"
              >
                {loadingAI ? (
                  <>
                    <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                    Mengkoreksi Tulisan...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Koreksi dengan AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Feedback Card */}
          {activeTeil === "t1" ? (
            evaluationT1 && renderAIEvaluationCard(evaluationT1)
          ) : (
            evaluationT2 && renderAIEvaluationCard(evaluationT2)
          )}
        </div>
      </div>
    </div>
  );

  // Render evaluation helper card
  function renderAIEvaluationCard(evalData: { aufgabe: string; sprache: string; feedback: string; beispiel: string }) {
    // Grade colors
    const getGradeColor = (g: string) => {
      if (["A", "B"].includes(g)) return "text-success bg-success-light border-success/15";
      if (g === "C") return "text-amber-600 bg-warning-light border-warning/20";
      return "text-error bg-error-light border-error/15";
    };

    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-in slide-in-from-bottom duration-300">
        
        {/* Grading Title */}
        <div className="flex items-center gap-2 text-goethe-purple border-b border-gray-50 pb-3">
          <Award className="w-5 h-5" />
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">Hasil Koreksi AI GoetheForge</h3>
        </div>

        {/* Scaled Grades Box */}
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <div className="p-3.5 rounded-xl border text-center space-y-0.5">
            <span className="block text-[10px] font-bold text-gray-400 uppercase">Aufgabenerfüllung</span>
            <span className="block text-[10px] text-gray-500 font-medium">(Pemenuhan Tugas)</span>
            <span className={`inline-block px-3 py-1 rounded-lg text-lg font-black mt-2 border ${getGradeColor(evalData.aufgabe)}`}>
              {evalData.aufgabe}
            </span>
          </div>
          <div className="p-3.5 rounded-xl border text-center space-y-0.5">
            <span className="block text-[10px] font-bold text-gray-400 uppercase">Sprache</span>
            <span className="block text-[10px] text-gray-500 font-medium">(Ketepatan Bahasa)</span>
            <span className={`inline-block px-3 py-1 rounded-lg text-lg font-black mt-2 border ${getGradeColor(evalData.sprache)}`}>
              {evalData.sprache}
            </span>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="space-y-2">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wide">Evaluasi & Kritik Pembelajaran</h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-line bg-gray-50/70 p-4 rounded-xl border border-gray-50">
            {evalData.feedback}
          </p>
        </div>

        {/* Better Sample Response */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs bg-success-light text-success px-2.5 py-0.5 rounded-md h-fit">Versi Contoh Lebih Baik</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed font-sans italic bg-success-light/10 border border-success/10 p-4 rounded-xl">
            {evalData.beispiel}
          </p>
        </div>
      </div>
    );
  }
}
