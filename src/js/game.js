/**
 * Elevator Rush — Main Game Controller
 * Phase 1 stubs. Will be fleshed out in subsequent phases.
 */

(function () {
  "use strict";

  // DOM refs
  const startOverlay = document.getElementById("start-overlay");
  const gameArea = document.getElementById("game-area");
  const endOverlay = document.getElementById("end-overlay");
  const startForm = document.getElementById("start-form");
  const playerNameInput = document.getElementById("player-name");
  const nameError = document.getElementById("name-error");
  const leaderboardList = document.getElementById("leaderboard-list");
  const endLeaderboardList = document.getElementById("end-leaderboard-list");
  const hudPlayer = document.getElementById("hud-player");
  const hudScore = document.getElementById("hud-score");
  const hudTime = document.getElementById("hud-time");
  const hudCapacity = document.getElementById("hud-capacity");
  const finalScoreEl = document.getElementById("final-score");
  const playAgainBtn = document.getElementById("play-again-btn");

  // Game state
  const gameState = {
    status: "idle", // idle | running | ended
    playerName: "",
    score: 0,
    timeLeft: 120,
    spawnTimer: null,
    gameTimer: null,
  };

  // Phase 1 stubs
  function init() {
    console.assert(typeof startGame === "function", "startGame must be defined");
    console.assert(typeof endGame === "function", "endGame must be defined");
    renderLeaderboardPreview();
    bindEvents();
  }

  function bindEvents() {
    startForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = playerNameInput.value.trim();
      if (validateName(name)) {
        nameError.hidden = true;
        startGame(name);
      } else {
        nameError.hidden = false;
      }
    });

    playAgainBtn.addEventListener("click", () => {
      resetUI();
      showStartOverlay();
    });
  }

  function validateName(name) {
    return typeof name === "string" && name.length >= 2;
  }

  function startGame(name) {
    gameState.playerName = name;
    gameState.status = "running";
    gameState.score = 0;
    gameState.timeLeft = 120;

    hideStartOverlay();
    showGameArea();
    updateHUD();

    // Phase 2+ will wire lift, NPCs, timers here
    console.log("Game started:", name);
  }

  function endGame() {
    gameState.status = "ended";
    clearInterval(gameState.spawnTimer);
    clearInterval(gameState.gameTimer);

    saveScore(gameState.playerName, gameState.score);
    finalScoreEl.textContent = gameState.score;
    renderEndLeaderboard();
    hideGameArea();
    showEndOverlay();
  }

  function resetUI() {
    gameState.status = "idle";
    gameState.score = 0;
    gameState.timeLeft = 120;
    playerNameInput.value = "";
    updateHUD();
  }

  function updateHUD() {
    hudPlayer.textContent = gameState.playerName || "—";
    hudScore.textContent = gameState.score;
    hudTime.textContent = formatTime(gameState.timeLeft);
    // capacity wired in Phase 4
    hudCapacity.textContent = "0 / 5";
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function renderLeaderboardPreview() {
    const entries = getLeaderboard().slice(0, 5);
    leaderboardList.innerHTML = entries.length
      ? entries
          .map((e, i) => `<li><span>${i + 1}. ${escapeHtml(e.name)}</span><span>${e.score}</span></li>`)
          .join("")
      : `<li style="justify-content:center;color:var(--muted)">No scores yet</li>`;
  }

  function renderEndLeaderboard() {
    const entries = getLeaderboard().slice(0, 10);
    endLeaderboardList.innerHTML = entries.length
      ? entries
          .map((e, i) => `<li><span>${i + 1}. ${escapeHtml(e.name)}</span><span>${e.score}</span></li>`)
          .join("")
      : `<li style="justify-content:center;color:var(--muted)">No scores yet</li>`;
  }

  function showStartOverlay() {
    startOverlay.hidden = false;
    endOverlay.hidden = true;
  }

  function hideStartOverlay() {
    startOverlay.hidden = true;
  }

  function showGameArea() {
    gameArea.hidden = false;
  }

  function hideGameArea() {
    gameArea.hidden = true;
  }

  function showEndOverlay() {
    endOverlay.hidden = false;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Expose minimal API for tests
  window.ElevatorRush = {
    gameState,
    validateName,
    startGame,
    endGame,
    formatTime,
  };

  init();
})();
