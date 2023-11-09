import { API_URL } from "../consts";
import axios from "../utils/axios";
import { useEffect } from "react";

function RoutineSchedulesTable ({peopleId, setRoutineSchedules, routineSchedules}){
    

    useEffect(() => {
        axios.get(`${API_URL}/routineSchedules/${peopleId}`)
            .then((res) => setRoutineSchedules(res.data))
            .catch((e) => console.error(e));
    }, [peopleId, setRoutineSchedules]);

    return (
        <div>
        {routineSchedules.length ? (
            <table className="routineSchedules-table">
                <thead>
                    <tr>
                        <th colSpan={5}>Rutinas del cliente</th>
                    </tr>
                </thead>
            </table>
        ) : (
        <p>No hay rutinas seleccionadas...</p>
        )}
        </div>
    )
}

export default RoutineSchedulesTable;