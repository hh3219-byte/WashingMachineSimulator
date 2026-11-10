const stageSeconds = {
  Washing: 8,
  Rinsing: 15,
  Spinning: 5
};

const stageDisplay = document.getElementById("stage");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const cancelButton = document.getElementById("cancel");
const resetButton = document.getElementById("reset");

let stage = "Idle";
let stageTimeLeft = 0;
let isPaused = false;
let timerId;

function updateDisplay() {
  const cycleActive = stage !== "Idle" && stage !== "Finished";

  stageDisplay.textContent = isPaused ? `${stage} (Paused)` : stage;
  timeDisplay.textContent = stageTimeLeft;

  startButton.disabled = stage !== "Idle";
  pauseButton.disabled = !cycleActive || isPaused;
  resumeButton.disabled = !isPaused;
  cancelButton.disabled = !cycleActive;
  resetButton.disabled = stage !== "Finished";
}

function enterStage(nextStage) {
  stage = nextStage;
  stageTimeLeft = stageSeconds[nextStage];
}

function stopTimer() {
  clearInterval(timerId);
  timerId = undefined;
}

function returnToIdle() {
  stopTimer();
  stage = "Idle";
  stageTimeLeft = 0;
  isPaused = false;
  updateDisplay();
}

function tick() {
  stageTimeLeft--;

  if (stageTimeLeft === 0) {
    if (stage === "Washing") {
      enterStage("Rinsing");
    } else if (stage === "Rinsing") {
      enterStage("Spinning");
    } else if (stage === "Spinning") {
      stage = "Finished";
      stopTimer();
    }
  }

  updateDisplay();
}

startButton.addEventListener("click", () => {
  if (stage !== "Idle") return;

  enterStage("Washing");
  updateDisplay();
  timerId = setInterval(tick, 1000);
});

pauseButton.addEventListener("click", () => {
  stopTimer();
  isPaused = true;
  updateDisplay();
});

resumeButton.addEventListener("click", () => {
  isPaused = false;
  updateDisplay();
  timerId = setInterval(tick, 1000);
});

cancelButton.addEventListener("click", returnToIdle);
resetButton.addEventListener("click", returnToIdle);
