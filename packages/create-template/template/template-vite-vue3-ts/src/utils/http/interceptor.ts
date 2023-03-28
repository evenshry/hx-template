import axios, { AxiosResponse, AxiosResponseHeaders, InternalAxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import { usePiniaStore } from "@/store";
import router from "@/router";
import env from "../../environment";

// 接口地址
axios.defaults.baseURL = env.proxy ? "/api/web" : `${env.host}/web`;
axios.defaults.baseURL = "/mock";

/**
 * 请求信息拦截
 */
axios.interceptors.request.use((config: Http.HttpRequestConfigInterceptors<any>): Http.HttpRequestConfigInterceptors<any> => {
  const { CommonStore } = usePiniaStore();
  // 超时时间
  if (!config.timeout) {
    config.timeout = 30 * 1000;
  }
  const headers = config.headers || {};
  // 添加Token
  if (!config.noAuth) {
    const token = CommonStore.getToken;
    if (token) {
      headers["X-Hanxi-Token"] = token;
    }
  }
  // 添加Content-Type
  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json;charset=UTF-8";
  }
  config.headers = headers;

  // 清洁参数
  if (!config.noClear) {
    if (config.data) {
      for (const key in config.data) {
        if (!config.data[key]) delete config.data[key];
      }
    }
    if (config.params) {
      for (const key in config.params) {
        if (!config.params[key]) delete config.params[key];
      }
    }
  }

  return config;
});

// 错误枚举
const ERROR_MSG: { [key: number]: string } = {
  500: "500, 服务器异常，请稍后再试",
  502: "502, 网关异常，请稍后再试",
  503: "抱歉，当前服务器异常，请稍后再试",
  504: "服务器响应超时",

  401: "抱歉，您还未登录",
  403: "抱歉，您没有权限访问该页面",
  404: "抱歉，请求走丢了"
};

/**
 * 响应信息拦截
 */
axios.interceptors.response.use(
  (response: AxiosResponse<Http.ServerResponse<any>, any>): any => {
    // console.log("response", response);
    const result = response.data || {};
    const header = response.headers;
    // 非成功状态提示 区分下载和其他接口
    if (result.code && result.code != "0") {
      const msg = result.msg || "出错了，请重试！";
      ElMessage.error({ message: msg, duration: 2000 });
      checkDataCode(result);
      const error = new Error(msg);
      return Promise.reject(error);
    }
    if (response.config.responseType == "blob") {
      return { result, header };
    } else {
      return result;
    }
  },
  (error: any): any => {
    // console.log("error", error);
    if (error.response) {
      const response = error.response as AxiosResponse<Http.ServerResponse<any>, any>;
      const data = response.data || {};
      let message = data.msg;
      if (!message) {
        const code: number = response.status || 404;
        message = ERROR_MSG[code] || "发生了预期之外的错误";
      }
      ElMessage.error({ message, duration: 2000 });
      checkDataCode(data);
    }
    return Promise.reject(error);
  }
);

/**
 * 错误代码处理
 * @param data
 */
function checkDataCode(data: Http.ServerResponse<any>) {
  const { SysRoleStore } = usePiniaStore();
  // token失效
  if (
    data.code == "9999" ||
    data.code == "10001" ||
    data.code == "10002" ||
    data.code == "10003" ||
    data.code == "10005" ||
    data.code == "100013" ||
    data.code == "100023" ||
    data.code == "100024"
  ) {
    SysRoleStore.clear();
    router.replace("/login");
  }
}
