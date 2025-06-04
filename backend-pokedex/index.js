const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Instala con: npm install node-fetch

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para obtener datos del Pokémon desde la PokeAPI
app.get('/pokemon/:nombre', async (req, res) => {
  const nombre = req.params.nombre.toLowerCase();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!response.ok) return res.status(404).json({ error: 'Pokémon no encontrado' });

    const data = await response.json();

    const pokemon = {
      nombre: data.name,
      imagen: data.sprites.front_default,
      tipos: data.types.map(t => t.type.name),
      habilidades: data.abilities.map(a => a.ability.name)
    };

    res.json(pokemon);
  } catch (error) {
    console.error('Error al buscar el Pokémon:', error);
    res.status(500).json({ error: 'Error al consultar la PokeAPI' });
  }
});

app.listen(3000, () => console.log('Pokedex Backend corriendo en puerto 3000'));
