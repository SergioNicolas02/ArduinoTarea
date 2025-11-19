// server.js
import express from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ----------------------
// Estado inicial del sensor
// ----------------------
let estadoSensor = {
  temperatura: 0,
  humedad: 0,
  bombillo: 0,
  fecha: new Date().toLocaleString(),
};

// ----------------------
// POST -> Guardar data
// ----------------------
app.post("/api/datos", (req, res) => {
  const paquete = req.body?.datos;

  if (!paquete) {
    return res.status(400).json({ error: "No se envió ningún dato" });
  }

  const valores = paquete.split(",");

  if (valores.length !== 3) {
    return res.status(400).json({ error: "El formato debe ser 'temp,hum,bombillo'" });
  }

  const [t, h, b] = valores;

  estadoSensor = {
    temperatura: parseFloat(t),
    humedad: parseFloat(h),
    bombillo: parseInt(b),
    fecha: new Date().toLocaleString(),
  };

  console.log("📩 Nuevo paquete recibido:", estadoSensor);
  return res.json({ message: "Datos actualizados exitosamente" });
});

// ----------------------
// GET -> Consultar data JSON
// ----------------------
app.get("/api/datos", (_, res) => {
  res.json(estadoSensor);
});

// ----------------------
// Página visual
// ----------------------
app.get("/", (req, res) => {
  const { temperatura, humedad, bombillo, fecha } = estadoSensor;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dashboard LoRa</title>
      <meta http-equiv="refresh" content="5" />
      <style>
        body {
          margin: 0;
          background: #1e1e1e;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #fff;
        }
        .panel {
          background: #282828;
          padding: 30px;
          border-radius: 12px;
          width: 330px;
          box-shadow: 0 0 12px rgba(0,0,0,0.4);
          text-align: center;
        }
        h1 {
          margin-bottom: 20px;
          font-size: 22px;
          color: #4da8ff;
        }
        .dato {
          background: #333;
          padding: 12px;
          border-radius: 8px;
          margin: 10px 0;
          font-size: 1.1em;
        }
        .on {
          color: #4cff4c;
          font-weight: bold;
        }
        .off {
          color: #ff4c4c;
          font-weight: bold;
        }
        .footer {
          margin-top: 12px;
          font-size: 0.9em;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="panel">
        <h1>📡 Sensor LoRa</h1>

        <div class="dato">🌡️ Temperatura: <b>${temperatura.toFixed(1)} °C</b></div>
        <div class="dato">💧 Humedad: <b>${humedad.toFixed(1)} %</b></div>

        <div class="dato">
          💡 Bombillo: 
          <span class="${bombillo ? "on" : "off"}">
            ${bombillo ? "Encendido" : "Apagado"}
          </span>
        </div>

      </div>
    </body>
    </html>
  `);
});

// ----------------------
// Server
// ----------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🔥 Servidor activo en puerto ${PORT}`);
});
