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

//* Crear detalle de cada trabajo*
function crearDetalleTrabajo(trabajo) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta-trabajo";

  const datosFinancieros = trabajosFinancieros.find(
    (item) => String(item.id) === String(trabajo.id),
  );

  const ingresoActual = Number(datosFinancieros?.ingreso ?? trabajo.total) || 0;
  const costosActuales = Number(datosFinancieros?.costos) || 0;
  const utilidadActual = ingresoActual - costosActuales;

  const cantidadRepuestos = (trabajo.repuestos || []).reduce(
    (total, item) => total + (Number(item.cantidad) || 0),
    0,
  );

  const totalRepuestos = (trabajo.repuestos || []).reduce(
    (total, item) =>
      total + (Number(item.cantidad) || 0) * (Number(item.precio) || 0),
    0,
  );

  const cantidadMateriales = (trabajo.materiales || []).reduce(
    (total, item) => total + (Number(item.cantidad) || 0),
    0,
  );

  const totalMateriales = (trabajo.materiales || []).reduce(
    (total, item) =>
      total + (Number(item.cantidad) || 0) * (Number(item.precio) || 0),
    0,
  );

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
    <p><strong>Traslado:</strong> ${formatoPesos(trabajo.traslado)}</p>
    <p><strong>Mano de obra:</strong> ${formatoPesos(trabajo.manoObra)}</p>
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
      value="${datosFinancieros?.ingreso || trabajo.total || 0}"

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

  tarjeta.querySelector(".ver-cotizacion").addEventListener("click", () => {
    window.location.href = `../Costo_Utilidades/trabajos.html#ver-cotizacion-${trabajo.id}`;
  });

  tarjeta.querySelector(".guardar-finanzas").addEventListener("click", () => {
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

  return tarjeta;
}

//* Mostrar los trabajos terminados en una tabla*
function mostrarTrabajosRealizados() {
  const lista = document.getElementById("listaTrabajosRealizados");

  const trabajosTerminados = cotizaciones
    .filter((cotizacion) => cotizacion.estado === "Trabajo Listo")
    .sort((a, b) => {
      const fechaA = String(a.fecha || "")
        .split("-")
        .reverse()
        .join("-");
      const fechaB = String(b.fecha || "")
        .split("-")
        .reverse()
        .join("-");

      return new Date(fechaB) - new Date(fechaA);
    });

  // Actualizar indicadores superiores
  document.getElementById("totalTrabajos").textContent =
    trabajosTerminados.length;

  let ingresos = 0;
  let costos = 0;

  trabajosTerminados.forEach((trabajoTerminado) => {
    const registroFinanciero = trabajosFinancieros.find(
      (registro) => String(registro.id) === String(trabajoTerminado.id),
    );

    if (registroFinanciero) {
      ingresos += Number(registroFinanciero.ingreso) || 0;
      costos += Number(registroFinanciero.costos) || 0;
    }
  });

  document.getElementById("totalIngresos").textContent = formatoPesos(ingresos);

  document.getElementById("totalUtilidad").textContent = formatoPesos(
    ingresos - costos,
  );

  lista.innerHTML = "";

  // Crear tabla
  const tabla = document.createElement("table");
  tabla.className = "tabla-trabajos";

  const encabezado = document.createElement("thead");

  // Fila de filtros
  const filaFiltros = document.createElement("tr");

  const espacioVer = document.createElement("th");
  filaFiltros.appendChild(espacioVer);

  function crearFiltro(placeholder, etiqueta) {
    const celda = document.createElement("th");
    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = placeholder;
    input.setAttribute("aria-label", etiqueta);
    input.className = "filtro-trabajos";

    celda.appendChild(input);
    filaFiltros.appendChild(celda);

    return input;
  }

  const filtroCliente = crearFiltro("Buscar cliente", "Filtrar por cliente");
  const filtroNumero = crearFiltro("N.º cotización", "Filtrar por número");
  const filtroFecha = crearFiltro("Buscar fecha", "Filtrar por fecha");
  const filtroEstado = crearFiltro("Buscar estado", "Filtrar por estado");

  encabezado.appendChild(filaFiltros);

  // Fila de títulos
  const filaTitulos = document.createElement("tr");

  ["Ver", "Cliente", "N.º Cotización", "Fecha", "Estado"].forEach((titulo) => {
    const th = document.createElement("th");
    th.textContent = titulo;
    filaTitulos.appendChild(th);
  });

  encabezado.appendChild(filaTitulos);
  tabla.appendChild(encabezado);

  const cuerpo = document.createElement("tbody");
  tabla.appendChild(cuerpo);

  // Paginación
  let paginaActual = 1;
  const trabajosPorPagina = 20;

  const controlesPaginacion = document.createElement("div");
  controlesPaginacion.className = "controles-paginacion";

  // Mostrar y filtrar los trabajos
  function actualizarTabla() {
    const textoCliente = filtroCliente.value.toLowerCase().trim();
    const textoNumero = filtroNumero.value.toLowerCase().trim();
    const textoFecha = filtroFecha.value.toLowerCase().trim();
    const textoEstado = filtroEstado.value.toLowerCase().trim();

    const resultados = trabajosTerminados.filter((trabajo) => {
      return (
        String(trabajo.cliente || "")
          .toLowerCase()
          .includes(textoCliente) &&
        String(trabajo.numero || "")
          .toLowerCase()
          .includes(textoNumero) &&
        String(trabajo.fecha || "")
          .toLowerCase()
          .includes(textoFecha) &&
        String(trabajo.estado || "")
          .toLowerCase()
          .includes(textoEstado)
      );
    });

    cuerpo.innerHTML = "";

    if (resultados.length === 0) {
      const filaVacia = document.createElement("tr");
      const celdaVacia = document.createElement("td");

      celdaVacia.colSpan = 5;
      celdaVacia.textContent = "No se encontraron trabajos.";

      filaVacia.appendChild(celdaVacia);
      cuerpo.appendChild(filaVacia);
      return;
    }

    const totalPaginas = Math.max(
      1,
      Math.ceil(resultados.length / trabajosPorPagina),
    );

    paginaActual = Math.min(paginaActual, totalPaginas);

    const inicio = (paginaActual - 1) * trabajosPorPagina;

    const trabajosPagina = resultados.slice(inicio, inicio + trabajosPorPagina);

    trabajosPagina.forEach((trabajo) => {
      const fila = document.createElement("tr");

      // Botón Ver
      const celdaVer = document.createElement("td");
      const botonVer = document.createElement("button");

      botonVer.type = "button";
      botonVer.textContent = "Ver";
      botonVer.className = "boton-ver-trabajo";

      celdaVer.appendChild(botonVer);

      // Datos de la cotización
      const celdaCliente = document.createElement("td");
      celdaCliente.textContent = trabajo.cliente;

      const celdaNumero = document.createElement("td");
      celdaNumero.textContent = trabajo.numero;

      const celdaFecha = document.createElement("td");
      celdaFecha.textContent = trabajo.fecha;

      const celdaEstado = document.createElement("td");
      celdaEstado.textContent = trabajo.estado;

      fila.append(celdaVer, celdaCliente, celdaNumero, celdaFecha, celdaEstado);

      // Fila donde aparecerá el detalle
      const filaDetalle = document.createElement("tr");
      filaDetalle.hidden = true;

      const celdaDetalle = document.createElement("td");
      celdaDetalle.colSpan = 5;
      celdaDetalle.className = "celda-detalle-trabajo";

      filaDetalle.appendChild(celdaDetalle);

      botonVer.addEventListener("click", () => {
        window.location.href = `detalle_trabajo.html?id=${encodeURIComponent(trabajo.id)}`;
      });

      cuerpo.appendChild(fila);
      cuerpo.appendChild(filaDetalle);
    });

    // Crear botones de paginación
    controlesPaginacion.innerHTML = "";

    const botonAnterior = document.createElement("button");
    botonAnterior.textContent = "Anterior";
    botonAnterior.disabled = paginaActual === 1;

    botonAnterior.addEventListener("click", () => {
      if (paginaActual > 1) {
        paginaActual--;
        actualizarTabla();
      }
    });

    const indicadorPagina = document.createElement("span");
    indicadorPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;

    const botonSiguiente = document.createElement("button");
    botonSiguiente.textContent = "Siguiente";
    botonSiguiente.disabled = paginaActual === totalPaginas;

    botonSiguiente.addEventListener("click", () => {
      if (paginaActual < totalPaginas) {
        paginaActual++;
        actualizarTabla();
      }
    });

    controlesPaginacion.append(botonAnterior, indicadorPagina, botonSiguiente);
  }

  // Activar los filtros
  [filtroCliente, filtroNumero, filtroFecha, filtroEstado].forEach((filtro) => {
    filtro.addEventListener("input", actualizarTabla);
  });

  actualizarTabla();

  // Mostrar tabla y controles de paginación
  lista.appendChild(tabla);
  lista.appendChild(controlesPaginacion);
}

// Iniciar el módulo
mostrarTrabajosRealizados();
