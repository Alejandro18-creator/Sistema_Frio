// ==========================================
// PUCOR - CONTROL DE COSTOS Y UTILIDADES
// ==========================================

const btnCotizaciones = document.getElementById("btnCotizaciones");
const btnNuevaCotizacion = document.getElementById("btnNuevaCotizacion");

const pantallaNuevaCotizacion = document.getElementById(
  "pantallaNuevaCotizacion",
);
const pantallaHistorialCotizaciones = document.getElementById(
  "pantallaHistorialCotizaciones",
);
const pantallaTrabajos = document.getElementById("pantallaTrabajos");
const pantallaEditarTrabajo = document.getElementById("pantallaEditarTrabajo");
const formCotizacion = document.getElementById("formCotizacion");

// Identifica si estamos creando o editando una cotización
let cotizacionEnEdicion = null;
let modoSoloLectura = false;

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

  const cotizaciones =
    JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];

  const datosActualizados = {
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
  };

  if (cotizacionEnEdicion !== null) {
    const indice = cotizaciones.findIndex(
      (c) => String(c.id) === String(cotizacionEnEdicion),
    );

    if (indice === -1) {
      alert("No se encontró la cotización que deseas editar.");
      return;
    }

    Object.assign(cotizaciones[indice], datosActualizados);

    localStorage.setItem("cotizacionesPUCOR", JSON.stringify(cotizaciones));

    alert("¡Cotización actualizada correctamente!");

    cotizacionEnEdicion = null;
  } else {
    const nuevaCotizacion = {
      id: Date.now(),
      numero: String(
        cotizaciones.reduce(
          (mayor, c) => Math.max(mayor, Number(c.numero) || 0),
          0,
        ) + 1,
      ).padStart(5, "0"),
      fecha: new Date().toLocaleDateString("es-CL"),
      ...datosActualizados,
      estado: "Pendiente",
    };

    cotizaciones.push(nuevaCotizacion);

    localStorage.setItem("cotizacionesPUCOR", JSON.stringify(cotizaciones));

    alert("¡Cotización guardada correctamente!");
  }

  formCotizacion.reset();
  listaRepuestos.innerHTML = "";
  listaMateriales.innerHTML = "";
  actualizarTotales();

  ocultarTodasLasPantallas();
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
    tarjeta.id = `cotizacion-${cotizacion.id}`;

    const numero = document.createElement("h3");
    numero.textContent = `Cotización N.º ${cotizacion.numero}`;

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

    // DETALLE COMPLETO DE LA COTIZACIÓN

    const detalle = document.createElement("div");
    detalle.className = "detalle-cotizacion";

    const tituloDetalle = document.createElement("h3");
    tituloDetalle.textContent = "Detalle de la cotización";
    detalle.appendChild(tituloDetalle);

    // Repuestos

    const tituloRepuestos = document.createElement("h4");
    tituloRepuestos.textContent = "Repuestos";
    detalle.appendChild(tituloRepuestos);

    if (cotizacion.repuestos && cotizacion.repuestos.length > 0) {
      cotizacion.repuestos.forEach((item) => {
        const subtotal = Number(item.cantidad) * Number(item.precio);

        const texto = document.createElement("p");
        texto.textContent =
          `${item.nombre} | Cantidad: ${item.cantidad} | ` +
          `Precio unitario: ${formatoPesos(item.precio)} | ` +
          `Subtotal: ${formatoPesos(subtotal)}`;

        detalle.appendChild(texto);
      });
    } else {
      const texto = document.createElement("p");
      texto.textContent = "Sin repuestos registrados.";
      detalle.appendChild(texto);
    }

    // Materiales

    const tituloMateriales = document.createElement("h4");
    tituloMateriales.textContent = "Materiales";
    detalle.appendChild(tituloMateriales);

    if (cotizacion.materiales && cotizacion.materiales.length > 0) {
      cotizacion.materiales.forEach((item) => {
        const subtotal = Number(item.cantidad) * Number(item.precio);

        const texto = document.createElement("p");
        texto.textContent =
          `${item.nombre} | Cantidad: ${item.cantidad} | ` +
          `Precio unitario: ${formatoPesos(item.precio)} | ` +
          `Subtotal: ${formatoPesos(subtotal)}`;

        detalle.appendChild(texto);
      });
    } else {
      const texto = document.createElement("p");
      texto.textContent = "Sin materiales registrados.";
      detalle.appendChild(texto);
    }

    // Otros costos

    const tituloOtros = document.createElement("h4");
    tituloOtros.textContent = "Otros costos";
    detalle.appendChild(tituloOtros);

    const textoTraslado = document.createElement("p");
    textoTraslado.textContent = `Traslado: ${formatoPesos(cotizacion.traslado)}`;
    detalle.appendChild(textoTraslado);

    const textoManoObra = document.createElement("p");
    textoManoObra.textContent = `Mano de obra: ${formatoPesos(cotizacion.manoObra)}`;
    detalle.appendChild(textoManoObra);

    // Abrir automáticamente cuando se llega desde Control de Costos

    detalle.hidden = window.location.hash !== `#cotizacion-${cotizacion.id}`;

    const botonDetalle = document.createElement("button");
    botonDetalle.type = "button";

    botonDetalle.textContent = detalle.hidden
      ? "Ver detalle"
      : "Ocultar detalle";

    botonDetalle.addEventListener("click", () => {
      detalle.hidden = !detalle.hidden;

      botonDetalle.textContent = detalle.hidden
        ? "Ver detalle"
        : "Ocultar detalle";
    });

    tarjeta.append(botonDetalle, detalle);

    // BOTONES DE ESTADO

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
//* Visualizar cotización original en modo solo lectura*
function abrirVisualizacionCotizacion(id) {
  const cotizaciones =
    JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];

  const cotizacion = cotizaciones.find((c) => String(c.id) === String(id));

  if (!cotizacion) {
    alert("No se encontró la cotización.");
    return;
  }

  modoSoloLectura = true;
  cotizacionEnEdicion = null;

  ocultarTodasLasPantallas();
  pantallaNuevaCotizacion.hidden = false;

  cargarClientes();

  const clientes = JSON.parse(localStorage.getItem("clientesPUCOR")) || [];

  const indiceCliente = clientes.findIndex(
    (cliente) => cliente.nombre === cotizacion.cliente,
  );

  clienteCotizacion.value = indiceCliente;
  descripcionCotizacion.value = cotizacion.descripcion;

  listaRepuestos.innerHTML = "";
  listaMateriales.innerHTML = "";

  (cotizacion.repuestos || []).forEach((item) => {
    const fila = crearFilaItem("repuesto");

    fila.querySelector(".nombre-item").value = item.nombre;
    fila.querySelector(".cantidad-item").value = item.cantidad;
    fila.querySelector(".precio-item").value = item.precio;

    listaRepuestos.appendChild(fila);
  });

  (cotizacion.materiales || []).forEach((item) => {
    const fila = crearFilaItem("material");

    fila.querySelector(".nombre-item").value = item.nombre;
    fila.querySelector(".cantidad-item").value = item.cantidad;
    fila.querySelector(".precio-item").value = item.precio;

    listaMateriales.appendChild(fila);
  });

  costoTraslado.value = cotizacion.traslado || 0;
  costoManoObra.value = cotizacion.manoObra || 0;

  actualizarTotales();

  // Bloquear los campos para impedir modificaciones
  formCotizacion
    .querySelectorAll("input, select, textarea")
    .forEach((campo) => {
      campo.disabled = true;
    });

  // Ocultar botones para agregar y quitar elementos
  btnAgregarRepuesto.hidden = true;
  btnAgregarMaterial.hidden = true;

  formCotizacion.querySelectorAll(".btn-quitar-item").forEach((boton) => {
    boton.hidden = true;
  });

  // Ocultar botón de guardar
  const botonGuardar = formCotizacion.querySelector('button[type="submit"]');

  if (botonGuardar) {
    botonGuardar.hidden = true;
  }

  // Cambiar título
  pantallaNuevaCotizacion.querySelector("h2").textContent =
    `Visualizar cotización N.º ${cotizacion.numero}`;

  // Crear botón para regresar
  let botonVolver = document.getElementById("btnVolverVisualizacion");

  if (!botonVolver) {
    botonVolver = document.createElement("button");
    botonVolver.id = "btnVolverVisualizacion";
    botonVolver.type = "button";
    botonVolver.textContent = "Volver a Control de Costos y Utilidades";

    formCotizacion.appendChild(botonVolver);
  }

  botonVolver.onclick = () => {
    window.location.href = "../Trabajos_Realizados/trabajos_realizados.html";
  };
}

function abrirEdicionTrabajo(id) {
  const cotizaciones =
    JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];

  const cotizacion = cotizaciones.find((c) => String(c.id) === String(id));

  if (!cotizacion) return;

  cotizacionEnEdicion = cotizacion.id;

  ocultarTodasLasPantallas();
  pantallaNuevaCotizacion.hidden = false;

  cargarClientes();

  const clientes = JSON.parse(localStorage.getItem("clientesPUCOR")) || [];
  const indiceCliente = clientes.findIndex(
    (cliente) => cliente.nombre === cotizacion.cliente,
  );

  clienteCotizacion.value = indiceCliente;

  descripcionCotizacion.value = cotizacion.descripcion;

  listaRepuestos.innerHTML = "";
  listaMateriales.innerHTML = "";

  cotizacion.repuestos.forEach((item) => {
    const fila = crearFilaItem("repuesto");

    fila.querySelector(".nombre-item").value = item.nombre;
    fila.querySelector(".cantidad-item").value = item.cantidad;
    fila.querySelector(".precio-item").value = item.precio;

    listaRepuestos.appendChild(fila);
  });

  cotizacion.materiales.forEach((item) => {
    const fila = crearFilaItem("material");

    fila.querySelector(".nombre-item").value = item.nombre;
    fila.querySelector(".cantidad-item").value = item.cantidad;
    fila.querySelector(".precio-item").value = item.precio;

    listaMateriales.appendChild(fila);
  });

  costoTraslado.value = cotizacion.traslado || 0;
  costoManoObra.value = cotizacion.manoObra || 0;

  actualizarTotales();
}

// Abrir cotización original en modo solo lectura
if (window.location.hash.startsWith("#ver-cotizacion-")) {
  const idCotizacion = window.location.hash.replace("#ver-cotizacion-", "");

  abrirVisualizacionCotizacion(idCotizacion);

  // Abrir cotización desde el historial
} else if (window.location.hash.startsWith("#cotizacion-")) {
  const idCotizacion = window.location.hash.replace("#cotizacion-", "");

  btnCotizaciones.click();

  setTimeout(() => {
    const cotizacion = document.getElementById(`cotizacion-${idCotizacion}`);

    if (cotizacion) {
      cotizacion.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      cotizacion.style.outline = "3px solid var(--azul-pucor)";
    }
  }, 100);
} else if (window.location.hash === "#cotizaciones") {
  btnCotizaciones.click();
} else if (window.location.hash === "#cotizaciones") {
  btnCotizaciones.click();
}
