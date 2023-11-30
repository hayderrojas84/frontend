import { powerHouseApi } from "../../utils/axios";


export class GetPeople {
  async byIdentification({ identification }) {
    return powerHouseApi.get(`/people/${identification}/`).then((res) => res.data);
  }

  async list({ params = {} } = {}) {
    return powerHouseApi.get('/people/', { params }).then((res) => res.data);
  }
}