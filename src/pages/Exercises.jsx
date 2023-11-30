import { useEffect, useState } from "react";
import { ENV } from "../shared/constants/services";
import { GetExercises } from "../shared/services/Exercises/getExercises";
import { PersistExercise } from "../shared/services/Exercises/persistExercise";
import DataTable from "../components/Utils/DataTable";
import Modal from "../components/Utils/Modal";
import ExerciseForm from "../components/Exercises/ExerciseForm";

export default function ExercisesPage() {
  document.title = 'Power House | Ejercicios';
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
  const [exerciseToEdit, setExerciseToEdit] = useState(null);

  useEffect(() => {
    const getExercises = new GetExercises();
    const headers = [
      { name: 'ID', access: 'id' },
      { name: 'Nombre', access: 'name' },
      { name: 'Descripción', access: 'description' },
      { name: 'Grupo Muscular', access: 'muscleGroup' },
      { name: 'Máquinas', access: 'machines' },
      { name: 'Imagen', access: 'image' },
      { name: 'Acciones', access: 'form_actions' }
    ]

    getExercises.withPagination(pagination).then((exercisesPaginated) => {
      const content = exercisesPaginated.data;

      setData((oldData) => {
        return {
          ...oldData,
          content,
          headers,
          total: exercisesPaginated.total
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
      setExerciseToEdit(item);
      setOperation('Editar');
    } else {
      setExerciseToEdit(null);
      setOperation('Agregar');
    }
  }

  const handleDelete = ({ id }) => {
    const persistExercise = new PersistExercise();
    persistExercise.deleteById({ exerciseId: id }).then((res) => {
      const getExercise = new GetExercises();
      getExercise.withPagination(pagination).then((paginatedExercises) => {
        setData((oldData) => {
          return {
            ...oldData,
            content: paginatedExercises.data,
            total: paginatedExercises.total
          }
        });

        setPagination((oldPagination) => {
          return {
            ...oldPagination,
            page: paginatedExercises.page
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
      <h1>Ejercicios</h1>
      <div className="overflow_table">
        <DataTable form_actions={formActions} data={data} setPagination={setPagination} pagination={pagination} model={'Ejercicios'} register_button={true} toggleModal={toggleModal} />
      </div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <ExerciseForm setData={setData} operation={operation} toggleModal={toggleModal} exerciseToEdit={exerciseToEdit} pagination={pagination} setPagination={setPagination} />
        </Modal>
      )}
    </div>

  )
}