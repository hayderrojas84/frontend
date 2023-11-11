import { useNavigate } from "react-router-dom";
import { API_URL } from "../consts";
import axios from "../utils/axios";
import { useEffect, useState } from "react";
import { checkIfUserIsLogged } from "../services/checkIfIsLogged";
import UsersForm from "../components/UsersForm";
import Modal from "../components/Modal";
import { getUserLogged } from "../services/getUserLogged";

function Users() {

  const [userLogged, setUserLogged] = useState(null)
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const navigate = useNavigate();


  const toggleDelete = (id) => {
    axios.delete(`${API_URL}/users/${id}/delete/`)
      .then((_res) => setUsers((lastUsers) => lastUsers.filter((user) => user.id !== id)))
      .catch((e) => console.error(e));
  }

  const toggleModalCreate = () => {
    setShowModalCreate((lastShow) => !lastShow);
  };

  const toggleModalUpdate = (user) => {
    setShowModalUpdate((lastShow) => !lastShow);
    setUserToEdit(user)
  };

  const toggleMembership = (identification) => {
    navigate(`/transactions/${identification}`);
  }

  if (!checkIfUserIsLogged()) navigate('/');

  useEffect(() => {
    setUserLogged(getUserLogged())
    axios.get(`${API_URL}/users/`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div>
      {(!showModalCreate && !showModalUpdate) && (
        <>
        <button onClick={toggleModalCreate}>Registrar nuevo usuario</button>
        <div>
          <h2>LISTAR USUARIOS</h2>
        </div><table>
            <thead>
              <tr>
                <th>
                  ID
                </th>
                <th>
                  Identificación
                </th>
                <th>
                  Nombres
                </th>
                <th>
                  Apellidos
                </th>
                <th>
                  Edad
                </th>
                <th>
                  Correo
                </th>
                <th>
                  Teléfono
                </th>
                <th>
                  Estado de pago
                </th>
                <th>
                  Fotografia
                </th>
                <th>
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>
                      {user.id}
                    </td>
                    {user.people ? (
                      <>
                        <td>
                          {user.people.identification}
                        </td>
                        <td>
                          {user.people.names}
                        </td>
                        <td>
                          {user.people.lastnames}
                        </td>
                        <td>
                          {user.people.birthdate ? Math.floor(((new Date()-(new Date(user.people.birthdate)))/31557600000)):<></>}
                        </td>
                        <td>
                          {user.people.email}
                        </td>
                        <td>
                          {user.people.mobile}
                        </td>
                        <td>
                          {user.paymentStatus}
                        </td>
                        <td>
                          {user.people.image ? (
                            <img src={user.people.image} alt={user.username} width='250px' />
                          )
                            :
                            (
                              <>No tiene fotografia</>
                            )}
                        </td>
                      </>
                    ) : (
                      <td colSpan={7}></td>
                    )}
                    <td>
                      <div className="buttons">
                        <div className="actions">
                        <button onClick={() => toggleModalUpdate(user)} disabled={userLogged && userLogged.id === user.id}>Editar</button>
                        <button onClick={() => toggleDelete(user.id)} disabled={userLogged && userLogged.id === user.id}>Eliminar</button>
                        
                        </div>
                        <div className="membership">
                        <button onClick={() => toggleMembership(user.people.identification)}>Membresia</button>
                        </div>
                      </div>

                      
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table></>
      )}
      {showModalCreate && (
          <Modal onClose={toggleModalCreate}>
            <UsersForm setUsers={setUsers} operation="Agregar" toggleModal={toggleModalCreate} />
          </Modal>
        )}
      {showModalUpdate && (
        <Modal onClose={toggleModalUpdate}>
          <UsersForm setUsers={setUsers} operation="Editar" toggleModal={toggleModalUpdate} userToEdit={userToEdit} />
        </Modal>
      )}
    </div>
  )
}

export default Users;