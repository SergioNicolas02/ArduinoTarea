import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let datosSensor = {
  temperatura: 0,
  humedad: 0,
  fecha: new Date().toLocaleString(),
};

// 📥 Recibir datos del ESP32
app.post("/api/datos", (req, res) => {
  const { temperatura, humedad } = req.body;

  if (temperatura === undefined || humedad === undefined) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  datosSensor = { temperatura, humedad, fecha: new Date().toLocaleString() };
  console.log("📥 Datos recibidos:", datosSensor);
  res.json({ mensaje: "Datos guardados correctamente" });
});

// 📤 Consultar datos desde el dashboard o frontend
app.get("/api/datos", (req, res) => {
  res.json(datosSensor);
});

// 🌐 Mostrar datos directamente en el navegador
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Datos del Sensor</title>
        <meta http-equiv="refresh" content="5"> <!-- Se actualiza cada 5 segundos -->
        <style>
          body { font-family: Arial; text-align: center; margin-top: 40px; background-color: #f8f9fa; color: #333; }
          h1 { color: #007bff; }
          .card { display: inline-block; padding: 20px 40px; border: 1px solid #ccc; border-radius: 10px; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          p { font-size: 1.2em; margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>📊 Datos del Sensor</h1>
          <p><strong>🌡️ Temperatura:</strong> ${datosSensor.temperatura} °C</p>
          <p><strong>💧 Humedad:</strong> ${datosSensor.humedad} %</p>
          <p><strong>🕒 Fecha:</strong> ${datosSensor.fecha}</p>
        </div>
      </body>
    </html>
  `);
});

// ✅ Puerto dinámico (para Railway)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
