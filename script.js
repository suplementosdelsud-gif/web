/* === CONFIGURACIÓN === */
const NUMERO_WHATSAPP = "59163284940";

/* === CONEXIONES INICIALES === */
document.addEventListener("DOMContentLoaded", () => {
  // ⚠️ Ya no se limpia el carrito al abrir la tienda
  // Esto permite mantener los productos entre páginas

  const btnRealizar = document.getElementById("btnRealizarPedido");
  if (btnRealizar) btnRealizar.addEventListener("click", realizarPedido);

  document.querySelectorAll(".btn-volver-tienda").forEach(b =>
    b.addEventListener("click", volverATienda)
  );
  document.querySelectorAll(".btn-volver-inicio").forEach(b =>
    b.addEventListener("click", volverAInicio)
  );
});

/* === FUNCIONES AUXILIARES === */
function leerCliente() {
  try { return JSON.parse(localStorage.getItem("cliente")) || {}; }
  catch { return {}; }
}

function leerCarrito() {
  try { return JSON.parse(localStorage.getItem("carrito")) || []; }
  catch { return []; }
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* === AÑADIR PRODUCTO === */
function añadirCarrito(nombreProducto, idCantidad, precio = 0) {
  const input = document.getElementById(idCantidad);
  const cantidad = Number(input?.value) || 1;

  if (!nombreProducto) return alert("❌ Error: producto no válido");

  let carrito = leerCarrito();
  const existente = carrito.find(p => p.nombre === nombreProducto);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre: nombreProducto, cantidad, precio });
  }

  guardarCarrito(carrito);
  alert(`✅ ${cantidad} x ${nombreProducto} añadido al carrito.`);
}

/* === VER DETALLES === */
function verDetalles(nombreProducto, precio = 0) {
  localStorage.setItem("productoDetalle", JSON.stringify({ nombre: nombreProducto, precio }));
  window.open("detalles.html", "_blank");
}

/* === REALIZAR PEDIDO === */
function realizarPedido() {
  const cliente = leerCliente();
  const carrito = leerCarrito();

  // Verificar si el carrito está vacío o no tiene productos válidos
  if (!carrito || carrito.length === 0) {
    alert("⚠️ No has seleccionado ningún producto. Añade al menos uno antes de realizar el pedido.");
    return;
  }

  const productosValidos = carrito.filter(p => p.nombre && p.cantidad > 0);
  if (productosValidos.length === 0) {
    alert("⚠️ No has seleccionado ningún producto válido.");
    return;
  }

  const listaProductos = productosValidos.map((p, i) =>
    `${i + 1}. ${p.nombre} (x${p.cantidad}) - ${p.precio ? p.precio * p.cantidad + " Bs" : ""}`
  ).join("\n");

  const total = productosValidos.reduce((sum, p) => sum + (p.precio * p.cantidad || 0), 0);

  const mensaje = `
📦 *Nuevo pedido desde Suplementos del Sud* 💪

👤 *Datos del cliente:*
- Nombre: ${cliente.nombre || ""}
- Apellido: ${cliente.apellido || ""}
- Género: ${cliente.genero || ""}
- Correo: ${cliente.correo || ""}
- Dirección: ${cliente.direccion || ""}
- Ciudad: ${cliente.ciudad || ""}

🛒 *Productos solicitados:*
${listaProductos}

💰 *Total:* ${total} Bs

Por favor confirmar el pedido.
`.trim();

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

/* === NAVEGACIÓN === */
function volverATienda() {
  window.location.href = "tienda.html";
}

function volverAInicio() {
  window.location.href = "index.html";
}
function mostrarCarrito() {
  const panel = document.getElementById("carritoPanel");
  const cont = document.getElementById("listaCarrito");
  const totalEl = document.getElementById("totalCarrito");

  const carrito = leerCarrito();

  if (!carrito || carrito.length === 0) {
    cont.innerHTML = "<p>🛒 Tu carrito está vacío.</p>";
    totalEl.textContent = "";
    panel.style.display = "block";
    return;
  }

  let total = 0;
  cont.innerHTML = carrito.map(p => {
    const subtotal = (p.precio || 0) * (p.cantidad || 0);
    total += subtotal;
    return `<p>${p.nombre} (x${p.cantidad}) — ${subtotal} Bs</p>`;
  }).join("");
  totalEl.textContent = `💰 Total: ${total} Bs`;
  panel.style.display = "block";
}

function cerrarCarrito() {
  document.getElementById("carritoPanel").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const btnVerCarrito = document.getElementById("btnVerCarrito");
  if (btnVerCarrito) {
    btnVerCarrito.addEventListener("click", mostrarCarrito);
  }
});
