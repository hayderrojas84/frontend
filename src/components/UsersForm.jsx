import React, { useState } from 'react';
import { API_URL } from '../consts';
import axios from '../utils/axios.js';
import '../estilos/UsersForm.css';
import { useNavigate } from 'react-router-dom';
import {LoginService} from '../services/loginService';

function UsersForm({ setUsers = null, operation = 'Agregar', toggleModal = null, from = null, userToEdit = null }) {
  const [user, setUser] = useState({
    username: userToEdit?.username || null,
    password: null
  });

  const navigate = useNavigate();

  const [people, setPeople] = useState({
    identification: userToEdit?.people?.identification || null,
    names: userToEdit?.people?.names || null,
    lastnames: userToEdit?.people?.lastnames || null,
    birthdate: userToEdit?.people?.birthdate || null,
    email: userToEdit?.people?.email || null,
    address: userToEdit?.people?.address || null,
    mobile: userToEdit?.people?.mobile || null,
    weight: userToEdit?.people?.weight || null,
    height: userToEdit?.people?.height || null,
    bloodType: userToEdit?.people?.bloodType || null,
    gender: userToEdit?.people?.gender || null
  })
  const [image, setImage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'username' || name === 'password'){
      setUser({
        ...user,
        [name]: value,
      });
    } else {
      setPeople({
        ...people,
        [name]: value,
      });
    }      
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('people', JSON.stringify(people));
    if (image) {
      formData.append('image', image);
    }

    if (userToEdit){
      if (!user.password) delete user.password
      formData.append('user', JSON.stringify(user));

      axios
      .post(`${API_URL}/users/${userToEdit.id}/update/`, formData)
      .then((_res) => {
        if (setUsers){
          axios
          .get(`${API_URL}/users/`)
          .then((res) => {
            const users = res.data;
            setUsers(users);
          })
          .catch((e) => console.error(e));
        }
      })
      .catch((e) => console.error(e));
    } else {
      formData.append('user', JSON.stringify(user));

      axios
      .post(`${API_URL}/users/create/`, formData)
      .then((res) => {
        const { id } = res.data;
        if (setUsers){
          axios
          .get(`${API_URL}/users/${id}/`)
          .then((res) => {
            const newUser = res.data;
            setUsers((oldUsers) => [...oldUsers, newUser]);
          })
          .catch((e) => console.error(e));
        }
        if (from === 'login') {
          const credentials = {
            ...user
          }

          if (credentials.password === '' || credentials.password === null){
            navigate('/');
          } else {
            const loginService = new LoginService();
            loginService.run(credentials).then((_res) => {
              navigate('/');
              window.location.reload(false);
            });
            
          }
        }
      })
      .catch((e) => console.error(e));
    }

    if (toggleModal) toggleModal()

  };

  return (
    <div className='users-form-container'>
      <h2>{operation} Usuario</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <table>
          <thead>
            <tr>
              <th colSpan="2">
                <h3>Datos del usuario</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  onChange={handleInputChange}
                  required={from === 'login'}
                  value={user.username}
                />
              </td>
              <td>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  onChange={handleInputChange}
                  required={from === 'login'}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th colSpan="3">
                <h3>Datos de la persona</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="identification"
                  placeholder="Identificación"
                  onChange={handleInputChange}
                  required
                  value={people.identification}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="names"
                  placeholder="Nombres"
                  onChange={handleInputChange}
                  value={people.names}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="lastnames"
                  placeholder="Apellidos"
                  onChange={handleInputChange}
                  value={people.lastnames}
                />
              </td>
            </tr>
            <tr>
              <td>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '5px' }}>Fecha de nacimiento:</span>
                  <input
                    type="date"
                    name="birthdate"
                    placeholder="Fecha de nacimiento"
                    min="1"
                    onChange={handleInputChange}
                    value={people.birthdate ?? ''}
                  />
                </span>
              </td>
              <td>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo"
                  onChange={handleInputChange}
                  value={people.email}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  onChange={handleInputChange}
                  value={people.address}
                />
              </td>

            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Teléfono"
                  onChange={handleInputChange}
                  value={people.mobile}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="weight"
                  placeholder="Peso"
                  onChange={handleInputChange}
                  value={people.weight}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="height"
                  placeholder="Altura"
                  onChange={handleInputChange}
                  value={people.height}
                />
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  name="bloodType"
                  placeholder="Tipo de sangre"
                  onChange={handleInputChange}
                  value={people.bloodType}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="gender"
                  placeholder="Género"
                  onChange={handleInputChange}
                  value={people.gender}
                />
              </td>
              <td>
                {
                  (userToEdit?.people?.image) && (
                    <>
                      <small>Actual:</small>
                      <img src={userToEdit.people.image} alt={userToEdit.people.names} width={75}/>
                    </>
                    
                  )
                }
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
        <button>{operation}</button>
      </form>
    </div>
  );
}

export default UsersForm;
