import React, { useState } from 'react';
import { API_URL } from '../consts';
import axios from '../utils/axios.js'


function MachinesForm({ setMachines }) {
  const [machine, setMachine] = useState({
    name: '',
    description: '',
    muscleGroup: '',
    quantity: 1,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMachine({
      ...machine,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', machine.name);
    formData.append('description', machine.description);
    formData.append('muscleGroup', machine.muscleGroup);
    formData.append('quantity', machine.quantity);
    if (image) {
      formData.append('image', image);
    }

    axios
      .post(`${API_URL}/machines/create/`, formData)
      .then((res) => {
        const { id } = res.data;

        axios
          .get(`${API_URL}/machines/${id}/`)
          .then((res) => {
            const newMachine = res.data;
            setMachines((oldMachines) => [...oldMachines, newMachine]);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="Agregar-Maquina">
      <h2 className="agregar-maquina-h2">Agregar Máquina</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Nombre de la Máquina"
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        <textarea
          placeholder="Descripción de la Máquina"
          name="description"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="muscleGroup"
          placeholder="Grupo muscular"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          min="1"
          onChange={handleInputChange}
        />

        <button>Agregar</button>
      </form>
    </div>
  );
}

export default MachinesForm;
