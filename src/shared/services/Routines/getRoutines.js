import { powerHouseApi } from "../../utils/axios";

export class GetRoutines {
  async byId({ routineId }) {
    return powerHouseApi.get(`/routines/${routineId}/`).then((res) => res.data);
  }

  async list({ params = {} } = {}) {
    return powerHouseApi.get('/routines/', { params }).then((res) => res.data);
  }

  async withPagination({ page = null, perPage = null, sort = null, order = null, search = null } = {}) {
    const queryParams = {}
    if (page) queryParams.page = page;
    if (perPage) queryParams.perPage = perPage;
    if (sort) queryParams.sort = sort;
    if (order) queryParams.order = order;
    if (search) queryParams.search = search;
    return powerHouseApi.get('/routines/paginated/', {
      params: queryParams,
    }).then((res) => res.data);
  }
}