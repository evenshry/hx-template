import { App } from "@vue/runtime-dom";

import AreaCascader from "./AreaCascader/main.vue";
import ConfirmButton from "./ConfirmButton/main.vue";
import ProcessLine from "./ProcessLine/main.vue";
import TableAside from "./TableAside/main.vue";
import TableRowIndex from "./TableRowIndex/main.vue";
import TableContainer from "./TableContainer/main.vue";
import UploadPicture from "./UploadPicture/main.vue";
import UploadPictureList from "./UploadPictureList/main.vue";
import UploadVideo from "./UploadVideo/main.vue";
import RichTextarea from "./RichTextarea/main.vue";
import UploadFileList from "./UploadFileList/main.vue";
import DateRangePicker from "./DateRangePicker/main.vue";

const components = {
  AreaCascader,
  ConfirmButton,
  ProcessLine,
  TableAside,
  TableRowIndex,
  TableContainer,
  UploadPicture,
  UploadPictureList,
  UploadVideo,
  RichTextarea,
  UploadFileList,
  DateRangePicker
};

export default {
  install: function (app: App<Element>): void {
    Object.keys(components).forEach((key) => {
      app.component(key, components[key]);
    });
  }
};
