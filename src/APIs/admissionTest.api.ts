import axios from "axios";
import { AdmissionTestEntity } from "../Models/AdmissionTest";
import { API_BASE_URL } from "./base";

export const fetchAdmissionTestListAPI = () => {
  const url = API_BASE_URL + "/admission/tests";
  return axios.get(url).then((response) => {
    return response.data as AdmissionTestEntity[];
  });
};
