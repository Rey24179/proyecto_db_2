const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role_name) {
        return res.status(403).json({
          error: "No se encontró el rol del usuario",
        });
      }

      const rolUsuario = req.user.role_name;

      if (!rolesPermitidos.includes(rolUsuario)) {
        return res.status(403).json({
          error: "Acceso denegado para este rol",
        });
      }

      next();
    } catch (error) {
      console.error("Error validando rol:", error);
      return res.status(500).json({
        error: "Error al validar rol",
      });
    }
  };
};

module.exports = permitirRoles;