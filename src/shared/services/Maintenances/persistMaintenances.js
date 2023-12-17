import { powerHouseApi } from "../../utils/axios";

export class PersistMaintenance {
  async create({ data }) {
    return powerHouseApi.post('/maintenances/create/', data).then((res) => res.data);
  }
}