import { powerHouseApi } from "../../utils/axios";

export class GetMachines {
  async byId({ machineId }) {
    return powerHouseApi.get(`/machines/${machineId}/`).then((res) => res.data);
  }

  async list({ params = {} } = {}) {
    return powerHouseApi.get('/machines/', { params }).then((res) => res.data);
  }

  async withPagination({ page = null, perPage = null, sort = null, order = null, search = null } = {}) {
    const queryParams = {}
    if (page) queryParams.page = page;
    if (perPage) queryParams.perPage = perPage;
    if (sort) queryParams.sort = sort;
    if (order) queryParams.order = order;
    if (search) queryParams.search = search;
    return powerHouseApi.get('/machines/paginated/', {
      params: queryParams,
    }).then((res) => res.data);
  }
}