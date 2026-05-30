const pool = require("../db");

const reporteOrdenesPorCliente = async (req, res) => {
  try {
    const sql = `SELECT * FROM sp_get_sales_report();`;
    const resultado = await pool.query(sql);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al generar reporte:", error);
    res.status(500).json({ error: "Error al generar el reporte" });
  }
};

const exportarReporteCSV = async (req, res) => {
  try {
    const sql = `SELECT * FROM sp_get_sales_report();`;
    const resultado = await pool.query(sql);

    const encabezados = "company,total_orders,total_amount\n";
    const filas = resultado.rows
      .map((fila) => `${fila.company},${fila.total_orders},${fila.total_amount}`)
      .join("\n");

    const csv = encabezados + filas;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_ordenes_por_cliente.csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error al exportar CSV:", error);
    res.status(500).json({ error: "Error al exportar CSV" });
  }
};

module.exports = {
  reporteOrdenesPorCliente,
  exportarReporteCSV,
};