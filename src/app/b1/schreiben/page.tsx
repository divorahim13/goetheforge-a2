"use client";

import React, { useState, useEffect } from "react";
import { 
  PenTool, Clock, Award, Save, RefreshCw, Send, CheckSquare, 
  ChevronRight, AlertCircle, CheckCircle, Info, FileText 
} from "lucide-react";
import { SCHREIBEN_BANK_B1, SchreibenScenarioB1 } from "@/lib/questions_b1";
import { saveModuleProgress } from "@/lib/db";

export default function B1SchreibenModule() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const currentScenario: SchreibenScenarioB1 = SCHREIBEN_BANK_B1[scenarioIndex];

  // Active Teil: "t1" | "t2" | "t3"
  const [activeTeil, setActiveTeil] = useState<"t1" | "t2" | "t3">("t1");
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isExamRunning, setIsExamRunning] = useState(true);

  // Input states
  const [textT1, setTextT1] = useState("");
  const [textT2, setTextT2] = useState("");
  const [textT3, setTextT3] = useState("");

  // Point checklists
  const [checkedPointsT1, setCheckedPointsT1] = useState<boolean[]>([false, false, false]);
  const [checkedPointsT2, setCheckedPointsT2] = useState<boolean[]>([false, false, false]);
  const [checkedPointsT3, setCheckedPointsT3] = useState<boolean[]>([false, false, false]);

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
  const [evaluationT3, setEvaluationT3] = useState<{
    aufgabe: string;
    sprache: string;
    feedback: string;
    beispiel: string;
  } | null>(null);

  // Helper template toggle
  const [showTemplates, setShowTemplates] = useState(true);

  // Timer effect
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

  // Load Auto-Saved Drafts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const draftT1 = localStorage.getItem(`goetheforge_b1_draft_schreiben_t1_${scenarioIndex}`);
      const draftT2 = localStorage.getItem(`goetheforge_b1_draft_schreiben_t2_${scenarioIndex}`);
      const draftT3 = localStorage.getItem(`goetheforge_b1_draft_schreiben_t3_${scenarioIndex}`);
      const cachedTime = localStorage.getItem(`goetheforge_b1_schreiben_time_${scenarioIndex}`);
      const cachedExamRunning = localStorage.getItem(`goetheforge_b1_schreiben_running_${scenarioIndex}`);
      const cachedPointsT1 = localStorage.getItem(`goetheforge_b1_schreiben_points_t1_${scenarioIndex}`);
      const cachedPointsT2 = localStorage.getItem(`goetheforge_b1_schreiben_points_t2_${scenarioIndex}`);
      const cachedPointsT3 = localStorage.getItem(`goetheforge_b1_schreiben_points_t3_${scenarioIndex}`);
      const cachedEvalT1 = localStorage.getItem(`goetheforge_b1_schreiben_eval_t1_${scenarioIndex}`);
      const cachedEvalT2 = localStorage.getItem(`goetheforge_b1_schreiben_eval_t2_${scenarioIndex}`);
      const cachedEvalT3 = localStorage.getItem(`goetheforge_b1_schreiben_eval_t3_${scenarioIndex}`);
      const cachedTab = localStorage.getItem(`goetheforge_b1_schreiben_tab_${scenarioIndex}`);

      if (draftT1) setTextT1(draftT1);
      if (draftT2) setTextT2(draftT2);
      if (draftT3) setTextT3(draftT3);
      if (cachedTime) setTimeLeft(Number(cachedTime));
      if (cachedExamRunning) setIsExamRunning(cachedExamRunning === "true");
      if (cachedPointsT1) setCheckedPointsT1(JSON.parse(cachedPointsT1));
      if (cachedPointsT2) setCheckedPointsT2(JSON.parse(cachedPointsT2));
      if (cachedPointsT3) setCheckedPointsT3(JSON.parse(cachedPointsT3));
      if (cachedEvalT1) setEvaluationT1(JSON.parse(cachedEvalT1));
      if (cachedEvalT2) setEvaluationT2(JSON.parse(cachedEvalT2));
      if (cachedEvalT3) setEvaluationT3(JSON.parse(cachedEvalT3));
      if (cachedTab) setActiveTeil(cachedTab as any);
    }
  }, [scenarioIndex]);

  // Auto-Save Drafts on change
  const handleTextChange = (text: string, type: "t1" | "t2" | "t3") => {
    if (type === "t1") {
      setTextT1(text);
      localStorage.setItem(`goetheforge_b1_draft_schreiben_t1_${scenarioIndex}`, text);
    } else if (type === "t2") {
      setTextT2(text);
      localStorage.setItem(`goetheforge_b1_draft_schreiben_t2_${scenarioIndex}`, text);
    } else {
      setTextT3(text);
      localStorage.setItem(`goetheforge_b1_draft_schreiben_t3_${scenarioIndex}`, text);
    }
  };

  // Cache changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`goetheforge_b1_schreiben_time_${scenarioIndex}`, timeLeft.toString());
      localStorage.setItem(`goetheforge_b1_schreiben_running_${scenarioIndex}`, isExamRunning.toString());
      localStorage.setItem(`goetheforge_b1_schreiben_points_t1_${scenarioIndex}`, JSON.stringify(checkedPointsT1));
      localStorage.setItem(`goetheforge_b1_schreiben_points_t2_${scenarioIndex}`, JSON.stringify(checkedPointsT2));
      localStorage.setItem(`goetheforge_b1_schreiben_points_t3_${scenarioIndex}`, JSON.stringify(checkedPointsT3));
      localStorage.setItem(`goetheforge_b1_schreiben_tab_${scenarioIndex}`, activeTeil);
      
      if (evaluationT1) localStorage.setItem(`goetheforge_b1_schreiben_eval_t1_${scenarioIndex}`, JSON.stringify(evaluationT1));
      if (evaluationT2) localStorage.setItem(`goetheforge_b1_schreiben_eval_t2_${scenarioIndex}`, JSON.stringify(evaluationT2));
      if (evaluationT3) localStorage.setItem(`goetheforge_b1_schreiben_eval_t3_${scenarioIndex}`, JSON.stringify(evaluationT3));
    }
  }, [timeLeft, isExamRunning, checkedPointsT1, checkedPointsT2, checkedPointsT3, activeTeil, evaluationT1, evaluationT2, evaluationT3, scenarioIndex]);

  // Insert Template text utility
  const insertTemplateText = (tpl: string) => {
    if (activeTeil === "t1") {
      handleTextChange(tpl + "\n" + textT1, "t1");
    } else if (activeTeil === "t2") {
      handleTextChange(tpl + "\n" + textT2, "t2");
    } else {
      handleTextChange(tpl + "\n" + textT3, "t3");
    }
  };

  // Helper templates
  const TEMPLATE_T1 = {
    openings: ["Lieber Christian,", "Hallo Christian,", "Liebe Sarah,"],
    closings: ["Viele Grüße", "Dein/Deine [Nama]", "Bis bald"]
  };

  const TEMPLATE_T2 = {
    openings: ["Ich finde das Thema ... sehr interessant.", "In diesem Forumsbeitrag möchte ich meine Meinung äußern.", "Meiner Meinung nach..."],
    closings: ["Zusammenfassend lässt sich sagen...", "Das ist meine Sicht der Dinge."]
  };

  const TEMPLATE_T3 = {
    openings: ["Sehr geehrte Frau Dr. Müller,", "Sehr geehrter Herr Wagner,", "Sehr geehrte Damen und Herren,"],
    closings: ["Mit freundlichen Grüßen,", "Freundliche Grüße,"]
  };

  const getWordCount = (str: string) => {
    if (!str.trim()) return 0;
    return str.trim().split(/\s+/).length;
  };

  const getWordCountConfig = (count: number, type: "t1" | "t2" | "t3") => {
    const min = type === "t3" ? 35 : 70;
    const max = type === "t3" ? 55 : 95;

    if (count === 0) return { color: "text-gray-400", bg: "bg-gray-100", label: "Belum menulis" };
    if (count < min - 10 || count > max + 20) {
      return { color: "text-error font-bold", bg: "bg-error-light", label: `Terlalu ${count < min ? "sedikit" : "banyak"}!` };
    }
    if (count < min || count > max) {
      return { color: "text-amber-600 font-semibold", bg: "bg-warning-light", label: "Mendekati batas ideal" };
    }
    return { color: "text-success font-black", bg: "bg-success-light", label: "Ideal (Sesuai ketentuan)" };
  };

  // Trigger AI correction call
  const handleAIEvaluation = async () => {
    const text = activeTeil === "t1" ? textT1 : activeTeil === "t2" ? textT2 : textT3;
    if (getWordCount(text) < 5) {
      alert("Tulisan Anda terlalu singkat untuk dinilai.");
      return;
    }

    setLoadingAI(true);
    try {
      const resp = await fetch("/api/score-schreiben", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: "B1",
          teil: activeTeil === "t1" ? 1 : activeTeil === "t2" ? 2 : 3,
          text,
          situation: activeTeil === "t1" ? currentScenario.teil1.situation : activeTeil === "t2" ? currentScenario.teil2.situation : currentScenario.teil3.situation,
          points: activeTeil === "t1" ? currentScenario.teil1.points : activeTeil === "t2" ? currentScenario.teil2.points : currentScenario.teil3.points
        })
      });

      const data = await resp.json();
      if (activeTeil === "t1") {
        setEvaluationT1(data);
      } else if (activeTeil === "t2") {
        setEvaluationT2(data);
      } else {
        setEvaluationT3(data);
      }

      // Save modular progress (scaled to 100 points)
      const gradeMap: { [key: string]: number } = { A: 50, B: 40, C: 30, D: 20, E: 10 };
      const score = (gradeMap[data.aufgabe] || 35) + (gradeMap[data.sprache] || 35); // 50+50 = 100 points
      saveModuleProgress("schreiben", score, 100, "B1");

    } catch (e) {
      console.error(e);
      alert("Gagal melakukan koreksi. Silakan coba lagi.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleResetScenario = (newIdx = scenarioIndex) => {
    if (confirm("Reset ulang lembar jawaban Anda untuk skenario ini?")) {
      setScenarioIndex(newIdx);
      setTextT1("");
      setTextT2("");
      setTextT3("");
      setCheckedPointsT1([false, false, false]);
      setCheckedPointsT2([false, false, false]);
      setCheckedPointsT3([false, false, false]);
      setEvaluationT1(null);
      setEvaluationT2(null);
      setEvaluationT3(null);
      setTimeLeft(3600);
      setIsExamRunning(true);
      
      if (typeof window !== "undefined") {
        localStorage.removeItem(`goetheforge_b1_draft_schreiben_t1_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_draft_schreiben_t2_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_draft_schreiben_t3_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_schreiben_time_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_schreiben_running_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_schreiben_points_t1_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_schreiben_points_t2_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_schreiben_points_t3_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_schreiben_eval_t1_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_schreiben_eval_t2_${newIdx}`);
        localStorage.removeItem(`goetheforge_b1_schreiben_eval_t3_${newIdx}`);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeText = activeTeil === "t1" ? textT1 : activeTeil === "t2" ? textT2 : textT3;
  const activeWordCount = getWordCount(activeText);
  const activeWordConfig = getWordCountConfig(activeWordCount, activeTeil);
  const activeEval = activeTeil === "t1" ? evaluationT1 : activeTeil === "t2" ? evaluationT2 : evaluationT3;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-goethe-purple">
            <PenTool className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">Modul Schreiben B1</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Menulis (Schriftlicher Ausdruck)</h1>
          <p className="text-xs text-gray-500 font-medium">Latih keterampilan menulis Anda dalam bahasa Jerman sesuai format ujian Goethe B1.</p>
        </div>

        {/* Set Selection and Timer */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500">Pilih Set:</label>
            <select
              value={scenarioIndex}
              onChange={(e) => handleResetScenario(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
            >
              {SCHREIBEN_BANK_B1.map((scen, idx) => (
                <option key={scen.id} value={idx}>{scen.name}</option>
              ))}
            </select>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold ${
            timeLeft < 300 && isExamRunning ? "bg-error-light text-error border-error animate-pulse" : "bg-white text-gray-700 border-gray-200"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{isExamRunning ? formatTime(timeLeft) : "WAKTU HABIS"}</span>
          </div>

          <button
            onClick={() => handleResetScenario()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-goethe-purple hover:bg-goethe-light rounded-xl border border-goethe-purple/20 transition-all cursor-pointer bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Draf</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-white p-1.5 rounded-xl shadow-xs gap-1.5">
        {[
          { key: "t1", label: "Teil 1: E-Mail Pribadi" },
          { key: "t2", label: "Teil 2: Forum Opini" },
          { key: "t3", label: "Teil 3: E-Mail Formil" }
        ].map((t) => {
          const isActive = activeTeil === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTeil(t.key as any)}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-goethe-purple text-white shadow-sm"
                  : "text-gray-500 hover:text-goethe-purple hover:bg-goethe-light"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Column (Editor & Prompt), Right Column (Evaluation & Templates) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Main writing card) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Scenario prompt details */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-150 space-y-3">
            <span className="text-[10px] font-black text-goethe-purple uppercase tracking-wider">
              {activeTeil === "t1" ? "Skenario Teil 1 (80 kata)" : activeTeil === "t2" ? "Skenario Teil 2 (80 kata)" : "Skenario Teil 3 (40 kata)"}
            </span>
            <h4 className="font-extrabold text-gray-900 text-sm leading-normal">
              {activeTeil === "t1" ? currentScenario.teil1.title : activeTeil === "t2" ? currentScenario.teil2.title : currentScenario.teil3.title}
            </h4>
            <p className="text-gray-700 text-xs leading-relaxed italic bg-white p-3 rounded-lg border border-gray-100">
              {activeTeil === "t1" ? currentScenario.teil1.situation : activeTeil === "t2" ? currentScenario.teil2.situation : currentScenario.teil3.situation}
            </p>
            
            {/* Points checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Poin Wajib yang Harus Ditulis:</span>
              <div className="grid grid-cols-1 gap-2">
                {(activeTeil === "t1" ? currentScenario.teil1.points : activeTeil === "t2" ? currentScenario.teil2.points : currentScenario.teil3.points).map((pt, index) => {
                  const isChecked = activeTeil === "t1" ? checkedPointsT1[index] : activeTeil === "t2" ? checkedPointsT2[index] : checkedPointsT3[index];
                  const toggleCheck = () => {
                    if (activeTeil === "t1") {
                      const copy = [...checkedPointsT1];
                      copy[index] = !copy[index];
                      setCheckedPointsT1(copy);
                    } else if (activeTeil === "t2") {
                      const copy = [...checkedPointsT2];
                      copy[index] = !copy[index];
                      setCheckedPointsT2(copy);
                    } else {
                      const copy = [...checkedPointsT3];
                      copy[index] = !copy[index];
                      setCheckedPointsT3(copy);
                    }
                  };

                  return (
                    <div 
                      key={index} 
                      onClick={toggleCheck}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                        isChecked ? "bg-success-light border-success/30 text-success" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <CheckSquare className={`w-4 h-4 ${isChecked ? "fill-success text-white" : "text-gray-300"}`} />
                      <span>{pt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Input Editor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase">Lembar Tulisan Anda:</label>
              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${activeWordConfig.bg} ${activeWordConfig.color}`}>
                <span>{activeWordCount} Kata</span>
                <span className="opacity-60">•</span>
                <span>{activeWordConfig.label}</span>
              </div>
            </div>
            
            <textarea
              value={activeText}
              onChange={(e) => handleTextChange(e.target.value, activeTeil)}
              placeholder="Tulis lembar jawaban Anda dalam bahasa Jerman di sini..."
              className="w-full min-h-[220px] bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-mono text-gray-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-goethe-purple focus:bg-white transition-all shadow-xs"
            ></textarea>
          </div>

          {/* Action Trigger button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleAIEvaluation}
              disabled={loadingAI || activeWordCount < 5}
              className="px-6 py-3 rounded-xl bg-goethe-purple hover:bg-goethe-purple-hover disabled:opacity-50 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-goethe-purple/10 flex items-center gap-2 cursor-pointer"
            >
              {loadingAI ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengevaluasi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Koreksi & Nilai Tulisan B1</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (Side helper panels) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Level Switch templates */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-150 pb-2">
              <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-goethe-purple" />
                <span>Bantuan Struktur & Redemittel</span>
              </h4>
              <button 
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-[10px] font-bold text-goethe-purple hover:underline"
              >
                {showTemplates ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            {showTemplates && (
              <div className="space-y-4 text-xs">
                {/* Salutation templates */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Salam Pembuka (Anrede)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeTeil === "t1" ? TEMPLATE_T1.openings : activeTeil === "t2" ? TEMPLATE_T2.openings : TEMPLATE_T3.openings).map((tpl, i) => (
                      <button
                        key={i}
                        onClick={() => insertTemplateText(tpl)}
                        className="bg-gray-50 border border-gray-200 hover:border-goethe-purple hover:bg-goethe-light text-gray-700 px-2 py-1.5 rounded-lg font-medium text-left w-full transition-all cursor-pointer truncate"
                      >
                        {tpl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Closing templates */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Salam Penutup (Grußformel)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeTeil === "t1" ? TEMPLATE_T1.closings : activeTeil === "t2" ? TEMPLATE_T2.closings : TEMPLATE_T3.closings).map((tpl, i) => (
                      <button
                        key={i}
                        onClick={() => insertTemplateText(tpl)}
                        className="bg-gray-50 border border-gray-200 hover:border-goethe-purple hover:bg-goethe-light text-gray-700 px-2 py-1.5 rounded-lg font-medium text-left w-full transition-all cursor-pointer truncate"
                      >
                        {tpl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Result Card */}
          {activeEval && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4 animate-in zoom-in-95 duration-200">
              <h4 className="font-extrabold text-gray-900 text-xs border-b border-gray-150 pb-2">
                Hasil Koreksi & Umpan Balik B1
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Pemenuhan Tugas</span>
                  <p className="text-xl font-black text-goethe-purple">{activeEval.aufgabe}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Bahasa & Grammar</span>
                  <p className="text-xl font-black text-goethe-purple">{activeEval.sprache}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Feedback Terperinci:</span>
                <p className="text-gray-600 text-xs leading-relaxed bg-goethe-light/30 p-3 rounded-xl border border-goethe-purple/5 whitespace-pre-line font-medium">
                  {activeEval.feedback}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Contoh Jawaban Ideal:</span>
                <div className="bg-success-light/30 p-3.5 rounded-xl border border-success/15 text-xs text-gray-800 leading-relaxed font-mono whitespace-pre-line select-all">
                  {activeEval.beispiel}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
