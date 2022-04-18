import axios from "axios";
import { API_BASE_URL } from "./base";

export const discoverySoucresFetchAPI = () => {
  const url = API_BASE_URL + `/register/sources`;
  return axios.get(url).then((response: any) => {
    return response.data as string[];
  });
};
