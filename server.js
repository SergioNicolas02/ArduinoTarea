// ----------------------------------------------------------
// server.js - Servidor REST para Dashboard de sensores LoRa
// ----------------------------------------------------------

import express from "express";
import cors from "cors";

const app = express();


// ----------------------------------------------------------
// Middlewares
// ----------------------------------------------------------
app.use(cors());
app.use(express.json());


// ----------------------------------------------------------
// Estado global del sensor
// ----------------------------------------------------------
let estadoSensor = {
  temperatura: 0,
  humedad: 0,
  bombillo: 0,
  fecha: new Date().toLocaleString(),
};


// ----------------------------------------------------------
// POST - Recepción de datos del sensor
// ----------------------------------------------------------
app.post("/api/datos", (req, res) => {
  const paquete = req.body?.datos;

  if (!paquete) {
    return res.status(400).json({ error: "No se envió ningún dato" });
  }

  const valores = paquete.split(",");

  if (valores.length !== 3) {
    return res
      .status(400)
      .json({ error: "El formato debe ser 'temp,hum,bombillo'" });
  }

  const [t, h, b] = valores;

  estadoSensor = {
    temperatura: parseFloat(t),
    humedad: parseFloat(h),
    bombillo: parseInt(b),
    fecha: new Date().toLocaleString(),
  };

  console.log("📦 Nuevo paquete recibido:", estadoSensor);
  return res.json({ message: "Datos actualizados exitosamente" });
});


// ----------------------------------------------------------
// GET - Datos actuales del sensor
// ----------------------------------------------------------
app.get("/api/datos", (_, res) => {
  res.json(estadoSensor);
});


// ----------------------------------------------------------
// GET - Dashboard visual
// ----------------------------------------------------------
app.get("/", (req, res) => {
  const { temperatura, humedad, bombillo, fecha } = estadoSensor;

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Panel LoRa</title>
      <meta http-equiv="refresh" content="5" />
      <style>
        body {
          margin: 0;
          font-family: "Segoe UI", sans-serif;
          background: linear-gradient(135deg, #141E30, #243B55);
          color: #f1f1f1;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .container {
          background: rgba(255,255,255,0.08);
          padding: 40px 30px;
          border-radius: 20px;
          width: 380px;
          backdrop-filter: blur(10px);
          box-shadow: 0px 0px 30px rgba(0,0,0,0.4);
          text-align: center;
        }

        h1 {
          margin: 0 0 25px;
          font-size: 26px;
          letter-spacing: 1px;
          color: #00eaff;
        }

        .item {
          margin: 15px 0;
          padding: 15px;
          border-radius: 12px;
          background: rgba(255,255,255,0.12);
          font-size: 1.2em;
          transition: transform 0.2s;
        }

        .item:hover {
          transform: scale(1.03);
        }

        .estado-on {
          color: #00ff9d;
          font-weight: bold;
        }

        .estado-off {
          color: #ff5e5e;
          font-weight: bold;
        }

        .footer {
          margin-top: 20px;
          font-size: 0.85em;
          opacity: 0.8;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <h1>Panel de Sensor LoRa</h1>

        <div class="item">🌡️ Temperatura: <b>${temperatura.toFixed(1)} °C</b></div>
        <div class="item">💧 Humedad: <b>${humedad.toFixed(1)} %</b></div>

        <div class="item">
          💡 Bombillo:
          <span class="${bombillo ? "estado-on" : "estado-off"}">
            ${bombillo ? "Encendido" : "Apagado"}
          </span>
        </div>

        <div class="footer">Última actualización:<br>${fecha}</div>
      </div>
    </body>
    </html>
  `);
});


// ----------------------------------------------------------
// Servidor activo
// ----------------------------------------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
