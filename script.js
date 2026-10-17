// Calculator logic (no eval): evaluates left to right, one operation at a time.

const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");
const buttons = document.querySelectorAll(".key");

const SYMBOLS = { "+": "+", "-": "\u2212", "*": "\u00d7", "/": "\u00f7" };
const MAX_DIGITS = 14;

let current = "0";      // number being typed (or last result)
let previous = null;    // first operand waiting for the next number
let operator = null;    // pending operator: + - * /
let overwrite = false;  // true when the next digit should replace the display
let hasError = false;

// ---------- Helpers ----------

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? null : a / b; // null signals division by zero
    default:  return b;
  }
}

// Trim floating point noise, e.g. 0.1 + 0.2 -> 0.3
function format(number) {
  return String(parseFloat(number.toPrecision(12)));
}

function showError(message) {
  hasError = true;
  current = "Error";
  previous = null;
  operator = null;
  overwrite = true;
  historyEl.textContent = message;
}

function updateDisplay() {
  displayEl.textContent = current;
  displayEl.classList.toggle("is-long", current.length > 10 && !hasError);
  displayEl.classList.toggle("is-error", hasError);
}

function resetAll() {
  current = "0";
  previous = null;
  operator = null;
  overwrite = false;
  hasError = false;
  historyEl.textContent = "";
}

// ---------- Actions ----------

function inputDigit(digit) {
  if (hasError) resetAll();
  if (overwrite) {
    current = digit;
    overwrite = false;
    historyEl.textContent = operator ? format(previous) + " " + SYMBOLS[operator] : "";
  } else if (current.replace(/[-.]/g, "").length < MAX_DIGITS) {
    current = current === "0" ? digit : current + digit;
  }
}

function inputDecimal() {
  if (hasError) resetAll();
  if (overwrite) {
    current = "0.";
    overwrite = false;
    return;
  }
  if (!current.includes(".")) current += ".";
}

function chooseOperator(nextOp) {
  if (hasError) return;

  // Changing your mind about the operator (e.g. pressed + then ×)
  if (operator && overwrite) {
    operator = nextOp;
    historyEl.textContent = format(previous) + " " + SYMBOLS[operator];
    return;
  }

  // Chaining: 5 + 3 then × evaluates 5 + 3 first
  if (operator) {
    const result = calculate(previous, parseFloat(current), operator);
    if (result === null) {
      showError("Cannot divide by zero");
      return;
    }
    previous = result;
    current = format(result);
  } else {
    previous = parseFloat(current);
  }

  operator = nextOp;
  overwrite = true;
  historyEl.textContent = format(previous) + " " + SYMBOLS[operator];
}

function evaluate() {
  if (hasError || !operator) return;

  const b = parseFloat(current);
  const result = calculate(previous, b, operator);

  if (result === null) {
    showError("Cannot divide by zero");
    return;
  }

  historyEl.textContent = format(previous) + " " + SYMBOLS[operator] + " " + format(b) + " =";
  current = format(result);
  previous = null;
  operator = null;
  overwrite = true;
}

function backspace() {
  if (hasError) {
    resetAll();
    return;
  }
  if (overwrite) return; // do not edit a finished result
  current = current.slice(0, -1);
  if (current === "" || current === "-") current = "0";
}

// ---------- Event listeners ----------

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
      case "digit":     inputDigit(value); break;
      case "decimal":   inputDecimal(); break;
      case "operator":  chooseOperator(value); break;
      case "equals":    evaluate(); break;
      case "backspace": backspace(); break;
      case "clear":     resetAll(); break;
    }
    updateDisplay();
  });
});

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") inputDigit(key);
  else if (key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
  else if (key === "Enter" || key === "=") { event.preventDefault(); evaluate(); }
  else if (key === "Backspace") backspace();
  else if (key === "Escape") resetAll();
  else return;

  updateDisplay();
});

updateDisplay();
