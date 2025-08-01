function openOrder() {
  document.getElementById("orderPopup").style.display = "flex";
}

function closeOrder() {
  document.getElementById("orderPopup").style.display = "none";
}

function sendWhatsAppOrder() {
  const size = document.getElementById("sizeSelect").value;
  const color = document.getElementById("colorSelect").value;
  const message = `Hi RAIRBREED, I'd like to order the "Built Different Tee". Size: ${size}, Color: ${color}`;
  
  const whatsappURL = `https://wa.me/27672695851?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}
