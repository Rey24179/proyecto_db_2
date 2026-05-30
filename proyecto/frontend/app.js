const API_BASE = "http://localhost:3000";
const API_CLIENTES = `${API_BASE}/customers`;
const API_PRODUCTOS = `${API_BASE}/products`;
const API_REPORTE = `${API_BASE}/reports/orders-by-customer`;
const API_ORDERS = `${API_BASE}/orders/transaction`;
const API_LOGIN = `${API_BASE}/auth/login`;
const API_PROFILE = `${API_BASE}/auth/profile`;

/* HELPERS AUTH */
function obtenerToken() {
  return localStorage.getItem("token");
}

function obtenerHeadersAuth() {
  const token = obtenerToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function obtenerHeadersSoloAuth() {
  const token = obtenerToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

/* CLIENTES */
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
    const respuesta = await fetch(API_CLIENTES, {
      headers: obtenerHeadersSoloAuth(),
    });

    const clientes = await respuesta.json();
    tablaClientes.innerHTML = "";

    if (!respuesta.ok) {
      mensajeCliente.textContent = clientes.error || "Error al cargar clientes";
      return;
    }

    clientes.forEach((cliente) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${cliente.cust_num}</td>
        <td>${cliente.company}</td>
        <td>${cliente.cust_rep}</td>
        <td>${cliente.credit_limit}</td>
        <td>
          <button onclick="editarCliente(${cliente.cust_num}, '${cliente.company.replace(/'/g, "\\'")}', ${cliente.cust_rep}, ${cliente.credit_limit})">Editar</button>
          <button class="danger" onclick="eliminarCliente(${cliente.cust_num})">Eliminar</button>
        </td>
      `;
      tablaClientes.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
    mensajeCliente.textContent = "Error al cargar clientes";
  }
}

if (formCliente) {
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
          headers: obtenerHeadersAuth(),
          body: JSON.stringify({
            company: cliente.company,
            cust_rep: cliente.cust_rep,
            credit_limit: cliente.credit_limit,
          }),
        });
      } else {
        respuesta = await fetch(API_CLIENTES, {
          method: "POST",
          headers: obtenerHeadersAuth(),
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
}

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
      headers: obtenerHeadersSoloAuth(),
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

if (btnCancelarCliente) {
  btnCancelarCliente.addEventListener("click", () => {
    resetFormularioCliente();
    mensajeCliente.textContent = "Edición de cliente cancelada";
  });
}

/* PRODUCTOS */
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
    const respuesta = await fetch(API_PRODUCTOS, {
      headers: obtenerHeadersSoloAuth(),
    });

    const productos = await respuesta.json();
    tablaProductos.innerHTML = "";

    if (!respuesta.ok) {
      mensajeProducto.textContent = productos.error || "Error al cargar productos";
      return;
    }

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
          <button class="danger" onclick="eliminarProducto('${producto.mfr_id}', '${producto.product_id}')">Eliminar</button>
        </td>
      `;
      tablaProductos.appendChild(fila);
    });
  } catch (error) {
    console.error(error);
    mensajeProducto.textContent = "Error al cargar productos";
  }
}

if (formProducto) {
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
          headers: obtenerHeadersAuth(),
          body: JSON.stringify({
            description: producto.description,
            price: producto.price,
            qty_on_hand: producto.qty_on_hand,
          }),
        });
      } else {
        respuesta = await fetch(API_PRODUCTOS, {
          method: "POST",
          headers: obtenerHeadersAuth(),
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
}

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
      headers: obtenerHeadersSoloAuth(),
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

if (btnCancelarProducto) {
  btnCancelarProducto.addEventListener("click", () => {
    resetFormularioProducto();
    mensajeProducto.textContent = "Edición de producto cancelada";
  });
}

/* REPORTE */
const btnCargarReporte = document.getElementById("btnCargarReporte");
const btnExportarCSV = document.getElementById("btnExportarCSV");
const tablaReporte = document.getElementById("tablaReporte");
const mensajeReporte = document.getElementById("mensajeReporte");

async function cargarReporteOrdenesPorCliente() {
  try {
    const respuesta = await fetch(API_REPORTE, {
      headers: obtenerHeadersSoloAuth(),
    });

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

if (btnCargarReporte) {
  btnCargarReporte.addEventListener("click", cargarReporteOrdenesPorCliente);
}

if (btnExportarCSV) {
  btnExportarCSV.addEventListener("click", async () => {
    try {
      const respuesta = await fetch(`${API_REPORTE}/csv`, {
        headers: obtenerHeadersSoloAuth(),
      });

      if (!respuesta.ok) {
        const data = await respuesta.json();
        mensajeReporte.textContent = data.error || "Error al exportar CSV";
        return;
      }

      const blob = await respuesta.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_ordenes_por_cliente.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      mensajeReporte.textContent = "Error al exportar CSV";
    }
  });
}

/* CONSULTAS */
const formConsulta = document.getElementById("formConsulta");
const inputComandoConsulta = document.getElementById("comandoConsulta");

function obtenerUrlConsulta(comando) {
  const texto = comando.trim().toLowerCase();

  const mapaConsultas = {
    "join clientes": `${API_BASE}/queries/join-clientes`,
    "join representantes": `${API_BASE}/queries/join-representantes`,
    "join productos": `${API_BASE}/queries/join-productos`,
    "subquery credito": `${API_BASE}/queries/subquery-credito`,
    "subquery representantes": `${API_BASE}/queries/subquery-representantes`,
    "cte clientes": `${API_BASE}/queries/cte-clientes`,
  };

  return mapaConsultas[texto] || null;
}

async function cargarConsulta(url) {
  const encabezado = document.getElementById("encabezadoConsulta");
  const cuerpo = document.getElementById("cuerpoConsulta");
  const mensaje = document.getElementById("mensajeConsulta");

  try {
    const respuesta = await fetch(url, {
      headers: obtenerHeadersSoloAuth(),
    });

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

    const columnas = Object.keys(datos[0]);
    const filaEncabezado = document.createElement("tr");

    columnas.forEach((columna) => {
      const th = document.createElement("th");
      th.textContent = columna;
      filaEncabezado.appendChild(th);
    });

    encabezado.appendChild(filaEncabezado);

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
    if (mensaje) mensaje.textContent = "Error al cargar la consulta";
  }
}

if (formConsulta) {
  formConsulta.addEventListener("submit", async (e) => {
    e.preventDefault();

    const comando = inputComandoConsulta.value;
    const url = obtenerUrlConsulta(comando);
    const mensaje = document.getElementById("mensajeConsulta");
    const encabezado = document.getElementById("encabezadoConsulta");
    const cuerpo = document.getElementById("cuerpoConsulta");

    if (!url) {
      mensaje.textContent = "Comando no reconocido";
      encabezado.innerHTML = "";
      cuerpo.innerHTML = "";
      return;
    }

    await cargarConsulta(url);
  });
}

/* ORDENES */
const formOrden = document.getElementById("formOrden");
const mensajeOrden = document.getElementById("mensajeOrden");

if (formOrden) {
  formOrden.addEventListener("submit", async (e) => {
    e.preventDefault();

    mensajeOrden.textContent = "Intentando registrar orden...";

    const nuevaOrden = {
      order_num: parseInt(document.getElementById("order_num").value),
      order_date: document.getElementById("order_date").value,
      cust: parseInt(document.getElementById("order_cust").value),
      rep: parseInt(document.getElementById("order_rep").value),
      mfr: document.getElementById("order_mfr").value,
      product: document.getElementById("order_product").value,
      qty: parseInt(document.getElementById("order_qty").value),
    };

    try {
      const respuesta = await fetch(API_ORDERS, {
        method: "POST",
        headers: obtenerHeadersAuth(),
        body: JSON.stringify(nuevaOrden),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        mensajeOrden.textContent = data.detalle || data.error || "Error al registrar la orden";
        return;
      }

      mensajeOrden.textContent = `${data.mensaje}. Monto: ${data.amount}`;
      formOrden.reset();
      cargarProductos();
    } catch (error) {
      console.error(error);
      mensajeOrden.textContent = "Error al registrar la orden";
    }
  });
}

/* NAVEGACION */
function mostrarSeccion(idSeccion, boton) {
  const secciones = document.querySelectorAll(".app-section");
  const botones = document.querySelectorAll(".nav-btn");

  secciones.forEach((seccion) => {
    seccion.classList.add("hidden");
  });

  botones.forEach((btn) => {
    btn.classList.remove("active");
  });

  const seccionActiva = document.getElementById(idSeccion);
  if (seccionActiva) {
    seccionActiva.classList.remove("hidden");
  }

  if (boton) {
    boton.classList.add("active");
  }
}

function activarDesdeTarjeta(idSeccion) {
  const boton = Array.from(document.querySelectorAll(".nav-btn")).find(
    (btn) => btn.getAttribute("onclick")?.includes(`'${idSeccion}'`)
  );

  mostrarSeccion(idSeccion, boton);
}

/* LOGIN / LOGOUT */
const formLogin = document.getElementById("formLogin");
const btnLogout = document.getElementById("btnLogout");
const mensajeLogin = document.getElementById("mensajeLogin");
const estadoSesion = document.getElementById("estadoSesion");
const sistemaApp = document.getElementById("sistemaApp");

function mostrarSistema() {
  if (sistemaApp) sistemaApp.style.display = "block";
}

function ocultarSistema() {
  if (sistemaApp) sistemaApp.style.display = "none";
}

function ocultarBotonesAccion(selectorTabla) {
  const tabla = document.querySelector(selectorTabla);
  if (!tabla) return;
  const botones = tabla.querySelectorAll("button");
  botones.forEach((btn) => {
    btn.style.display = "none";
  });
}

function aplicarPermisosFrontend(roleName) {
  const navClientes = document.querySelector('button[onclick*="clientes"]');
  const navProductos = document.querySelector('button[onclick*="productos"]');
  const navReportes = document.querySelector('button[onclick*="reportes"]');
  const navConsultas = document.querySelector('button[onclick*="consultas"]');
  const navOrdenes = document.querySelector('button[onclick*="ordenes"]');

  const seccionClientes = document.getElementById("clientes");
  const seccionProductos = document.getElementById("productos");
  const seccionReportes = document.getElementById("reportes");
  const seccionConsultas = document.getElementById("consultas");
  const seccionOrdenes = document.getElementById("ordenes");

  const formClienteEl = document.getElementById("formCliente");
  const formProductoEl = document.getElementById("formProducto");
  const formOrdenEl = document.getElementById("formOrden");
  const btnExportarCSVEl = document.getElementById("btnExportarCSV");

  const ocultar = (elemento) => {
    if (elemento) elemento.style.display = "none";
  };

  const mostrar = (elemento, tipo = "block") => {
    if (elemento) elemento.style.display = tipo;
  };

  [navClientes, navProductos, navReportes, navConsultas, navOrdenes].forEach((el) => mostrar(el, "inline-block"));
  [seccionClientes, seccionProductos, seccionReportes, seccionConsultas, seccionOrdenes].forEach((el) => mostrar(el, "block"));
  mostrar(formClienteEl, "flex");
  mostrar(formProductoEl, "flex");
  mostrar(formOrdenEl, "flex");
  mostrar(btnExportarCSVEl, "inline-block");

  if (roleName === "admin_role") return;

  if (roleName === "sales_role") {
    ocultar(navReportes);
    ocultar(navConsultas);
    ocultar(seccionReportes);
    ocultar(seccionConsultas);
    ocultar(formProductoEl);
    ocultarBotonesAccion("#tablaProductos");
    return;
  }

  if (roleName === "inventory_role") {
    ocultar(navClientes);
    ocultar(navReportes);
    ocultar(navConsultas);
    ocultar(navOrdenes);
    ocultar(seccionClientes);
    ocultar(seccionReportes);
    ocultar(seccionConsultas);
    ocultar(seccionOrdenes);
    return;
  }

  if (roleName === "report_role") {
    ocultar(navClientes);
    ocultar(navProductos);
    ocultar(navOrdenes);
    ocultar(seccionClientes);
    ocultar(seccionProductos);
    ocultar(seccionOrdenes);
    return;
  }

  if (roleName === "readonly_role") {
    ocultar(formClienteEl);
    ocultar(formProductoEl);
    ocultar(formOrdenEl);
    ocultar(btnExportarCSVEl);
    ocultar(navConsultas);
    ocultar(seccionConsultas);
    ocultarBotonesAccion("#tablaClientes");
    ocultarBotonesAccion("#tablaProductos");
  }
}

async function verificarSesion() {
  const token = obtenerToken();

  if (!token) {
    if (estadoSesion) estadoSesion.textContent = "No has iniciado sesión";
    ocultarSistema();
    return;
  }

  try {
    const respuesta = await fetch(API_PROFILE, {
      headers: obtenerHeadersSoloAuth(),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      if (estadoSesion) estadoSesion.textContent = "Sesión inválida o expirada";
      localStorage.removeItem("token");
      ocultarSistema();
      return;
    }

    if (estadoSesion) {
      estadoSesion.textContent = `Sesión activa: ${data.user.username} (${data.user.role_name})`;
    }

    mostrarSistema();
    aplicarPermisosFrontend(data.user.role_name);
  } catch (error) {
    console.error(error);
    if (estadoSesion) estadoSesion.textContent = "Error al verificar sesión";
    ocultarSistema();
  }
}

if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("login_username").value;
    const password = document.getElementById("login_password").value;

    try {
      const respuesta = await fetch(API_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        if (mensajeLogin) mensajeLogin.textContent = data.error || "Error al iniciar sesión";
        return;
      }

      localStorage.setItem("token", data.token);
      if (mensajeLogin) mensajeLogin.textContent = "Inicio de sesión exitoso";
      formLogin.reset();
      mostrarSistema();
      cargarClientes();
      cargarProductos();
      verificarSesion();
    } catch (error) {
      console.error(error);
      if (mensajeLogin) mensajeLogin.textContent = "Error al iniciar sesión";
    }
  });
}

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    if (mensajeLogin) mensajeLogin.textContent = "Sesión cerrada correctamente";
    if (estadoSesion) estadoSesion.textContent = "No has iniciado sesión";
    ocultarSistema();
  });
}

verificarSesion();