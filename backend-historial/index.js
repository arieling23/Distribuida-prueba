const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./historial.db');
db.run("CREATE TABLE IF NOT EXISTS historial (nombre TEXT, fecha TEXT)");

app.post('/historial', (req, res) => {
  const { nombre } = req.body;
  const fecha = new Date().toISOString();
  db.run("INSERT INTO historial (nombre, fecha) VALUES (?, ?)", [nombre, fecha]);
  res.sendStatus(200);
});

app.get('/historial', (req, res) => {
  db.all("SELECT * FROM historial ORDER BY fecha DESC LIMIT 10", [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(3001, () => console.log("Historial Backend on 3001"));
