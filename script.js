// 1. DOM Elements Mapping
const screen = document.getElementById('screen');
const keysContainer = document.getElementById('keys-container');

// State tracking variables
let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

// Update UI view
function updateScreen() {
    screen.innerText = displayValue;
}
updateScreen();

// 2. Centralized DOM Event Listener (Event Delegation)
keysContainer.addEventListener('click', (event) => {
    // Access the clicked element
    const target = event.target;

    // Filter out clicks that aren't actually on buttons
    if (!target.matches('button')) {
        return;
    }

    // Identify button types based on class signatures
    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateScreen();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateScreen();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateScreen();
        return;
    }

    if (target.classList.contains('equal-sign')) {
        handleEqualSign();
        updateScreen();
        return;
    }

    // Default case: it's a numeric digit
    inputDigit(target.value);
    updateScreen();
});

// 3. Calculator Core Logic Functions
function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (waitingForSecondOperand === true) {
        displayValue = "0."
        waitingForSecondOperand = false;
        return;
    }

    if (!displayValue.includes(dot)) {
        displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand)  {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

function handleEqualSign() {
    const inputValue = parseFloat(displayValue);

    if (operator === null || waitingForSecondOperand) return;

    const result = calculate(firstOperand, inputValue, operator);
    displayValue = `${parseFloat(result.toFixed(7))}`;
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

function calculate(first, second, op) {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') return second === 0 ? 0 : first / second; // Simple zero protection
    return second;
}

function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    waitingForSecondOperand = false;
    operator = null;
}
