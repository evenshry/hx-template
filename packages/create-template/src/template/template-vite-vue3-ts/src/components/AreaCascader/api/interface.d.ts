declare namespace AreaCascader {
  /**
   * 参数
   */
  interface Params {
    level: string;
    code?: string;
  }

  /**
   * 返回数据
   */
  interface Result {
    code: string;
    label: string;
    level: string;
    hasNext: boolean;
  }

  /**
   * 选择返回数据
   */
  interface ChangeData {
    values: string[];
    labels: string[];
  }
}
