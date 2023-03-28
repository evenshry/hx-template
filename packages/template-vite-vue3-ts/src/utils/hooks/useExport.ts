import { ElLoading } from "element-plus";

/**
 * 统一请求导出和下载
 * @param exportFunction
 * @param listParams
 */
export async function useExport(exportFunction: Function, listParams: Common.FetchParams) {
  const params = JSON.parse(JSON.stringify(listParams));
  if (params.page) delete params.page;
  if (params.pageLimit) delete params.pageLimit;
  const loadingInstance = ElLoading.service({
    text: "导出中...",
    body: true,
    lock: true
  });
  try {
    const response = await exportFunction(params);
    const data = response.data || {};
    if (data.url) {
      // window.open(data.url);
      await downloadFile(data.url, data.fileName);
    }
    loadingInstance.close();
  } catch (error) {
    loadingInstance.close();
    console.log(error);
  }
}

/**
 * 文件下载
 * @param url
 * @param fileName
 */
export async function downloadFile(url: string, fileName?: string) {
  if (!fileName) {
    const temp = url.split("/");
    fileName = temp[temp.length - 1];
  }
  if (url && fileName) {
    const loadingInstance = ElLoading.service({
      text: "下载中...",
      body: true,
      lock: true
    });
    try {
      const blob = await requestBlob(url);
      downloadBlob(blob, fileName);
      loadingInstance.close();
    } catch (error) {
      loadingInstance.close();
    }
  }
}

/**
 * 通过文件下载url拿到对应的blob对象
 * @param url
 * @returns
 */
function requestBlob(url: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.onerror = () => {
      reject();
    };
    xhr.send();
  });
}

/**
 * 下载文件 js模拟点击a标签进行下载
 * @param blob
 * @param fileName
 */
function downloadBlob(blob: any, fileName?: string) {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName || "";
  link.target = "_blank";
  link.click();
}
