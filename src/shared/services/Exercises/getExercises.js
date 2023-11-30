import { powerHouseApi } from "../../utils/axios";

export class GetExercises {
  async byId({ exerciseId }) {
    return powerHouseApi.get(`/exercises/${exerciseId}/`).then((res) => res.data);
  }

  async list({ params = {} } = {}) {
    return powerHouseApi.get('/exercises/', { params }).then((res) => res.data);
  }

  async withPagination({ page = null, perPage = null, sort = null, order = null, search = null } = {}) {
    const queryParams = {}
    if (page) queryParams.page = page;
    if (perPage) queryParams.perPage = perPage;
    if (sort) queryParams.sort = sort;
    if (order) queryParams.order = order;
    if (search) queryParams.search = search;
    return powerHouseApi.get('/exercises/paginated/', {
      params: queryParams,
    }).then((res) => res.data);
  }
}