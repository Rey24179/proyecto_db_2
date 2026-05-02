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
    console.error("ERROR REPORTE:", error);
    res.status(500).json({ error: "Error al generar el reporte", detalle: error.message });
  }
};

const exportarReporteCSV = async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM vw_orders_by_customer
      ORDER BY total_amount DESC;
    `;

    const resultado = await pool.query(sql);
    const filas = resultado.rows;

    let csv = "company,total_orders,total_amount\n";

    filas.forEach((fila) => {
      csv += `${fila.company},${fila.total_orders},${fila.total_amount}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="reporte_ordenes_por_cliente.csv"'
    );

    res.status(200).send(csv);
  } catch (error) {
    console.error("ERROR CSV:", error);
    res.status(500).json({ error: "Error al exportar CSV", detalle: error.message });
  }
};

module.exports = {
  reporteOrdenesPorCliente,
  exportarReporteCSV,
};