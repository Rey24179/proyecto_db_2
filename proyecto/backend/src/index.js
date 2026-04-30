const express = require("express");
const cors = require("cors");
require("dotenv").config();

const customersRoutes = require("./routes/customers.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customers", customersRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});