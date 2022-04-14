import axios from "axios";
import { Institute } from "../Models/Institue";
import { BASE_URL } from "./base";

export const fetchInstitutesListAPI = () => {
  const url = BASE_URL + "/institutes";
  return axios.get(url).then((response) => {
    return response.data as Institute[];
  });
};
