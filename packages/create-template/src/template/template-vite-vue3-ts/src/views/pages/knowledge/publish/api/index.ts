import http from "@/utils/http";

/**
 * 查询知识库列表
 * @param params
 * @returns
 */
export function fetchKnowledgeLibList(params: KnowledgeLib.FetchParams): Http.PrPage<KnowledgeLib.ListItem> {
  return http.get("/article/article", { params });
}

/**
 * 查询文章详情
 * @param params
 * @returns
 */
export function fetchKnowledgeLibDetail(params: KnowledgeLib.FetchParams): Http.PrNormal<KnowledgeLib.ListItem> {
  return http.get("/article/articleDetail", { params });
}

/**
 * 添加知识库
 * @param data
 * @returns
 */
export function saveKnowledgeLibInfo(data: KnowledgeLib.ListItem): Http.PrNormal<any> {
  return http.post("/article/article", data, { noClear: true });
}

/**
 * 更新知识库
 * @param data
 * @returns
 */
export function updateKnowledgeLibInfo(data: KnowledgeLib.ListItem): Http.PrNormal<any> {
  return http.put("/article/article", data, { noClear: true });
}

/**
 * 更新知识库-上架
 * @param data
 * @returns
 */
export function putOnShelvesKnowledgeLib(data: KnowledgeLib.FetchParams): Http.PrNormal<any> {
  return http.put("/article/upperShelvesArticle", data);
}

/**
 * 更新知识库-下架
 * @param data
 * @returns
 */
export function getOffShelvesKnowledgeLib(data: KnowledgeLib.FetchParams): Http.PrNormal<any> {
  return http.put("/article/lowerShelvesArticle", data);
}

/**
 * 删除知识库
 * @param params
 * @returns
 */
export function deleteKnowledgeLibInfo(params: KnowledgeLib.FetchParams): Http.PrNormal<any> {
  return http.delete("/article/article", { params });
}
