const pool = require("../db");

const obtenerClientes = async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT cust_num, company, cust_rep, credit_limit FROM customers ORDER BY cust_num"
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

const crearCliente = async (req, res) => {
  try {
    const { cust_num, company, cust_rep, credit_limit } = req.body;

    if (!cust_num || !company || !cust_rep || !credit_limit) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      INSERT INTO customers (cust_num, company, cust_rep, credit_limit)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const valores = [cust_num, company, cust_rep, credit_limit];
    const resultado = await pool.query(sql, valores);

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, cust_rep, credit_limit } = req.body;

    const sql = `
      UPDATE customers
      SET company = $1,
          cust_rep = $2,
          credit_limit = $3
      WHERE cust_num = $4
      RETURNING *
    `;

    const valores = [company, cust_rep, credit_limit, id];
    const resultado = await pool.query(sql, valores);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      "DELETE FROM customers WHERE cust_num = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};

module.exports = {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};