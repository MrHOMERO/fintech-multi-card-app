// Estado global
let user = JSON.parse(localStorage.getItem('pro_user')) || null;
let cards = JSON.parse(localStorage.getItem('pro_cards')) || [];
let activeCardId = cards.length > 0 ? cards[0].id : null;
let cvvInterval = null;

// Elementos DOM
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const step4 = document.getElementById('step-4');
const step5 = document.getElementById('step-5');

function navigateTo(step) {
  [step1, step2, step3, step4, step5].forEach(s => s.classList.add('hidden'));

  if (step === 1) step1.classList.remove('hidden');
  if (step === 2) step2.classList.remove('hidden');
  if (step === 3) {
    step3.classList.remove('hidden');
    document.getElementById('user-title').innerText = `Hola, ${user.username}`;
    renderDashboard();
  }
  if (step === 4) {
    step4.classList.remove('hidden');
    startScreenCardMode();
  }
  if (step === 5) step5.classList.remove('hidden');
}

// Paso 1: Registro
document.getElementById('form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  user = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value
  };
  localStorage.setItem('pro_user', JSON.stringify(user));
  toast(`Confirmación enviada a ${user.email}`);
  navigateTo(cards.length > 0 ? 3 : 2);
});

// Paso 2: Vincular Tarjeta
document.getElementById('form-card').addEventListener('submit', (e) => {
  e.preventDefault();
  const num = document.getElementById('card-num').value;
  const newCard = {
    id: Date.now().toString(),
    bank: document.getElementById('bank').value,
    number: num,
    last4: num.slice(-4) || "0000",
    holder: document.getElementById('holder').value.toUpperCase(),
    balance: parseFloat(document.getElementById('balance').value)
  };

  cards.push(newCard);
  activeCardId = newCard.id;
  localStorage.setItem('pro_cards', JSON.stringify(cards));
  document.getElementById('form-card').reset();
  toast("Tarjeta vinculada con enrutado inteligente");
  navigateTo(3);
});

// Paso 3: Renderizar Billetera
function renderDashboard() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  let total = 0;
  cards.forEach(c => {
    total += c.balance;
    const cardEl = document.createElement('div');
    cardEl.className = `card-box ${c.id === activeCardId ? 'active' : ''}`;
    cardEl.innerHTML = `
      <div class="card-top">
        <strong>${c.bank}</strong>
        <span style="font-size:0.75rem; color:#30d158;">Enrutamiento Activo</span>
      </div>
      <div class="card-num">•••• •••• •••• ${c.last4}</div>
      <div class="card-bottom-row">
        <span>${c.holder}</span>
        <span>Saldo: $${c.balance.toFixed(2)}</span>
      </div>
    `;

    cardEl.addEventListener('click', () => {
      activeCardId = c.id;
      renderDashboard();
    });
    container.appendChild(cardEl);
  });

  document.getElementById('total-balance').innerText = `Saldo Total Unificado: $${total.toFixed(2)}`;
}

// Paso 4: Modo Pantalla Tarjeta NFC
function startScreenCardMode() {
  if (!activeCardId) return;
  const card = cards.find(c => c.id === activeCardId);

  document.getElementById('v-bank').innerText = card.bank.toUpperCase();
  document.getElementById('v-number').innerText = `•••• •••• •••• ${card.last4}`;
  document.getElementById('v-holder').innerText = card.holder;

  // Generador de CVV Dinámico de Seguridad cada 5 segundos para demo
  const generateCVV = () => {
    document.getElementById('v-cvv').innerText = Math.floor(100 + Math.random() * 900);
  };
  generateCVV();
  if (cvvInterval) clearInterval(cvvInterval);
  cvvInterval = setInterval(generateCVV, 5000);
}

// Navegación secundaria
document.getElementById('btn-add-another').addEventListener('click', () => navigateTo(2));
document.getElementById('btn-activate-screen-card').addEventListener('click', () => navigateTo(4));
document.getElementById('btn-exit-nfc').addEventListener('click', () => {
  if (cvvInterval) clearInterval(cvvInterval);
  navigateTo(3);
});
document.getElementById('btn-subs').addEventListener('click', () => navigateTo(5));
document.getElementById('btn-back-dashboard').addEventListener('click', () => navigateTo(3));

document.getElementById('btn-human-support').addEventListener('click', () => {
  toast("Conectando con un agente humano prioritario...");
});

function cancelSub(btn, name) {
  btn.innerText = "Bloqueado";
  btn.style.background = "#30d158";
  toast(`Suscripción a ${name} cancelada en el emisor`);
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  if (user) {
    navigateTo(cards.length > 0 ? 3 : 2);
  } else {
    navigateTo(1);
  }
});
