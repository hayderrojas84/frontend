import UserForm from "../components/Users/UserForm";
import '../styles/UserCreation.css';

function UserCreation () {
  document.title = 'Power House | Login | Registro'
  
  return (
    <div className="user-creation-container">
      <UserForm operation="Registrar" from="login" />
    </div>
  )
}

export default UserCreation;