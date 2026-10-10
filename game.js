let score = 0;
let cpc = 1; 
let cps = 0; 
let pendingUpgrade = null;
let correctAnswer = 0;

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    }

    themeToggle.addEventListener("click", () => {
        let theme = "light";
        if (document.documentElement.getAttribute("data-theme") !== "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            themeToggle.textContent = "☀️ Light Mode";
            theme = "dark";
        } else {
            document.documentElement.removeAttribute("data-theme");
            themeToggle.textContent = "🌙 Dark Mode";
        }
        localStorage.setItem("theme", theme);
    });
});

const scoreEl = document.getElementById('score');
const cpcEl = document.getElementById('cpc');
const cpsEl = document.getElementById('cps');
const clickBtn = document.getElementById('click-btn');
const clickWrapper = document.getElementById('click-wrapper');
const upgradeBtns = document.querySelectorAll('.upgrade-btn');
const mathModal = document.getElementById('math-modal');
const modalTitle = document.getElementById('modal-title');
const mathQuestionEl = document.getElementById('math-question');
const mathAnswerInput = document.getElementById('math-answer');
const submitAnswerBtn = document.getElementById('submit-answer');
const errorMsg = document.getElementById('error-msg');

clickBtn.addEventListener('click', (event) => {
    score += cpc;
    updateDisplay();
    
    const rect = clickWrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    createFloatingText(x, y, `+${cpc}`);
});

upgradeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const cost = parseInt(btn.getAttribute('data-cost'));
        if (score >= cost) {
            pendingUpgrade = btn;
            triggerMathQuestion(cost);
        } else {
            alert("Keep clicking! You need more stars for this upgrade! ⭐");
        }
    });
});

function createFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    el.setAttribute('style', `left: ${x}px; top: ${y}px;`);
    
    clickWrapper.appendChild(el);
    
    setTimeout(() => {
        el.remove();
    }, 800);
}

function triggerMathQuestion(cost) {
    let num1, num2, operator;
    
    if (cost < 50) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = '+';
        correctAnswer = num1 + num2;
    } else if (cost < 200) {
        num1 = Math.floor(Math.random() * 15) + 10; // 10 to 24
        num2 = Math.floor(Math.random() * 9) + 1;   // 1 to 9
        operator = '-';
        correctAnswer = num1 - num2;
    } else if (cost < 1000) {
        num1 = Math.floor(Math.random() * 6) + 2;   // 2 to 7
        num2 = Math.floor(Math.random() * 9) + 2;   // 2 to 10
        operator = '×';
        correctAnswer = num1 * num2;
    } else {
        if (Math.random() < 0.5) {
            num2 = Math.floor(Math.random() * 7) + 2; // Divisor (2 to 8)
            correctAnswer = Math.floor(Math.random() * 10) + 2; // Result (2 to 11)
            num1 = num2 * correctAnswer; // Total dividend
            operator = '÷';
        } else {
            num1 = Math.floor(Math.random() * 4) + 11; // 11 to 14
            num2 = Math.floor(Math.random() * 8) + 3;  // 3 to 10
            operator = '×';
            correctAnswer = num1 * num2;
        }
    }

    const upgradeName = pendingUpgrade.getAttribute('data-name');
    modalTitle.textContent = `Unlocking: ${upgradeName}`;
    mathQuestionEl.textContent = `${num1} ${operator} ${num2} = ?`;
    mathAnswerInput.value = '';
    errorMsg.classList.add('hidden');
    mathModal.classList.remove('hidden');
    
    setTimeout(() => mathAnswerInput.focus(), 50);
}

submitAnswerBtn.addEventListener('click', checkAnswer);
mathAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    const userAnswer = parseInt(mathAnswerInput.value);
    if (userAnswer === correctAnswer) {
        mathModal.classList.add('hidden');
        applyUpgrade(pendingUpgrade);
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function applyUpgrade(btn) {
    const cost = parseInt(btn.getAttribute('data-cost'));
    const addCpc = parseInt(btn.getAttribute('data-cpc'));
    const addCps = parseInt(btn.getAttribute('data-cps'));
    const name = btn.getAttribute('data-name');

    score -= cost;
    cpc += addCpc;
    cps += addCps;

    const newCost = Math.floor(cost * 1.6);
    btn.setAttribute('data-cost', newCost);
    
    if (addCpc > 0) {
        btn.innerHTML = `✏️ ${name} (Cost: ${newCost}) <br><small>Gives +${addCpc} per click!</small>`;
    } else {
        btn.innerHTML = `🤖 ${name} (Cost: ${newCost}) <br><small>Earns +${addCps} every second!</small>`;
    }

    updateDisplay();
}

function updateDisplay() {
    scoreEl.textContent = score;
    cpcEl.textContent = cpc;
    cpsEl.textContent = cps;
}

setInterval(() => {
    score += cps;
    updateDisplay();
}, 1000);
