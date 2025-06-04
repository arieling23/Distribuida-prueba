import { useState, useEffect } from 'react';

// ✅ Variables de entorno desde .env
const URL_POKEDEX = process.env.REACT_APP_API_POKEDEX;
const URL_HISTORIAL = process.env.REACT_APP_API_HISTORIAL;

function App() {
  const [nombre, setNombre] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [historial, setHistorial] = useState([]);

  const buscar = () => {
    fetch(`${URL_POKEDEX}/pokemon/${nombre}`)
      .then(res => res.json())
      .then(data => {
        setPokemon(data);

        // Guardar en historial si existe el Pokémon
        if (data.nombre) {
          fetch(`${URL_HISTORIAL}/historial`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: data.nombre })
          });
        }

        setNombre('');
      })
      .catch(err => console.error('Error al consultar pokedex:', err));
  };

  useEffect(() => {
    fetch(`${URL_HISTORIAL}/historial`)
      .then(res => res.json())
      .then(setHistorial)
      .catch(err => console.error('Error al obtener historial:', err));
  }, [pokemon]);

  return (
    <div>
      <h1>Pokedex Distribuida Prueba</h1>
      <input value={nombre} onChange={e => setNombre(e.target.value)} />
      <button onClick={buscar}>Buscar</button>

      {pokemon && (
        <div>
          <h2>{pokemon.nombre}</h2>
          <img src={pokemon.imagen} alt={pokemon.nombre} />
          <p>Tipos: {pokemon.tipos.join(', ')}</p>
          <p>Habilidades: {pokemon.habilidades.join(', ')}</p>
        </div>
      )}

      <h3>Historial de búsquedas</h3>
      <ul>
        {historial.map((item, i) => (
          <li key={i}>{item.nombre} - {new Date(item.fecha).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
