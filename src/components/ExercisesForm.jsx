import React, { useEffect, useState } from 'react';
import { API_URL } from '../consts';
import axios from '../utils/axios.js';

function ExercisesForm({ setExercises = null, operation = 'Agregar', toggleModal = null, exerciseToEdit = null }) {
  const [exercise, setExercise] = useState({
    name: exerciseToEdit?.name || null,
    muscleGroup: exerciseToEdit?.muscleGroup || null,
    description: exerciseToEdit?.description || null
  });

  const [machines, setMachines] = useState([]);

  const [selectedMachines, setSelectedMachines] = useState([]);

  const [image, setImage] = useState(null);

  useEffect(()=>{
    axios.get(`${API_URL}/machines/`)
      .then((res)=>{
        setMachines(res.data);
        if (exerciseToEdit) {
          setSelectedMachines(exerciseToEdit.machines.map(mach => `${mach.id}`));
        }
      })
      .catch((e)=>console.error(e));
  },[exerciseToEdit]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExercise({
        ...exercise,
        [name]: value,
    });    
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSelectChange = (e) => {
    if (exerciseToEdit?.machines.length) exerciseToEdit.machines = [];
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    if (selectedOptions) setSelectedMachines((sel) => {
      if (!sel.includes(selectedOptions[0])) return [...sel, ...selectedOptions] 
      return [...sel];
    });
  }

  const handleDeleteSelectedMachines = () => {
    setSelectedMachines([]);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append('exercise', JSON.stringify(exercise));
    formData.append('machines', JSON.stringify(selectedMachines));
    if (image) formData.append('image', image);

    if (exerciseToEdit){
        axios
        .post(`${API_URL}/exercises/${exerciseToEdit.id}/update/`, formData)
        .then((_res) => {
            if (setExercises){
            axios
            .get(`${API_URL}/exercises/`)
            .then((res) => {
                setExercises(res.data);
            })
            .catch((e) => console.error(e));
            }
        })
        .catch((e) => console.error(e));
    } else {
      axios
      .post(`${API_URL}/exercises/create/`, formData)
      .then((res) => {
        const { id } = res.data;
        if (setExercises){
          axios
          .get(`${API_URL}/exercises/${id}/`)
          .then((res) => {
            const newExercise = res.data;
            setExercises((oldExercises) => [...oldExercises, newExercise]);
          })
          .catch((e) => console.error(e));
        }
      })
      .catch((e) => console.error(e));
    }

    if (toggleModal) toggleModal(null, null)

  };

  return (
    <div className='exercises-form-container'>
      <h2>{operation} Ejercicio</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                <h3>Datos del ejercicio</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre del ejercicio"
                  onChange={handleInputChange}
                  required
                  value={exercise.name ?? ''}
                />
              </td>
              <td>
                  <input
                  type="text"
                  name="muscleGroup"
                  placeholder="Grupo muscular del ejercicio"
                  onChange={handleInputChange}
                  required
                  value={exercise.muscleGroup ?? ''}
                  />
                </td>
            </tr>
            <tr>
                <td>
                  <textarea
                    type="text"
                    name="description"
                    placeholder="Descripción del ejercicio"
                    onChange={handleInputChange}
                    value={exercise.description ?? ''}
                  />
                </td>
                <td>
                  <select multiple={true} onChange={handleSelectChange} name="machines" id="machines_id" disabled={!machines.length}>
                    {machines.length && (
                      machines.map((machine) => {
                        return (
                          <option key={machine.id} value={machine.id}>{machine.name}</option>
                        )
                      })
                    )}
                  </select>
                  <button type="button" onClick={handleDeleteSelectedMachines}>Eliminar seleccionadas</button>
                    <p>Maquinas seleccionadas: {machines.filter((mach) => selectedMachines.includes(`${mach.id}`))?.map((mach) => mach.name).join(', ')}</p>
                </td>
            </tr>
            <tr>
              <td colSpan={2}>
              {(exerciseToEdit?.image) && (
                  <>
                    <small>Actual:</small>
                    <img src={exerciseToEdit.image} alt={exerciseToEdit.name} width={75}/>
                  </>
              )}
              <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
              </td>
            </tr>

          </tbody>
        </table>
        <button type='submit'>{operation}</button>
      </form>
    </div>
  );
}

export default ExercisesForm;
