const express = require("express");
const router = express.Router();

const {
  reporteOrdenesPorCliente,
  exportarReporteCSV,
} = require("../controllers/reports.controller");

const verificarToken = require("../middleware/auth.middleware");
const permitirRoles = require("../middleware/role.middleware");

router.get(
  "/orders-by-customer",
  verificarToken,
  permitirRoles("admin_role", "report_role", "readonly_role"),
  reporteOrdenesPorCliente
);

router.get(
  "/orders-by-customer/csv",
  verificarToken,
  permitirRoles("admin_role", "report_role"),
  exportarReporteCSV
);

module.exports = router;