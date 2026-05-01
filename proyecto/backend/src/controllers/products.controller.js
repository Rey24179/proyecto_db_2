const pool = require("../db");

const obtenerProductos = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT mfr_id, product_id, description, price, qty_on_hand
      FROM products
      ORDER BY mfr_id, product_id
    `);
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { mfr_id, product_id, description, price, qty_on_hand } = req.body;

    if (!mfr_id || !product_id || !description || price === undefined || qty_on_hand === undefined) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      INSERT INTO products (mfr_id, product_id, description, price, qty_on_hand)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const valores = [mfr_id, product_id, description, price, qty_on_hand];
    const resultado = await pool.query(sql, valores);

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { mfr_id, product_id } = req.params;
    const { description, price, qty_on_hand } = req.body;

    const sql = `
      UPDATE products
      SET description = $1,
          price = $2,
          qty_on_hand = $3
      WHERE mfr_id = $4 AND product_id = $5
      RETURNING *
    `;

    const valores = [description, price, qty_on_hand, mfr_id, product_id];
    const resultado = await pool.query(sql, valores);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { mfr_id, product_id } = req.params;

    const resultado = await pool.query(
      `DELETE FROM products
       WHERE mfr_id = $1 AND product_id = $2
       RETURNING *`,
      [mfr_id, product_id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

module.exports = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};