const pool = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }

    const resultado = await pool.query(
      "SELECT id, username, password, role_name FROM users WHERE username = $1",
      [username]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = resultado.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role_name: user.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      user: {
        id: user.id,
        username: user.username,
        role_name: user.role_name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

const profile = async (req, res) => {
  try {
    res.json({
      mensaje: "Perfil obtenido correctamente",
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

module.exports = {
  login,
  profile,
};