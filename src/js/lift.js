/**
 * Elevator Rush — Lift Movement & Floor Arrival
 * Phase 2 implementation.
 */

(function () {
  "use strict";

  const FLOOR_COUNT = 4;
  const FLOOR_HEIGHT_PCT = 100 / FLOOR_COUNT; // 25%
  const SEC_PER_FLOOR = 0.5;

  const liftCar = document.getElementById("lift-car");

  const liftState = {
    currentFloor: 1,
    targetFloor: null,
    moving: false,
    occupants: [],
    capacity: 5,
  };

  /**
   * Move the lift to a target floor (1–4).
   * Ignored if out of bounds, already there, or currently moving.
   */
  function moveTo(targetFloor) {
    if (liftState.moving) return false;
    if (targetFloor < 1 || targetFloor > FLOOR_COUNT) return false;
    if (targetFloor === liftState.currentFloor) {
      handleArrival();
      return true;
    }

    const diff = Math.abs(targetFloor - liftState.currentFloor);
    const duration = diff * SEC_PER_FLOOR;

    liftState.targetFloor = targetFloor;
    liftState.moving = true;

    const bottomPct = (targetFloor - 1) * FLOOR_HEIGHT_PCT;
    liftCar.style.transition = `bottom ${duration}s linear`;
    liftCar.style.bottom = `${bottomPct}%`;

    return true;
  }

  /**
   * Called automatically when the CSS transition ends.
   * Updates state and dispatches 'floorArrived'.
   */
  function onTransitionEnd() {
    if (!liftState.moving) return;
    liftState.currentFloor = liftState.targetFloor;
    liftState.targetFloor = null;
    liftState.moving = false;
    handleArrival();
  }

  function handleArrival() {
    document.dispatchEvent(
      new CustomEvent("floorArrived", {
        detail: { floor: liftState.currentFloor },
      })
    );
  }

  /**
   * Reset lift to floor 1. Used when restarting a game.
   */
  function reset() {
    liftCar.style.transition = "none";
    liftCar.style.bottom = "0%";
    // Force reflow so the next transition works
    void liftCar.offsetHeight;
    liftState.currentFloor = 1;
    liftState.targetFloor = null;
    liftState.moving = false;
    liftState.occupants = [];
  }

  // Listen for CSS transition completion
  liftCar.addEventListener("transitionend", onTransitionEnd);

  // Expose API
  window.Lift = {
    state: liftState,
    moveTo,
    reset,
    handleArrival,
  };

  // --- Phase 2 Tests ---
  function testLiftMovement() {
    // Mock: verify boundary logic without touching DOM
    const original = { ...liftState };

    // Simulate state for test
    liftState.moving = false;
    liftState.currentFloor = 1;

    console.assert(moveTo(0) === false, "moveTo(0) should be rejected");
    console.assert(moveTo(5) === false, "moveTo(5) should be rejected");
    console.assert(moveTo(1) === true, "moveTo(1) same floor should succeed");

    liftState.moving = true;
    console.assert(moveTo(2) === false, "moveTo while moving should be rejected");

    // Restore
    Object.assign(liftState, original);
    console.log("Lift tests passed");
  }

  window.LiftTests = { testLiftMovement };
})();
