import { powerHouseApi } from "../../utils/axios";

export class PersistRoutineSchedule {
  async create({ data }) {
    return powerHouseApi.post('/routineSchedules/create/', data).then((res) => res.data);
  }

  async update({ data, id }) {
    return powerHouseApi.put(`/routineSchedules/${id}/update/`, data).then((res) => res.data);
  }

  async deleteById({ id }) {
    return powerHouseApi.delete(`/routineSchedules/${id}/delete/`).then((res) => res.data);
  }
}