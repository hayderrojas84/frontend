import React, { useEffect, useState } from 'react';
import { ENV } from '../../shared/constants/services.js';
import "../../styles/RoutinesForm.css";
import { GetExercises } from '../../shared/services/Exercises/getExercises.js';
import { GetRoutines } from '../../shared/services/Routines/getRoutines.js';
import { PersistRoutine } from '../../shared/services/Routines/persistRoutine.js';
import { difficultyOptions, goalsOptions, muscleGroupOptions } from '../../shared/constants/selectOptions.js';
import FormComponent from '../Forms/FormComponent.jsx';
import FormField from '../Forms/FormField.jsx';
import SelectComponent from '../Forms/Select.jsx';

function RoutineForm({ setData = null, operation = 'Agregar', toggleModal = null, routineToEdit = null, setPagination = null, pagination = null }) {
  const [routine, setRoutine] = useState({
    name: routineToEdit?.name || '',
    description: routineToEdit?.description || '',
    difficulty: routineToEdit?.difficulty || '',
    goal: routineToEdit?.goal || '',
    muscleGroup: routineToEdit?.muscleGroup || ''
  });

  const [exercisesSelected, setExercisesSelected] = useState([]);

  const [exercises, setExercises] = useState([]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (routineToEdit) {
      if (routineToEdit.exercises && routineToEdit.exercises.length) setExercisesSelected(routineToEdit.exercises.map(exercise => `${exercise.id}`) || []);

      const getExercises = new GetExercises();
      getExercises.list({
        params: {
          muscleGroup: routineToEdit.muscleGroup
        }
      }).then((exercisesList) => {
        setExercises(exercisesList);
      }).catch(e => {
        if (ENV === 'dev') {
          console.error(e);
        }
      })
    }
  }, [routineToEdit])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRoutine({
      ...routine,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    if (selectedOptions) setExercisesSelected((sel) => {
      if (!sel.includes(selectedOptions[0])) return [...sel, ...selectedOptions]
      return [...sel];
    });
    e.target.value = '';
  }

  const handleDeleteSelectedExercises = () => {
    setExercisesSelected([]);
  }
  const handleSelectGoal = (e) => {
    setRoutine({
      ...routine,
      goal: e.target.selectedOptions[0].value
    })
  }

  const handleSelectDifficulty = (e) => {
    setRoutine({
      ...routine,
      difficulty: e.target.selectedOptions[0].value
    })
  }

  const handleSelectMuscleGroup = (e) => {
    const muscleGroup = e.target.selectedOptions[0].value;
    setRoutine({
      ...routine,
      muscleGroup
    });

    if (muscleGroup) {
      setExercisesSelected([]);
      if (routineToEdit && muscleGroup === routineToEdit.muscleGroup) {
        setExercisesSelected(routineToEdit.exercises.map(exercise => `${exercise.id}`));
      }
      const getExercises = new GetExercises();
      getExercises.list({
        params: {
          muscleGroup
        }
      }).then((exercisesList) => {
        setExercises(exercisesList);
      }).catch(e => {
        if (ENV === 'dev') {
          console.error(e);
        }
      })
    } else {
      setExercises([]);
      setExercisesSelected([]);
    }
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      routine,
      exercises: exercisesSelected
    }

    const persistRoutine = new PersistRoutine();
    const getRoutines = new GetRoutines();
    if (routineToEdit) {
      persistRoutine.update({ data, routineId: routineToEdit.id })
        .then((_res) => {
          if (setData && pagination) {
            getRoutines.withPagination(pagination).then((res) => {
              setData((oldData) => {
                return {
                  ...oldData,
                  content: res.data,
                  total: res.total
                }
              });
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
            });
          }
          if (toggleModal) toggleModal();
        })
        .catch((e) => {
          if (ENV === 'dev') {
            console.error(e);
          }
        });
    } else {
      persistRoutine.create({ data })
        .then((res) => {
          if (setData && pagination) {
            getRoutines.withPagination(pagination).then((res) => {
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
              if (setData && setPagination) {
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
                })
              }
            })
          }
          if (toggleModal) toggleModal();
        })
        .catch((e) => {
          if (ENV === 'dev') {
            console.error(e);
          }
          if (e.response?.data) setErrors(e.response.data);

        });
    }
  };



  return (
    <FormComponent handleSubmit={handleSubmit} operation={operation} model={'Rutina'} className={'grid c2_1fr'}>
      <FormField errors={errors.name} label={'Nombre'} spanClass="span_in">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          onChange={handleInputChange}
          value={routine.name}
        />
      </FormField>
      <FormField errors={errors.description} label={'Descripción'} spanClass="span_in">
        <textarea
          type="text"
          name="description"
          placeholder="Descripción"
          onChange={handleInputChange}
          value={routine.description}
        />
      </FormField>
      <FormField errors={errors.difficulty} label={'Dificultad'} spanClass="span_in">
        <SelectComponent onChange={handleSelectDifficulty} defaultValue={routine.difficulty} name={'Dificultad'} model={'difficulty'} options={difficultyOptions} />
      </FormField>

      <FormField errors={errors.goal} label={'Objetivo'} spanClass="span_in">
        <SelectComponent onChange={handleSelectGoal} defaultValue={routine.goal} name={'Objetivo'} model={'goal'} options={goalsOptions} />
      </FormField>
      <FormField errors={errors.muscleGroup} label={'Grupo Muscular'} spanClass="span_in">
        <SelectComponent onChange={handleSelectMuscleGroup} name={'Grupo Muscular'} defaultValue={routine.muscleGroup} model={'muscleGroup'} options={muscleGroupOptions} />
      </FormField>
      <div>
        <FormField errors={errors.exercises} label={'Ejercicios'} spanClass="span_in">
          <SelectComponent onChange={handleSelectChange} disabled={!exercises.length} name={'Ejercicios'} model={'exercises'} options={exercises} />
        </FormField>
        {exercisesSelected.length ? (
          <p>Ejercicios seleccionados: {exercises.filter((exercise) => exercisesSelected.includes(`${exercise.id}`))?.map((exercise) => exercise.name).join(', ')} <button type="button" onClick={handleDeleteSelectedExercises}>Limpiar</button></p>
        ) : ('')}
      </div>
    </FormComponent>
  )
}

export default RoutineForm;
