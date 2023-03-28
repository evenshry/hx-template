import env from "../environment";

/**
 * 生成10位随机码
 */
const uuidConfig = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function uuid(length = 10): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    const pos = Math.round(Math.random() * (uuidConfig.length - 1));
    result += uuidConfig.charAt(pos);
  }
  return result;
}

/**
 * 导出EXECL
 * @param url
 * @param query
 */
export function exportExcel(url: string, query: any) {
  url = env.host + url;
  const parseUrl = parseParams(url, query);
  window.open(parseUrl, "_blank");
}

/**
 * 转换路径参数
 * @param uri
 * @param params
 * @returns
 */
const parseParams = (uri: string, params: any) => {
  const paramsArray: any[] = [];
  Object.keys(params).forEach((key) => paramsArray.push(`${key}=${params[key]}`));
  if (uri.search(/\?/) === -1) {
    uri += `?${paramsArray.join("&")}`;
  } else {
    uri += `&${paramsArray.join("&")}`;
  }
  return uri;
};

/**
 * 选项映射对象转数组
 * @param source
 * @returns
 */
export function mapToOptions(source: Common.AnyNumerMap): Common.OptionItem[] {
  return Object.keys(source)
    .sort((a, b) => Number(a) - Number(b))
    .map((key): Common.OptionItem => ({ value: Number(key), label: source[Number(key)] }));
}
