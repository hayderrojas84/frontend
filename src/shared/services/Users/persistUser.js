import { powerHouseApi } from "../../utils/axios";

export class PersistUser {
  async create({data}){
    return powerHouseApi.post('/users/create/', data).then((res) => res.data);
  }

  async update({data, userId}){
    return powerHouseApi.patch(`/users/${userId}/update/`, data).then((res) => res.data);
  }

  async deleteById({userId}){
    return powerHouseApi.delete(`/users/${userId}/delete/`).then((res) => res.data);
  }
}