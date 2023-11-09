import axios from '../utils/axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../consts';
import '../estilos/Client.css'
import RoutineSchedulesTable from '../components/RoutineSchedulesTable';
import RoutineSchedulesSelection from '../components/RoutineSchedulesSelection';
import Modal from '../components/Modal';

function Client() {
  const { identification } = useParams();

  const [people, setPeople] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [routineSchedules, setRoutineSchedules] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/people/${identification}/`)
      .then((res) => {
        setPeople(res.data);
      })
      .catch((e) => console.error(e));
  }, [identification]);

  const toggleModal = () => {
    setShowModal((lastShow) => !lastShow);
  };

  return (
    <div>
      {showModal ? (
          <Modal onClose={toggleModal}>
            <RoutineSchedulesSelection toggleModal={toggleModal} peopleId={people.id} setRoutineSchedules={setRoutineSchedules} />
          </Modal>
        ) : 
        (
          <>
          <div className="client-data">
      {people && (
        <>
        <div className='client-main'>
          <img src={people.image ?? "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png"} alt="" />
          <p>{`${people.names} ${people.lastnames}`}</p>
        </div>
        <div className='client-info'>
          {people.birthdate && (
            <p>Fecha de nacimiento: {people.birthdate}</p>
          )}
          {people.email && (
            <p>Corrreo electronico: {people.email}</p>
          )}
          {people.address && (
            <p>Direccion: {people.address}</p>
          )}
          {people.mobile && (
            <p>Numero de telefono: {people.mobile}</p>
          )}
          {people.weight && (
            <p>Peso corporal: {people.weight} KG</p>
          )}
          {people.height && (
            <p>Altura: {people.height} CM</p>
          )}
          {people.bloodType && (
            <p>Tipo de sangre: {people.bloodType}</p>
          )}
          {people.gender && (
            <p>Genero: {people.gender}</p>
          )}
        </div>
        </>
      )}

        
      </div>    
      <div className='routineSchedules-data'>
          {people && (<RoutineSchedulesTable peopleId={people.id} setRoutineSchedules={setRoutineSchedules} routineSchedules={routineSchedules}/>)}
          <div>
            <button onClick={toggleModal}>Registrar nueva rutina</button>
          </div>
      </div>
      </>
        )}
    </div>
  );
}

export default Client;
