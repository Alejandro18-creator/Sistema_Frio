const formCliente = document.getElementById("formCliente");
const nombreCliente = document.getElementById("nombreCliente");
const telefonoCliente = document.getElementById("telefonoCliente");
const direccionCliente = document.getElementById("direccionCliente");
const listaClientes = document.getElementById("listaClientes");
const btnVolver = document.getElementById("btnVolver");

let clientes = JSON.parse(localStorage.getItem("clientesPUCOR")) || [];

function mostrarClientes() {
  listaClientes.innerHTML = "";

  if (clientes.length === 0) {
    listaClientes.textContent = "Todavía no hay clientes registrados.";
    return;
  }

  clientes.forEach((cliente) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-cliente";

    const nombre = document.createElement("h4");
    nombre.textContent = cliente.nombre;

    const telefono = document.createElement("p");
    telefono.textContent = `Teléfono: ${cliente.telefono}`;

    const direccion = document.createElement("p");
    direccion.textContent = `Dirección: ${cliente.direccion}`;

    tarjeta.append(nombre, telefono, direccion);
    listaClientes.appendChild(tarjeta);
  });
}

formCliente.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nuevoCliente = {
    nombre: nombreCliente.value.trim(),
    telefono: telefonoCliente.value.trim(),
    direccion: direccionCliente.value.trim(),
  };

  clientes.push(nuevoCliente);

  localStorage.setItem("clientesPUCOR", JSON.stringify(clientes));

  formCliente.reset();
  mostrarClientes();
});

btnVolver.addEventListener("click", () => {
  window.location.href = "index.html";
});

mostrarClientes();
