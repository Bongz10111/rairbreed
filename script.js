// Popup open/close
function openOrder(btn, name) {
  document.querySelectorAll('.order-popup.show').forEach(p => p.classList.remove('show'));
  const card = btn.closest('.product-card');
  const popup = card.querySelector('.order-popup');
  popup.querySelector('h2').textContent = `Order: ${name}`;
  popup.classList.add('show');
}

function closeOrder(btn) {
  const popup = btn.closest('.order-popup');
  popup.classList.remove('show');
}

// Cart data
const cart = [];

// Elements
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartModal = document.getElementById('cartModal');

// Show notification function
function showNotification(msg) {
  const notification = document.getElementById('notification');
  notification.textContent = msg;
  notification.style.opacity = '1';
  notification.style.pointerEvents = 'auto';

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.pointerEvents = 'none';
  }, 2000);
}

// Add current popup product to cart
function addCurrentProductToCart(button) {
  const popup = button.closest('.order-popup');
  const card = popup.closest('.product-card');

  const name = card.querySelector('h2').textContent.trim();
  const priceText = card.querySelector('.price').textContent.trim(); // e.g. "R399"
  const price = Number(priceText.replace('R', ''));

  // Get selected options
  const size = popup.querySelector('.size-select').value;
  const color = popup.querySelector('.color-select').value;
  const deliverySelect = popup.querySelector('.delivery-select');
  const deliveryCost = Number(deliverySelect.value);
  const deliveryText = deliverySelect.options[deliverySelect.selectedIndex].text;
  const quantityInput = popup.querySelector('.quantity-input');
  let quantity = Number(quantityInput.value);

  if (!quantity || quantity < 1) {
    alert('Please select a quantity of at least 1');
    return;
  }

  const totalItemPrice = (price * quantity) + deliveryCost;

  const existingIndex = cart.findIndex(item =>
    item.name === name &&
    item.size === size &&
    item.color === color &&
    item.delivery === deliveryText
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
    cart[existingIndex].totalPrice += totalItemPrice;
  } else {
    cart.push({
      name,
      size,
      color,
      quantity,
      delivery: deliveryText,
      deliveryCost,
      unitPrice: price,
      totalPrice: totalItemPrice
    });
  }

  updateCartUI();

  // Replace alert with notification
  showNotification(`${quantity} x ${name} (${size}, ${color}, Delivery: ${deliveryText}) added to cart!`);

  popup.classList.remove('show');
}

// Update cart UI
function updateCartUI() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalQty;

  cartItemsEl.innerHTML = '';
  cart.forEach((item, idx) => {
    const li = document.createElement('li');
    li.textContent = `${item.quantity} x ${item.name} - Size: ${item.size}, Color: ${item.color}, Delivery: ${item.delivery} = R${item.totalPrice.toFixed(2)}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.style.marginLeft = '10px';
    removeBtn.style.background = 'transparent';
    removeBtn.style.color = 'white';
    removeBtn.style.border = 'none';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.fontWeight = 'bold';
    removeBtn.onclick = () => {
      cart.splice(idx, 1);
      updateCartUI();
    };

    li.appendChild(removeBtn);
    cartItemsEl.appendChild(li);
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  cartTotalEl.textContent = `Total: R${totalPrice.toFixed(2)}`;
}

// Toggle cart modal
function toggleCart() {
  if (cartModal.style.display === 'block') {
    cartModal.style.display = 'none';
  } else {
    cartModal.style.display = 'block';
  }
}

// Send cart order via WhatsApp
function sendCart() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const name = document.getElementById('clientName')?.value.trim();
  const surname = document.getElementById('clientSurname')?.value.trim();

  if (!name || !surname) {
    alert("Please enter your name and surname before sending the order.");
    return;
  }

  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  let message = `*RAIRBREED Order #${orderNumber}*\n`;
  message += `From: ${name} ${surname}\n\n`;

  cart.forEach(item => {
    message += `${item.quantity} x ${item.name} (Size: ${item.size}, Color: ${item.color}, Delivery: ${item.delivery}) - R${item.totalPrice.toFixed(2)}\n`;
  });

  message += `\n*Total: R${totalPrice.toFixed(2)}*\n\n`;
  message += "Please confirm delivery address and you'll receive payment details.";

  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = '27672695851';
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappURL, '_blank');
}


  // Show confirmation popup
  setTimeout(() => {
    const confirmation = document.createElement("div");
    confirmation.className = "order-confirmation";
    confirmation.innerHTML = `
      <p>✅ <strong>Thank you for your order!</strong></p>
      <p>Your order number is <strong>#${orderNumber}</strong>.</p>
      <p>You will receive payment details via WhatsApp shortly.</p>
    `;
    document.body.appendChild(confirmation);

    setTimeout(() => {
      confirmation.remove();
    }, 8000);
  }, 1000);

