import { useEffect, useState } from "react";
import MachinesForm from "../components/machinesForm";
import axios from "axios";
import MachinesList from "../components/machinesList";
import { API_URL } from "../consts";
import { checkIfUserIsLogged } from "../services/checkIfIsLogged";
import { useNavigate } from "react-router-dom";

function Inventory () {
  const [machines, setMachines] = useState([]);

  const navigate = useNavigate();
  if (!checkIfUserIsLogged()) navigate('/');

  useEffect(() => {
    axios.get(`${API_URL}/machines/`)
      .then((res) => setMachines(res.data))
      .catch((e) => console.error(e));
  }, []);

  

  return (
    <div>
      <h1 className="inventory">Gimnasio - Inventario de Máquinas</h1>
      <MachinesForm setMachines={setMachines}/>
      <MachinesList machines={machines} setMachines={setMachines} />
    </div>
  )
}

export default Inventory;