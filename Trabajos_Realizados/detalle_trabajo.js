// Obtener el identificador del trabajo desde la dirección
const parametros = new URLSearchParams(window.location.search);
const idTrabajo = parametros.get("id");

// Obtener las cotizaciones y los datos financieros
const cotizaciones =
  JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];

let trabajosFinancieros =
  JSON.parse(localStorage.getItem("trabajosRealizadosPUCOR")) || [];

// Formatear valores como pesos chilenos
function formatoPesos(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor || 0);
}

// Buscar el trabajo seleccionado
const trabajo = cotizaciones.find(
  (cotizacion) =>
    String(cotizacion.id) === String(idTrabajo) &&
    cotizacion.estado === "Trabajo Listo",
);

// Mostrar el detalle
function mostrarDetalleTrabajo() {
  const contenedor = document.getElementById("detalleTrabajoPagina");

  if (!trabajo) {
    contenedor.innerHTML = "<p>No se encontró el trabajo seleccionado.</p>";
    return;
  }

  const datosFinancieros = trabajosFinancieros.find(
    (item) => String(item.id) === String(trabajo.id),
  );

  const ingresoActual = Number(datosFinancieros?.ingreso ?? trabajo.total) || 0;

  const costosActuales = Number(datosFinancieros?.costos) || 0;
  const utilidadActual = ingresoActual - costosActuales;

  // Resumen de repuestos
  const cantidadRepuestos = (trabajo.repuestos || []).reduce(
    (total, item) => total + (Number(item.cantidad) || 0),
    0,
  );

  const totalRepuestos = (trabajo.repuestos || []).reduce(
    (total, item) => total + Number(item.cantidad) * Number(item.precio),
    0,
  );

  // Resumen de materiales
  const cantidadMateriales = (trabajo.materiales || []).reduce(
    (total, item) => total + (Number(item.cantidad) || 0),
    0,
  );

  const totalMateriales = (trabajo.materiales || []).reduce(
    (total, item) => total + Number(item.cantidad) * Number(item.precio),
    0,
  );

  contenedor.innerHTML = `
    <div class="tarjeta-trabajo">

      <h3>Trabajo N.º ${trabajo.numero}</h3>

      <p><strong>Cliente:</strong> ${trabajo.cliente}</p>
      <p><strong>Descripción:</strong> ${trabajo.descripcion}</p>
      <p><strong>Fecha:</strong> ${trabajo.fecha}</p>
      <p><strong>Estado:</strong> ${trabajo.estado}</p>

      <hr>

      <h3>Resumen de cotización</h3>

      <p><strong>Repuestos:</strong> ${cantidadRepuestos} unidades — ${formatoPesos(totalRepuestos)}</p>

      <p><strong>Materiales:</strong> ${cantidadMateriales} unidades — ${formatoPesos(totalMateriales)}</p>

      <p><strong>Traslado:</strong> ${formatoPesos(trabajo.traslado)}</p>

      <p><strong>Mano de obra:</strong> ${formatoPesos(trabajo.manoObra)}</p>

      <p><strong>Total cotizado:</strong> ${formatoPesos(trabajo.total)}</p>

      <button type="button" id="btnVerCotizacionOriginal">
        Ver cotización original
      </button>

      <hr>

      <h3>Resumen económico</h3>

      <p><strong>Ingreso real:</strong> ${formatoPesos(ingresoActual)}</p>

      <p><strong>Total de costos:</strong> ${formatoPesos(costosActuales)}</p>

      <p><strong>Utilidad:</strong> ${formatoPesos(utilidadActual)}</p>

      <hr>

      <h3>Control financiero</h3>

      <label>Ingreso real ($)</label>
      <input type="number" id="ingresoReal" min="0"
        value="${ingresoActual}">

      <label>Costo de repuestos ($)</label>
      <input type="number" id="costoRepuestos" min="0"
        value="${datosFinancieros?.repuestos ?? ""}">

      <label>Costo de materiales ($)</label>
      <input type="number" id="costoMateriales" min="0"
        value="${datosFinancieros?.materiales ?? ""}">

      <label>Costo de traslado ($)</label>
      <input type="number" id="costoTraslado" min="0"
        value="${datosFinancieros?.traslado ?? ""}">

      <label>Otros gastos ($)</label>
      <input type="number" id="otrosGastos" min="0"
        value="${datosFinancieros?.otros ?? ""}">

      <button type="button" id="btnGuardarFinanzas">
        Guardar costos e ingresos
      </button>

    </div>
  `;

  // Abrir cotización original
  document
    .getElementById("btnVerCotizacionOriginal")
    .addEventListener("click", () => {
      window.location.href = `../Costo_Utilidades/trabajos.html#ver-cotizacion-${trabajo.id}`;
    });

  // Guardar información financiera
  document
    .getElementById("btnGuardarFinanzas")
    .addEventListener("click", () => {
      const ingreso = Number(document.getElementById("ingresoReal").value) || 0;

      const repuestos =
        Number(document.getElementById("costoRepuestos").value) || 0;

      const materiales =
        Number(document.getElementById("costoMateriales").value) || 0;

      const traslado =
        Number(document.getElementById("costoTraslado").value) || 0;

      const otros = Number(document.getElementById("otrosGastos").value) || 0;

      const costos = repuestos + materiales + traslado + otros;

      const nuevoRegistro = {
        id: trabajo.id,
        ingreso,
        repuestos,
        materiales,
        traslado,
        otros,
        costos,
      };

      const indice = trabajosFinancieros.findIndex(
        (item) => String(item.id) === String(trabajo.id),
      );

      if (indice !== -1) {
        trabajosFinancieros[indice] = nuevoRegistro;
      } else {
        trabajosFinancieros.push(nuevoRegistro);
      }

      localStorage.setItem(
        "trabajosRealizadosPUCOR",
        JSON.stringify(trabajosFinancieros),
      );

      alert("Datos financieros guardados correctamente.");

      mostrarDetalleTrabajo();
    });
}

// Iniciar la página
mostrarDetalleTrabajo();
