const API_CLIENTES = "http://localhost:3000/customers";
const API_PRODUCTOS = "http://localhost:3000/products";

/* =========================
   CLIENTES
========================= */
const formCliente = document.getElementById("formCliente");
const tablaClientes = document.getElementById("tablaClientes");
const mensajeCliente = document.getElementById("mensajeCliente");
const btnGuardarCliente = document.getElementById("btnGuardarCliente");
const btnCancelarCliente = document.getElementById("btnCancelarCliente");

const inputCustNum = document.getElementById("cust_num");
const inputCompany = document.getElementById("company");
const inputCustRep = document.getElementById("cust_rep");
const inputCreditLimit = document.getElementById("credit_limit");

let editandoCliente = false;
let idClienteEditando = null;

async function cargarClientes() {
  try {
    const respuesta = await fetch(API_CLIENTES);
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
    mensajeCliente.textContent = "Error al cargar clientes";
  }
}

formCliente.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cliente = {
    cust_num: parseInt(inputCustNum.value),
    company: inputCompany.value,
    cust_rep: parseInt(inputCustRep.value),
    credit_limit: parseFloat(inputCreditLimit.value),
  };

  try {
    let respuesta;

    if (editandoCliente) {
      respuesta = await fetch(`${API_CLIENTES}/${idClienteEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: cliente.company,
          cust_rep: cliente.cust_rep,
          credit_limit: cliente.credit_limit,
        }),
      });
    } else {
      respuesta = await fetch(API_CLIENTES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });
    }

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mensajeCliente.textContent = data.error || "Error en clientes";
      return;
    }

    mensajeCliente.textContent = editandoCliente
      ? "Cliente actualizado correctamente"
      : "Cliente creado correctamente";

    resetFormularioCliente();
    cargarClientes();
  } catch (error) {
    console.error(error);
    mensajeCliente.textContent = "Error al guardar cliente";
  }
});

function editarCliente(cust_num, company, cust_rep, credit_limit) {
  editandoCliente = true;
  idClienteEditando = cust_num;

  inputCustNum.value = cust_num;
  inputCustNum.disabled = true;
  inputCompany.value = company;
  inputCustRep.value = cust_rep;
  inputCreditLimit.value = credit_limit;

  btnGuardarCliente.textContent = "Actualizar";
  btnCancelarCliente.style.display = "inline-block";
  mensajeCliente.textContent = `Editando cliente ${cust_num}`;
}

async function eliminarCliente(id) {
  const confirmar = confirm(`¿Deseas eliminar el cliente ${id}?`);
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_CLIENTES}/${id}`, {
      method: "DELETE",
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mensajeCliente.textContent = data.error || "Error al eliminar cliente";
      return;
    }

    mensajeCliente.textContent = "Cliente eliminado correctamente";

    if (editandoCliente && idClienteEditando === id) {
      resetFormularioCliente();
    }

    cargarClientes();
  } catch (error) {
    console.error(error);
    mensajeCliente.textContent = "Error al eliminar cliente";
  }
}

function resetFormularioCliente() {
  formCliente.reset();
  editandoCliente = false;
  idClienteEditando = null;
  inputCustNum.disabled = false;
  btnGuardarCliente.textContent = "Guardar";
  btnCancelarCliente.style.display = "none";
}

btnCancelarCliente.addEventListener("click", () => {
  resetFormularioCliente();
  mensajeCliente.textContent = "Edición de cliente cancelada";
});

/* =========================
   PRODUCTOS
========================= */
const formProducto = document.getElementById("formProducto");
const tablaProductos = document.getElementById("tablaProductos");
const mensajeProducto = document.getElementById("mensajeProducto");
const btnGuardarProducto = document.getElementById("btnGuardarProducto");
const btnCancelarProducto = document.getElementById("btnCancelarProducto");

const inputMfrId = document.getElementById("mfr_id");
const inputProductId = document.getElementById("product_id");
const inputDescription = document.getElementById("description");
const inputPrice = document.getElementById("price");
const inputQtyOnHand = document.getElementById("qty_on_hand");

let editandoProducto = false;
let mfrEditando = null;
let productEditando = null;

async function cargarProductos() {
  try {
    const respuesta = await fetch(API_PRODUCTOS);
    const productos = await respuesta.json();

    tablaProductos.innerHTML = "";

    productos.forEach((producto) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${producto.mfr_id}</td>
        <td>${producto.product_id}</td>
        <td>${producto.description}</td>
        <td>${producto.price}</td>
        <td>${producto.qty_on_hand}</td>
        <td>
          <button onclick="editarProducto('${producto.mfr_id}', '${producto.product_id}', '${producto.description.replace(/'/g, "\\'")}', ${producto.price}, ${producto.qty_on_hand})">Editar</button>
          <button onclick="eliminarProducto('${producto.mfr_id}', '${producto.product_id}')">Eliminar</button>
        </td>
      `;
      tablaProductos.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
    mensajeProducto.textContent = "Error al cargar productos";
  }
}

formProducto.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto = {
    mfr_id: inputMfrId.value,
    product_id: inputProductId.value,
    description: inputDescription.value,
    price: parseFloat(inputPrice.value),
    qty_on_hand: parseInt(inputQtyOnHand.value),
  };

  try {
    let respuesta;

    if (editandoProducto) {
      respuesta = await fetch(`${API_PRODUCTOS}/${mfrEditando}/${productEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: producto.description,
          price: producto.price,
          qty_on_hand: producto.qty_on_hand,
        }),
      });
    } else {
      respuesta = await fetch(API_PRODUCTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
    }

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mensajeProducto.textContent = data.error || "Error en productos";
      return;
    }

    mensajeProducto.textContent = editandoProducto
      ? "Producto actualizado correctamente"
      : "Producto creado correctamente";

    resetFormularioProducto();
    cargarProductos();
  } catch (error) {
    console.error(error);
    mensajeProducto.textContent = "Error al guardar producto";
  }
});

function editarProducto(mfr_id, product_id, description, price, qty_on_hand) {
  editandoProducto = true;
  mfrEditando = mfr_id;
  productEditando = product_id;

  inputMfrId.value = mfr_id;
  inputProductId.value = product_id;
  inputMfrId.disabled = true;
  inputProductId.disabled = true;
  inputDescription.value = description;
  inputPrice.value = price;
  inputQtyOnHand.value = qty_on_hand;

  btnGuardarProducto.textContent = "Actualizar";
  btnCancelarProducto.style.display = "inline-block";
  mensajeProducto.textContent = `Editando producto ${mfr_id}-${product_id}`;
}

async function eliminarProducto(mfr_id, product_id) {
  const confirmar = confirm(`¿Deseas eliminar el producto ${mfr_id}-${product_id}?`);
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_PRODUCTOS}/${mfr_id}/${product_id}`, {
      method: "DELETE",
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mensajeProducto.textContent = data.error || "Error al eliminar producto";
      return;
    }

    mensajeProducto.textContent = "Producto eliminado correctamente";

    if (editandoProducto && mfrEditando === mfr_id && productEditando === product_id) {
      resetFormularioProducto();
    }

    cargarProductos();
  } catch (error) {
    console.error(error);
    mensajeProducto.textContent = "Error al eliminar producto";
  }
}

function resetFormularioProducto() {
  formProducto.reset();
  editandoProducto = false;
  mfrEditando = null;
  productEditando = null;
  inputMfrId.disabled = false;
  inputProductId.disabled = false;
  btnGuardarProducto.textContent = "Guardar";
  btnCancelarProducto.style.display = "none";
}

btnCancelarProducto.addEventListener("click", () => {
  resetFormularioProducto();
  mensajeProducto.textContent = "Edición de producto cancelada";
});

cargarClientes();
cargarProductos();

async function cargarConsulta(url) {
  const encabezado = document.getElementById("encabezadoConsulta");
  const cuerpo = document.getElementById("cuerpoConsulta");
  const mensaje = document.getElementById("mensajeConsulta");

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    encabezado.innerHTML = "";
    cuerpo.innerHTML = "";

    if (!respuesta.ok) {
      mensaje.textContent = datos.error || "Error al cargar la consulta";
      return;
    }

    if (!datos || datos.length === 0) {
      mensaje.textContent = "La consulta no devolvió resultados";
      return;
    }

    mensaje.textContent = "Consulta cargada correctamente";

    // Crear encabezados dinámicamente
    const columnas = Object.keys(datos[0]);
    const filaEncabezado = document.createElement("tr");

    columnas.forEach((columna) => {
      const th = document.createElement("th");
      th.textContent = columna;
      filaEncabezado.appendChild(th);
    });

    encabezado.appendChild(filaEncabezado);

    // Crear filas dinámicamente
    datos.forEach((fila) => {
      const tr = document.createElement("tr");

      columnas.forEach((columna) => {
        const td = document.createElement("td");
        td.textContent = fila[columna];
        tr.appendChild(td);
      });

      cuerpo.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al cargar la consulta";
    encabezado.innerHTML = "";
    cuerpo.innerHTML = "";
  }
}
const API_REPORTE = "http://localhost:3000/reports/orders-by-customer";

const btnCargarReporte = document.getElementById("btnCargarReporte");
const tablaReporte = document.getElementById("tablaReporte");
const mensajeReporte = document.getElementById("mensajeReporte");

async function cargarReporteOrdenesPorCliente() {
  try {
    const respuesta = await fetch(API_REPORTE);
    const datos = await respuesta.json();

    tablaReporte.innerHTML = "";

    if (!respuesta.ok) {
      mensajeReporte.textContent = datos.error || "Error al cargar el reporte";
      return;
    }

    datos.forEach((fila) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${fila.company}</td>
        <td>${fila.total_orders}</td>
        <td>${fila.total_amount}</td>
      `;
      tablaReporte.appendChild(tr);
    });

    mensajeReporte.textContent = "Reporte cargado correctamente";
  } catch (error) {
    console.error(error);
    mensajeReporte.textContent = "Error al cargar el reporte";
  }
}

btnCargarReporte.addEventListener("click", cargarReporteOrdenesPorCliente);