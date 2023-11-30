import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MachineForm from "../components/Machines/MachineForm";
import DataTable from "../components/Utils/DataTable";
import Modal from "../components/Utils/Modal";
import { ENV } from "../shared/constants/services";
import "../styles/Machines.css";
import { GetMachines } from "../shared/services/Machines/getMachines";
import { PersistMachine } from "../shared/services/Machines/persistMachine";
import { checkIfUserIsLogged } from "../shared/services/checkIfIsLogged";

function Machines() {
  document.title = 'Power House | Máquinas';
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState('Agregar');
  const [data, setData] = useState({
    headers: [],
    content: [],
    total: 0
  });

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  const [machineToEdit, setMachineToEdit] = useState(null);

  const navigate = useNavigate();
  if (!checkIfUserIsLogged()) navigate('/');

  useEffect(() => {
    const machinesService = new GetMachines();
    const headers = [
      { name: 'ID', access: 'id' },
      { name: 'Nombre', access: 'name' },
      { name: 'Descripción', access: 'description' },
      { name: 'Grupo Muscular', access: 'muscleGroup' },
      { name: 'Cantidad', access: 'quantity' },
      { name: 'Imagen', access: 'image' },
      { name: 'Acciones', access: 'form_actions' }
    ];
    machinesService.withPagination(pagination).then((machinesPaginated) => {
      const content = machinesPaginated.data;

      setData((oldData) => {
        return {
          ...oldData,
          headers,
          content,
          total: machinesPaginated.total
        }
      });
    }).catch((e) => {
      setData({
        headers: [],
        content: [],
        total: 0
      });
      if (ENV === 'dev') {
        console.error(e);
      }
    });
  }, [pagination]);

  const toggleModal = ({ item = null } = {}) => {
    setShowModal((lastShow) => !lastShow);
    if (item) {
      setMachineToEdit(item);
      setOperation('Editar');
    } else {
      setMachineToEdit(null);
      setOperation('Agregar');
    }
  }

  const handleDelete = ({ id }) => {
    const persistMachine = new PersistMachine();
    persistMachine.deleteById({ machineId: id }).then((res) => {
      const machinesService = new GetMachines();
      machinesService.withPagination(pagination).then((res) => {
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
        onClick: toggleModal,
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
      <h1>Máquinas</h1>
      <div className="overflow_table">
        <DataTable model={'Máquinas'} data={data} form_actions={formActions} pagination={pagination} setPagination={setPagination} toggleModal={toggleModal} register_button />
      </div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <MachineForm setData={setData} toggleModal={toggleModal} operation={operation} machineToEdit={machineToEdit} pagination={pagination} setPagination={setPagination} />
        </Modal>
      )}
    </div>
  )
}

export default Machines;