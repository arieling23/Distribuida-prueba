import { useState, useEffect } from 'react';

function App() {
  const [nombre, setNombre] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [historial, setHistorial] = useState([]);

  const buscar = () => {
    fetch(`http://localhost:3000/pokemon/${nombre}`)
      .then(res => res.json())
      .then(data => {
        setPokemon(data);
        fetch('http://localhost:3001/historial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: data.nombre })
        });
        setNombre('');
      });
  };

  useEffect(() => {
    fetch('http://localhost:3001/historial')
      .then(res => res.json())
      .then(setHistorial);
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
