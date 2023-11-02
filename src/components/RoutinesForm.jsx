import React, { useState } from 'react';
import { API_URL } from '../consts';
import axios from '../utils/axios.js';

function RoutinesForm({ setRoutines = null, operation = 'Agregar', toggleModal = null, routineToEdit = null }) {
  const [routine, setRoutine] = useState({
    name: routineToEdit?.name || null,
    description: routineToEdit?.description || null,
    difficulty: routineToEdit?.difficulty || null,
    goal: routineToEdit?.goal || null
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRoutine({
        ...routine,
        [name]: value,
    });    
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    if (routineToEdit){
        axios
        .put(`${API_URL}/routines/${routineToEdit.id}/update/`, routine)
        .then((_res) => {
            if (setRoutines){
            axios
            .get(`${API_URL}/routines/`)
            .then((res) => {
                const routines = res.data;
                setRoutines(routines);
            })
            .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
    } else {
      axios
      .post(`${API_URL}/routines/create/`, routine)
      .then((res) => {
        const { id } = res.data;
        if (setRoutines){
          axios
          .get(`${API_URL}/routines/${id}/`)
          .then((res) => {
            const newRoutine = res.data;
            setRoutines((oldRoutines) => [...oldRoutines, newRoutine]);
          })
          .catch((e) => console.error(e));
        }
      })
      .catch((e) => console.error(e));
    }

    if (toggleModal) toggleModal(null, null)

  };

  return (
    <div className='routines-form-container'>
      <h2>{operation} Rutina</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                <h3>Datos de la rutina</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre de la rutina"
                  onChange={handleInputChange}
                  required
                  value={routine.name ?? ''}
                />
              </td>
              <td>
                <textarea
                  type="text"
                  name="description"
                  placeholder="Descripción de la rutina"
                  onChange={handleInputChange}
                  value={routine.description ?? ''}
                />
              </td>
            </tr>
            <tr>
                <td>
                    <input
                    type="text"
                    name="difficulty"
                    placeholder="Dificultad de la rutina"
                    onChange={handleInputChange}
                    required
                    value={routine.difficulty ?? ''}
                    />
                </td>
                <td>
                    <input
                    type="text"
                    name="goal"
                    placeholder="Objetivo de la rutina"
                    onChange={handleInputChange}
                    required
                    value={routine.goal ?? ''}
                    />
                </td>
            </tr>
          </tbody>
        </table>
        <button>{operation}</button>
      </form>
    </div>
  );
}

export default RoutinesForm;
