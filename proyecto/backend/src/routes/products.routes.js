const express = require("express");
const router = express.Router();

const {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/products.controller");

const verificarToken = require("../middleware/auth.middleware");
const permitirRoles = require("../middleware/role.middleware");

router.get(
  "/",
  verificarToken,
  permitirRoles("admin_role", "inventory_role", "sales_role", "readonly_role", "report_role"),
  obtenerProductos
);

router.post(
  "/",
  verificarToken,
  permitirRoles("admin_role", "inventory_role"),
  crearProducto
);

router.put(
  "/:mfr_id/:product_id",
  verificarToken,
  permitirRoles("admin_role", "inventory_role"),
  actualizarProducto
);

router.delete(
  "/:mfr_id/:product_id",
  verificarToken,
  permitirRoles("admin_role"),
  eliminarProducto
);

module.exports = router;