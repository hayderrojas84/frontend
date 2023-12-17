import { useState } from "react";
import { ENV } from "../../shared/constants/services";
import { GetMaintenances } from "../../shared/services/Maintenances/getMaintenances";
import { PersistMaintenance } from "../../shared/services/Maintenances/persistMaintenances";
import FormComponent from "../Forms/FormComponent";
import FormField from "../Forms/FormField";

function MaintenanceForm({ toggleModal, machineId, setData = null, setPagination = null, pagination = null }) {

  const [maintenance, setMaintenance] = useState({ machineId });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') setMaintenance({ ...maintenance, startDate: value });
    if (name === 'endDate') setMaintenance({ ...maintenance, endDate: value });
    if (name === 'value') setMaintenance({ ...maintenance, value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const persistMaintenance = new PersistMaintenance();
    persistMaintenance.create({ data: maintenance })
      .then((res) => {
        const getMaintenances = new GetMaintenances();
        getMaintenances.withPagination(pagination).then((maintenancesPaginated) => {
          setData((oldData) => {
            return {
              ...oldData,
              content: maintenancesPaginated.data,
              total: maintenancesPaginated.total
            }
          });
          setPagination((oldPagination) => {
            return {
              ...oldPagination,
              page: maintenancesPaginated.page,
              perPage: maintenancesPaginated.perPage
            }
          })
          toggleModal(); 
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
      })
      .catch((e) => {
        if (ENV === 'dev') {
          console.error(e);
        }
        if (e.response?.data) setErrors(e.response.data);
      });
  }

  return (
    <FormComponent model="Mantenimiento" handleSubmit={handleSubmit} showAlert className="grid c2_1fr">
      <FormField errors={errors.startDate} label={'Fecha de inicio'} spanClass="span_in">
        <input
          type="date"
          name="startDate"
          onChange={handleInputChange}
        />
      </FormField>
      <FormField errors={errors.endDate} label={'Fecha de finalización'} spanClass="span_in">
        <input
          type="date"
          name="endDate"
          onChange={handleInputChange}
        />
      </FormField>
      <FormField errors={errors.value} label={'Valor'} spanClass="span_in">
        <input
          type="number"
          name="value"
          onChange={handleInputChange}
          placeholder="Valor"
        />
      </FormField>
    </FormComponent>
  )

}

export default MaintenanceForm;