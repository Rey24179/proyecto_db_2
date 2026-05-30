const express = require("express");
const router = express.Router();

const {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} = require("../controllers/customers.controller");

const verificarToken = require("../middleware/auth.middleware");
const permitirRoles = require("../middleware/role.middleware");

router.get(
  "/",
  verificarToken,
  permitirRoles("admin_role", "sales_role", "readonly_role", "report_role"),
  obtenerClientes
);

router.post(
  "/",
  verificarToken,
  permitirRoles("admin_role", "sales_role"),
  crearCliente
);

router.put(
  "/:id",
  verificarToken,
  permitirRoles("admin_role", "sales_role"),
  actualizarCliente
);

router.delete(
  "/:id",
  verificarToken,
  permitirRoles("admin_role"),
  eliminarCliente
);

module.exports = router;