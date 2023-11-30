import { useEffect, useState } from "react";
import RoutineForm from "../components/Routines/RoutineForm";
import DataTable from "../components/Utils/DataTable";
import Modal from "../components/Utils/Modal";
import { ENV } from "../shared/constants/services";
import "../styles/RoutinesPage.css";
import { GetRoutines } from "../shared/services/Routines/getRoutines";
import { PersistRoutine } from "../shared/services/Routines/persistRoutine";



function RoutinesPage() {
  document.title = 'Power House | Rutinas';
  const [data, setData] = useState({
    content: [],
    headers: [],
    total: 0
  });

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10
  });

  const [operation, setOperation] = useState('Agregar');
  const [showModal, setShowModal] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState(null);

  useEffect(() => {
    const getRoutines = new GetRoutines();
    const headers = [
      { name: 'ID', access: 'id' },
      { name: 'Nombre', access: 'name' },
      { name: 'Descripción', access: 'description' },
      { name: 'Dificultad', access: 'difficulty' },
      { name: 'Objetivo', access: 'goal' },
      { name: 'Grupo Muscular', access: 'muscleGroup' },
      { name: 'Ejercicios', access: 'exercises' },
      { name: 'Acciones', access: 'form_actions' }
    ]

    getRoutines.withPagination(pagination).then((routinesPaginated) => {
      const content = routinesPaginated.data;

      setData((oldData) => {
        return {
          ...oldData,
          content,
          headers,
          total: routinesPaginated.total
        }
      });
    }).catch((e) => {
      if (ENV === 'dev') console.error(e);
      setData((oldData) => {
        return {
          ...oldData,
          content: [],
          total: 0
        }
      })
    })
  }, [pagination]);

  const toggleModal = ({ item = null } = {}) => {
    setShowModal((oldShow) => !oldShow);
    if (item) {
      setRoutineToEdit(item);
      setOperation('Editar');
    } else {
      setRoutineToEdit(null);
      setOperation('Agregar');
    }
  }

  const handleDelete = ({ id }) => {
    const persistRoutine = new PersistRoutine();
    persistRoutine.deleteById({ routineId: id }).then((res) => {
      const getRoutine = new GetRoutines();
      getRoutine.withPagination(pagination).then((res) => {
        setData((oldData) => {
          return {
            ...oldData,
            content: res.data,
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
        if (ENV === 'dev') {
          console.error(e);
        }
        setData({
          content: [],
          headers: [],
          total: 0
        });

        setPagination((oldPagination) => {
          return {
            ...oldPagination,
            page: 1
          }
        });
      });
    }).catch((e) => {
      if (ENV === 'dev') {
        console.error(e);
      }
    });
  };

  const formActions = [
    {
      name: 'Editar',
      attributes: {
        className: 'primary',
        onClick: toggleModal
      }
    },
    {
      name: 'Eliminar',
      attributes: {
        className: 'delete-button danger',
        onClick: handleDelete
      }
    }
  ];

  return (
    <div className="text-center">
      <h1>Rutinas</h1>
      <div className="overflow_table">
        <DataTable form_actions={formActions} data={data} setPagination={setPagination} pagination={pagination} model={'Rutinas'} register_button={true} toggleModal={toggleModal} />
      </div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <RoutineForm setData={setData} operation={operation} toggleModal={toggleModal} routineToEdit={routineToEdit} pagination={pagination} setPagination={setPagination} />
        </Modal>
      )}
    </div>
  )
}



export default RoutinesPage;