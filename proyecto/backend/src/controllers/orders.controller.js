const pool = require("../db");

const obtenerOrdenes = async (req, res) => {
  try {
    const sql = `
      SELECT order_num, order_date, cust, rep, mfr, product, qty, amount
      FROM orders
      ORDER BY order_num;
    `;
    const resultado = await pool.query(sql);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};

const crearOrdenConTransaccion = async (req, res) => {
  try {
    const { order_num, order_date, cust, rep, mfr, product, qty } = req.body;

    if (!order_num || !order_date || !cust || !rep || !mfr || !product || !qty) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    const sql = `
      SELECT * FROM sp_create_order(
        $1, $2, $3, $4, $5, $6, $7
      );
    `;

    const valores = [order_num, order_date, cust, rep, mfr, product, qty];
    const resultado = await pool.query(sql, valores);

    res.status(201).json({
      mensaje: resultado.rows[0].p_message,
      amount: resultado.rows[0].p_amount,
    });
  } catch (error) {
    console.error("Error al crear orden con procedure:", error);
    res.status(500).json({
      error: error.message || "Error al registrar la orden",
    });
  }
};

module.exports = {
  obtenerOrdenes,
  crearOrdenConTransaccion,
};