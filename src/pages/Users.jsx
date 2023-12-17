import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/Users/UserForm";
import DataTable from "../components/Utils/DataTable";
import Modal from "../components/Utils/Modal";
import { ENV } from "../shared/constants/services";
import { paymentStatusOptions } from "../shared/constants/selectOptions";
import { checkIfUserIsLogged } from "../shared/services/checkIfIsLogged";
import { getUserLogged } from "../shared/services/getUserLogged";
import { GetUsers } from "../shared/services/Users/getUsers";
import { PersistUser } from "../shared/services/Users/persistUser";

function Users() {
  document.title = 'Power House | Usuarios';
  const [userLogged, setUserLogged] = useState(null)
  const [userToEdit, setUserToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState('Agregar');
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10
  })
  const [data, setData] = useState({
    headers: [],
    content: [],
    total: 0
  })

  const navigate = useNavigate();

  if (!checkIfUserIsLogged()) navigate('/');

  useEffect(() => {
    setUserLogged(getUserLogged());
    const headers = [
      { name: 'ID', access: 'id' },
      { name: 'Nombre de usuario', access: 'username' },
      { name: 'Identificación', access: 'people.identification' },
      { name: 'Nombres', access: 'people.names' },
      { name: 'Apellidos', access: 'people.lastnames' },
      { name: 'Correo Electrónico', access: 'people.email' },
      { name: 'Celular', access: 'people.mobile' },
      { name: 'Estado del pago', access: 'people.paymentStatus' },
      { name: 'Fotografía', access: 'people.image' },
      { name: 'Acciones', access: 'form_actions' }
    ];
    const getUsers = new GetUsers();
    getUsers.withPagination(pagination).then((usersPaginated) => {
      const content = usersPaginated.data.map((user) => {
        return {
          ...user,
          people: {
            ...user.people,
            age: user.people?.birthdate ? Math.floor(((new Date() - (new Date(user.people.birthdate))) / 31557600000)) : ''
          },
        }
      });
      setData((oldData) => {
        return {
          ...oldData,
          content,
          headers,
          total: usersPaginated.total
        }
      });
    }).catch((e) => {
      setData((oldData) => {
        return {
          ...oldData,
          content: [],
          total: 0
        }
      });
      if (ENV === 'dev') {
        console.error(e);
      }
    })

  }, [pagination]);

  const toggleModal = ({ item = null } = {}) => {
    if (item) {
      setUserToEdit(item);
      setOperation('Editar');
    } else {
      setUserToEdit(null);
      setOperation('Agregar');
    }
    setShowModal((lastShow) => !lastShow);
  };


  const handleMembership = ({ identification }) => {
    navigate(`/users/transactions/${identification}`);
  }

  const handleDelete = ({ id }) => {
    const persistUser = new PersistUser();
    try {
      persistUser.deleteById({ userId: id }).then((res) => {
        const getUsers = new GetUsers();
        getUsers.withPagination(pagination).then((res) => {
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
          setData((oldData) => {
            return {
              ...oldData,
              content: [],
              total: 0
            }
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
    } catch (e) {
      if (ENV === 'dev') {
        console.error(e);
      }
    }
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
    },
    {
      name: 'Membresía',
      attributes: {
        className: 'info',
        onClick: handleMembership
      }
    }
  ];

  const customFilters = [
    {
      name: 'Estado del pago',
      model: 'paymentStatus',
      type: 'select',
      options: paymentStatusOptions
    }
  ]



  return (
    <div className="text-center">
      <h1>Usuarios</h1>
      <div className="overflow_table">
        <DataTable register_button toggleModal={toggleModal} customFilters={customFilters} form_actions={formActions} data={data} pagination={pagination} setPagination={setPagination} model={'Usuarios'} userLogged={userLogged} />
      </div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <UserForm setData={setData} operation={operation} toggleModal={toggleModal} userToEdit={userToEdit} pagination={pagination} setPagination={setPagination} />
        </Modal>
      )}
    </div>
  )
}

export default Users;