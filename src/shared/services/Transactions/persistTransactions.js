import { powerHouseApi } from "../../utils/axios";

export class PersistTransaction {
  async create({ data }) {
    return powerHouseApi.post('/transactions/create/', data).then((res) => res.data);
  }

  async update({ data, id }) {
    return powerHouseApi.patch(`/transactions/${id}/update/`, data).then((res) => res.data);
  }

  async deleteById({ id }) {
    return powerHouseApi.delete(`/transactions/${id}/delete/`).then((res) => res.data);
  }
}