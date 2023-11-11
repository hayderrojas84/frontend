import axios from '../utils/axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../consts';
import '../estilos/Client.css'
import RoutineSchedulesTable from '../components/RoutineSchedulesTable';
import RoutineSchedulesSelection from '../components/RoutineSchedulesSelection';
import Modal from '../components/Modal';
import PeopleInformation from '../components/PeopleInformation';

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
        <>
        <Modal onClose={toggleModal}>
            <RoutineSchedulesSelection toggleModal={toggleModal} peopleId={people.id} setRoutineSchedules={setRoutineSchedules} />
          </Modal>
        </>
        ) : 
        (
          <>
            {people && (<PeopleInformation people={people}/>)}
          </>
      )}

      <div className='routineSchedules-data'>
          {people && (<RoutineSchedulesTable peopleId={people.id} setRoutineSchedules={setRoutineSchedules} routineSchedules={routineSchedules}/>)}
          <div>
            <button onClick={toggleModal}>Registrar nueva rutina</button>
          </div>
      </div>
    </div>
  );
}

export default Client;
