const floorInput = document.querySelector(".floor__input");
const liftInput = document.querySelector(".lift__input");
const submitBtn = document.querySelector(".submit__btn");
const outputSection = document.querySelector(".output__section");

const floorMaping = new Map();
const liftMaping = new Map();
const checkAvailability = new Map();

let floorCount = null,
  liftCount = null;
let leftLiftcalls = [];

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  floorCount = parseInt(floorInput.value, 10);
  liftCount = parseInt(liftInput.value, 10);

  if (
    isNaN(floorCount) ||
    isNaN(liftCount) ||
    floorCount <= 0 ||
    liftCount <= 0
  ) {
    return alert("Invalid Input, Please Try Again!!");
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
  floorMaping.set(`floor-${totalFloors}`, null);
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
    floorMaping.set(`floor-${i}`, null);
    outputSection.appendChild(middleFloors);
  }
  const groundFloor = document.createElement("section");
  groundFloor.className = "floor";
  groundFloor.id = `floor-${0}`;
  groundFloor.innerHTML = `
    <section class="floor-details">
        <button type="" class="lift-control up">↑</button>
        <p class="floor-number">Floor-${0}</p>
    </section>
    `;

  groundFloor
    .querySelector(".up")
    .addEventListener("click", (e) => handleLiftCall(e));
  floorMaping.set(`floor-${0}`, null);
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

  if (floorMaping.get(floorId) != null) {
    const mappedliftId = floorMaping.get(floorId);
    if (checkAvailability.get(mappedliftId)) {
      checkAvailability.set(mappedliftId, false);
      doorOpenClose(floorId, mappedliftId);
    }
    return;
  }

  for (let i = 1; i <= liftCount; i++) {
    const liftId = `lift-${i}`;
    if (checkAvailability.get(liftId)) {
      liftMovement(floorId, liftId);
      return;
    }
  }
  leftLiftcalls.push(floorId);
}

function liftMovement(floorId, liftId) {
  if (floorMaping.get(floorId) !== null) {
    const mappedLiftId = floorMaping.get(floorId);
    if (checkAvailability.get(mappedLiftId)) {
      checkAvailability.set(mappedLiftId, false);
      doorOpenClose(floorId, mappedLiftId);
    }
    return;
  }
  checkAvailability.set(liftId, false);
  floorMaping.set(floorId, liftId);

  floorMaping.forEach((value, key) => {
    if (key !== floorId && value === liftId) {
      floorMaping.set(key, null);
    }
  });

  // const floor = document.querySelector(`#${floorId}`);
  const lift = document.getElementById(`${liftId}`);
  const arr = floorId.split("-");
  const floorNumber = parseInt(arr[arr.length - 1]);
  const previousFloor = liftMaping.get(liftId);
  const diff = Math.abs(previousFloor - floorNumber);
  const transitionDuration = diff * 2;
  lift.style.transform = `translateY(-${floorNumber * 100}px)`;
  lift.style.transition = `all ${transitionDuration}s`;

  setTimeout(() => {
    doorOpenClose(floorId, liftId);
  }, transitionDuration * 1000);

  liftMaping.set(liftId, floorNumber);
}

function doorOpenClose(floorId, liftId) {
  const lift = document.querySelector(`#${liftId}`);
  const leftDoor = lift.querySelector(".left-door");
  const rightDoor = lift.querySelector(".right-door");
  leftDoor.classList.add("left-move");
  rightDoor.classList.add("right-move");
  setTimeout(() => {
    leftDoor.classList.remove("left-move");
    rightDoor.classList.remove("right-move");
    //this lift will be free after 2500ms
    setTimeout(() => {
      checkAvailability.set(liftId, true);
      if (leftLiftcalls.length > 0) {
        const floorIdFromRemainingCalls = leftLiftcalls[0];
        leftLiftcalls.shift();
        liftMovement(floorIdFromRemainingCalls, liftId);
      }
    }, 2500);
  }, 2500);
}
