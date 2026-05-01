const express = require("express");
const router = express.Router();

const {
  reporteOrdenesPorCliente,
} = require("../controllers/reports.controller");

router.get("/orders-by-customer", reporteOrdenesPorCliente);

module.exports = router;