declare namespace KnowledgeLib {
  /**
   * 查询参数
   */
  interface FetchParams extends Common.PageParams {
    articleId?: string;
    title?: string;
    status?: string;
  }

  /**
   * 列表项
   */
  interface ListItem {
    articleId?: string;
    title?: string;
    category?: string;
    top?: boolean;
    collect?:boolean;
    content?: string;
    imageUrl?: string;
    publishTime?: string;
    status?: number;
  }

  /**
   * 列表项
   */
  interface Detail {
    articleId?: string;
    title?: string;
    category?: string;
    top?: boolean;
    collect?:boolean;
    content?: string;
    imageUrl?: string;
    publishTime?: string;
    status?: number;
  }

  /**
   * 附件参数
   */
  interface AppendixItem {
    appendixUrl?: string;
    appendixName?: string;
    name?: string;
    url?: string;
  }
}
