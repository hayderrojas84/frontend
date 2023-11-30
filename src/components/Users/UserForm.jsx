import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { genderOptions } from '../../shared/constants/selectOptions.js';
import FormComponent from '../Forms/FormComponent.jsx';
import FormField from '../Forms/FormField.jsx';
import SelectComponent from '../Forms/Select.jsx';
import '../../styles/UserForm.css';
import { ENV } from '../../shared/constants/services.js';
import { LoginService } from '../../shared/services/loginService.js';
import { PersistUser } from '../../shared/services/Users/persistUser.js';
import { GetUsers } from '../../shared/services/Users/getUsers.js';

function UserForm({ setData = null, toggleModal = null, userToEdit = null, operation = 'Agregar', pagination = null, setPagination = null, from = null }) {
  const [user, setUser] = useState({
    username: userToEdit?.username || '',
    password: ''
  });
  const [people, setPeople] = useState({
    identification: userToEdit?.people?.identification || '',
    names: userToEdit?.people?.names || '',
    lastnames: userToEdit?.people?.lastnames || '',
    birthdate: userToEdit?.people?.birthdate || null,
    email: userToEdit?.people?.email || '',
    address: userToEdit?.people?.address || '',
    mobile: userToEdit?.people?.mobile || '',
    weight: userToEdit?.people?.weight || '',
    height: userToEdit?.people?.height || '',
    bloodType: userToEdit?.people?.bloodType || '',
    gender: userToEdit?.people?.gender || ''
  })
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'username' || name === 'password') {
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

  const handleGenderSelectChange = (e) => {
    const { value } = e.target.selectedOptions[0];

    if (value) setPeople((oldPeople) => {
      return {
        ...oldPeople,
        gender: value
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('people', JSON.stringify(people));
    if (image) {
      formData.append('image', image);
    }

    const persistUser = new PersistUser();
    const getUsers = new GetUsers()

    if (userToEdit) {
      if (!user.password) delete user.password
      formData.append('user', JSON.stringify(user));

      persistUser.update({ data: formData, userId: userToEdit.id }).then((_res) => {
        if (setData) {
          getUsers.withPagination(pagination).then((res) => {
            setData((oldData) => {
              return {
                ...oldData,
                content: res.data.map((item) => {
                  return {
                    ...item,
                    people: {
                      ...item.people,
                      age: item.people?.birthdate ? Math.floor(((new Date() - (new Date(item.people.birthdate))) / 31557600000)) : ''
                    },
                  }
                }),
                total: res.total
              }
            });
          }).catch((e) => {
            if (ENV === 'dev') {
              console.error(e);
            }
          });
        }
        if (toggleModal) toggleModal();
      }).catch((e) => {
        if (e.response?.data) setErrors(e.response.data);
      });
    } else {
      formData.append('user', JSON.stringify(user));

      persistUser.create({ data: formData }).then((_res) => {
        if (from === 'login') {
          const credentials = {
            ...user
          }

          if (credentials.password === '' || credentials.password === null) {
            navigate('/');
          } else {
            const loginService = new LoginService();
            loginService.run(credentials).then((_res) => {
              navigate('/');
              window.location.reload(false);
            });
          }
        } else {
          if (setData){
            getUsers.withPagination(pagination).then((res) => {
              setData((oldData) => {
                return {
                  ...oldData,
                  content: res.data.map((item) => {
                    return {
                      ...item,
                      people: {
                        ...item.people,
                        age: item.people?.birthdate ? Math.floor(((new Date() - (new Date(item.people.birthdate))) / 31557600000)) : ''
                      },
                    }
                  }),
                  total: res.total
                }
              });
              setPagination((oldPagination) => {
                return {
                  ...oldPagination,
                  page: res.page
                }
              })
            }).catch((e) => {
              console.log({ENV});
              if (ENV === 'dev') {
                console.error(e);
              }
            });
          }
        }
        if (toggleModal) toggleModal();
      }).catch((e) => {
        if (e.response?.data) setErrors(e.response.data);
      });
    }
  };

  return (
    <FormComponent enctype={'multipart/form-data'} model={'Usuario'} operation={operation} handleSubmit={handleSubmit}>
      <section className='form-section user-data'>
        <h3>Datos del usuario</h3>
        <div className='grid c2_1fr'>
          <FormField errors={errors.username} label={'Nombre de usuario'} spanClass='span_in'>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              onChange={handleInputChange}
              required={from === 'login'}
              disabled={operation !== 'Registrar' && operation !== 'Agregar'}
              value={user.username}
              autoComplete='off'
            />
          </FormField>
          <FormField errors={errors.password} label={'Contraseña'} spanClass='span_in'>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleInputChange}
              required={from === 'login'}
              autoComplete='off'
            />
          </FormField>
        </div>
      </section>
      <section className='form-section people-data'>
        <h3>Datos de la persona</h3>
        <div className='grid c3_1fr'>
          <FormField errors={errors.identification} label={'Identificación'} spanClass='span_in'>
            <input
              type="text"
              name="identification"
              placeholder="Identificación"
              onChange={handleInputChange}
              required
              disabled={operation !== 'Registrar' && operation !== 'Agregar'}
              value={people.identification}
            />
          </FormField>
          <FormField errors={errors.names} label={'Nombres'} spanClass='span_in'>
            <input
              type="text"
              name="names"
              placeholder="Nombres"
              onChange={handleInputChange}
              value={people.names}
            />
          </FormField>
          <FormField errors={errors.lastnames} label={'Apellidos'} spanClass='span_in'>
            <input
              type="text"
              name="lastnames"
              placeholder="Apellidos"
              onChange={handleInputChange}
              value={people.lastnames}
            />
          </FormField>
          <FormField errors={errors.birthdate} label={'Fecha de nacimiento'} spanClass='span_in'>
            <input
              type="date"
              name="birthdate"
              placeholder="Fecha de nacimiento"
              min="1"
              onChange={handleInputChange}
              value={people.birthdate ?? ''}
            />
          </FormField>
          <FormField errors={errors.email} label={'Correo electrónico'} spanClass='span_in'>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              onChange={handleInputChange}
              value={people.email}
            />
          </FormField>
          <FormField errors={errors.address} label={'Dirección'} spanClass='span_in'>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              onChange={handleInputChange}
              value={people.address}
            />
          </FormField>
          <FormField errors={errors.mobile} label={'Teléfono'} spanClass='span_in'>
            <input
              type="text"
              name="mobile"
              placeholder="Teléfono"
              onChange={handleInputChange}
              value={people.mobile}
            />
          </FormField>
          <FormField errors={errors.weight} label={'Peso'} spanClass='span_in'>
            <input
              type="number"
              name="weight"
              placeholder="Peso (KG)"
              onChange={handleInputChange}
              value={people.weight}
              min={30}
              max={250}
            />
          </FormField>
          <FormField errors={errors.height} label={'Altura'} spanClass='span_in'>
            <input
              type="number"
              name="height"
              placeholder="Altura (CM)"
              onChange={handleInputChange}
              value={people.height}
              min={100}
              max={250}
            />
          </FormField>
          <FormField errors={errors.bloodType} label={'Tipo de sangre'} spanClass='span_in'>
            <input
              type="text"
              name="bloodType"
              placeholder="Tipo de sangre"
              onChange={handleInputChange}
              value={people.bloodType}
              maxLength={5}
            />
          </FormField>
          <FormField errors={errors.gender} label={'Género'} spanClass='span_in'>
            <SelectComponent onChange={handleGenderSelectChange} required={true} name='Género' model='gender' defaultValue={people.gender} options={genderOptions} />
          </FormField>
          <div>
            {(userToEdit?.people?.image) && (
            <>
              <small>Actual:</small>
              <img src={userToEdit.people.image} alt={userToEdit.people.names} width={75} />
            </>
            )}
            <FormField errors={errors.image} label={'Imagen'} spanClass='span_in'>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </FormField>
          </div>
        </div>
      </section>
    </FormComponent>
  );
}

export default UserForm;
