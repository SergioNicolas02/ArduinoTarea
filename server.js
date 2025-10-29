// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let datosSensor = { temperatura: 0, humedad: 0, fecha: new Date().toLocaleString() };

// Recibir datos del ESP32 receptor
app.post("/api/datos", (req, res) => {
  const { temperatura, humedad } = req.body;

  if (temperatura === undefined || humedad === undefined) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  datosSensor = { temperatura, humedad, fecha: new Date().toLocaleString() };
  console.log("📥 Datos recibidos:", datosSensor);
  res.json({ mensaje: "Datos guardados correctamente" });
});

// Consultar datos (para el dashboard)
app.get("/api/datos", (req, res) => {
  res.json(datosSensor);
});

// Puerto dinámico (para Railway) o 3000 local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
export default app;