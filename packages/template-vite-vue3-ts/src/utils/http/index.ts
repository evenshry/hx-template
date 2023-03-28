import axios from "axios";

import env from "../../environment";

const host = env.host; // 服务地址

const ApiURL = `${host}/platform/`;

export function get<T>(url: string, config?: Http.HttpRequestConfig<Http.ServerResponse<T>>): Promise<Http.ServerResponse<T>> {
  return axios.get(url, config);
}

export function post<T>(
  url: string,
  params: Common.AnyObj,
  config?: Http.HttpRequestConfig<Http.ServerResponse<T>>
): Promise<Http.ServerResponse<T>> {
  return axios.post(url, params, config);
}

export function put<T>(
  url: string,
  params: Common.AnyObj,
  config?: Http.HttpRequestConfig<Http.ServerResponse<T>>
): Promise<Http.ServerResponse<T>> {
  return axios.put(url, params, config);
}

export function _delete<T>(url: string, config?: Http.HttpRequestConfig<Http.ServerResponse<T>>): Promise<Http.ServerResponse<T>> {
  return axios.delete(url, config);
}

export function downFileGet<T>(url: string, config?: Http.HttpRequestConfig<Http.ServerResponse<T>>): Promise<Http.ServerResponse<T>> {
  return axios.get(url, config);
}

const http = {
  ApiURL,
  host,
  get,
  post,
  put,
  delete: _delete,
  downFileGet
};

export default http;
