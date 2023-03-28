import http from "@/utils/http";

/**
 * 查询地区数据
 * @param params 
 * @returns 
 */
export function fetchAreaList(params: AreaCascader.Params): Http.PrNormal<Array<AreaCascader.Result>> {
  return http.get("/address/area", { params });
}
