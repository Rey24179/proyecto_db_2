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
    console.error(error);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};

const crearOrdenConTransaccion = async (req, res) => {
  const client = await pool.connect();

  try {
    const { order_num, order_date, cust, rep, mfr, product, qty } = req.body;

    if (!order_num || !order_date || !cust || !rep || !mfr || !product || !qty) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    await client.query("BEGIN");

    const cliente = await client.query(
      "SELECT cust_num FROM customers WHERE cust_num = $1",
      [cust]
    );

    if (cliente.rows.length === 0) {
      throw new Error("El cliente no existe");
    }

    const representante = await client.query(
      "SELECT empl_num FROM salesRep WHERE empl_num = $1",
      [rep]
    );

    if (representante.rows.length === 0) {
      throw new Error("El representante no existe");
    }

    const productoInfo = await client.query(
      `
      SELECT price, qty_on_hand
      FROM products
      WHERE mfr_id = $1 AND product_id = $2
      `,
      [mfr, product]
    );

    if (productoInfo.rows.length === 0) {
      throw new Error("El producto no existe");
    }

    const price = parseFloat(productoInfo.rows[0].price);
    const stockActual = parseInt(productoInfo.rows[0].qty_on_hand, 10);

    if (qty > stockActual) {
      throw new Error("Stock insuficiente para realizar la orden");
    }

    const amount = price * qty;

    await client.query(
      `
      INSERT INTO orders (order_num, order_date, cust, rep, mfr, product, qty, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [order_num, order_date, cust, rep, mfr, product, qty, amount]
    );

    await client.query(
      `
      UPDATE products
      SET qty_on_hand = qty_on_hand - $1
      WHERE mfr_id = $2 AND product_id = $3
      `,
      [qty, mfr, product]
    );

    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Orden creada correctamente y stock actualizado",
      amount,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en transacción:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "Ya existe una orden con ese número",
      });
    }

    res.status(500).json({
      error: error.message || "La transacción falló y se hizo ROLLBACK",
    });
  } finally {
    client.release();
  }
};

module.exports = {
  obtenerOrdenes,
  crearOrdenConTransaccion,
};