// ==========================================
// PUCOR - CONTROL DE COSTOS Y UTILIDADES
// ==========================================

const menuTrabajos = document.getElementById("menuTrabajos");
const btnCotizaciones = document.getElementById("btnCotizaciones");
const btnTrabajosRealizados = document.getElementById("btnTrabajosRealizados");
const btnNuevaCotizacion = document.getElementById("btnNuevaCotizacion");
const btnVolver = document.getElementById("btnVolver");

const pantallaNuevaCotizacion = document.getElementById(
  "pantallaNuevaCotizacion",
);
const pantallaHistorialCotizaciones = document.getElementById(
  "pantallaHistorialCotizaciones",
);
const pantallaTrabajos = document.getElementById("pantallaTrabajos");
const pantallaEditarTrabajo = document.getElementById("pantallaEditarTrabajo");

const btnVolverNuevaCotizacion = document.getElementById(
  "btnVolverNuevaCotizacion",
);
const btnVolverHistorialCotizaciones = document.getElementById(
  "btnVolverHistorialCotizaciones",
);
const btnVolverTrabajos = document.getElementById("btnVolverTrabajos");

const formCotizacion = document.getElementById("formCotizacion");
const clienteCotizacion = document.getElementById("clienteCotizacion");
const descripcionCotizacion = document.getElementById("descripcionCotizacion");
const listaRepuestos = document.getElementById("listaRepuestos");
const listaMateriales = document.getElementById("listaMateriales");
const btnAgregarRepuesto = document.getElementById("btnAgregarRepuesto");
const btnAgregarMaterial = document.getElementById("btnAgregarMaterial");

const costoTraslado = document.getElementById("costoTraslado");
const costoManoObra = document.getElementById("costoManoObra");
const subtotalRepuestos = document.getElementById("subtotalRepuestos");
const subtotalMateriales = document.getElementById("subtotalMateriales");
const totalTraslado = document.getElementById("totalTraslado");
const totalManoObra = document.getElementById("totalManoObra");
const totalCotizacion = document.getElementById("totalCotizacion");
const listaCotizaciones = document.getElementById("listaCotizaciones");

// ELEMENTOS DE EDICIÓN DE TRABAJOS
const datosCotizacionOriginal = document.getElementById(
  "datosCotizacionOriginal",
);
const listaRepuestosAdicionales = document.getElementById(
  "listaRepuestosAdicionales",
);
const listaMaterialesAdicionales = document.getElementById(
  "listaMaterialesAdicionales",
);

const btnAgregarRepuestoAdicional = document.getElementById(
  "btnAgregarRepuestoAdicional",
);
const btnAgregarMaterialAdicional = document.getElementById(
  "btnAgregarMaterialAdicional",
);
const btnGuardarAdicionales = document.getElementById("btnGuardarAdicionales");

const costoTrasladoAdicional = document.getElementById(
  "costoTrasladoAdicional",
);
const costoManoObraAdicional = document.getElementById(
  "costoManoObraAdicional",
);

// NAVEGACIÓN

function ocultarTodasLasPantallas() {
  pantallaNuevaCotizacion.hidden = true;
  pantallaHistorialCotizaciones.hidden = true;
  pantallaTrabajos.hidden = true;
  pantallaEditarTrabajo.hidden = true;
}

/*function volverAlMenuPrincipal() {
  ocultarTodasLasPantallas();
  menuTrabajos.hidden = false;
}*/

btnCotizaciones.addEventListener("click", () => {
  ocultarTodasLasPantallas();
  pantallaHistorialCotizaciones.hidden = false;
  mostrarCotizaciones();
});

btnNuevaCotizacion.addEventListener("click", () => {
  ocultarTodasLasPantallas();
  pantallaNuevaCotizacion.hidden = false;
  cargarClientes();
});

btnTrabajosRealizados.addEventListener("click", () => {
  ocultarTodasLasPantallas();
  pantallaTrabajos.hidden = false;
});

btnVolverHistorialCotizaciones.addEventListener("click", volverAlMenuPrincipal);

btnVolver.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// CLIENTES

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
  btnCotizaciones;
}

// REPUESTOS Y MATERIALES

function crearFilaItem(tipo) {
  const fila = document.createElement("div");
  fila.className = "fila-cotizacion";

  const nombre = document.createElement("input");
  nombre.type = "text";
  nombre.className = "nombre-item";
  nombre.placeholder =
    tipo === "repuesto" ? "Nombre del repuesto" : "Nombre del material";
  nombre.required = true;

  const cantidad = document.createElement("input");
  cantidad.type = "number";
  cantidad.className = "cantidad-item";
  cantidad.placeholder = "Cantidad";
  cantidad.min = "1";
  cantidad.value = "1";
  cantidad.required = true;

  const precio = document.createElement("input");
  precio.type = "number";
  precio.className = "precio-item";
  precio.placeholder = "Precio unitario";
  precio.min = "0";
  precio.value = "0";
  precio.required = true;

  const quitar = document.createElement("button");
  quitar.type = "button";
  quitar.className = "btn-quitar-item";
  quitar.textContent = "Quitar";

  fila.append(nombre, cantidad, precio, quitar);
  return fila;
}

btnAgregarRepuesto.addEventListener("click", () => {
  listaRepuestos.appendChild(crearFilaItem("repuesto"));
});

btnAgregarMaterial.addEventListener("click", () => {
  listaMateriales.appendChild(crearFilaItem("material"));
});

document.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-quitar-item")) {
    evento.target.closest(".fila-cotizacion").remove();
    actualizarTotales();
  }
});

// CÁLCULOS

function formatoPesos(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}

function calcularSubtotal(contenedor) {
  let subtotal = 0;

  contenedor.querySelectorAll(".fila-cotizacion").forEach((fila) => {
    const cantidad = Number(fila.querySelector(".cantidad-item").value) || 0;
    const precio = Number(fila.querySelector(".precio-item").value) || 0;
    subtotal += cantidad * precio;
  });

  return subtotal;
}

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

[listaRepuestos, listaMateriales, costoTraslado, costoManoObra].forEach(
  (elemento) => {
    elemento.addEventListener("input", actualizarTotales);
  },
);

actualizarTotales();

// GUARDAR COTIZACIÓN

formCotizacion.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const clientes = JSON.parse(localStorage.getItem("clientesPUCOR")) || [];
  const cliente = clientes[Number(clienteCotizacion.value)];

  if (!cliente) {
    alert("Selecciona un cliente válido.");
    return;
  }

  const repuestos = Array.from(
    listaRepuestos.querySelectorAll(".fila-cotizacion"),
  ).map((fila) => ({
    nombre: fila.querySelector(".nombre-item").value.trim(),
    cantidad: Number(fila.querySelector(".cantidad-item").value),
    precio: Number(fila.querySelector(".precio-item").value),
  }));

  const materiales = Array.from(
    listaMateriales.querySelectorAll(".fila-cotizacion"),
  ).map((fila) => ({
    nombre: fila.querySelector(".nombre-item").value.trim(),
    cantidad: Number(fila.querySelector(".cantidad-item").value),
    precio: Number(fila.querySelector(".precio-item").value),
  }));

  const nuevaCotizacion = {
    id: Date.now(),
    numero: String(
      (JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || []).reduce(
        (mayor, c) => Math.max(mayor, Number(c.numero) || 0),
        0,
      ) + 1,
    ).padStart(5, "0"),
    fecha: new Date().toLocaleDateString("es-CL"),
    cliente: cliente.nombre,
    descripcion: descripcionCotizacion.value.trim(),
    repuestos,
    materiales,
    traslado: Number(costoTraslado.value) || 0,
    manoObra: Number(costoManoObra.value) || 0,
    total:
      calcularSubtotal(listaRepuestos) +
      calcularSubtotal(listaMateriales) +
      (Number(costoTraslado.value) || 0) +
      (Number(costoManoObra.value) || 0),
    estado: "Pendiente",
  };

  const cotizaciones =
    JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];
  cotizaciones.push(nuevaCotizacion);
  localStorage.setItem("cotizacionesPUCOR", JSON.stringify(cotizaciones));

  alert("¡Cotización guardada correctamente!");

  formCotizacion.reset();
  listaRepuestos.innerHTML = "";
  listaMateriales.innerHTML = "";
  actualizarTotales();

  volverAlMenuPrincipal();
});

// HISTORIAL DE COTIZACIONES

function mostrarCotizaciones() {
  const cotizaciones =
    JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];
  listaCotizaciones.innerHTML = "";

  if (cotizaciones.length === 0) {
    listaCotizaciones.textContent = "Todavía no hay cotizaciones registradas.";
    return;
  }

  cotizaciones.forEach((cotizacion) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-cotizacion";

    const numero = document.createElement("h3");
    numero.textContent = `Cotización N.º ${cotizacion.numero || "Sin número"}`;

    const fecha = document.createElement("p");
    fecha.textContent = `Fecha: ${cotizacion.fecha}`;

    const cliente = document.createElement("p");
    cliente.textContent = `Cliente: ${cotizacion.cliente}`;

    const descripcion = document.createElement("p");
    descripcion.textContent = `Servicio: ${cotizacion.descripcion}`;

    const total = document.createElement("h3");
    total.textContent = `Total: ${formatoPesos(cotizacion.total)}`;

    const estado = document.createElement("p");
    estado.textContent = `Estado: ${cotizacion.estado}`;

    tarjeta.append(numero, fecha, cliente, descripcion, total, estado);

    if (cotizacion.estado === "Pendiente") {
      const botonAceptar = document.createElement("button");
      botonAceptar.textContent = "Cotización Aceptada";

      botonAceptar.addEventListener("click", () => {
        cambiarEstadoCotizacion(cotizacion.id, "Trabajo Pendiente");
      });

      tarjeta.appendChild(botonAceptar);
    }

    if (cotizacion.estado === "Trabajo Pendiente") {
      const botonEditar = document.createElement("button");
      botonEditar.textContent = "Editar trabajo";

      botonEditar.addEventListener("click", () => {
        abrirEdicionTrabajo(cotizacion.id);
      });

      const botonListo = document.createElement("button");
      botonListo.textContent = "Trabajo Listo";

      botonListo.addEventListener("click", () => {
        cambiarEstadoCotizacion(cotizacion.id, "Trabajo Listo");
      });

      tarjeta.append(botonEditar, botonListo);
    }

    listaCotizaciones.appendChild(tarjeta);
  });
}

function cambiarEstadoCotizacion(id, nuevoEstado) {
  const cotizaciones =
    JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];

  const cotizacion = cotizaciones.find((c) => String(c.id) === String(id));

  if (!cotizacion) return;

  cotizacion.estado = nuevoEstado;

  localStorage.setItem("cotizacionesPUCOR", JSON.stringify(cotizaciones));

  mostrarCotizaciones();
}

function abrirEdicionTrabajo(id) {
  const cotizaciones =
    JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];

  const cotizacion = cotizaciones.find((c) => String(c.id) === String(id));

  if (!cotizacion) return;

  ocultarTodasLasPantallas();
  pantallaEditarTrabajo.hidden = false;

  datosCotizacionOriginal.textContent = `Cotización N.º ${cotizacion.id} | Cliente: ${cotizacion.cliente} | Total original: ${formatoPesos(cotizacion.total)}`;
}
