import { API_URL } from '../consts';
import axios from '../utils/axios';


function MachinesList ({ machines, setMachines }) {
  const handleDeleteMachine = (machineId) => {
    axios
      .delete(`${API_URL}/machines/${machineId}/delete/`)
      .then(() => {
        setMachines((prevMachines) =>
          prevMachines.filter((machine) => machine.id !== machineId)
        );
      })
      .catch((e) => console.error(e));
  };
  return (
    <div>
      {
        machines.map((machine) => {
          return (
            <div key={machine.id}>
              <h2>{machine.name}</h2>
              <p>{machine.description}</p>
              {machine.image && (
                <img src={machine.image} alt={machine.name} width="250px"/>
              )}
              <button onClick={() => handleDeleteMachine(machine.id)}>Eliminar</button>
            </div>
            
          )
        })
      }
    </div>
  )
}

export default MachinesList