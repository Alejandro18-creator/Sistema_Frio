const menuTrabajos = document.getElementById("menuTrabajos");

const pantallaCotizaciones = document.getElementById("pantallaCotizaciones");

const pantallaTrabajos = document.getElementById("pantallaTrabajos");

const btnCotizaciones = document.getElementById("btnCotizaciones");
const btnTrabajosRealizados = document.getElementById("btnTrabajosRealizados");

const btnVolverCotizaciones = document.getElementById("btnVolverCotizaciones");

const btnVolverTrabajos = document.getElementById("btnVolverTrabajos");
const btnVolver = document.getElementById("btnVolver");

// Elementos del formulario de cotizaciones
const formCotizacion = document.getElementById("formCotizacion");
const clienteCotizacion = document.getElementById("clienteCotizacion");
const descripcionCotizacion = document.getElementById("descripcionCotizacion");

const listaRepuestos = document.getElementById("listaRepuestos");
const listaMateriales = document.getElementById("listaMateriales");

const btnAgregarRepuesto = document.getElementById("btnAgregarRepuesto");
const btnAgregarMaterial = document.getElementById("btnAgregarMaterial");

// Elementos del resumen de cotización
const costoTraslado = document.getElementById("costoTraslado");
const costoManoObra = document.getElementById("costoManoObra");

const subtotalRepuestos = document.getElementById("subtotalRepuestos");
const subtotalMateriales = document.getElementById("subtotalMateriales");
const totalTraslado = document.getElementById("totalTraslado");
const totalManoObra = document.getElementById("totalManoObra");
const totalCotizacion = document.getElementById("totalCotizacion");

// Cargar clientes registrados
function cargarClientes() {
  const clientes = JSON.parse(localStorage.getItem("clientesPUCOR")) || [];

  clienteCotizacion.innerHTML =
    '<option value="">Selecciona un cliente</option>';

  clientes.forEach((cliente, indice) => {
    const opcion = document.createElement("option");

    opcion.value = indice;
    opcion.textContent = cliente.nombre;

    clienteCotizacion.appendChild(opcion);
  });
}

cargarClientes();

// Agregar repuestos a la cotización
function agregarRepuesto() {
  const fila = document.createElement("div");
  fila.className = "fila-cotizacion";

  fila.innerHTML = `
    <input type="text" class="nombre-item" placeholder="Nombre del repuesto" required>

    <input type="number" class="cantidad-item" placeholder="Cantidad" min="1" value="1" required>

    <input type="number" class="precio-item" placeholder="Precio unitario" min="0" value="0" required>

    <button type="button" class="btn-quitar-item">Quitar</button>
  `;

  listaRepuestos.appendChild(fila);
}

btnAgregarRepuesto.addEventListener("click", agregarRepuesto);

// Agregar materiales a la cotización
function agregarMaterial() {
  const fila = document.createElement("div");
  fila.className = "fila-cotizacion";

  fila.innerHTML = `
    <input type="text" class="nombre-item" placeholder="Nombre del material" required>

    <input type="number" class="cantidad-item" placeholder="Cantidad" min="1" value="1" required>

    <input type="number" class="precio-item" placeholder="Precio unitario" min="0" value="0" required>

    <button type="button" class="btn-quitar-item">Quitar</button>
  `;

  listaMateriales.appendChild(fila);
}

btnAgregarMaterial.addEventListener("click", agregarMaterial);

// Formato de moneda chilena
function formatoPesos(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}

// Calcular subtotal de repuestos y materiales
function calcularSubtotal(contenedor) {
  let subtotal = 0;

  contenedor.querySelectorAll(".fila-cotizacion").forEach((fila) => {
    const cantidad = Number(fila.querySelector(".cantidad-item").value) || 0;
    const precio = Number(fila.querySelector(".precio-item").value) || 0;

    subtotal += cantidad * precio;
  });

  return subtotal;
}

// Actualizar todos los totales
function actualizarTotales() {
  const repuestos = calcularSubtotal(listaRepuestos);
  const materiales = calcularSubtotal(listaMateriales);
  const traslado = Number(costoTraslado.value) || 0;
  const manoObra = Number(costoManoObra.value) || 0;

  const total = repuestos + materiales + traslado + manoObra;

  subtotalRepuestos.textContent = formatoPesos(repuestos);
  subtotalMateriales.textContent = formatoPesos(materiales);
  totalTraslado.textContent = formatoPesos(traslado);
  totalManoObra.textContent = formatoPesos(manoObra);
  totalCotizacion.textContent = formatoPesos(total);
}

// Actualizar al modificar los valores
[listaRepuestos, listaMateriales, costoTraslado, costoManoObra].forEach(
  (elemento) => {
    elemento.addEventListener("input", actualizarTotales);
  },
);

actualizarTotales();

btnCotizaciones.addEventListener("click", () => {
  menuTrabajos.hidden = true;
  pantallaCotizaciones.hidden = false;
});

btnTrabajosRealizados.addEventListener("click", () => {
  menuTrabajos.hidden = true;
  pantallaTrabajos.hidden = false;
});

btnVolverCotizaciones.addEventListener("click", () => {
  pantallaCotizaciones.hidden = true;
  menuTrabajos.hidden = false;
});

btnVolverTrabajos.addEventListener("click", () => {
  pantallaTrabajos.hidden = true;
  menuTrabajos.hidden = false;
});

btnVolver.addEventListener("click", () => {
  window.location.href = "../index.html";
});
// Eliminar repuestos o materiales
document.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-quitar-item")) {
    evento.target.closest(".fila-cotizacion").remove();
    actualizarTotales();
  }
});
