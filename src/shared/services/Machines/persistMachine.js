import { powerHouseApi } from "../../utils/axios";

export class PersistMachine {
  async create({ data }) {
    return powerHouseApi.post('/machines/create/', data).then((res) => res.data);
  }

  async update({ data, machineId }) {
    return powerHouseApi.put(`/machines/${machineId}/update/`, data).then((res) => res.data);
  }

  async deleteById({ machineId }) {
    return powerHouseApi.delete(`/machines/${machineId}/delete/`).then((res) => res.data);
  }
}