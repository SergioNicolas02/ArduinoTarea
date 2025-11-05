// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // Para leer JSON

// Estado del sensor
let datosSensor = {
  temperatura: 0,
  humedad: 0,
  bombillo: 0,
  fecha: new Date().toLocaleString(),
};

// ---------- Ruta POST para recibir datos ----------
app.post("/api/datos", (req, res) => {
  const { datos } = req.body;

  if (!datos) {
    return res.status(400).json({ error: "No se recibieron datos" });
  }

  // Los datos vienen como "25.3,60,1"
  const partes = datos.split(",");
  if (partes.length !== 3) {
    return res.status(400).json({ error: "Formato de datos incorrecto" });
  }

  const [tempStr, humStr, bombStr] = partes;
  datosSensor = {
    temperatura: parseFloat(tempStr),
    humedad: parseFloat(humStr),
    bombillo: parseInt(bombStr),
    fecha: new Date().toLocaleString(),
  };

  console.log("📥 Datos recibidos:", datosSensor);
  res.json({ mensaje: "Datos guardados correctamente" });
});

// ---------- Ruta GET para ver datos en JSON ----------
app.get("/api/datos", (req, res) => {
  res.json(datosSensor);
});

// ---------- Página web para visualizar datos ----------
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Panel de Datos LoRa 🌡️</title>
        <meta http-equiv="refresh" content="5">
        <style>
          body { font-family: Arial; background: #f7f7f7; text-align: center; margin-top: 60px; color: #333; }
          h1 { color: #007bff; }
          .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: inline-block; }
          p { font-size: 1.2em; margin: 8px 0; }
          .on { color: green; font-weight: bold; }
          .off { color: red; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>📡 Datos del Sensor</h1>
          <p><b>🌡️ Temperatura:</b> ${datosSensor.temperatura.toFixed(2)} °C</p>
          <p><b>💧 Humedad:</b> ${datosSensor.humedad.toFixed(2)} %</p>
          <p><b>💡 Bombillo:</b> <span class="${datosSensor.bombillo ? 'on' : 'off'}">${datosSensor.bombillo ? 'Encendido' : 'Apagado'}</span></p>
          <p><b>🕒 Última actualización:</b> ${datosSensor.fecha}</p>
        </div>
      </body>
    </html>
  `);
});

// ---------- Puerto dinámico (Railway) o 8080 local ----------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
