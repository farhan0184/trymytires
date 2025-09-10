
import axios from "axios";
import toast from "react-hot-toast";


const API_URL = process.env.backend_url + "api/v1/";

const axiosApi = axios.create({
  baseURL: API_URL,
  validateStatus: function (status) {
    return status >= 200 && status < 600; // default
  },
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function get(url, data, config = {}, token_name = "token") {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem(token_name) ?? ""
  }`;

  return await axiosApi
    .get(url, { ...config, params: { ...data } })
    .then((response) => response.data);
}
export async function postForm(url, data, config = {}) {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem("token") ?? ""
  }`;
  axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data";

  return axiosApi
    .post(url, data, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}, token_name = "token") {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem(token_name) ?? ""
  }`;
  // config.headers["Content-Type"] = "application/json";
  return axiosApi
    .post(url, data, { ...config })
    .then((response) => response.data);
}
// export async function newPost(url, data, config = {}, token_name = "token") {
//     axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
//         localStorage.getItem(token_name) ?? ""
//     }`;
//     return axiosApi
//         .post(url, {...data}, { ...config })
//         .then((response) => response.data);
// }
export async function newPost(url, data, config = {}, token_name = "token") {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem(token_name) ?? ""
  }`;
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["Content-Type"] = "application/json";
  return axiosApi.post(url, data, config).then((response) => response.data);
}

// export async function put(url, data, config = {}, token_name = "token") {
//     axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
//         localStorage.getItem(token_name) ?? ""
//     }`;
//     return axiosApi
//         .put(url, { ...data }, { ...config })
//         .then((response) => response.data);
// }
export async function put(url, data, config = {}, token_name = "token") {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem(token_name) ?? ""
  }`;

  // Ensure Content-Type is application/json
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["Content-Type"] = "application/json";

  return axiosApi
    .put(url, data, config) // Directly pass `data` in JSON format
    .then((response) => response.data);
}
export async function putch(url, data, config = {}, token_name = "token") {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem(token_name) ?? ""
  }`;

  // Ensure Content-Type is application/json
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["Content-Type"] = "application/json";

  return axiosApi
    .patch(url, data, config) // Directly pass `data` in JSON format
    .then((response) => response.data);
}

export async function del(url, config = {}, token_name = "token") {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem(token_name) ?? ""
  }`;
  return await axiosApi.delete(url, config).then((res) => res.data);
}
export async function imgDel(url, data, config = {}, token_name = "token") {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${
    localStorage.getItem(token_name) ?? ""
  }`;
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["Content-Type"] = "application/json";
  return await axiosApi
    .delete(url, { ...config, data: { file: `${data}` } })
    .then((response) => response.data);
}



export function isFile(input) {
  return "File" in window && input instanceof File;
}

export async function customFetch(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {

    toast.error( error.response?.data || error.message)
    return null;
  }
}