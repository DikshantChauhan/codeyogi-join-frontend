import axios from "axios";
import { Institute } from "../Models/Institue";
import { API_BASE_URL } from "./base";

export const fetchInstitutesListAPI = () => {
  const url = API_BASE_URL + "/institutes";
  return axios.get(url).then((response) => {
    return response.data as Institute[];
  });
};
