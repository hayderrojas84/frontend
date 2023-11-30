import { useState } from "react";
import FormComponent from "../Forms/FormComponent";
import FormField from "../Forms/FormField";
import SelectComponent from "../Forms/Select";
import { muscleGroupOptions } from "../../shared/constants/selectOptions";
import { PersistMachine } from "../../shared/services/Machines/persistMachine";
import { GetMachines } from "../../shared/services/Machines/getMachines";
import { ENV } from "../../shared/constants/services";

function MachineForm({ setData = null, toggleModal = null, machineToEdit = null, operation = 'Agregar', pagination = null, setPagination = null }) {
  const [errors, setErrors] = useState({});
  const [machine, setMachine] = useState({
    name: machineToEdit?.name || '',
    description: machineToEdit?.description || '',
    muscleGroup: machineToEdit?.muscleGroup || '',
    quantity: machineToEdit?.quantity || 1,
  });

  const [image, setImage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMachine({
      ...machine,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('machine', JSON.stringify(machine));
    if (image) {
      formData.append('image', image);
    }

    const persistMachine = new PersistMachine();
    const getMachines = new GetMachines();

    if (machineToEdit) {
      persistMachine.update({ data: formData, machineId: machineToEdit.id }).then((res) => {
        if (setData) {
          getMachines.withPagination(pagination).then((res) => {
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
      }).catch((e) => {
        if (e.response?.data) setErrors(e.response.data);
      });
    } else {
      persistMachine.create({ data: formData }).then((res) => {
        getMachines.withPagination(pagination).then((res) => {
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
        if (toggleModal) toggleModal();
      }).catch((e) => {
        if (e.response?.data) setErrors(e.response.data);
      });
    }
  };

  const handleSelectChange = (e) => {
    setMachine({
      ...machine,
      muscleGroup: e.target.selectedOptions[0].value
    })
  }

  return (
    <FormComponent className={'grid c2_1fr'} enctype={'multipart/form-data'} model={'Máquina'} operation={operation} handleSubmit={handleSubmit}>
      <FormField errors={errors.name ?? []} label={'Nombre'} spanClass="span_in">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          onChange={handleInputChange}
          value={machine.name}
        />
      </FormField>
      <div>
        {(machineToEdit?.image) && (
          <>
            <small>Actual:</small>
            <img src={machineToEdit.image} alt={machineToEdit.name} width={75} />
          </>
        )}
        <FormField errors={errors.image ?? []} label={'Imagen'} spanClass="span_in">
          <input
            type="file"
            name="image"
            accept="image/*"
            placeholder="Imagen"
            onChange={handleFileChange}
          />
        </FormField>
      </div>

      <FormField errors={errors.description ?? []} label={'Descripción'} spanClass="span_in">
        <textarea
          placeholder="Descripción"
          name="description"
          onChange={handleInputChange}
          value={machine.description}
        />
      </FormField>
      <FormField errors={errors.muscleGroup ?? []} label={'Grupo muscular'} spanClass="span_in">
        <SelectComponent onChange={handleSelectChange} model="muscleGroup" name="Grupo muscular" defaultValue={machine.muscleGroup} options={muscleGroupOptions} />
      </FormField>
      <FormField errors={errors.quantity ?? []} label={'Cantidad'} spanClass="span_in">
        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={machine.quantity}
          min="1"
          onChange={handleInputChange}
        />
      </FormField>
    </FormComponent>
  )
}

export default MachineForm;