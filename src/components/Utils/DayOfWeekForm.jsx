import { ENV } from "../../shared/constants/services";
import { useState } from "react";
import FormComponent from "../Forms/FormComponent";
import FormField from "../Forms/FormField";
import SelectComponent from "../Forms/Select";
import { diasDeLaSemana } from "../../shared/constants/selectOptions";
import { GetRoutineSchedules } from "../../shared/services/RoutineSchedules/getRoutineSchedules";
import { PersistRoutineSchedule } from "../../shared/services/RoutineSchedules/persistRoutineSchedule";

function DayOfWeekForm({ routineId, peopleId, setData, toggleModal, toggleShowDaysModal }) {
  const [dayOfWeek, setDayOfWeek] = useState(null)

  const handleSelectChange = (e) => {
    const value = e.target.selectedOptions[0].value;
    setDayOfWeek(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const getRoutineSchedules = new GetRoutineSchedules();
    const persistRoutineSchedule = new PersistRoutineSchedule()

    persistRoutineSchedule.create({
      data: {
        peopleId,
        routineId,
        dayOfWeek
      }
    }).then((res) => {
      getRoutineSchedules.list({
        params: {
          peopleId
        }
      })
        .then((routineSchedules) => {
          if (setData) {
            setData((oldData) => {
              return {
                ...oldData,
                content: routineSchedules,
                total: routineSchedules.length
              }
            });
          }
          toggleShowDaysModal();
          toggleModal();
        })
        .catch((e) => {
          if (ENV === 'dev') {
            console.error(e);
          }
          if (setData) {
            setData((oldData) => {
              return {
                ...oldData,
                content: [],
                total: 0
              }
            });
          }
        });
    }).catch((e) => {
      if (ENV === 'dev') {
        console.error(e);
      }
    });
  }

  return (
    <FormComponent handleSubmit={handleSubmit}>
      <FormField label={'Día de la semana'} spanClass="span_in">
        <SelectComponent onChange={handleSelectChange} name="Día de la semana" model="dayOfWeek" required options={diasDeLaSemana}/>
      </FormField>
    </FormComponent>
    
  )

}
export default DayOfWeekForm;