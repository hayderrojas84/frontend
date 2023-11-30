import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ENV } from "../shared/constants/services";
import "../styles/RoutineSchedule.css";
import Modal from "../components/Utils/Modal";
import MachineDetail from "../components/Machines/MachineDetail";
import { GetRoutineSchedules } from "../shared/services/RoutineSchedules/getRoutineSchedules";

export default function RoutineScheduleDetail() {
  document.title = 'Power House | Cliente | Rutina';
  const [routineSchedule, setRoutineSchedule] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [machineShowed, setMachineShowed] = useState(null);

  const { identification, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getRoutineSchedules = new GetRoutineSchedules();
    getRoutineSchedules.byId({ routineId: id })
      .then((routineSchedule) => setRoutineSchedule(routineSchedule))
      .catch((e) => {
        if (ENV === 'dev') {
          console.error(e);
        }
        navigate(`/client/${identification}`);
      })
  }, [id, identification, navigate]);

  const handleBack = () => {
    navigate(`/client/${identification}`)
  }

  const toggleModal = ({machine = null} = {}) => {
    setShowModal((oldShow) => !oldShow);
    if (machine){
      setMachineShowed(machine);
    } else {
      setMachineShowed(null);
    }
  }
  if (routineSchedule && routineSchedule.routine) return (
    <div>
      <button className="primary" onClick={handleBack}>Volver</button>
      <div className="routine_schedule_data">
        <h1 className="text-center">{routineSchedule.routine.name}</h1>
        <div className="routine_data">
          <div className="grid c2_1fr grid-center">
            <p><strong>Dificultad:</strong> {routineSchedule.routine.difficulty}</p>
            <p><strong>Objetivo:</strong> {routineSchedule.routine.goal}</p>
            <p><strong>Grupo muscular:</strong> {routineSchedule.routine.muscleGroup}</p>
            <p><strong>Día de la semana:</strong> {routineSchedule.dayOfWeek}</p>
          </div>
          <p className="routine_description text-center">{routineSchedule.routine.description}</p>

        </div>
        {routineSchedule.routine.exercises.length > 0 ? (
          <div className="routine_exercises">
            <h3>Ejercicios:</h3>
            {routineSchedule.routine.exercises.map((exercise) => {
              return (
                <div className="routine_exercise_container" key={exercise.id}>
                <div className="exercise_data" >
                  <div className="exercise_info">
                    <h4>{exercise.name}</h4>
                    <p>{exercise.description}</p>
                    {exercise.machines.length > 0 ? (
                    <p>Máquinas: {exercise.machines.map((machine) => (
                      <span key={machine.id} onClick={() => toggleModal({machine})}>{machine.name}</span>
                    ))}</p>
                ) : ('')}
                  </div>
                  {exercise.image ? (
                    <div className="exercise_image">
                      <img src={exercise.image} alt={exercise.name} />
                    </div>
                  ) : ''}
                  <div></div>
                </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p>No hay ejercicios en esta rutina.</p>
        )}
      </div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <MachineDetail machine={machineShowed} />
        </Modal>
      )}
    </div>
  )

  return ('')
}