window.onload = function() {
  mostrarCarrito();
};

function mostrarCarrito() {
  const contenedor = document.getElementById("carrito-contenido");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
    return;
  }

  let total = 0;
  let html = "<table><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr>";

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `<tr>
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>${item.precio} Bs</td>
      <td>${subtotal} Bs</td>
    </tr>`;
  });

  html += `</table><h3>Total: ${total} Bs</h3>`;
  contenedor.innerHTML = html;
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  mostrarCarrito();
  alert("Carrito vaciado 🧹");
}
