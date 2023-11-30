import React, { useEffect, useState } from 'react';
import { ENV } from '../../shared/constants/services.js';
import "../../styles/ExercisesForm.css";
import { GetExercises } from '../../shared/services/Exercises/getExercises.js';
import { PersistExercise } from '../../shared/services/Exercises/persistExercise.js';
import { GetMachines } from '../../shared/services/Machines/getMachines.js';
import { muscleGroupOptions } from '../../shared/constants/selectOptions.js';
import FormComponent from '../Forms/FormComponent.jsx';
import FormField from '../Forms/FormField.jsx';
import SelectComponent from '../Forms/Select.jsx';

function ExerciseForm({ setData = null, operation = 'Agregar', toggleModal = null, exerciseToEdit = null, pagination = null, setPagination = null }) {
  const [exercise, setExercise] = useState({
    name: exerciseToEdit?.name || '',
    muscleGroup: exerciseToEdit?.muscleGroup || '',
    description: exerciseToEdit?.description || ''
  });

  const [machines, setMachines] = useState([]);

  const [selectedMachines, setSelectedMachines] = useState([]);

  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (exerciseToEdit) {
      setSelectedMachines(exerciseToEdit.machines.map(mach => `${mach.id}`));
      if (exerciseToEdit.muscleGroup) {
        const getMachines = new GetMachines();

        getMachines.list({
          params: {
            muscleGroup: exerciseToEdit.muscleGroup
          }
        }).then((machinesList) => {
          setMachines(machinesList)
        }).catch((e) => {
          if (ENV === 'dev') console.error(e);
        })
      }
    }
  }, [exerciseToEdit]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExercise({
      ...exercise,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    if (selectedOptions) setSelectedMachines((sel) => {
      if (!sel.includes(selectedOptions[0])) return [...sel, ...selectedOptions]
      return [...sel];
    });
    e.target.value = '';
  }

  const handleSelectMuscleGroup = (e) => {
    const muscleGroup = e.target.selectedOptions[0].value;
    setExercise({
      ...exercise,
      muscleGroup
    });

    if (muscleGroup) {
      const getMachines = new GetMachines();
      setSelectedMachines([]);
      if (exerciseToEdit && muscleGroup === exerciseToEdit.muscleGroup) {
        setSelectedMachines(exerciseToEdit.machines.map(mach => `${mach.id}`));
      }
      getMachines.list({
        params: {
          muscleGroup
        }
      }).then((machinesList) => {
        setMachines(machinesList);
      }).catch((e) => {
        if (ENV === 'dev') console.error(e);
      })
    } else {
      setMachines([]);
      setSelectedMachines([]);
    }
  }

  const handleDeleteSelectedMachines = () => {
    setSelectedMachines([]);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append('exercise', JSON.stringify(exercise));
    formData.append('machines', JSON.stringify(selectedMachines));
    if (image) formData.append('image', image);

    const persistExercise = new PersistExercise();
    const getExercises = new GetExercises();
    if (exerciseToEdit) {
      persistExercise.update({ data: formData, exerciseId: exerciseToEdit.id })
        .then((res) => {
          if (setData) {
            getExercises.withPagination(pagination)
              .then((exercisesPaginated) => {
                setData((oldData) => {
                  return {
                    ...oldData,
                    content: exercisesPaginated.data,
                    total: exercisesPaginated.total
                  }
                })
                if (toggleModal) toggleModal();
              })
              .catch((e) => {
                if (ENV === 'dev') {
                  console.error(e);
                }
                setData((oldData) => {
                  return {
                    ...oldData,
                    content: [],
                    total: 0
                  }
                })
              });
          } else {
            if (toggleModal) toggleModal();
          }
        })
        .catch((e) => {
          if (ENV === 'dev') {
            console.error(e);
          }
          if (e.response?.data) setErrors(e.response.data);
        });
    } else {
      persistExercise.create({ data: formData })
        .then((res) => {
          if (setData) {
            getExercises.withPagination(pagination)
              .then((exercisesPaginated) => {
                setData((oldData) => {
                  return {
                    ...oldData,
                    content: exercisesPaginated.data,
                    total: exercisesPaginated.total
                  }
                });

                setPagination((oldPagination) => {
                  return {
                    ...oldPagination,
                    page: exercisesPaginated.page
                  }
                })
                if (toggleModal) toggleModal();
              })
              .catch((e) => {
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

                setPagination((oldPagination) => {
                  return {
                    ...oldPagination,
                    page: 1
                  }
                })
              });
          } else {
            if (toggleModal) toggleModal();
          }
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
    <FormComponent operation={operation} handleSubmit={handleSubmit} model={'Ejercicio'} className={'grid c2_1fr'}>
      <FormField errors={errors.name} label={'Nombre'} spanClass='span_in'>
        <input
          type="text"
          name="name"
          placeholder="Nombre del ejercicio"
          onChange={handleInputChange}
          value={exercise.name}
        />
      </FormField>
      <FormField errors={errors.muscleGroup} label={'Grupo Muscular'} spanClass="span_in">
        <SelectComponent onChange={handleSelectMuscleGroup} name={'Grupo Muscular'} defaultValue={exercise.muscleGroup} model={'muscleGroup'} options={muscleGroupOptions} />
      </FormField>
      <FormField errors={errors.description} label={'Descripción'} spanClass="span_in">
        <textarea
          type="text"
          name="description"
          placeholder="Descripción del ejercicio"
          onChange={handleInputChange}
          value={exercise.description}
        />
      </FormField>
      <div>
        <FormField label={'Máquinas'} spanClass="span_in">
          <SelectComponent onChange={handleSelectChange} name='Máquina' model='machines' disabled={!machines.length} options={machines} />
        </FormField>
        {selectedMachines.length ? (<p>Maquinas seleccionadas: {machines.filter((mach) => selectedMachines.includes(`${mach.id}`))?.map((mach) => mach.name).join(', ')} <button type="button" onClick={handleDeleteSelectedMachines}>Eliminar seleccionadas</button></p>) : ('')}
      </div>
      <div>
        {(exerciseToEdit?.image) && (
          <>
            <small>Actual:</small>
            <img src={exerciseToEdit.image} alt={exerciseToEdit.name} width={75} />
          </>
        )}
        <FormField label={'Imagen'} spanClass="span_in">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </FormField>
      </div>
    </FormComponent>
  );
}

export default ExerciseForm;
