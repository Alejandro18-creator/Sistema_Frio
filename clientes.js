const formCliente = document.getElementById("formCliente");
const nombreCliente = document.getElementById("nombreCliente");
const telefonoCliente = document.getElementById("telefonoCliente");
const correoCliente = document.getElementById("correoCliente");
const direccionCliente = document.getElementById("direccionCliente");
const listaClientes = document.getElementById("listaClientes");
const buscarCliente = document.getElementById("buscarCliente");
const btnVolver = document.getElementById("btnVolver");

let clientes = JSON.parse(localStorage.getItem("clientesPUCOR")) || [];

function mostrarClientes() {
  listaClientes.innerHTML = "";

  const termino = buscarCliente.value.toLowerCase().trim();

  const clientesFiltrados = clientes.filter((cliente) => {
    return (
      cliente.nombre.toLowerCase().includes(termino) ||
      cliente.telefono.toLowerCase().includes(termino) ||
      cliente.direccion.toLowerCase().includes(termino)
    );
  });

  if (clientesFiltrados.length === 0) {
    listaClientes.textContent =
      clientes.length === 0
        ? "Todavía no hay clientes registrados."
        : "No se encontraron clientes.";
    return;
  }

  clientesFiltrados.forEach((cliente) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-cliente";

    const nombre = document.createElement("h4");
    nombre.textContent = cliente.nombre;

    const telefono = document.createElement("p");
    telefono.textContent = `Teléfono: ${cliente.telefono}`;

    const correo = document.createElement("p");
    correo.textContent = `Correo: ${cliente.correo || "No registrado"}`;

    const direccion = document.createElement("p");
    direccion.textContent = `Dirección: ${cliente.direccion}`;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.type = "button";

    btnEditar.addEventListener("click", () => {
      const nuevoNombre = prompt("Nombre del cliente:", cliente.nombre);

      if (nuevoNombre === null || nuevoNombre.trim() === "") return;

      const nuevoTelefono = prompt("Teléfono:", cliente.telefono);

      if (nuevoTelefono === null || nuevoTelefono.trim() === "") return;

      const nuevaDireccion = prompt("Dirección:", cliente.direccion);

      if (nuevaDireccion === null || nuevaDireccion.trim() === "") return;

      cliente.nombre = nuevoNombre.trim();
      cliente.telefono = nuevoTelefono.trim();
      cliente.direccion = nuevaDireccion.trim();

      localStorage.setItem("clientesPUCOR", JSON.stringify(clientes));

      mostrarClientes();
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.type = "button";

    btnEliminar.addEventListener("click", () => {
      const confirmar = confirm(
        `¿Estás seguro de eliminar a ${cliente.nombre}?`,
      );

      if (!confirmar) return;

      clientes = clientes.filter((c) => c !== cliente);

      localStorage.setItem("clientesPUCOR", JSON.stringify(clientes));

      mostrarClientes();
    });

    tarjeta.append(nombre, telefono, correo, direccion, btnEditar, btnEliminar);
    listaClientes.appendChild(tarjeta);
  });
}

formCliente.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nuevoCliente = {
    nombre: nombreCliente.value.trim(),
    telefono: telefonoCliente.value.trim(),
    correo: correoCliente.value.trim(),
    direccion: direccionCliente.value.trim(),
  };

  clientes.push(nuevoCliente);

  localStorage.setItem("clientesPUCOR", JSON.stringify(clientes));

  formCliente.reset();
  mostrarClientes();
});

buscarCliente.addEventListener("input", () => {
  mostrarClientes();
});

btnVolver.addEventListener("click", () => {
  window.location.href = "index.html";
});

mostrarClientes();
