const express = require("express");
const router = express.Router();

const {
  joinClientes,
  joinRepresentantes,
  joinProductos,
  subqueryCredito,
  subqueryRepresentantes,
  consultaCTE,
} = require("../controllers/queries.controller");

const verificarToken = require("../middleware/auth.middleware");
const permitirRoles = require("../middleware/role.middleware");

router.get("/join-clientes", verificarToken, permitirRoles("admin_role", "report_role"), joinClientes);
router.get("/join-representantes", verificarToken, permitirRoles("admin_role", "report_role"), joinRepresentantes);
router.get("/join-productos", verificarToken, permitirRoles("admin_role", "report_role"), joinProductos);
router.get("/subquery-credito", verificarToken, permitirRoles("admin_role", "report_role"), subqueryCredito);
router.get("/subquery-representantes", verificarToken, permitirRoles("admin_role", "report_role"), subqueryRepresentantes);
router.get("/cte-clientes", verificarToken, permitirRoles("admin_role", "report_role"), consultaCTE);

module.exports = router;