import axios from "../utils/axios";
import { useEffect } from "react";
import { useState } from "react";
import { API_URL } from "../consts";
import Modal from "../components/Modal";
import RoutinesForm from "../components/RoutinesForm";
import ExercisesForm from "../components/ExercisesForm";

function RoutinesPage () {

    const [routines, setRoutines] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [showModalRoutine, setShowModalRoutine] = useState(false);
    const [showModalExercise, setShowModalExercise] = useState(false);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [operation, setOperation] = useState('Agregar');



    useEffect(() => {
        axios.get(`${API_URL}/routines/`)
            .then((res) => setRoutines(res.data))
            .catch((e) => console.error(e));

        axios.get(`${API_URL}/exercises/`)
            .then((res) => setExercises(res.data))
            .catch((e) => console.error(e));
    }, []);

    const toggleModalRoutine = (routineData = null, formOperation = null) => {
        if (routineData) {
            setRowToEdit(routineData);
        } else {
            setRowToEdit(null);
        }

        if (formOperation) {
            setOperation(formOperation);
        } else {
            setOperation('Agregar');
        }

        setShowModalRoutine((lastShow) => !lastShow);
    };

    const toggleDeleteRoutine = (id) => {
        axios.delete(`${API_URL}/routines/${id}/delete/`)
            .then((res) => setRoutines((oldRoutines) => oldRoutines.filter((routine) => routine.id !== id)))
            .catch((e) => console.error(e));
    }

    const toggleModalExercise = (exerciseData = null, formOperation = null) => {
        if (exerciseData) {
            setRowToEdit(exerciseData);
        } else {
            setRowToEdit(null);
        }

        if (formOperation) {
            setOperation(formOperation);
        } else {
            setOperation('Agregar');
        }
        
        setShowModalExercise((lastShow) => !lastShow);
    };

    const toggleDeleteExercise = (id) => {
        axios.delete(`${API_URL}/exercises/${id}/delete/`)
            .then((res) => setExercises((oldExercises) => oldExercises.filter((exercise) => exercise.id !== id)))
            .catch((e) => console.error(e));
    }

    

    return (
        <>
        <div className="container-routines-page">
            {(!showModalRoutine && ! showModalExercise) && (
                <>
                {!showModalRoutine && (<button onClick={() => {toggleModalRoutine(null, null)}}>Registrar nueva rutina</button>)}
            {routines.length ? (
                <div className="routines-info routines-table">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={6}>Rutinas</th>
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
                                            <button onClick={() => toggleModalRoutine(routine, 'Editar')}>Editar</button>
                                            <button onClick={() => toggleDeleteRoutine(routine.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                
            ) : (
                <div className="routines-info">
                    <p>No hay rutinas para mostrar...</p>
                </div>
            )}

            {(!showModalExercise) && (<button onClick={() => toggleModalExercise(null, null)}>Registrar nuevo ejercicio</button>)}
            {exercises.length ? (
                <div className="exercises-info exercises-table">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={5}>Ejercicios</th>
                            </tr>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <th>
                                    Nombre
                                </th>
                                <th>
                                    Grupo Muscular
                                </th>
                                <th>
                                    Descripción
                                </th>
                                <th>
                                    Imagen
                                </th>
                                <th>
                                    Máquinas
                                </th>
                                <th>
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercises.map((exercise) => {
                                return (
                                    <tr key={exercise.id}>
                                        <td>
                                            {exercise.id}
                                        </td>
                                        <td>
                                            {exercise.name}
                                        </td>
                                        <td>
                                            {exercise.muscleGroup}
                                        </td>
                                        <td>
                                            {exercise.description}
                                        </td>
                                        <td>
                                            {exercise.image ? (
                                                <img src={exercise.image} alt={exercise.name} width='150px' />
                                            )
                                            :
                                            (
                                                <>No tiene imagen</>
                                            )}
                                        </td>
                                        <td>
                                            {exercise.machines.length ? (
                                                <>{exercise.machines.map((machine) => machine.name).join(', ')}</>
                                            ) : (
                                                <>No tiene máquinas asociadas...</>
                                            )}
                                        </td>
                                        <td>
                                            <button onClick={() => toggleModalExercise(exercise, 'Editar')}>Editar</button>
                                            <button onClick={() => toggleDeleteExercise(exercise.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="exercises-info">
                    <p>No hay Ejercicios para mostrar...</p>
                </div>
            )}
                </>
            )}
        </div>

        {showModalRoutine && (
          <Modal onClose={() => toggleModalRoutine(null, null)}>
            <RoutinesForm setRoutines={setRoutines} operation={operation} toggleModal={toggleModalRoutine} routineToEdit={rowToEdit} />
          </Modal>
        )}

        {showModalExercise && (
          <Modal onClose={() => toggleModalExercise(null, null)}>
            <ExercisesForm setExercises={setExercises} operation={operation} toggleModal={toggleModalExercise} exerciseToEdit={rowToEdit} />
          </Modal>
        )}
        </>
    )
}

export default RoutinesPage;