import { powerHouseApi } from "../../utils/axios";

export class GetUsers {
  async byId({userId}){
    return powerHouseApi.get(`/users/${userId}/`).then((res) => res.data);
  }

  async list({params = {}} = {}){
    return powerHouseApi.get('/users/', {params}).then((res) => res.data);
  }

  async withPagination({page = null, perPage = null, sort = null, order = null, search = null, paymentStatus = null} = {}){
    const queryParams = {}
    if (page) queryParams.page = page;
    if (perPage) queryParams.perPage = perPage;
    if (sort) queryParams.sort = sort;
    if (order) queryParams.order = order;
    if (search) queryParams.search = search;
    if (paymentStatus) queryParams.paymentStatus = paymentStatus;
    return powerHouseApi.get('/users/paginated/', {
      params: queryParams,
    }).then((res) => res.data);
  }
}