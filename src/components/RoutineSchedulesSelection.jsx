import { useState } from "react";
import { API_URL } from "../consts";
import axios from "../utils/axios";
import Modal from "./Modal";
import DayOfWeekForm from "./DayOfWeekForm";

function RoutineSchedulesSelection ({peopleId, toggleModal, setRoutineSchedules}) {

    const [routines, setRoutines] = useState([])

    const [goal, setGoal] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    const [muscleGroup, setMuscleGroup] = useState(null);

    const [showDaysModal, setShowDaysModal] = useState(false);

    const [routineId, setRoutineId] = useState(null);

    const handleSelectChange = (e) => {
        const { name, selectedOptions } = e.target;
        const { value } = selectedOptions[0];

        if (name === 'goal'){
            setGoal(value);
        }
        if (name === 'difficulty'){
            setDifficulty(value);
        }
        if (name === 'muscleGroup'){
            setMuscleGroup(value);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let params = {}

        if (goal) params.goal = goal;
        if (difficulty) params.difficulty = difficulty;
        if (muscleGroup) params.muscleGroup = muscleGroup;
        
        axios.get(`${API_URL}/routines/`, {params})
            .then((res) => setRoutines(res.data))
            .catch((e) => console.error(e));
    }

    const toggleShowDaysModal = () => {
        setShowDaysModal((lastShow) => !lastShow);
    }

    return (
        <>
        {showDaysModal ? (
            <Modal onClose={toggleShowDaysModal}>
                <DayOfWeekForm toggleModal={toggleModal} toggleShowDaysModal={toggleShowDaysModal} peopleId={peopleId} setRoutineSchedules={setRoutineSchedules} routineId={routineId} />
            </Modal>
        ) : (
            <>
            <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="goal">Objetivo</label>
                <select name="goal" id="goal" onChange={handleSelectChange}>
                    <option value="">SELECCIONE</option>
                    <option value="Bajar de peso">Bajar de peso</option>
                    <option value="Definir">Definir</option>
                    <option value="Tonificar">Tonificar</option>
                </select>
            </div>
            <div>
                <label htmlFor="difficulty">Dificultad</label>
                <select name="difficulty" id="difficulty" onChange={handleSelectChange}>
                    <option value="">SELECCIONE</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                </select>
            </div>
            <div>
                <label htmlFor="muscleGroup">Grupo muscular</label>
                <select name="muscleGroup" id="muscleGroup" onChange={handleSelectChange}>
                    <option value="">SELECCIONE</option>
                    <option value="Pecho">Pecho</option>
                    <option value="Espalda">Espalda</option>
                    <option value="Piernas">Piernas</option>
                    <option value="Brazos">Brazos</option>
                    <option value="Hombros">Hombros</option>
                    <option value="Abdominales">Abdominales</option>
                </select>
            </div>
            <button>Buscar</button>
        </form>
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
                                    routine.exercises.map(exercise=>exercise.name).join(", ")

                                ): (
                                    <>No hay ejercicios</> 
                                )}
                            </td>
                            <td>
                                <button onClick={()=>{
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
        </>
        )}
        </>
    )
}

export default RoutineSchedulesSelection;