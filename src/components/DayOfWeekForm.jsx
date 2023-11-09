import { API_URL } from "../consts";
import axios from "../utils/axios";
import { useState } from "react";

function DayOfWeekForm({routineId, peopleId, setRoutineSchedules, toggleModal, toggleShowDaysModal}) {
    const [day,setDay]=useState(null)
    
    const handleSelectChange=(e)=> {
        const value=e.target.selectedOptions[0].value;
        setDay (value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${API_URL}/routineSchedules/create/`, {
            peopleId,
            routineId,
            dayOfWeek:day
        }).then((res) => {
            const {id} = res.data;
            axios.get(`${API_URL}/routineSchedules/${id}/`)
                .then((res) => {
                    setRoutineSchedules((oldRs) => [...oldRs, res.data]);
                    toggleShowDaysModal();
                    toggleModal();
                })
                .catch((e) => console.error(e));
        }).catch((e) => console.error(e));
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="day">Seleccione el día de la semana</label>
            <select name="day" id="day" onChange={handleSelectChange} required>
                <option value="">SELECCIONE</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miercoles">Miercoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sabado">Sabado</option>
                <option value="Domingo">Domingo</option>
            </select>
            <button>Guardar</button>
        </form>
    )
    
}
export default DayOfWeekForm;