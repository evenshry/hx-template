declare namespace Common {
  interface AnyStringObj {
    [key: string]: string;
  }

  interface AnyObj {
    [key: string]: any;
  }

  interface AnyNumerMap extends Object {
    [key: number]: string;
  }

  interface OptionItem {
    label?: string;
    value: number | string;
  }

  interface PageParams {
    refresh?: boolean;
    page?: number;
    pageLimit?: number;
  }

  interface FetchParams {
    refresh?: boolean;
    page?: number;
    pageLimit?: number;
    [key: string]: any;
  }

  interface Pagination<T> {
    page?: number;
    pageLimit?: number;
    entries?: Array<T>;
    totalCount?: number;
  }
}
