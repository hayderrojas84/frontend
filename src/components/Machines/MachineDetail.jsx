import "../../styles/Machines.css"

export default function MachineDetail({machine}){
  return (
    <div>
      <h3>{machine.name}</h3>
      <p>{machine.description}</p>
      {machine.image ? (
        <div className="machine_image text-center">
          <img src={machine.image} alt={machine.name} />
        </div>
      ) : ''}
    </div>
  )
}