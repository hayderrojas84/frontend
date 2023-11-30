import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PeopleCard from '../components/People/PeopleCard';
import RoutineSchedulesSelection from '../components/RoutineSchedules/RoutineSchedulesSelection';
import DataTable from '../components/Utils/DataTable';
import Modal from '../components/Utils/Modal';
import { ENV } from '../shared/constants/services';
import { GetPeople } from '../shared/services/People/getPeople';
import { GetRoutineSchedules } from '../shared/services/RoutineSchedules/getRoutineSchedules';
import '../styles/Client.css';

function Client() {
  document.title = 'Power House | Cliente';
  const { identification } = useParams();

  const [people, setPeople] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    content: [],
    headers: [],
    total: 0
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getPeople = new GetPeople();
    const getRoutineSchedules = new GetRoutineSchedules();
    const headers = [
      { name: 'Nombre', access: 'routine.name' },
      { name: 'Descripción', access: 'routine.description' },
      { name: 'Dificultad', access: 'routine.difficulty' },
      { name: 'Objetivo', access: 'routine.goal' },
      { name: 'Grupo Muscular', access: 'routine.muscleGroup' },
      { name: 'Día', access: 'dayOfWeek' },
      { name: 'Acciones', access: 'form_actions' }
    ];

    getPeople.byIdentification({ identification })
      .then((people) => {
        setPeople(people);
        getRoutineSchedules.list({
          params: {
            peopleId: people.id
          }
        }).then((routineSchedules) => {
          setData((oldData) => {
            return {
              ...oldData,
              headers,
              content: routineSchedules,
              total: routineSchedules.length
            }
          });
        }).catch((e) => {
          if (ENV === 'dev') {
            console.error(e);
          }
          setData((oldData) => {
            return {
              ...oldData,
              headers,
              content: [],
              total: 0
            }
          })
        });

      }).catch((e) => {
        console.error(e);
        navigate('/');
      });
  }, [identification, navigate]);

  const handleView = ({ id }) => {
    navigate(`${location.pathname}/routine-schedule/${id}`);
  }

  const formActions = [
    {
      name: 'Ver',
      attributes: {
        className: 'primary',
        onClick: handleView
      }
    }
  ]


  const toggleModal = () => {
    setShowModal((lastShow) => !lastShow);
  };

  return (
    <div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <RoutineSchedulesSelection toggleModal={toggleModal} peopleId={people.id} setData={setData} />
        </Modal>
      )}

      {people ? (
        <>
          <PeopleCard people={people} />
          <div className='routineSchedules_data overflow_table'>
            <DataTable data={data} form_actions={formActions} model={'Horario de rutina'} register_button toggleModal={toggleModal} />
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>Cargando...</p>
      )}
    </div>
  );
}

export default Client;
