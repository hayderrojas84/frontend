import { powerHouseApi } from "../../utils/axios";

export class PersistRoutine {
  async create({ data }) {
    return powerHouseApi.post('/routines/create/', data).then((res) => res.data);
  }

  async update({ data, routineId }) {
    return powerHouseApi.put(`/routines/${routineId}/update/`, data).then((res) => res.data);
  }

  async deleteById({ routineId }) {
    return powerHouseApi.delete(`/routines/${routineId}/delete/`).then((res) => res.data);
  }
}