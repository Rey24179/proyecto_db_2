const jwt = require("jsonwebtoken");
require("dotenv").config();

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token no proporcionado",
      });
    }

    const partes = authHeader.split(" ");
    const token = partes[1];

    if (!token) {
      return res.status(401).json({
        error: "Formato de token inválido",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(401).json({
      error: "Token inválido o expirado",
    });
  }
};

module.exports = verificarToken;