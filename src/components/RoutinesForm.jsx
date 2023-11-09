import React, { useEffect, useState } from 'react';
import { API_URL } from '../consts';
import axios from '../utils/axios.js';
import "../estilos/RoutinesForm.css"; // Import the CSS file

function RoutinesForm({ setRoutines = null, operation = 'Agregar', toggleModal = null, routineToEdit = null }) {
  const [routine, setRoutine] = useState({
    name: routineToEdit?.name || null,
    description: routineToEdit?.description || null,
    difficulty: routineToEdit?.difficulty || null,
    goal: routineToEdit?.goal || null,
    muscleGroup: routineToEdit?.muscleGroup || null
  });

  const [ exercisesSelected, setExercisesSelected] = useState([]);

  const [ exercises, setExercises] = useState ([]);

  useEffect(()=>{
    axios.get(`${API_URL}/exercises/`)
      .then(res=>{
        setExercises(res.data);
        if (routineToEdit) {
          setExercisesSelected(routineToEdit.exercises.map(exercise=>`${exercise.id}`))
        }
      })
      .catch(e=>console.error(e))
  }, [routineToEdit])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRoutine({
        ...routine,
        [name]: value,
    });    
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    if (selectedOptions) setExercisesSelected((sel) => {
      if (!sel.includes(selectedOptions[0])) return [...sel, ...selectedOptions] 
      return [...sel];
    });
  }

  const handleDeleteSelectedExercises = () => {
    setExercisesSelected([]);
  }
  const handleSelectGoal = (e) => {
    setRoutine({
      ...routine,
      goal:e.target.selectedOptions[0].value
    })
  }

  const handleSelectMuscleGroup = (e) => {
    setRoutine({
      ...routine,
      muscleGroup:e.target.selectedOptions[0].value
    })
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      routine,
      exercises:exercisesSelected
    }
    if (routineToEdit){
        axios
        .put(`${API_URL}/routines/${routineToEdit.id}/update/`, data)
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
      .post(`${API_URL}/routines/create/`, data)
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
                    {/* <input
                    type="text"
                    name="goal"
                    placeholder="Objetivo de la rutina"
                    onChange={handleInputChange}
                    required
                    value={routine.goal ?? ''}
                    /> */}
                    <select name="goal" id="goalid" onChange={handleSelectGoal} defaultValue={routine.goal}  required>
                      <option value="">Seleccionar Objetivo</option>
                      <option value="Bajar de peso">Bajar de peso</option>
                      <option value="Definir">Definir</option>
                      <option value="Tonificar">Tonificar</option>
                    </select>
                </td>
            </tr>
            <tr>
              <td>
                  <select onChange={handleSelectChange} name="exercises" id="exercises_id" disabled={!exercises.length}>
                    <option value="">Seleccionar Ejercicios</option>
                    {exercises.length && (
                      exercises.map((exercise) => {
                        return (
                          <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                        )
                      })
                    )}
                  </select>
                  <button type="button" onClick={handleDeleteSelectedExercises}>Eliminar seleccionadas</button>
                    <p>Ejercicios seleccionados: {exercises.filter((exercise) => exercisesSelected.includes(`${exercise.id}`))?.map((exercise) => exercise.name).join(', ')}</p>
                </td>
                <td>
                  <label htmlFor="muscleGroup">Grupo muscular</label>
                  <select onChange={handleSelectMuscleGroup} name="muscleGroup" id="muscleGroup" defaultValue={routine.muscleGroup} required>
                      <option value="">SELECCIONE</option>
                      <option value="Pecho">Pecho</option>
                      <option value="Espalda">Espalda</option>
                      <option value="Piernas">Piernas</option>
                      <option value="Brazos">Brazos</option>
                      <option value="Hombros">Hombros</option>
                      <option value="Abdominales">Abdominales</option>
                  </select>
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
