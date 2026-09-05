// Estado local
let currentUser = JSON.parse(localStorage.getItem('app_user')) || null;
let cards = JSON.parse(localStorage.getItem('app_cards')) || [];
let selectedCardId = cards.length > 0 ? cards[0].id : null;

// Vistas
const stepLogin = document.getElementById('step-login');
const stepAddCard = document.getElementById('step-add-card');
const stepDashboard = document.getElementById('step-dashboard');

function showStep(step) {
  stepLogin.classList.add('hidden');
  stepAddCard.classList.add('hidden');
  stepDashboard.classList.add('hidden');

  if (step === 1) stepLogin.classList.remove('hidden');
  if (step === 2) stepAddCard.classList.remove('hidden');
  if (step === 3) {
    stepDashboard.classList.remove('hidden');
    document.getElementById('user-display').innerText = `Hola, ${currentUser.username}`;
    renderCards();
  }
}

// Paso 1: Login
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  currentUser = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value
  };
  localStorage.setItem('app_user', JSON.stringify(currentUser));
  showToast(`Confirmación enviada a ${currentUser.email}`);

  // Si no tiene tarjetas, va directo a agregar una; si ya tiene, va al dashboard
  if (cards.length === 0) {
    showStep(2);
  } else {
    showStep(3);
  }
});

// Paso 2: Agregar Tarjeta
document.getElementById('card-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const fullNumber = document.getElementById('card-number').value;
  const newCard = {
    id: Date.now().toString(),
    bankName: document.getElementById('bank-name').value,
    cardNumber: fullNumber,
    lastFour: fullNumber.slice(-4) || "0000",
    holder: document.getElementById('card-holder').value.toUpperCase(),
    expiry: document.getElementById('expiry').value,
    cvv: document.getElementById('cvv').value,
    balance: parseFloat(document.getElementById('balance').value)
  };

  cards.push(newCard);
  selectedCardId = newCard.id;
  localStorage.setItem('app_cards', JSON.stringify(cards));

  document.getElementById('card-form').reset();
  showToast("Tarjeta vinculada correctamente");
  showStep(3);
});

// Paso 3: Renderizar Lista de Tarjetas
function renderCards() {
  const container = document.getElementById('cards-list');
  container.innerHTML = '';

  if (cards.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#888; margin-top:40px;">No tienes tarjetas asociadas.</p>';
    selectedCardId = null;
    return;
  }

  cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = `card-item ${card.id === selectedCardId ? 'selected' : ''}`;

    cardEl.innerHTML = `
      <div class="card-header-row">
        <span class="bank-title">${card.bankName}</span>
        <button class="delete-btn" data-id="${card.id}" title="Eliminar">✕</button>
      </div>
      <div class="card-number-display">•••• •••• •••• ${card.lastFour}</div>
      <div class="card-footer-row">
        <span>${card.holder}</span>
        <span>Saldo: $${card.balance.toFixed(2)}</span>
      </div>
    `;

    cardEl.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-btn')) {
        selectedCardId = card.id;
        renderCards();
      }
    });

    cardEl.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCard(card.id);
    });

    container.appendChild(cardEl);
  });
}

function deleteCard(id) {
  cards = cards.filter(c => c.id !== id);
  if (selectedCardId === id) {
    selectedCardId = cards.length > 0 ? cards[0].id : null;
  }
  localStorage.setItem('app_cards', JSON.stringify(cards));
  renderCards();
  showToast("Tarjeta eliminada");
}

// Botones auxiliares
document.getElementById('go-add-another-btn').addEventListener('click', () => showStep(2));

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('app_user');
  currentUser = null;
  showStep(1);
});

document.getElementById('nfc-pay-btn').addEventListener('click', () => {
  if (!selectedCardId) {
    showToast("Selecciona una tarjeta para pagar");
    return;
  }
  const card = cards.find(c => c.id === selectedCardId);
  showToast(`Pago NFC activo: ${card.bankName} (**** ${card.lastFour})`);
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Inicio según sesión guardada
document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    showStep(cards.length > 0 ? 3 : 2);
  } else {
    showStep(1);
  }
});
