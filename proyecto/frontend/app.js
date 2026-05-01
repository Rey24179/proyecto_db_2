const API = "http://localhost:3000/customers";

const form = document.getElementById("formCliente");
const tablaClientes = document.getElementById("tablaClientes");
const mensaje = document.getElementById("mensaje");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

const inputCustNum = document.getElementById("cust_num");
const inputCompany = document.getElementById("company");
const inputCustRep = document.getElementById("cust_rep");
const inputCreditLimit = document.getElementById("credit_limit");

let editando = false;
let idClienteEditando = null;

async function cargarClientes() {
  try {
    const respuesta = await fetch(API);
    const clientes = await respuesta.json();

    tablaClientes.innerHTML = "";

    clientes.forEach((cliente) => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${cliente.cust_num}</td>
        <td>${cliente.company}</td>
        <td>${cliente.cust_rep}</td>
        <td>${cliente.credit_limit}</td>
        <td>
          <button onclick="editarCliente(${cliente.cust_num}, '${cliente.company.replace(/'/g, "\\'")}', ${cliente.cust_rep}, ${cliente.credit_limit})">Editar</button>
          <button onclick="eliminarCliente(${cliente.cust_num})">Eliminar</button>
        </td>
      `;

      tablaClientes.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al cargar clientes";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cliente = {
    cust_num: parseInt(inputCustNum.value),
    company: inputCompany.value,
    cust_rep: parseInt(inputCustRep.value),
    credit_limit: parseFloat(inputCreditLimit.value),
  };

  try {
    let respuesta;

    if (editando) {
      respuesta = await fetch(`${API}/${idClienteEditando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: cliente.company,
          cust_rep: cliente.cust_rep,
          credit_limit: cliente.credit_limit,
        }),
      });
    } else {
      respuesta = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });
    }

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = data.error || "Ocurrió un error";
      return;
    }

    mensaje.textContent = editando
      ? "Cliente actualizado correctamente"
      : "Cliente creado correctamente";

    resetFormulario();
    cargarClientes();
  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al guardar cliente";
  }
});

function editarCliente(cust_num, company, cust_rep, credit_limit) {
  editando = true;
  idClienteEditando = cust_num;

  inputCustNum.value = cust_num;
  inputCustNum.disabled = true;
  inputCompany.value = company;
  inputCustRep.value = cust_rep;
  inputCreditLimit.value = credit_limit;

  btnGuardar.textContent = "Actualizar";
  btnCancelar.style.display = "inline-block";
  mensaje.textContent = `Editando cliente ${cust_num}`;
}

async function eliminarCliente(id) {
  const confirmar = confirm(`¿Deseas eliminar el cliente ${id}?`);
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = data.error || "Error al eliminar cliente";
      return;
    }

    mensaje.textContent = "Cliente eliminado correctamente";

    if (editando && idClienteEditando === id) {
      resetFormulario();
    }

    cargarClientes();
  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al eliminar cliente";
  }
}

function resetFormulario() {
  form.reset();
  editando = false;
  idClienteEditando = null;
  inputCustNum.disabled = false;
  btnGuardar.textContent = "Guardar";
  btnCancelar.style.display = "none";
}

btnCancelar.addEventListener("click", () => {
  resetFormulario();
  mensaje.textContent = "Edición cancelada";
});

cargarClientes();