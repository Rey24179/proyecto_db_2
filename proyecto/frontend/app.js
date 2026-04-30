const API = "http://localhost:3000/customers";

async function cargarClientes() {
  const respuesta = await fetch(API);
  const clientes = await respuesta.json();

  const tabla = document.getElementById("tablaClientes");
  tabla.innerHTML = "";

  clientes.forEach((cliente) => {
    tabla.innerHTML += `
      <tr>
        <td>${cliente.cust_num}</td>
        <td>${cliente.company}</td>
        <td>${cliente.cust_rep}</td>
        <td>${cliente.credit_limit}</td>
      </tr>
    `;
  });
}

document.getElementById("formCliente").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoCliente = {
    cust_num: parseInt(document.getElementById("cust_num").value),
    company: document.getElementById("company").value,
    cust_rep: parseInt(document.getElementById("cust_rep").value),
    credit_limit: parseFloat(document.getElementById("credit_limit").value),
  };

  const respuesta = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoCliente),
  });

  const mensaje = document.getElementById("mensaje");

  if (respuesta.ok) {
    mensaje.textContent = "Cliente agregado correctamente";
    document.getElementById("formCliente").reset();
    cargarClientes();
  } else {
    const error = await respuesta.json();
    mensaje.textContent = error.error || "Error al guardar cliente";
  }
});

cargarClientes();