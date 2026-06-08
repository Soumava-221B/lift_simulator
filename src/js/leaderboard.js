/**
 * Elevator Rush — Leaderboard (localStorage)
 * Phase 1 stubs. Persisted under key 'elevator_rush_lb'.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "elevator_rush_lb";
  const MAX_ENTRIES = 20;

  function getLeaderboard() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      return arr
        .filter((e) => e && typeof e.name === "string" && typeof e.score === "number")
        .sort((a, b) => b.score - a.score);
    } catch (err) {
      console.warn("Leaderboard parse error:", err);
      return [];
    }
  }

  function saveScore(name, score) {
    const entries = getLeaderboard();
    entries.push({
      name: String(name).trim(),
      score: Number(score),
      date: new Date().toISOString(),
    });
    entries.sort((a, b) => b.score - a.score);
    const trimmed = entries.slice(0, MAX_ENTRIES);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.warn("Leaderboard save error:", err);
    }
  }

  function clearLeaderboard() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Expose globals for cross-module use (no bundler)
  window.getLeaderboard = getLeaderboard;
  window.saveScore = saveScore;
  window.clearLeaderboard = clearLeaderboard;
})();
