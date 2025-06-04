const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch'); // Asegúrate de tenerlo instalado con: npm install node-fetch
require('dotenv').config(); // Para usar variables del .env

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a base de datos SQLite
const db = new sqlite3.Database('./historial.db');
db.run("CREATE TABLE IF NOT EXISTS historial (nombre TEXT, fecha TEXT)");

// IP del backend-pokedex (puedes usar variable de entorno)
const BACKEND_POKEDEX_URL = process.env.BACKEND_POKEDEX_URL || 'http://54.197.8.77:3000'; // ✅ CAMBIA esta IP si necesitas

// Ruta POST para guardar en historial (solo si el Pokémon existe)
app.post('/historial', async (req, res) => {
  const { nombre } = req.body;
  const fecha = new Date().toISOString();

  try {
    const response = await fetch(`${BACKEND_POKEDEX_URL}/pokemon/${nombre}`);
    const data = await response.json();

    if (data.nombre) {
      db.run("INSERT INTO historial (nombre, fecha) VALUES (?, ?)", [nombre, fecha]);
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'Pokémon no encontrado en Pokedex' });
    }
  } catch (error) {
    console.error('Error conectando con el backend-pokedex:', error);
    res.status(500).json({ error: 'Fallo al comunicarse con backend-pokedex' });
  }
});

// Ruta GET para obtener historial
app.get('/historial', (req, res) => {
  db.all("SELECT * FROM historial ORDER BY fecha DESC LIMIT 10", [], (err, rows) => {
    if (err) {
      console.error('Error en historial:', err);
      res.status(500).json({ error: 'Error en el historial' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(3001, () => console.log("✅ Historial Backend corriendo en puerto 3001"));
