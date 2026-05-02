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

router.get("/join-clientes", joinClientes);
router.get("/join-representantes", joinRepresentantes);
router.get("/join-productos", joinProductos);
router.get("/subquery-credito", subqueryCredito);
router.get("/subquery-representantes", subqueryRepresentantes);
router.get("/cte-clientes", consultaCTE);

module.exports = router;