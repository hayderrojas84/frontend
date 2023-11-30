import { powerHouseApi } from "../../utils/axios";

export class PersistExercise {
  async create({ data }) {
    return powerHouseApi.post('/exercises/create/', data).then((res) => res.data);
  }

  async update({ data, exerciseId }) {
    return powerHouseApi.put(`/exercises/${exerciseId}/update/`, data).then((res) => res.data);
  }

  async deleteById({ exerciseId }) {
    return powerHouseApi.delete(`/exercises/${exerciseId}/delete/`).then((res) => res.data);
  }
}