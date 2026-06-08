/**
 * Elevator Rush — NPC Logic
 * Phase 1 stub. Will be implemented in Phase 3.
 */

(function () {
  "use strict";

  const floors = {
    1: { waiting: [] },
    2: { waiting: [] },
    3: { waiting: [] },
    4: { waiting: [] },
  };

  let npcIdCounter = 0;

  function createNPC(spawnFloor, targetFloor) {
    npcIdCounter += 1;
    return {
      id: npcIdCounter,
      spawnFloor,
      targetFloor,
      state: "waiting",
    };
  }

  function spawnBatch() {
    console.log("NPC.spawnBatch stub called");
  }

  window.NPC = {
    floors,
    createNPC,
    spawnBatch,
  };
})();
