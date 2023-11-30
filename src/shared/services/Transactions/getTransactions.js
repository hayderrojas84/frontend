import { powerHouseApi } from "../../utils/axios";

export class GetTransactions {
  async byId({ id }) {
    return powerHouseApi.get(`/transactions/${id}/`).then((res) => res.data);
  }

  async list({ params = {} } = {}) {
    return powerHouseApi.get('/transactions/', { params }).then((res) => res.data);
  }

  async withPagination({ page = null, perPage = null, sort = null, order = null, search = null, peopleId = null } = {}) {
    const queryParams = {}
    if (page) queryParams.page = page;
    if (perPage) queryParams.perPage = perPage;
    if (sort) queryParams.sort = sort;
    if (order) queryParams.order = order;
    if (search) queryParams.search = search;
    if (peopleId) queryParams.peopleId = peopleId;
    return powerHouseApi.get('/transactions/paginated/', {
      params: queryParams,
    }).then((res) => res.data);
  }
}