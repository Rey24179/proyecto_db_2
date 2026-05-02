const express = require("express");
const router = express.Router();

const {
  obtenerOrdenes,
  crearOrdenConTransaccion,
} = require("../controllers/orders.controller");

router.get("/", obtenerOrdenes);
router.post("/transaction", crearOrdenConTransaccion);

module.exports = router;