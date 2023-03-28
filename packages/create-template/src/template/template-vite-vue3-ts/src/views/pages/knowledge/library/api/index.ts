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
