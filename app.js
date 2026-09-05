const mockCards = [
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
  },
  {
    id: "3",
    bankName: "Mercado Pago",
    cardHolder: "CARLOS MARTINEZ",
    lastFourDigits: "9054",
    balance: 4850.00,
    currency: "UYU",
    cardType: "Virtual",
    colorHex: "#009EE3"
  }
];

let selectedCardId = mockCards[0].id;

function renderCards() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  mockCards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.id === selectedCardId ? 'selected' : ''}`;
    cardEl.style.backgroundColor = card.colorHex;

    cardEl.innerHTML = `
      <div class="card-header">
        <span class="bank-name">${card.bankName}</span>
        <span class="card-type">${card.cardType}</span>
      </div>
      <div class="card-balance">
        Saldo disponible: ${card.currency} $${card.balance.toFixed(2)}
      </div>
      <div class="card-footer">
        <span>${card.cardHolder}</span>
        <span>**** ${card.lastFourDigits}</span>
      </div>
    `;

    cardEl.addEventListener('click', () => {
      selectedCardId = card.id;
      renderCards();
    });

    container.appendChild(cardEl);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

document.getElementById('nfc-pay-btn').addEventListener('click', () => {
  const card = mockCards.find(c => c.id === selectedCardId);
  showToast(`Tarjeta activa para pago NFC: ${card.bankName} (**** ${card.lastFourDigits})`);
});

document.addEventListener('DOMContentLoaded', renderCards);
