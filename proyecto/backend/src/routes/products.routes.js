const express = require("express");
const router = express.Router();

const {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/products.controller");

router.get("/", obtenerProductos);
router.post("/", crearProducto);
router.put("/:mfr_id/:product_id", actualizarProducto);
router.delete("/:mfr_id/:product_id", eliminarProducto);

module.exports = router;