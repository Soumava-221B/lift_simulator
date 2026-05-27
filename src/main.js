const floorInput = document.querySelector(".floor__input");
const liftInput = document.querySelector(".lift__input");
const submitBtn = document.querySelector(".submit__btn");
const outputSection = document.querySelector(".output__section");

const floorCalls = new Map();
const liftMaping = new Map();
const checkAvailability = new Map();

let floorCount = null,
  liftCount = null;
let pendingCalls = [];

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  floorCount = parseInt(floorInput.value, 10);
  liftCount = parseInt(liftInput.value, 10);

  if (
    isNaN(floorCount) ||
    isNaN(liftCount) ||
    floorCount <= 0 ||
    liftCount <= 0 ||
    !Number.isInteger(Number(floorInput.value)) ||
    !Number.isInteger(Number(liftInput.value))
  ) {
    return alert("Oops! Please enter a whole number greater than 0 for both floor and lift 😊");
  }

  const inputSection = document.querySelector(".input__section");
  inputSection.style.display = "none";

  handleFloor(floorCount);
  handleLift(liftCount);
});

//Making of floor
function handleFloor(totalFloors) {
  totalFloors = Number(totalFloors);
  const topFloor = document.createElement("section");
  topFloor.className = "floor";
  topFloor.id = `floor-${totalFloors}`;
  const floorDetails = document.createElement("section");
  floorDetails.className = "floor-details";

  const downBtn = document.createElement("button");
  downBtn.className = "lift-control down";
  downBtn.textContent = "↓";

  const floorLabel = document.createElement("p");
  floorLabel.className = "floor-number";
  floorLabel.textContent = `Floor-${totalFloors}`;

  floorDetails.append(downBtn, floorLabel);
  topFloor.appendChild(floorDetails);
  topFloor
    .querySelector(".down")
    .addEventListener("click", (e) => handleLiftCall(e));
  floorCalls.set(`floor-${totalFloors}`, { down: null });
  outputSection.appendChild(topFloor);

  for (let i = totalFloors - 1; i > 0; i--) {
    const middleFloors = document.createElement("section");
    middleFloors.className = "floor";
    middleFloors.id = `floor-${i}`;
    middleFloors.innerHTML = `
      <section class="floor-details">
          <button type="" class="lift-control up">↑</button>
          <p class="floor-number">Floor-${i}</p>
          <button class="lift-control down">↓</button>
      </section>
      `;

    middleFloors
      .querySelector(".up")
      .addEventListener("click", (e) => handleLiftCall(e));
    middleFloors
      .querySelector(".down")
      .addEventListener("click", (e) => handleLiftCall(e));
    floorCalls.set(`floor-${i}`, { up: null, down: null });
    outputSection.appendChild(middleFloors);
  }
  const groundFloor = document.createElement("section");
  groundFloor.className = "floor";
  groundFloor.id = `floor-${0}`;
  groundFloor.innerHTML = `
    <section class="floor-details">
        <button type="" class="lift-control up">↑</button>
        <p class="floor-number">Ground Floor</p>
    </section>
    `;

  groundFloor
    .querySelector(".up")
    .addEventListener("click", (e) => handleLiftCall(e));
  floorCalls.set(`floor-${0}`, { up: null });
  outputSection.appendChild(groundFloor);

  outputSection.style.visibility = "visible";
}

//Making of lifts
function handleLift(totalLifts) {
  const groundFloor = document.querySelector(".output__section>#floor-0");
  for (let i = 1; i <= totalLifts; i++) {
    const currentLift = document.createElement("section");
    currentLift.className = "lift";
    currentLift.id = `lift-${i}`;
    currentLift.innerHTML = `
      <section class="door left-door"></section>
      <section class="door right-door"></section>
    `;
    liftMaping.set(`lift-${i}`, 0);
    checkAvailability.set(`lift-${i}`, true);
    groundFloor.appendChild(currentLift);
  }
}

//handle lift call
function handleLiftCall(event) {
  const floorElement = event.target.closest(".floor");
  if (!floorElement) return;
  const floorId = floorElement.id;
  const direction = event.target.classList.contains("up") ? "up" : "down";
  dispatchLift(floorId, direction);
}

function setButtonDisabled(floorId, direction, disabled) {
  const floorEl = document.getElementById(floorId);
  if (!floorEl) return;
  const btn = floorEl.querySelector(`.lift-control.${direction}`);
  if (btn) btn.disabled = disabled;
}

function dispatchLift(floorId, direction) {
  const callState = floorCalls.get(floorId);
  const floorNum = parseInt(floorId.split("-")[1], 10);
  const isTerminal = floorNum === 0 || floorNum === floorCount;

  if (isTerminal) {
    const assignedLift = Object.values(callState).find((id) => id !== null);
    if (assignedLift) {
      setButtonDisabled(floorId, direction, true);
      if (checkAvailability.get(assignedLift)) {
        checkAvailability.set(assignedLift, false);
        doorOpenClose(floorId, assignedLift, direction);
      }
      return;
    }
  } else {
    if (callState[direction] !== null) {
      const assignedLift = callState[direction];
      setButtonDisabled(floorId, direction, true);
      if (checkAvailability.get(assignedLift)) {
        checkAvailability.set(assignedLift, false);
        doorOpenClose(floorId, assignedLift, direction);
      }
      return;
    }
  }

  const liftId = findNearestAvailableLift(floorId);
  if (liftId) {
    assignAndMove(floorId, liftId, direction);
  } else {
    pendingCalls.push({ floorId, direction });
  }
}

function findNearestAvailableLift(targetFloorId) {
  const arr = targetFloorId.split("-");
  const targetFloor = parseInt(arr[arr.length - 1], 10);
  let nearestLiftId = null;
  let minDistance = Infinity;

  for (let i = 1; i <= liftCount; i++) {
    const liftId = `lift-${i}`;
    if (checkAvailability.get(liftId)) {
      const liftFloor = liftMaping.get(liftId);
      const distance = Math.abs(liftFloor - targetFloor);
      if (distance < minDistance) {
        minDistance = distance;
        nearestLiftId = liftId;
      }
    }
  }
  return nearestLiftId;
}

function assignAndMove(floorId, liftId, direction) {
  checkAvailability.set(liftId, false);
  setButtonDisabled(floorId, direction, true);
  const callState = floorCalls.get(floorId);
  callState[direction] = liftId;

  floorCalls.forEach((state, key) => {
    if (key !== floorId) {
      if (state.up === liftId) state.up = null;
      if (state.down === liftId) state.down = null;
    }
  });

  const lift = document.getElementById(`${liftId}`);
  const arr = floorId.split("-");
  const floorNumber = parseInt(arr[arr.length - 1], 10);
  const previousFloor = liftMaping.get(liftId);
  const diff = Math.abs(previousFloor - floorNumber);
  const transitionDuration = diff * 0.25;
  lift.style.transform = `translateY(-${floorNumber * 100}px)`;
  lift.style.transition = `transform ${transitionDuration}s`;

  setTimeout(() => {
    doorOpenClose(floorId, liftId, direction);
  }, transitionDuration * 1000);

  liftMaping.set(liftId, floorNumber);
}

function doorOpenClose(floorId, liftId, direction) {
  const lift = document.querySelector(`#${liftId}`);
  const leftDoor = lift.querySelector(".left-door");
  const rightDoor = lift.querySelector(".right-door");
  leftDoor.classList.add("left-move");
  rightDoor.classList.add("right-move");
  setTimeout(() => {
    leftDoor.classList.remove("left-move");
    rightDoor.classList.remove("right-move");

    const callState = floorCalls.get(floorId);
    if (callState && callState[direction] === liftId) {
      callState[direction] = null;
    }

    setTimeout(() => {
      checkAvailability.set(liftId, true);
      setButtonDisabled(floorId, direction, false);
      if (pendingCalls.length > 0) {
        const nextCall = pendingCalls[0];
        pendingCalls.shift();
        dispatchLift(nextCall.floorId, nextCall.direction);
      }
    }, 2500);
  }, 2500);
}
