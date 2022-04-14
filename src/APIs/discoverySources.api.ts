import axios from "axios";
import { BASE_URL } from "./base";

export const discoverySoucresFetchAPI = () => {
  const url = BASE_URL + `/register/sources`;
  return axios.get(url).then((response: any) => {
    return response.data as string[];
  });
};
