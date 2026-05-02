const express = require("express");
const router = express.Router();

const {
  reporteOrdenesPorCliente,
  exportarReporteCSV,
} = require("../controllers/reports.controller");

router.get("/orders-by-customer", reporteOrdenesPorCliente);
router.get("/orders-by-customer/csv", exportarReporteCSV);

module.exports = router;