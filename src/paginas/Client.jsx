import axios from '../utils/axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../consts';

function Client() {
  const { identification } = useParams();

  const [people, setPeople] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/people/${identification}/`)
      .then((res) => setPeople(res.data))
      .catch((e) => console.error(e));
  }, [identification])

  return (
    <div>
      <h1>Página del Cliente</h1>
      <p>ID del Cliente: {identification}</p>

      {people && (
        <div>
          {JSON.stringify(people)}
        </div>
      )}
    </div>
  );
}

export default Client;
