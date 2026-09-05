// Datos iniciales de demostración
const defaultCards = [
  {
    id: "1",
    bankName: "eBROU",
    cardHolder: "CARLOS MARTINEZ",
    lastFourDigits: "4321",
    balance: 15400.50,
    currency: "UYU",
    cardType: "Débito",
    colorHex: "#00529B"
  },
  {
    id: "2",
    bankName: "Prex",
    cardHolder: "CARLOS MARTINEZ",
    lastFourDigits: "8812",
    balance: 320.00,
    currency: "USD",
    cardType: "Prepaga",
    colorHex: "#6B21A8"
  }
];

// Estado local
let cards = JSON.parse(localStorage.getItem('user_cards')) || defaultCards;
let selectedCardId = cards.length > 0 ? cards[0].id : null;
let currentUser = localStorage.getItem('logged_user') || null;

// Elementos DOM
const loginView = document.getElementById('login-view');
const recoveryView = document.getElementById('recovery-view');
const dashboardView = document.getElementById('dashboard-view');
const addCardModal = document.getElementById('add-card-modal');

// Navegación de Pantallas
function showView(viewName) {
  loginView.classList.add('hidden');
  recoveryView.classList.add('hidden');
  dashboardView.classList.add('hidden');

  if (viewName === 'login') loginView.classList.remove('hidden');
  if (viewName === 'recovery') recoveryView.classList.remove('hidden');
  if (viewName === 'dashboard') {
    dashboardView.classList.remove('hidden');
    document.getElementById('user-greeting').innerText = `Usuario: ${currentUser}`;
    renderCards();
  }
}

// Renderizado de Tarjetas
function renderCards() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  if (cards.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#888; margin: 40px 0;">No tienes tarjetas agregadas.</p>';
    selectedCardId = null;
    return;
  }

  cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.id === selectedCardId ? 'selected' : ''}`;
    cardEl.style.backgroundColor = card.colorHex;

    cardEl.innerHTML = `
      <div class="card-header">
        <div>
          <span class="bank-name">${card.bankName}</span>
          <span class="card-type">(${card.cardType})</span>
        </div>
        <button class="delete-card-btn" data-id="${card.id}" title="Eliminar tarjeta">✕</button>
      </div>
      <div class="card-balance">
        Saldo: ${card.currency} $${parseFloat(card.balance).toFixed(2)}
      </div>
      <div class="card-footer">
        <span>${card.cardHolder}</span>
        <span>**** ${card.lastFourDigits}</span>
      </div>
    `;

    // Selección de tarjeta al hacer clic
    cardEl.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-card-btn')) {
        selectedCardId = card.id;
        renderCards();
      }
    });

    // Evento para eliminar tarjeta
    const deleteBtn = cardEl.querySelector('.delete-card-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCard(card.id);
    });

    container.appendChild(cardEl);
  });
}

// Funciones CRUD
function addCard(newCard) {
  cards.push(newCard);
  selectedCardId = newCard.id;
  saveCards();
  renderCards();
  showToast("Tarjeta agregada exitosamente");
}

function deleteCard(id) {
  cards = cards.filter(c => c.id !== id);
  if (selectedCardId === id) {
    selectedCardId = cards.length > 0 ? cards[0].id : null;
  }
  saveCards();
  renderCards();
  showToast("Tarjeta eliminada");
}

function saveCards() {
  localStorage.setItem('user_cards', JSON.stringify(cards));
}

// Mensajes Toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  currentUser = email;
  localStorage.setItem('logged_user', email);
  showView('dashboard');
  showToast("¡Bienvenido!");
});

document.getElementById('go-recovery-btn').addEventListener('click', () => showView('recovery'));
document.getElementById('back-login-btn').addEventListener('click', () => showView('login'));

document.getElementById('recovery-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('recovery-email').value;
  showToast(`Código de respaldo enviado a ${email}`);
  setTimeout(() => showView('login'), 2000);
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('logged_user');
  currentUser = null;
  showView('login');
});

// Modal de alta
document.getElementById('open-add-modal-btn').addEventListener('click', () => addCardModal.classList.remove('hidden'));
document.getElementById('close-add-modal-btn').addEventListener('click', () => addCardModal.classList.add('hidden'));

document.getElementById('add-card-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const newCard = {
    id: Date.now().toString(),
    bankName: document.getElementById('bank-name').value,
    cardHolder: document.getElementById('card-holder').value.toUpperCase(),
    lastFourDigits: document.getElementById('last-digits').value,
    balance: parseFloat(document.getElementById('balance').value),
    currency: document.getElementById('currency').value,
    cardType: document.getElementById('card-type').value,
    colorHex: document.getElementById('card-color').value
  };

  addCard(newCard);
  addCardModal.classList.add('hidden');
  document.getElementById('add-card-form').reset();
});

// Pago NFC
document.getElementById('nfc-pay-btn').addEventListener('click', () => {
  if (!selectedCardId) {
    showToast("Selecciona o agrega una tarjeta primero");
    return;
  }
  const card = cards.find(c => c.id === selectedCardId);
  showToast(`Aproxime al POS: ${card.bankName} (**** ${card.lastFourDigits})`);
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    showView('dashboard');
  } else {
    showView('login');
  }
});
