import { powerHouseApi } from "../../utils/axios";

export class GetRoutineSchedules {
  async byId({ routineId }) {
    return powerHouseApi.get(`/routineSchedules/${routineId}/`).then((res) => res.data);
  }

  async list({ params = {} } = {}) {
    return powerHouseApi.get('/routineSchedules/', { params }).then((res) => res.data);
  }

  async listByPeopleId({ peopleId } = {}) {
    return powerHouseApi.get(`/routineSchedules/people/${peopleId}/`).then((res) => res.data);
  }
}