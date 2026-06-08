/**
 * Elevator Rush — NPC Logic
 * Phase 3 implementation.
 */

(function () {
  "use strict";

  const FLOOR_COUNT = 4;
  const SPAWN_INTERVAL = 3000; // ms
  const BATCH_SIZE = 3;

  const floors = {
    1: { waiting: [] },
    2: { waiting: [] },
    3: { waiting: [] },
    4: { waiting: [] },
  };

  let npcIdCounter = 0;
  let spawnTimerId = null;

  function randomFloor() {
    return Math.floor(Math.random() * FLOOR_COUNT) + 1;
  }

  function createNPC(spawnFloor, targetFloor) {
    npcIdCounter += 1;
    return {
      id: npcIdCounter,
      spawnFloor,
      targetFloor,
      state: "waiting", // waiting | inLift | exited
    };
  }

  /**
   * Spawn a batch of NPCs and render them in their floor queues.
   */
  function spawnBatch() {
    for (let i = 0; i < BATCH_SIZE; i++) {
      const spawnFloor = randomFloor();
      const targetFloor = randomFloor();
      const npc = createNPC(spawnFloor, targetFloor);
      floors[spawnFloor].waiting.push(npc);
      renderNPC(npc, spawnFloor);
    }
  }

  /**
   * Build a stick-figure DOM element with a speech bubble.
   */
  function buildNPCNode(npc) {
    const el = document.createElement("div");
    el.className = "npc spawn";
    el.dataset.npcId = npc.id;
    el.innerHTML = `
      <div class="npc-bubble">${npc.targetFloor}</div>
      <div class="npc-head"></div>
      <div class="npc-body"></div>
    `;
    return el;
  }

  function renderNPC(npc, floorNum) {
    const queue = document.querySelector(`.floor-queue[data-floor="${floorNum}"]`);
    if (!queue) return;
    const node = buildNPCNode(npc);
    queue.appendChild(node);
  }

  /**
   * Move an NPC from a floor queue into the lift interior.
   */
  function boardNPC(npc) {
    npc.state = "inLift";
    const node = document.querySelector(`.npc[data-npc-id="${npc.id}"]`);
    if (node) {
      node.classList.remove("spawn");
      // Hide bubble inside lift to reduce clutter
      const bubble = node.querySelector(".npc-bubble");
      if (bubble) bubble.style.opacity = "0.2";
      document.querySelector(".lift-occupants").appendChild(node);
    }
  }

  /**
   * Remove an NPC from the DOM (exited the lift at correct floor).
   */
  function removeNPC(npc) {
    npc.state = "exited";
    const node = document.querySelector(`.npc[data-npc-id="${npc.id}"]`);
    if (node) {
      node.style.transition = "opacity 0.3s, transform 0.3s";
      node.style.opacity = "0";
      node.style.transform = "translateY(-20px)";
      setTimeout(() => node.remove(), 300);
    }
  }

  /**
   * Start the recurring spawn loop.
   */
  function startSpawning() {
    if (spawnTimerId) clearInterval(spawnTimerId);
    spawnTimerId = setInterval(spawnBatch, SPAWN_INTERVAL);
    // Spawn first batch immediately
    spawnBatch();
  }

  /**
   * Stop spawning new NPCs.
   */
  function stopSpawning() {
    if (spawnTimerId) {
      clearInterval(spawnTimerId);
      spawnTimerId = null;
    }
  }

  /**
   * Clear all NPCs and floor queues. Called when restarting a game.
   */
  function reset() {
    stopSpawning();
    npcIdCounter = 0;
    for (let f = 1; f <= FLOOR_COUNT; f++) {
      floors[f].waiting.length = 0;
    }
    document.querySelectorAll(".npc").forEach((el) => el.remove());
    document.querySelector(".lift-occupants").innerHTML = "";
  }

  // Expose API
  window.NPC = {
    floors,
    createNPC,
    spawnBatch,
    startSpawning,
    stopSpawning,
    reset,
    boardNPC,
    removeNPC,
  };

  // --- Phase 3 Tests ---
  function testSpawnNPCs() {
    reset();
    const before = totalWaiting();
    spawnBatch();
    const after = totalWaiting();
    console.assert(after === before + 3, `Expected 3 new NPCs, got ${after - before}`);

    const all = [];
    for (let f = 1; f <= FLOOR_COUNT; f++) {
      all.push(...floors[f].waiting);
    }
    all.forEach((npc) => {
      console.assert(npc.targetFloor >= 1 && npc.targetFloor <= 4, "targetFloor out of range");
      console.assert(npc.spawnFloor >= 1 && npc.spawnFloor <= 4, "spawnFloor out of range");
      // Same-floor targeting is now allowed per new rule
    });
    console.log("NPC spawn tests passed");
  }

  function totalWaiting() {
    let sum = 0;
    for (let f = 1; f <= FLOOR_COUNT; f++) sum += floors[f].waiting.length;
    return sum;
  }

  window.NPCTests = { testSpawnNPCs, totalWaiting };
})();
