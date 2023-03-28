declare namespace Http {
  /**
   * server端返回的数据格式
   */
  interface ServerResponse<T> {
    readonly code: number | string;
    readonly data: T;
    readonly msg: string;
  }

  /**
   * 配置
   */
  interface ExtConfig {
    /**
     * 不验证Token
     */
    noAuth?: boolean;
    /**
     * 不清洁参数
     */
    noClear?: boolean;
  }

  /**
   * 请求方法的配置
   */
  type HttpRequestConfig<T> = AxiosRequestConfig<T> & ExtConfig;

  /**
   * 拦截器的配置
   */
  type HttpRequestConfigInterceptors<T> = InternalAxiosRequestConfig<T> & ExtConfig;

  /**
   * 一般返回数据格式
   */
  type PrNormal<T> = Promise<Http.ServerResponse<T>>;

  /**
   * 分页返回数据格式
   */
  type PrPage<T> = Promise<Http.ServerResponse<common.PageResult<T>>>;
}
