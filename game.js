let score = 0;
let cpc = 1; 
let cps = 0; 
let pendingUpgrade = null;
let correctAnswer = 0;

document.addEventListener("DOMContentLoaded", () => {
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
            alert("Keep clicking! You need more score for this upgrade! ⭐");
        }
    });
});

function createFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;
    // FIXED: Use style properties directly to preserve the base CSS class animations
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
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
        num1 = Math.floor(Math.random() * 15) + 10; 
        num2 = Math.floor(Math.random() * 9) + 1;   
        operator = '-';
        correctAnswer = num1 - num2;
    } else if (cost < 1000) {
        num1 = Math.floor(Math.random() * 6) + 2;   
        num2 = Math.floor(Math.random() * 9) + 2;   
        operator = '×';
        correctAnswer = num1 * num2;
    } else {
        if (Math.random() < 0.5) {
            num2 = Math.floor(Math.random() * 7) + 2; 
            correctAnswer = Math.floor(Math.random() * 10) + 2; 
            num1 = num2 * correctAnswer; 
            operator = '÷';
        } else {
            num1 = Math.floor(Math.random() * 4) + 11; 
            num2 = Math.floor(Math.random() * 8) + 3;  
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
    
    // FIXED: Dynamically pulls the original emoji using string slicing, preserving item variety
    const originalText = btn.innerHTML.trim();
    const emoji = originalText.startsWith('<') ? '⭐' : originalText.substring(0, 2);
    
    if (addCpc > 0) {
        btn.innerHTML = `${emoji} ${name} (Cost: ${newCost}) <br><small>Gives +${addCpc} per click!</small>`;
    } else {
        btn.innerHTML = `${emoji} ${name} (Cost: ${newCost}) <br><small>Earns +${addCps} every second!</small>`;
    }

    updateDisplay();
}

function updateDisplay() {
    // OPTIMISATION: Round figures locally to maintain clean integer layout values
    scoreEl.textContent = Math.floor(score).toLocaleString();
    cpcEl.textContent = cpc.toLocaleString();
    cpsEl.textContent = cps.toLocaleString();
}

setInterval(() => {
    score += cps;
    updateDisplay();
}, 1000);
