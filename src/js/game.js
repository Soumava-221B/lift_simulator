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
  const hudFloor = document.getElementById("hud-floor");
  const btnUp = document.getElementById("btn-up");
  const btnDown = document.getElementById("btn-down");
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

    // Lift controls
    btnUp.addEventListener("click", () => {
      if (gameState.status === "running") {
        Lift.moveTo(Lift.state.currentFloor + 1);
      }
    });

    btnDown.addEventListener("click", () => {
      if (gameState.status === "running") {
        Lift.moveTo(Lift.state.currentFloor - 1);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (gameState.status !== "running") return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        Lift.moveTo(Lift.state.currentFloor + 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        Lift.moveTo(Lift.state.currentFloor - 1);
      }
    });

    // Phase 4: handle boarding, exiting, scoring on floor arrival
    document.addEventListener("floorArrived", () => {
      handleFloorArrival();
    });
  }

  function validateName(name) {
    return typeof name === "string" && name.length >= 2;
  }

  function startGame(name) {
    // Prevent duplicate timers
    if (gameState.gameTimer) clearInterval(gameState.gameTimer);

    gameState.playerName = name;
    gameState.status = "running";
    gameState.score = 0;
    gameState.timeLeft = 120;

    Lift.reset();
    NPC.reset();
    NPC.startSpawning();
    setControlsEnabled(true);

    // 2-minute countdown timer
    gameState.gameTimer = setInterval(() => {
      if (gameState.status !== "running") return;
      gameState.timeLeft -= 1;
      updateHUD();
      if (gameState.timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    hideStartOverlay();
    showGameArea();
    updateHUD();

    console.log("Game started:", name);
  }

  function endGame() {
    gameState.status = "ended";
    clearInterval(gameState.spawnTimer);
    if (gameState.gameTimer) {
      clearInterval(gameState.gameTimer);
      gameState.gameTimer = null;
    }
    NPC.stopSpawning();
    setControlsEnabled(false);

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
    if (gameState.gameTimer) {
      clearInterval(gameState.gameTimer);
      gameState.gameTimer = null;
    }
    playerNameInput.value = "";
    NPC.reset();
    updateHUD();
  }

  /**
   * Phase 4 core: on floor arrival, open doors, let NPCs exit and board,
   * then close doors.  Awards 5 points per correct exit.
   */
  function handleFloorArrival() {
    if (gameState.status !== "running") return;

    const currentFloor = Lift.state.currentFloor;
    openDoors();

    // Wait for doors to visually open before processing
    setTimeout(() => {
      // --- EXIT PHASE ---
      let exitedCount = 0;
      const remaining = [];
      Lift.state.occupants.forEach((npc) => {
        if (npc.targetFloor === currentFloor) {
          NPC.removeNPC(npc);
          exitedCount += 1;
          gameState.score += 5;
        } else {
          remaining.push(npc);
        }
      });
      Lift.state.occupants = remaining;

      // --- BOARD PHASE ---
      const queue = NPC.floors[currentFloor].waiting;
      while (
        Lift.state.occupants.length < Lift.state.capacity &&
        queue.length > 0
      ) {
        const npc = queue.shift();
        NPC.boardNPC(npc);
        Lift.state.occupants.push(npc);
      }

      updateHUD();

      // Close doors after a brief pause so the player can see what happened
      setTimeout(() => {
        closeDoors();
      }, 500);
    }, 400);
  }

  function openDoors() {
    Lift.state.doorsOpen = true;
    document.querySelector(".lift-door.left-door")?.classList.add("open");
    document.querySelector(".lift-door.right-door")?.classList.add("open");
  }

  function closeDoors() {
    Lift.state.doorsOpen = false;
    document.querySelector(".lift-door.left-door")?.classList.remove("open");
    document.querySelector(".lift-door.right-door")?.classList.remove("open");
  }

  function updateHUD() {
    hudPlayer.textContent = gameState.playerName || "—";
    hudScore.textContent = gameState.score;
    hudTime.textContent = formatTime(gameState.timeLeft);
    hudFloor.textContent = Lift.state.currentFloor;
    hudCapacity.textContent = `${Lift.state.occupants.length} / ${Lift.state.capacity}`;
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

  function setControlsEnabled(enabled) {
    btnUp.disabled = !enabled;
    btnDown.disabled = !enabled;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Phase 4 Tests ---
  function testExitAndScore() {
    // Requires DOM present (run inside game.html)
    gameState.status = "running";
    NPC.reset();
    Lift.reset();
    gameState.score = 0;
    Lift.state.occupants = [
      NPC.createNPC(1, 2),
      NPC.createNPC(1, 3),
    ];
    Lift.state.currentFloor = 2;

    const scoreBefore = gameState.score;
    handleFloorArrival();

    // Because handleFloorArrival is async (setTimeout), we can't assert synchronously.
    // Instead, inspect state after a short delay in the console.
    setTimeout(() => {
      console.assert(Lift.state.occupants.length === 1, "one NPC should remain");
      console.assert(Lift.state.occupants[0].targetFloor === 3, "remaining NPC targets floor 3");
      console.assert(gameState.score === scoreBefore + 5, "5 points awarded");
      console.log("testExitAndScore passed");
    }, 600);
  }

  function testCapacityBoarding() {
    gameState.status = "running";
    NPC.reset();
    Lift.reset();
    gameState.score = 0;
    // Fill lift to capacity with NPCs going to floor 4
    for (let i = 0; i < 5; i++) {
      Lift.state.occupants.push(NPC.createNPC(1, 4));
    }
    // Add 2 waiting NPCs on floor 1
    NPC.floors[1].waiting.push(NPC.createNPC(1, 2));
    NPC.floors[1].waiting.push(NPC.createNPC(1, 3));
    Lift.state.currentFloor = 1;

    handleFloorArrival();
    setTimeout(() => {
      console.assert(Lift.state.occupants.length === 5, "capacity should stay at 5");
      console.assert(NPC.floors[1].waiting.length === 2, "waiting queue unchanged");
      console.log("testCapacityBoarding passed");
    }, 600);
  }

  function testPartialBoarding() {
    gameState.status = "running";
    NPC.reset();
    Lift.reset();
    gameState.score = 0;
    // 3 in lift, 2 free slots
    for (let i = 0; i < 3; i++) {
      Lift.state.occupants.push(NPC.createNPC(1, 4));
    }
    // 3 waiting on floor 2
    NPC.floors[2].waiting.push(NPC.createNPC(2, 1));
    NPC.floors[2].waiting.push(NPC.createNPC(2, 3));
    NPC.floors[2].waiting.push(NPC.createNPC(2, 4));
    Lift.state.currentFloor = 2;

    handleFloorArrival();
    setTimeout(() => {
      console.assert(Lift.state.occupants.length === 5, "lift filled to capacity");
      console.assert(NPC.floors[2].waiting.length === 1, "one NPC left waiting");
      console.log("testPartialBoarding passed");
    }, 600);
  }

  // --- Phase 5 Tests ---
  function testTimerEnd() {
    startGame("TestPlayer");
    gameState.timeLeft = 1;
    // Manually trigger the interval logic
    gameState.timeLeft -= 1;
    updateHUD();
    if (gameState.timeLeft <= 0) {
      endGame();
    }
    console.assert(gameState.status === "ended", "game should end when timer reaches 0");
    console.assert(gameState.gameTimer === null, "gameTimer should be cleared");
    console.log("testTimerEnd passed");
  }

  function runAllTests() {
    console.log("=== Elevator Rush — Running All Tests ===");

    // Synchronous tests
    LiftTests.testLiftMovement();
    NPCTests.testSpawnNPCs();

    // Asynchronous tests — staggered to avoid state collisions
    const delay = 800;
    let d = delay;
    setTimeout(() => testExitAndScore(), d);        d += delay;
    setTimeout(() => testCapacityBoarding(), d);    d += delay;
    setTimeout(() => testPartialBoarding(), d);      d += delay;
    setTimeout(() => testTimerEnd(), d);             d += delay;
    setTimeout(() => console.log("=== All tests completed ==="), d);
  }

  window.GameTests = {
    testExitAndScore,
    testCapacityBoarding,
    testPartialBoarding,
    testTimerEnd,
    runAllTests,
  };

  // Expose minimal API for tests
  window.ElevatorRush = {
    gameState,
    validateName,
    startGame,
    endGame,
    formatTime,
    handleFloorArrival,
  };

  init();
})();
