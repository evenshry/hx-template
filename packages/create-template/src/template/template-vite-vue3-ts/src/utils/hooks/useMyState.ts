import { Ref, ref, watch, WatchCallback, WatchOptions } from "vue";

type Action = () => void;

type SetAction<T> = (value: T) => void;

type ConvertAction<T> = (value: T) => T;

/**
 * 声明一个响应式对象 和 操作方法
 * @param init
 * @param watchCallback
 * @param watchOptions
 * @returns
 */
export function useMyState<T>(
  init: T,
  watchCallback?: WatchCallback<T, T | undefined>,
  watchOptions?: WatchOptions<true> | undefined
): [Ref<T>, SetAction<T>] {
  // 目标变量
  const target = ref<T>(init) as Ref<T>;

  // 操作方法
  function setTarget(value: T) {
    target.value = value;
  }

  // 监听方法
  if (watchCallback) {
    watch(
      () => target.value,
      (value, oldValue, onCleanup) => {
        watchCallback && watchCallback(value, oldValue, onCleanup);
      },
      { immediate: watchOptions?.immediate || true, deep: watchOptions?.deep || true }
    );
  }

  return [target, setTarget];
}

// 分页默认参数
const defaultPage: Common.Pagination<any> = {
  page: 1,
  pageLimit: 20,
  entries: [],
  totalCount: 0
};

/**
 * 附加操作
 */
interface AfterAction<T> {
  success?: SetAction<T>;
  fail?: Action;
  convertData?: ConvertAction<T>;
}

/**
 * 加载分页数据
 * @param fetchFunction
 * @param listParams
 * @returns
 */
export function usePagination<T>(
  fetchFunction: Function,
  listParams: Ref<Common.FetchParams>,
  options?: AfterAction<Array<T>>
): {
  dataLoading: Ref<boolean>;
  panigationData: Ref<Common.Pagination<T>>;
  loadPanigation: Action;
  resetPanigation: Action;
  handlePageChange: SetAction<number>;
  handleSizeChange: SetAction<number>;
} {
  // 加载状态
  const [dataLoading, setDataLoading] = useMyState<boolean>(false);
  // 分页数据
  const [panigationData, setPanigationData] = useMyState<Common.Pagination<T>>({ ...defaultPage });

  watch(
    () => listParams.value,
    (value) => {
      if (value.refresh) {
        loadPanigation();
      }
    },
    { immediate: true, deep: true }
  );

  /**
   * 加载分页列表
   */
  async function loadPanigation() {
    try {
      setDataLoading(true);
      const response = await fetchFunction(listParams.value);
      const data = response.data || {};
      const pageData: Common.Pagination<T> = JSON.parse(JSON.stringify(data));
      if (options && options.convertData && pageData.entries) {
        pageData.entries = options.convertData(pageData.entries);
      }
      setPanigationData({ ...defaultPage, ...pageData });
      options && options.success && options.success(pageData.entries || []);
    } catch (error) {
      setPanigationData({ ...defaultPage });
      options && options.fail && options.fail();
    } finally {
      setDataLoading(false);
    }
  }

  /**
   * 重置分页数据
   */
  function resetPanigation() {
    setPanigationData({ ...defaultPage });
  }

  /**
   * 翻页
   * @param value
   */
  function handlePageChange(value: number) {
    listParams.value.page = value;
    loadPanigation();
  }

  /**
   * 改变每页条数
   * @param value
   */
  function handleSizeChange(value: number) {
    listParams.value.page = 1;
    listParams.value.pageLimit = value;
    loadPanigation();
  }

  return {
    dataLoading,
    panigationData,
    loadPanigation,
    resetPanigation,
    handlePageChange,
    handleSizeChange
  };
}

/**
 * 加载普通数据
 * @param fetchFunction
 * @param listParams
 * @param defaultData
 * @returns
 */
export function useDataList<T>(
  fetchFunction: Function,
  listParams: Ref<Common.FetchParams>,
  options?: AfterAction<Array<T>>
): {
  dataLoading: Ref<boolean>;
  dataList: Ref<Array<T>>;
  loadDataList: Action;
  resetDataList: Action;
} {
  // 加载状态
  const [dataLoading, setDataLoading] = useMyState<boolean>(false);
  // 普通数据
  const [dataList, setDataList] = useMyState<Array<T>>([]);

  watch(
    () => listParams.value,
    (value) => {
      if (value.refresh) {
        loadDataList();
      }
    },
    { immediate: true, deep: true }
  );

  /**
   * 加载列表
   */
  async function loadDataList() {
    try {
      setDataLoading(true);
      const response = await fetchFunction(listParams.value);
      const data = response.data || [];
      let list: Array<T> = JSON.parse(JSON.stringify(data));
      if (options && options.convertData && list && list.length) {
        list = options.convertData(list);
      }
      setDataList([...list]);
      options && options.success && options.success(list);
    } catch (error) {
      resetDataList();
      options && options.fail && options.fail();
    } finally {
      setDataLoading(false);
    }
  }

  /**
   * 重置数据
   */
  function resetDataList() {
    setDataList([]);
  }

  return {
    dataLoading,
    dataList,
    loadDataList,
    resetDataList
  };
}

/**
 * 加载普通数据
 * @param fetchFunction
 * @param listParams
 * @param defaultData
 * @returns
 */
export function useNormalData<T>(
  fetchFunction: Function,
  listParams: Ref<Common.FetchParams>,
  defaultData: T,
  options?: AfterAction<T>
): {
  dataLoading: Ref<boolean>;
  data: Ref<T>;
  loadData: Action;
  resetData: Action;
} {
  // 加载状态
  const [dataLoading, setDataLoading] = useMyState<boolean>(false);
  // 普通数据
  const [data, setData] = useMyState<T>({ ...defaultData });

  watch(
    () => listParams.value,
    (value) => {
      if (value.refresh) {
        loadData();
      }
    },
    { immediate: true, deep: true }
  );

  /**
   * 加载数据
   */
  async function loadData() {
    try {
      setDataLoading(true);
      const response = await fetchFunction(listParams.value);
      const data = response.data || {};
      let temp: T = JSON.parse(JSON.stringify(data));
      if (options && options.convertData && temp) {
        temp = options.convertData(temp);
      }
      setDataLoading(false);
      setData({ ...defaultData, ...temp });
      options && options.success && options.success(temp);
    } catch (error) {
      setDataLoading(false);
      resetData();
      options && options.fail && options.fail();
    } finally {
    }
  }

  /**
   * 重置数据
   */
  function resetData() {
    setData({ ...defaultData });
  }

  return {
    dataLoading,
    data,
    loadData,
    resetData
  };
}
