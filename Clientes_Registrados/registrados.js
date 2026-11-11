const listaClientes = document.getElementById("listaClientes");
const buscarCliente = document.getElementById("buscarCliente");
const btnVolver = document.getElementById("btnVolver");

let clientes = JSON.parse(localStorage.getItem("clientesPUCOR")) || [];

// Asignar identificadores a clientes antiguos
let huboCambios = false;

clientes.forEach((cliente) => {
  if (!cliente.id) {
    cliente.id = Date.now().toString() + Math.random().toString(16).slice(2);
    huboCambios = true;
  }
});

if (huboCambios) {
  localStorage.setItem("clientesPUCOR", JSON.stringify(clientes));
}

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
    tarjeta.style.cursor = "pointer";

    const nombre = document.createElement("h4");
    nombre.textContent = cliente.nombre;

    const telefono = document.createElement("p");
    telefono.textContent = `Teléfono: ${cliente.telefono}`;

    const correo = document.createElement("p");
    correo.textContent = `Correo: ${cliente.correo || "No registrado"}`;

    const direccion = document.createElement("p");
    direccion.textContent = `Dirección: ${cliente.direccion}`;

    const indicacion = document.createElement("p");
    indicacion.textContent = "Ver ficha del cliente →";

    tarjeta.append(nombre, telefono, correo, direccion, indicacion);

    tarjeta.addEventListener("click", () => {
      window.location.href = `../Ficha_Cliente/ficha.html?id=${encodeURIComponent(cliente.id)}`;
    });

    listaClientes.appendChild(tarjeta);
  });
}

buscarCliente.addEventListener("input", mostrarClientes);

btnVolver.addEventListener("click", () => {
  window.location.href = "../clientes.html";
});

mostrarClientes();
