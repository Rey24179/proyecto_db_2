const pool = require("../db");

const reporteOrdenesPorCliente = async (req, res) => {
  try {
    const sql = `
      SELECT 
          c.company,
          COUNT(o.order_num) AS total_orders,
          COALESCE(SUM(o.amount), 0) AS total_amount
      FROM customers c
      LEFT JOIN orders o ON c.cust_num = o.cust
      GROUP BY c.company
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