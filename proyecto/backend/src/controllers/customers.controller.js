const Customer = require("../models/customer.model");

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Customer.findAll({
      order: [["cust_num", "ASC"]],
    });

    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

const crearCliente = async (req, res) => {
  try {
    const { cust_num, company, cust_rep, credit_limit } = req.body;

    if (!cust_num || !company || !cust_rep || credit_limit === undefined) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    const clienteExistente = await Customer.findByPk(cust_num);

    if (clienteExistente) {
      return res.status(400).json({
        error: "Ya existe un cliente con ese ID",
      });
    }

    const nuevoCliente = await Customer.create({
      cust_num,
      company,
      cust_rep,
      credit_limit,
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, cust_rep, credit_limit } = req.body;

    const cliente = await Customer.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    await cliente.update({
      company,
      cust_rep,
      credit_limit,
    });

    res.json(cliente);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Customer.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    await cliente.destroy();

    res.json({
      mensaje: "Cliente eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};

module.exports = {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};