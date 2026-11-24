// Obtener las cotizaciones guardadas
let cotizaciones = JSON.parse(localStorage.getItem("cotizacionesPUCOR")) || [];

// Obtener los trabajos con sus datos financieros
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

// Mostrar los trabajos terminados
function mostrarTrabajosRealizados() {
  const lista = document.getElementById("listaTrabajosRealizados");

  const trabajosTerminados = cotizaciones.filter(
    (cotizacion) => cotizacion.estado === "Trabajo Listo",
  );

  document.getElementById("totalTrabajos").textContent =
    trabajosTerminados.length;

  let ingresos = 0;
  let costos = 0;

  trabajosFinancieros.forEach((trabajo) => {
    ingresos += Number(trabajo.ingreso) || 0;
    costos += Number(trabajo.costos) || 0;
  });

  document.getElementById("totalIngresos").textContent = formatoPesos(ingresos);

  document.getElementById("totalUtilidad").textContent = formatoPesos(
    ingresos - costos,
  );

  if (trabajosTerminados.length === 0) {
    lista.innerHTML = "<p>No hay trabajos terminados todavía.</p>";
    return;
  }

  lista.innerHTML = "";

  trabajosTerminados.forEach((trabajo) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-trabajo";

    const datosFinancieros = trabajosFinancieros.find(
      (item) => String(item.id) === String(trabajo.id),
    );

    const ingresoActual = Number(datosFinancieros?.ingreso) || 0;
    const costosActuales = Number(datosFinancieros?.costos) || 0;
    const utilidadActual = ingresoActual - costosActuales;

    // Resumen de repuestos
    const cantidadRepuestos = (trabajo.repuestos || []).reduce(
      (total, item) => total + (Number(item.cantidad) || 0),
      0,
    );

    const totalRepuestos = (trabajo.repuestos || []).reduce(
      (total, item) =>
        total + (Number(item.cantidad) || 0) * (Number(item.precio) || 0),
      0,
    );

    // Resumen de materiales
    const cantidadMateriales = (trabajo.materiales || []).reduce(
      (total, item) => total + (Number(item.cantidad) || 0),
      0,
    );

    const totalMateriales = (trabajo.materiales || []).reduce(
      (total, item) =>
        total + (Number(item.cantidad) || 0) * (Number(item.precio) || 0),
      0,
    );

    const totalTraslado = Number(trabajo.traslado) || 0;
    const totalManoObra = Number(trabajo.manoObra) || 0;

    tarjeta.innerHTML = `
      <h3>Trabajo N.º ${trabajo.numero}</h3>
      <p><strong>Cliente:</strong> ${trabajo.cliente}</p>
      <p><strong>Descripción:</strong> ${trabajo.descripcion}</p>
      <p><strong>Fecha:</strong> ${trabajo.fecha}</p>
            <p><strong>Estado:</strong> ${trabajo.estado}</p>

      <hr>

      <h4>Resumen de cotización</h4>

      <p><strong>Repuestos:</strong> ${cantidadRepuestos} unidades — ${formatoPesos(totalRepuestos)}</p>

      <p><strong>Materiales:</strong> ${cantidadMateriales} unidades — ${formatoPesos(totalMateriales)}</p>

      <p><strong>Traslado:</strong> ${formatoPesos(totalTraslado)}</p>
      <p><strong>Total cotizado:</strong> ${formatoPesos(trabajo.total)}</p>

      <button type="button" class="ver-cotizacion">
        Ver cotización original
      </button>

      <hr>

      <h4>Resumen económico</h4>

      <p><strong>Ingreso real:</strong> ${formatoPesos(ingresoActual)}</p>

      <p><strong>Total de costos:</strong> ${formatoPesos(costosActuales)}</p>

      <p><strong>Utilidad:</strong> ${formatoPesos(utilidadActual)}</p>

      <hr>

      <h4>Control financiero</h4>

      <label>Ingreso real ($)</label>
      <input type="number" class="ingreso-real" min="0"
        value="${datosFinancieros?.ingreso ?? ""}"
        placeholder="Monto cobrado">

      <label>Costo de repuestos ($)</label>
      <input type="number" class="costo-repuestos" min="0"
        value="${datosFinancieros?.repuestos ?? ""}">

      <label>Costo de materiales ($)</label>
      <input type="number" class="costo-materiales" min="0"
        value="${datosFinancieros?.materiales ?? ""}">

      <label>Costo de traslado ($)</label>
      <input type="number" class="costo-traslado" min="0"
        value="${datosFinancieros?.traslado ?? ""}">

      <label>Otros gastos ($)</label>
      <input type="number" class="otros-gastos" min="0"
        value="${datosFinancieros?.otros ?? ""}">

      <button type="button" class="guardar-finanzas">
        Guardar costos e ingresos
      </button>
    `;
    const botonVerCotizacion = tarjeta.querySelector(".ver-cotizacion");

    botonVerCotizacion.addEventListener("click", () => {
      window.location.href = `../Costo_Utilidades/trabajos.html#cotizacion-${trabajo.id}`;
    });

    const botonGuardar = tarjeta.querySelector(".guardar-finanzas");

    botonGuardar.addEventListener("click", () => {
      const ingreso = Number(tarjeta.querySelector(".ingreso-real").value) || 0;
      const repuestos =
        Number(tarjeta.querySelector(".costo-repuestos").value) || 0;
      const materiales =
        Number(tarjeta.querySelector(".costo-materiales").value) || 0;
      const traslado =
        Number(tarjeta.querySelector(".costo-traslado").value) || 0;
      const otros = Number(tarjeta.querySelector(".otros-gastos").value) || 0;

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

      mostrarTrabajosRealizados();
    });

    lista.appendChild(tarjeta);
  });
}

// Iniciar el módulo
mostrarTrabajosRealizados();
