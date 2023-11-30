import { useState } from "react";
import { API_URL, ENV } from "../../shared/constants/services";
import Modal from "../Utils/Modal";
import DayOfWeekForm from "../Utils/DayOfWeekForm";
import FormComponent from "../Forms/FormComponent";
import FormField from "../Forms/FormField";
import SelectComponent from "../Forms/Select";
import { difficultyOptions, goalsOptions, muscleGroupOptions } from "../../shared/constants/selectOptions";
import { api } from "../../shared/utils/axios";

function RoutineSchedulesSelection({ peopleId, toggleModal, setData }) {

  const [routines, setRoutines] = useState([])

  const [goal, setGoal] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [muscleGroup, setMuscleGroup] = useState(null);

  const [showDaysModal, setShowDaysModal] = useState(false);

  const [routineId, setRoutineId] = useState(null);

  const handleSelectChange = (e) => {
    const { name, selectedOptions } = e.target;
    const { value } = selectedOptions[0];

    if (name === 'goal') {
      setGoal(value);
    }
    if (name === 'difficulty') {
      setDifficulty(value);
    }
    if (name === 'muscleGroup') {
      setMuscleGroup(value);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let params = {}

    if (goal) params.goal = goal;
    if (difficulty) params.difficulty = difficulty;
    if (muscleGroup) params.muscleGroup = muscleGroup;

    api.get(`${API_URL}/routines/`, { params })
      .then((res) => setRoutines(res.data))
      .catch((e) => {
        if (ENV === 'dev') {
          console.error(e);
        }
      });
  }

  const toggleShowDaysModal = () => {
    setShowDaysModal((lastShow) => !lastShow);
  }

  return (
    <>
      {showDaysModal && (
        <Modal onClose={toggleShowDaysModal}>
          <DayOfWeekForm toggleModal={toggleModal} toggleShowDaysModal={toggleShowDaysModal} peopleId={peopleId} setData={setData} routineId={routineId} />
        </Modal>
      )}
      <FormComponent handleSubmit={handleSubmit} model="Rutina" operation="Buscar" className="grid r_1fr">
        <FormField label={'Objetivo'} spanClass="span_in">
          <SelectComponent onChange={handleSelectChange} model="goal" name="Objetivo" options={goalsOptions}/>
        </FormField>
        <FormField label={'Dificultad'} spanClass="span_in">
          <SelectComponent onChange={handleSelectChange} model="difficulty" name="Dificultad" options={difficultyOptions}/>
        </FormField>
        <FormField label={'Grupo muscular'} spanClass="span_in">
          <SelectComponent onChange={handleSelectChange} model="muscleGroup" name="Grupo muscular" options={muscleGroupOptions}/>
        </FormField>
      </FormComponent>
      <div>
        {routines.length ? (
          <table>
            <thead>
              <tr>
                <th colSpan={8}>
                  Rutinas encontradas
                </th>
              </tr>
              <tr>
                <th>
                  ID
                </th>
                <th>
                  Nombre
                </th>
                <th>
                  Descripción
                </th>
                <th>
                  Dificultad
                </th>
                <th>
                  Objetivo
                </th>
                <th>
                  Grupo muscular
                </th>
                <th>
                  Ejercicios
                </th>
                <th>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {routines.map((routine) => {
                return (
                  <tr key={routine.id}>
                    <td>
                      {routine.id}
                    </td>
                    <td>
                      {routine.name}
                    </td>
                    <td>
                      {routine.description}
                    </td>
                    <td>
                      {routine.difficulty}
                    </td>
                    <td>
                      {routine.goal}
                    </td>
                    <td>
                      {routine.muscleGroup}
                    </td>
                    <td>
                      {routine.exercises.length ? (
                        routine.exercises.map(exercise => exercise.name).join(", ")

                      ) : (
                        <>No hay ejercicios</>
                      )}
                    </td>
                    <td>
                      <button onClick={() => {
                        setRoutineId(routine.id);
                        toggleShowDaysModal();
                      }}>Seleccionar rutina</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default RoutineSchedulesSelection;