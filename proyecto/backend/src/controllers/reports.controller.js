const pool = require("../db");

const reporteOrdenesPorCliente = async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM vw_orders_by_customer
      ORDER BY total_amount DESC;
    `;

    const resultado = await pool.query(sql);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar el reporte" });
  }
};

module.exports = {
  reporteOrdenesPorCliente,
};