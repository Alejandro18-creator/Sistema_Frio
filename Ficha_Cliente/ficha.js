const nombreFicha = document.getElementById("nombreFicha");
const telefonoFicha = document.getElementById("telefonoFicha");
const correoFicha = document.getElementById("correoFicha");
const direccionFicha = document.getElementById("direccionFicha");

const historialCotizaciones = document.getElementById("historialCotizaciones");
const historialTrabajos = document.getElementById("historialTrabajos");
const btnVolver = document.getElementById("btnVolver");

// Obtener identificador del cliente seleccionado
const parametros = new URLSearchParams(window.location.search);
const clienteId = parametros.get("id");

// Obtener clientes guardados
const clientes = JSON.parse(localStorage.getItem("clientesPUCOR")) || [];

// Buscar cliente
const cliente = clientes.find((c) => String(c.id) === clienteId);

function formatoPesos(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
}

function mostrarFicha() {
  if (!cliente) {
    nombreFicha.textContent = "Cliente no encontrado";
    telefonoFicha.textContent = "-";
    correoFicha.textContent = "-";
    direccionFicha.textContent = "-";
    historialCotizaciones.textContent =
      "No se encontró la información del cliente.";
    return;
  }

  nombreFicha.textContent = cliente.nombre;
  telefonoFicha.textContent = cliente.telefono;
  correoFicha.textContent = cliente.correo || "No registrado";
  direccionFicha.textContent = cliente.direccion;

  mostrarCotizaciones();
  mostrarTrabajos();
}

// Mostrar cotizaciones del cliente
function mostrarCotizaciones() {
  const cotizaciones =
    JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];

  const cotizacionesCliente = cotizaciones.filter(
    (cotizacion) => cotizacion.cliente === cliente.nombre,
  );

  historialCotizaciones.innerHTML = "";

  if (cotizacionesCliente.length === 0) {
    historialCotizaciones.textContent =
      "Este cliente todavía no tiene cotizaciones.";
    return;
  }

  cotizacionesCliente.forEach((cotizacion) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-historial";

    const titulo = document.createElement("h3");
    titulo.textContent = `Cotización N.º ${cotizacion.id}`;

    const fecha = document.createElement("p");
    fecha.textContent = `Fecha: ${cotizacion.fecha}`;

    const descripcion = document.createElement("p");
    descripcion.textContent = `Servicio: ${cotizacion.descripcion}`;

    const total = document.createElement("p");
    total.textContent = `Total: ${formatoPesos(cotizacion.total)}`;

    const estado = document.createElement("p");
    estado.textContent = `Estado: ${cotizacion.estado}`;

    tarjeta.append(titulo, fecha, descripcion, total, estado);
    historialCotizaciones.appendChild(tarjeta);
  });
}

// Se conectará con el módulo de trabajos realizados
function mostrarTrabajos() {
  historialTrabajos.textContent =
    "Todavía no hay trabajos registrados para este cliente.";
}

btnVolver.addEventListener("click", () => {
  window.location.href = "../Clientes_Registrados/registrados.html";
});

mostrarFicha();
