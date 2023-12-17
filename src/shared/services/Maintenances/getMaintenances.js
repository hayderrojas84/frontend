import { powerHouseApi } from "../../utils/axios";

export class GetMaintenances {
  async byId({ id }) {
    return powerHouseApi.get(`/maintenances/${id}/`).then((res) => res.data);
  }

  async list({ params = {} } = {}) {
    return powerHouseApi.get('/maintenances/', { params }).then((res) => res.data);
  }

  async withPagination({ page = null, perPage = null, sort = null, order = null, search = null, machineId = null } = {}) {
    const queryParams = {}
    if (page) queryParams.page = page;
    if (perPage) queryParams.perPage = perPage;
    if (sort) queryParams.sort = sort;
    if (order) queryParams.order = order;
    if (search) queryParams.search = search;
    if (machineId) queryParams.machineId = machineId;
    return powerHouseApi.get('/maintenances/paginated/', {
      params: queryParams,
    }).then((res) => res.data);
  }
}