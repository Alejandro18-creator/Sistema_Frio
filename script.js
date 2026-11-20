const btnCalendario = document.getElementById("btnCalendario");
const btnClientes = document.getElementById("btnClientes");
const btnTrabajos = document.getElementById("btnTrabajos");

const pantallaInicio = document.querySelector("main.contenedor");
const pantallaCalendario = document.getElementById("pantallaCalendario");
const btnVolver = document.getElementById("btnVolver");

const mesActual = document.getElementById("mesActual");
const diasCalendario = document.getElementById("diasCalendario");
const mesAnterior = document.getElementById("mesAnterior");
const mesSiguiente = document.getElementById("mesSiguiente");
const horariosDisponibles = document.getElementById("horariosDisponibles");
const disponibilidad = document.getElementById("disponibilidad");

let horaElegida = "";
const horasElegidas = {};

const fechaSeleccionada = document.getElementById("fechaSeleccionada");
const resumenCita = document.getElementById("resumenCita");

const hoy = new Date();
const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

let fechaVista = new Date(manana.getFullYear(), manana.getMonth(), 1);
let fechaElegida = null;

function formatoFecha(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function mostrarFecha(fecha) {
  return fecha.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderizarCalendario() {
  const anio = fechaVista.getFullYear();
  const mes = fechaVista.getMonth();

  mesActual.textContent = fechaVista.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });

  mesActual.textContent =
    mesActual.textContent.charAt(0).toUpperCase() +
    mesActual.textContent.slice(1);

  diasCalendario.innerHTML = "";

  if (fechaElegida) {
    const fechaClave = formatoFecha(fechaElegida);
    const horasDelDia = horasElegidas[fechaClave] || [];

    horaElegida = horasDelDia[horasDelDia.length - 1] || "";

    document.querySelectorAll(".hora-boton").forEach((boton) => {
      boton.classList.toggle(
        "hora-seleccionada",
        horasDelDia.includes(boton.dataset.hora),
      );
    });

    if (horasDelDia.length > 0) {
      disponibilidad.textContent = `Horas seleccionadas: ${horasDelDia.join(", ")}`;
    } else {
      disponibilidad.textContent = "Selecciona una hora para esta fecha.";
    }

    actualizarResumen();
  }

  const primerDia = new Date(anio, mes, 1).getDay();
  const cantidadDias = new Date(anio, mes + 1, 0).getDate();

  for (let i = 0; i < primerDia; i++) {
    const espacio = document.createElement("span");
    espacio.className = "dia-vacio";
    diasCalendario.appendChild(espacio);
  }

  for (let numeroDia = 1; numeroDia <= cantidadDias; numeroDia++) {
    const fecha = new Date(anio, mes, numeroDia);
    const botonDia = document.createElement("button");

    botonDia.type = "button";
    botonDia.className = "dia-calendario";
    if (horasElegidas[formatoFecha(fecha)]) {
      botonDia.classList.add("dia-con-hora");
    }
    botonDia.textContent = numeroDia;

    if (fecha < manana) {
      botonDia.disabled = true;
      botonDia.classList.add("dia-pasado");
    }

    if (fechaElegida && formatoFecha(fecha) === formatoFecha(fechaElegida)) {
      botonDia.classList.add("dia-seleccionado");
    }

    botonDia.addEventListener("click", () => {
      fechaElegida = fecha;
      fechaSeleccionada.textContent = mostrarFecha(fecha);
      actualizarResumen();
      renderizarCalendario();
    });

    diasCalendario.appendChild(botonDia);
  }
}

function actualizarResumen() {
  if (!fechaElegida) {
    resumenCita.textContent = "Selecciona un día para comenzar.";
    return;
  }

  const fecha = mostrarFecha(fechaElegida);
  const fechaClave = formatoFecha(fechaElegida);
  const horasDelDia = horasElegidas[fechaClave] || [];

  if (horasDelDia.length > 0) {
    resumenCita.textContent = `Día seleccionado: ${fecha}. Horas seleccionadas: ${horasDelDia.join(", ")}.`;
  } else {
    resumenCita.textContent = `Día seleccionado: ${fecha}. Ahora elige una hora.`;
  }
}

btnCalendario.addEventListener("click", () => {
  pantallaInicio.hidden = true;
  pantallaCalendario.hidden = false;
  renderizarCalendario();
});

btnVolver.addEventListener("click", () => {
  pantallaCalendario.hidden = true;
  pantallaInicio.hidden = false;
});

mesAnterior.addEventListener("click", () => {
  fechaVista.setMonth(fechaVista.getMonth() - 1);
  renderizarCalendario();
});

mesSiguiente.addEventListener("click", () => {
  fechaVista.setMonth(fechaVista.getMonth() + 1);
  renderizarCalendario();
});

horariosDisponibles.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".hora-boton");

  if (!boton || !fechaElegida) {
    if (!fechaElegida) {
      alert("Primero selecciona una fecha en el calendario.");
    }
    return;
  }

  const fechaClave = formatoFecha(fechaElegida);

  if (!horasElegidas[fechaClave]) {
    horasElegidas[fechaClave] = [];
  }

  horaElegida = boton.dataset.hora;

  if (horasElegidas[fechaClave].includes(horaElegida)) {
    alert("Esta hora ya fue seleccionada para esta fecha.");
    return;
  }

  horasElegidas[fechaClave].push(horaElegida);

  document.querySelectorAll(".hora-boton").forEach((hora) => {
    hora.classList.toggle(
      "hora-seleccionada",
      horasElegidas[fechaClave].includes(hora.dataset.hora),
    );
  });

  boton.classList.add("hora-seleccionada");

  disponibilidad.textContent = `Hora seleccionada: ${horaElegida}`;

  actualizarResumen();
  renderizarCalendario();
});

btnTrabajos.addEventListener("click", () => {
  window.location.href = "Costo_Utilidades/trabajos.html";
});

renderizarCalendario();
