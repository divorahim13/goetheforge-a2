// Local Storage Database Utility for GoetheForge A2
// Safe for Next.js SSR (checks typeof window)

export interface UserSettings {
  name: string;
  examDate: string;
  level?: "A2" | "B1";
}

export interface ModuleProgress {
  score: number;
  maxScore: number;
  date: string;
}

export interface ProgressState {
  lesen: ModuleProgress[];
  horen: ModuleProgress[];
  schreiben: ModuleProgress[];
  sprechen: ModuleProgress[];
}

export interface WortschatzProgress {
  [wordId: string]: "none" | "learned" | "review";
}

export interface ExamAttempt {
  date: string;
  lesenScore: number;  // out of 25
  horenScore: number;  // out of 25
  schreibenScore: number; // out of 25
  totalScore: number;   // out of 75 or 100
  sprechenScore?: number; // Sprechen is out of 25
  passed: boolean;
  notes: string;
}

export interface StreakData {
  lastActiveDate: string;
  currentStreak: number;
  activityHistory: string[]; // dates in YYYY-MM-DD format
}

const IS_BROWSER = typeof window !== "undefined";

const KEYS = {
  SETTINGS: "goetheforge_settings",
  PROGRESS: "goetheforge_progress",
  WORTSCHATZ: "goetheforge_wortschatz",
  HISTORY: "goetheforge_history",
  STREAK: "goetheforge_streak",
};

// --- SETTINGS ---
export function getSettings(): UserSettings {
  if (!IS_BROWSER) return { name: "Pelajar A2", examDate: getDefaultExamDate(), level: "A2" };
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (data) {
      const parsed = JSON.parse(data);
      if (!parsed.level) parsed.level = "A2";
      return parsed;
    }
  } catch (e) {
    console.error("Error reading settings from localStorage", e);
  }
  
  // Set default settings if not exists
  const defaults: UserSettings = { name: "Pelajar A2", examDate: getDefaultExamDate(), level: "A2" };
  saveSettings(defaults);
  return defaults;
}

export function saveSettings(settings: UserSettings): void {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving settings", e);
  }
}

function getDefaultExamDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 60); // Default to 60 days from now
  return date.toISOString().split("T")[0];
}

// --- MODULE PROGRESS ---
export function getProgress(level?: "A2" | "B1"): ProgressState {
  const emptyProgress: ProgressState = { lesen: [], horen: [], schreiben: [], sprechen: [] };
  if (!IS_BROWSER) return emptyProgress;
  try {
    const activeLevel = level || getSettings().level || "A2";
    const key = activeLevel === "B1" ? `${KEYS.PROGRESS}_b1` : KEYS.PROGRESS;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading progress", e);
  }
  return emptyProgress;
}

export function saveModuleProgress(moduleName: keyof ProgressState, score: number, maxScore: number, level?: "A2" | "B1"): void {
  if (!IS_BROWSER) return;
  try {
    const activeLevel = level || getSettings().level || "A2";
    const progress = getProgress(activeLevel);
    const newEntry: ModuleProgress = {
      score,
      maxScore,
      date: new Date().toISOString(),
    };
    progress[moduleName].push(newEntry);
    const key = activeLevel === "B1" ? `${KEYS.PROGRESS}_b1` : KEYS.PROGRESS;
    localStorage.setItem(key, JSON.stringify(progress));
    
    // Also trigger streak update when progress is saved
    updateStreak();
  } catch (e) {
    console.error("Error saving progress", e);
  }
}

// --- WORTSCHATZ ---
export function getWortschatzProgress(): WortschatzProgress {
  if (!IS_BROWSER) return {};
  try {
    const data = localStorage.getItem(KEYS.WORTSCHATZ);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading wortschatz", e);
  }
  return {};
}

export function saveWortschatzStatus(wordId: string, status: "none" | "learned" | "review"): void {
  if (!IS_BROWSER) return;
  try {
    const progress = getWortschatzProgress();
    progress[wordId] = status;
    localStorage.setItem(KEYS.WORTSCHATZ, JSON.stringify(progress));
    updateStreak();
  } catch (e) {
    console.error("Error saving wortschatz status", e);
  }
}

// --- EXAM HISTORY ---
export function getExamHistory(level?: "A2" | "B1"): ExamAttempt[] {
  if (!IS_BROWSER) return [];
  try {
    const activeLevel = level || getSettings().level || "A2";
    const key = activeLevel === "B1" ? `${KEYS.HISTORY}_b1` : KEYS.HISTORY;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading history", e);
  }
  return [];
}

export function addExamAttempt(attempt: Omit<ExamAttempt, "date">, level?: "A2" | "B1"): void {
  if (!IS_BROWSER) return;
  try {
    const activeLevel = level || getSettings().level || "A2";
    const history = getExamHistory(activeLevel);
    const fullAttempt: ExamAttempt = {
      ...attempt,
      date: new Date().toISOString(),
    };
    history.push(fullAttempt);
    const key = activeLevel === "B1" ? `${KEYS.HISTORY}_b1` : KEYS.HISTORY;
    localStorage.setItem(key, JSON.stringify(history));
    updateStreak();
  } catch (e) {
    console.error("Error adding exam attempt", e);
  }
}

// --- STREAK MANAGEMENT ---
export function getStreak(): StreakData {
  const defaultStreak: StreakData = {
    lastActiveDate: "",
    currentStreak: 0,
    activityHistory: [],
  };
  if (!IS_BROWSER) return defaultStreak;
  try {
    const data = localStorage.getItem(KEYS.STREAK);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading streak data", e);
  }
  return defaultStreak;
}

export function updateStreak(): void {
  if (!IS_BROWSER) return;
  try {
    const streak = getStreak();
    const today = new Date().toISOString().split("T")[0];
    
    // If already active today, do nothing
    if (streak.activityHistory.includes(today)) {
      return;
    }
    
    // Add today to history
    streak.activityHistory.push(today);
    
    if (streak.lastActiveDate) {
      const lastActive = new Date(streak.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Active yesterday, increment streak
        streak.currentStreak += 1;
      } else if (diffDays > 1) {
        // Broken streak, reset
        streak.currentStreak = 1;
      }
    } else {
      // First activity
      streak.currentStreak = 1;
    }
    
    streak.lastActiveDate = today;
    localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
  } catch (e) {
    console.error("Error updating streak", e);
  }
}
