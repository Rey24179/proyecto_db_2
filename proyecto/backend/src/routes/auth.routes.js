const express = require("express");
const router = express.Router();

const {
  obtenerOrdenes,
  crearOrdenConTransaccion,
} = require("../controllers/orders.controller");

const verificarToken = require("../middleware/auth.middleware");
const permitirRoles = require("../middleware/role.middleware");

router.get(
  "/",
  verificarToken,
  permitirRoles("admin_role", "sales_role", "readonly_role", "report_role"),
  obtenerOrdenes
);

router.post(
  "/transaction",
  verificarToken,
  permitirRoles("admin_role", "sales_role"),
  crearOrdenConTransaccion
);

module.exports = router;