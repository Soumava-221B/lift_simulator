/**
 * Elevator Rush — Lift Movement & Floor Arrival
 * Phase 1 stub. Will be implemented in Phase 2.
 */

(function () {
  "use strict";

  const liftState = {
    currentFloor: 1,
    targetFloor: null,
    moving: false,
    occupants: [],
    capacity: 5,
  };

  window.Lift = {
    state: liftState,
    moveTo(floor) {
      console.log("Lift.moveTo stub called with floor:", floor);
    },
    handleArrival() {
      console.log("Lift.handleArrival stub called");
    },
  };
})();
