import * as dotenv from "dotenv";

import axios from "axios";

dotenv.config();

const bungie_api = axios.create({
  baseURL: "https://www.bungie.net/Platform",
  transformResponse: axios.defaults.transformResponse.concat((data) => {
    return data?.Response;
  }),
  headers: {
    Accept: "application/json",
    "X-API-KEY": process.env.BUNGIE_API_KEY,
  },
});

export const bungieApi = async (path, method = "GET", headers = {}) => {
  const { data } = await bungie_api({ url: path, method, headers });
  return data;
};
